import React from 'react';
import { Table, Pagination, Button, ButtonGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <ButtonGroup aria-label="Basic example" className="mb-3">
                <Button variant="success" className="rounded-0" size="sm">
                    <FontAwesomeIcon icon={faPlus} /> Add
                </Button>
                <Button variant="warning" className="rounded-0" size="sm">
                    <FontAwesomeIcon icon={faPen} /> Edit
                </Button>
                <Button variant="danger" className="rounded-0" size="sm">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
            </ButtonGroup>
        );
    }
}

function Search(props) {
    return (
        <div className="mb-2">
            <Form.Control
                type="text"
                placeholder="Search"
                size="sm"
                onKeyUp={(e) => { if (props['onTextChange']) props.onTextChange(e.target.value); }}
            />
        </div>
    );
}

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

        if (this.props['onPageChange'])
        {
            this.props.onPageChange(page);
        }
    }

    render() {
        const range = this.props.range || 3;
        const page = this.state.page;
        const pages = this.props.pages || 1;

        const delta = Math.round(range / 2);
        const min = Math.max(1, page - delta);
        const max = Math.min(pages, page + delta);

        const items = [];
        for (let i = min; i <= max; ++i)
        {
            if (i === page)
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
                <Pagination.First onClick={() => this.handlePageSelection(1)} />
                <Pagination.Prev onClick={() => this.handlePageSelection(Math.max(1, page - 1))} />
                {items}
                <Pagination.Next onClick={() => this.handlePageSelection(Math.min(pages, page + 1))} />
                <Pagination.Last onClick={() => this.handlePageSelection(pages)} />
            </Pagination>
        );
    }
}

export class Datatable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: props.dataProvider || null,
            data: [],
            recordsTotal: 0,
            recordsFiltered: 0,
            limit: 10,
            page: 1,
            filter: ''
        };
    }

    get dataProvider() {
        return this.state.dataProvider;
    }

    get data() {
        return this.state.data;
    }

    #fetch = (filter, page) => {
        if (!this.dataProvider) return;

        this.dataProvider.getList({
            offset: (page - 1) * this.state.limit,
            limit: this.state.limit,
            filter: filter
        }).then((res => {
            this.setState({
                data: res.data.data,
                page: page,
                filter: filter,
                recordsTotal: res.data.recordsTotal,
                recordsFiltered: res.data.recordsFiltered
            });
        })).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.#fetch(this.state.filter, this.state.page);
    }

    handleRowSelection(record) {
        console.log(record);
    }

    handleSearch(text) {
        this.#fetch(text, this.state.page);
    }

    handlePageChange(page) {
        this.#fetch(this.state.filter, page);
    }

    render() {
        let columns = [];
        if (this.props.columns)
        {
            columns = Array.isArray(this.props.columns)
                ? this.props.columns :
                Object.keys(this.props.columns);
        }
        else if (this.data.length > 0) 
        {
            columns = Object.keys(this.data[0]);
        }

        const head = columns.map((column, index) =>
            <th key={index}>{this.props.columns[column] || column}</th>
        );

        const body = this.data.map((record, index) =>
            <tr key={index} onClick={() => this.handleRowSelection(record)}>
                {columns.map((column) =>
                    <td key={record.id + column}>{record[column]}</td>
                )}
            </tr>
        );

        // compute the number of pages
        let pages = 1;
        if (this.state.limit && this.state.recordsTotal)
        {
            pages = Math.round(this.state.recordsTotal / this.state.limit);
        }

        return (
            <>
                {this.props.crud && <Actions actions={this.props.crud} />}
                {this.props.search && <Search onTextChange={(e) => this.handleSearch(e)} />}
                <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                            {head}
                        </tr>
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </Table>
                {this.props.paginate && <DatatablePagination
                    pages={pages}
                    onPageChange={(e) => this.handlePageChange(e)}
                />}
            </>
        );
    }
}