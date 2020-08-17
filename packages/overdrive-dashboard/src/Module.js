import React, { Fragment } from 'react';
import ActionBar from './ActionBar';
import DataProvider from './DataProvider';
import Datatable from './Datatable';
import Dialog from './Dialog';
import Icon from './Icon';
import Inspector from './Inspector';

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

Module.Content = function (props) {
    return (
        <>
            {props.name && <h1>{props.name}</h1>}
            {props.description && <p className="lead">{props.description}</p>}
            {props.children}
        </>
    );
}

const Action = {
    Create: 'create',
    Edit: 'edit',
    List: 'list'
}

Module.SimpleCRUD = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(props.api),
            action: Action.List,
            selectedRecord: null
        };

        this.deleteDialog = React.createRef();
    }

    getContent() {
        switch (this.state.action)
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
                                    active={this.state.selectedRecord != null}
                                    icon={Icon.Images.faPen}
                                    name="Edit"
                                    onClick={(e) => this.handleActionChange(Action.Edit)} />
                                <ActionBar.Button
                                    color='red'
                                    active={this.state.selectedRecord != null}
                                    icon={Icon.Images.faTrash}
                                    name="Delete"
                                    onClick={(e) => this.handleDeleteAction()} />
                            </ActionBar>
                            <Datatable
                                columns={columns}
                                dataProvider={this.state.dataProvider}
                                paginate={true}
                                search={true}
                                onRowSelection={(record) => this.handleRecordSelection(record)}
                            ></Datatable>
                            <Dialog
                                ref={this.deleteDialog}
                                title="Delete"
                                buttonName="Delete"
                                buttonVariant="danger"
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
                        <Inspector
                            schema={this.props.schema}
                            dataProvider={this.state.dataProvider}
                            onCancel={() => this.handleActionChange(Action.List)}
                        ></Inspector>
                    );
                    break;
                }
            case Action.Edit:
                {
                    return (
                        <Inspector
                            schema={this.props.schema}
                            dataProvider={this.state.dataProvider}
                            model={this.state.selectedRecord}
                            onCancel={() => this.handleActionChange(Action.List)}
                        ></Inspector>
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

    handleRecordSelection(record) {
        this.setState({
            selectedRecord: record
        });
    }

    handleDeleteAction() {
        this.deleteDialog.current.show();
    }

    handleDelete(dialog) {
        dialog.close();
    }

    render() {
        return (
            <Module.Content
                name={this.props.name}
                description={this.props.description}
            >
                {this.getContent()}
                {this.props.children}
            </Module.Content>
        );
    }
}