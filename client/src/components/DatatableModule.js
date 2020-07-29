import React from 'react';
import { Datatable } from './Datatable';
import DataProvider from '../DataProvider';

const Actions = {
    Create: 'create',
    Delete: 'delete',
    Edit: 'edit',
    List: 'list'
}

export function Module(props) {
    return (
        <>
            {props.name && <h1>{props.name}</h1>}
            {props.description && <p className="lead">{props.description}</p>}
            {props.children}
        </>
    );
}

export class DatatableModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(props.api),
            action: Actions.List
        };
    }

    getContent() {
        switch (this.state.action)
        {
            case Actions.List:
                {
                    const columns = this.props.columns || {};

                    if (this.props.list) return this.props.list;
                    return (
                        <Datatable
                            columns={columns}
                            dataProvider={this.state.dataProvider}
                            paginate={true}
                            search={true}
                        ></Datatable>
                    );
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