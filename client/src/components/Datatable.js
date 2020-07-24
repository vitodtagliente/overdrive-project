import React from 'react';
import { Table, Pagination } from 'react-bootstrap';

class DatatablePagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: props.page || 1
        };
    }

    handlePageSelection(page) {
        this.setState({
            page
        });
    }

    render() {

        const range = this.props.range || 5;
        const page = this.state.page;
        const pages = this.props.pages || 1;

        const delta = Math.round(range / 2);
        const min = Math.max(1, page - delta);
        const max = Math.min(pages, page + delta);

        const items = [];
        for (let i = min; i <= max; ++i)
        {
            if (i == page)
            {
                items.push(
                    <Pagination.Item
                        onClick={() => this.handlePageSelection(i)}
                        key={i}
                        active>
                        {i}
                    </Pagination.Item>
                );
            }
            else
            {
                items.push(
                    <Pagination.Item
                        onClick={() => this.handlePageSelection(i)}
                        key={i}>
                        {i}
                    </Pagination.Item>
                );
            }
        }

        return (
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                {items}
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        );
    }
}

export class Datatable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static columns(data) {
        if (data.length > 0)
        {
            return Object.keys(data[0]).sort();
        }
        return [];
    }

    handleRowSelection(record) {
        console.log(record);
    }

    render() {
        const columns = this.props.columns ? this.props.columns.map((column) =>
            <th key={column}>{column}</th>
        ) : '';

        const content = this.props.data ? this.props.data.map((record) =>
            <tr key={record.id} onClick={() => this.handleRowSelection(record)}>
                {Object.keys(record).map((key, index) => <td key={key}>{record[key]}</td>)}
            </tr>
        ) : '';

        return (
            <>
                <Table responsive bordered size="sm">
                    <thead>
                        <tr>
                            {columns}
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </Table>
                {this.props.paginate && <DatatablePagination pages={5} />}
            </>
        );
    }
}