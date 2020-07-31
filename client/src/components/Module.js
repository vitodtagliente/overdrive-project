import React from 'react';
import { Datatable } from './Datatable';
import DataProvider from '../DataProvider';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import Dialog from './Dialog';

export function Module(props) {
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

class ActionBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let edit = '';
        if (this.props.record)
        {
            edit = (
                <>
                    <Button
                        variant="warning"
                        className="rounded-0"
                        size="sm"
                        onClick={(e) => { if (this.props['onAction']) this.props.onAction(Action.Edit); }}
                    >
                        <FontAwesomeIcon icon={faPen} /> Edit
                    </Button>
                    <Button
                        variant="danger"
                        className="rounded-0"
                        size="sm"
                        onClick={(e) => { if (this.props['onDelete']) this.props.onDelete() }}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                </>
            );
        }

        return (
            <ButtonGroup aria-label="Basic example" className="mb-3">
                <Button
                    variant="success"
                    className="rounded-0"
                    size="sm"
                    onClick={(e) => { if (this.props['onAction']) this.props.onAction(Action.Create); }}
                >
                    <FontAwesomeIcon icon={faPlus} /> Add
                </Button>
                {edit}
            </ButtonGroup>
        );
    }
}

export class DatatableModule extends React.Component {
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

                    if (this.props.list) return this.props.list;
                    return (
                        <>
                            <ActionBar
                                onAction={(e) => this.handleActionChange(e)}
                                onDelete={() => this.handleDeleteAction()}
                                record={this.state.selectedRecord}
                            ></ActionBar>
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
                            >
                                Are you sure to delete the selected record?
                            </Dialog>
                        </>
                    );
                }
            case Action.Create:
                {
                    if (this.props.create)
                    {
                        return this.props.create({
                            dataProvider: this.state.dataProvider,
                            onCancel: () => this.handleActionChange(Action.List)
                        });
                    }
                    break;
                }
            case Action.Edit:
                {
                    if (this.props.edit)
                    {
                        return this.props.edit({
                            dataProvider: this.state.dataProvider,
                            model: this.state.selectedRecord,
                            onCancel: () => this.handleActionChange(Action.List)
                        });
                    }
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

    handleDeleteAction(){
        this.deleteDialog.current.show();
    }

    render() {
        return (
            <Module
                name={this.props.name}
                description={this.props.description}
            >
                {this.getContent()}
                {this.props.children}
            </Module>
        );
    }
}