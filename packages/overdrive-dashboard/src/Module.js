import React, { Fragment } from 'react';
import ActionBar from './ActionBar';
import Alert from './Alert';
import DataProvider from './DataProvider';
import Datatable from './Datatable';
import Dialog from './Dialog';
import Icon from './Icon';
import Inspector from './Inspector';
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
        <>
            <Module.Description
                name={props.name}
                description={props.description}
                icon={props.icon}
                color={props.color} />
            <div>
                {props.children}
            </div>
        </>
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

Module.SimpleCRUD = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(props.api),
            action: Action.List,
            selectedRecords: [],
            error: null
        };

        this.deleteDialog = React.createRef();
    }

    getView(action) {
        switch (action)
        {
            case Action.List:
                {
                    const columns = this.props.columns || {};
                    return (
                        <>
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
                            <Datatable
                                columns={columns}
                                dataProvider={this.state.dataProvider}
                                paginate={true}
                                search={true}
                                onSelectionChanged={(records) => this.handleRecordSelection(records)}
                            ></Datatable>
                            <Dialog
                                ref={this.deleteDialog}
                                title="Delete"
                                buttonName="Delete"
                                onAction={(dialog) => this.handleDelete(dialog)}
                            >
                                Are you sure to delete the selected record?
                            </Dialog>
                        </>
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
                                onError={(e) => this.setState({ error: e })}
                                onCancel={() => this.handleActionChange(Action.List)}
                            ></Inspector>
                            <hr />
                            {this.state.error &&
                                <Alert variant="danger">{this.state.error}</Alert>}
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
                                onCancel={() => this.handleActionChange(Action.List)}
                            ></Inspector>
                            {this.state.error &&
                                <>
                                    <hr />
                                    <Alert variant="danger">{this.state.error}</Alert>
                                </>
                            }
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
        this.deleteDialog.current.show();
    }

    handleDelete() {
        // this.deleteDialog.current.close();
    }

    render() {
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
                    show={this.state.action != Action.List}
                    onClose={(e) => this.handleActionChange(Action.List)}
                >
                    {this.state.action != Action.List
                        && this.getView(this.state.action)}
                </Panel>
            </Module.Content>
        );
    }
}