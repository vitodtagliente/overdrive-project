import React from 'react';
import { Datatable } from './Datatable';
import DataProvider from '../DataProvider';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

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
    Delete: 'delete',
    Edit: 'edit',
    List: 'list'
}

class ActionBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
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
                    onClick={(e) => { if (this.props['onAction']) this.props.onAction(Action.Delete); }}
                >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
            </ButtonGroup>
        );
    }
}

export class DatatableModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(props.api),
            action: Action.List
        };
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
                            ></ActionBar>
                            <Datatable
                                columns={columns}
                                dataProvider={this.state.dataProvider}
                                paginate={true}
                                search={true}
                            ></Datatable>
                        </>
                    );
                }
            case Action.Create:
                {
                    if (this.props.create)
                        return this.props.create;
                }
            case Action.Edit:
                {
                    if (this.props.edit)
                        return this.props.edit;
                }
            default: return (<></>);
        }
    }

    handleActionChange(action) {
        this.setState({
            action: action
        });
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