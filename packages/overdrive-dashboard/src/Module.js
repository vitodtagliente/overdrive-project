import React, { Fragment } from 'react';
import ActionBar from './ActionBar';
import Alert from './Alert';
import DataProvider from './DataProvider';
import Datatable from './Datatable';
import Icon from './Icon';
import Inspector from './Inspector';
import Modal from './Modal';
import style from './style.css';

export default class Module {
    #id = null
    #url = null;

    constructor(url, id) {
        this.#id = id || url || Math.random().toString(36).substring(2, 15)
            + Math.random().toString(36).substring(2, 15);
        this.#url = url || '/';
    }

    get id() {
        return this.#id;
    }

    get url() {
        return this.#url;
    }

    get pathname() {
        return window.location.pathname;
    }

    get isActive() {
        return this.pathname.includes(this.url);
    }

    sidebar() {
        return null;
    }

    content(context) {
        return null;
    }
}

Module.Description = function (props) {
    return (
        <div className="border-bottom mb-3">
            {
                props.name &&
                <h2>
                    {props.icon &&
                        <span
                            className="border pl-1 pr-1 mr-2"
                            style={{
                                color: props.color
                            }}
                        >
                            <Icon icon={props.icon} />
                        </span>
                    }
                    {props.name}
                </h2>
            }
            {props.description && <p><small>{props.description}</small></p>}
        </div>
    );
}

Module.Content = function (props) {
    return (
        <Fragment>
            <Module.Description
                name={props.name}
                description={props.description}
                icon={props.icon}
                color={props.color} />
            <div>
                {props.children}
            </div>
        </Fragment>
    );
}

const Action = {
    Create: 'create',
    Edit: 'edit',
    List: 'list'
}

function Panel(props) {
    return (
        <div className={`${style.panel} ${props.show ? style.toggled : ''}`}>
            <div className="container">
                {props.children}
            </div>
        </div>
    );
}

Module.CRUD = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(props.api),
            action: Action.List,
            selectedRecords: []
        };

        this.datatable = React.createRef();
        this.deleteModal = React.createRef();
    }

    getActionBar() {
        return (
            <ActionBar>
                <ActionBar.Button
                    icon={Icon.Images.faPlus}
                    name="Add"
                    onClick={(e) => this.handleActionChange(Action.Create)} />
                <ActionBar.Button
                    active={this.state.selectedRecords.length == 1}
                    icon={Icon.Images.faPen}
                    name="Edit"
                    onClick={(e) => this.handleActionChange(Action.Edit)} />
                <ActionBar.Button
                    color='red'
                    active={this.state.selectedRecords.length > 0}
                    icon={Icon.Images.faTrash}
                    name={`Delete${this.state.selectedRecords.length > 1 ? ` (${this.state.selectedRecords.length})` : ''}`}
                    onClick={(e) => this.handleDeleteAction()} />
            </ActionBar>
        );
    }

    getView(action) {
        switch (action)
        {
            case Action.List:
                {
                    const columns = this.props.fields || {};
                    return (
                        <Fragment>
                            {this.getActionBar()}
                            <Datatable
                                ref={this.datatable}
                                columns={columns}
                                dataProvider={this.state.dataProvider}
                                paginate={true}
                                search={true}
                                onSelectionChanged={(records) => this.handleRecordSelection(records)}
                            ></Datatable>
                            <Modal
                                ref={this.deleteModal}
                                title="Delete"
                                buttonName="Delete"
                                onAction={(e) => this.handleDelete(e)}
                            >
                                Are you sure to delete the selected record{this.state.selectedRecords.length > 1 ? 's' : ''}?
                            </Modal>
                        </Fragment>
                    );
                }
            case Action.Create:
                {
                    return (
                        <Fragment>
                            <h3>Create a new one</h3>
                            <hr />
                            <Inspector
                                schema={this.props.schema}
                                dataProvider={this.state.dataProvider}
                                onError={(e) => this.handleError(e)}
                                onCancel={() => this.handleActionChange(Action.List)}
                            ></Inspector>
                        </Fragment>
                    );
                    break;
                }
            case Action.Edit:
                {
                    return (
                        <Fragment>
                            <h3>Edit one</h3>
                            <hr />
                            <Inspector
                                schema={this.props.schema}
                                dataProvider={this.state.dataProvider}
                                model={this.state.selectedRecords[0]}
                                onError={(e) => this.handleError(e)}
                                onCancel={() => this.handleActionChange(Action.List)}
                            ></Inspector>
                        </Fragment>
                    );
                    break;
                }
            default: return (<></>);
        }
    }

    handleActionChange(action) {
        this.setState({
            action: action
        });
    }

    handleRecordSelection(records) {
        this.setState({
            selectedRecords: records
        });
    }

    handleDeleteAction() {
        this.deleteModal.current.show();
    }

    handleDelete() {
        this.state.dataProvider.delete(this.state.selectedRecords)
            .then((res => {
                this.datatable.current.refresh();
            })).catch((err) => {
                this.handleError(err.response);
            });
    }

    handleError(error) {
        console.log(error);
    }

    render() {
        const showPanel = this.state.action != Action.List;
        if (showPanel)
        {
            if (!document.body.className.includes(style.freeze))
            {
                document.body.classList.add(style.freeze);
            }
        }
        else 
        {
            if (document.body.className.includes(style.freeze))
            {
                document.body.classList.remove(style.freeze);
            }
        }

        return (
            <Module.Content
                name={this.props.name}
                description={this.props.description}
                icon={this.props.icon}
                color={this.props.color}
            >
                {this.getView(Action.List)}
                {this.props.children}
                <Panel
                    show={showPanel}
                    onClose={(e) => this.handleActionChange(Action.List)}
                >
                    {showPanel && this.getView(this.state.action)}
                </Panel>
            </Module.Content>
        );
    }
}