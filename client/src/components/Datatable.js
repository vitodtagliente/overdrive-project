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
            dataProvider: props.dataProvider || null,
            data: []
        };
    }

    get dataProvider() {
        return this.state.dataProvider;
    }

    get data() {
        return this.state.data;
    }

    #fetch = (search) => {
        if (!this.dataProvider) return;

        this.dataProvider.getList().then((res => {
            this.setState({
                data: res.data.data
            });
        })).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.#fetch();
    }

    handleRowSelection(record) {
        console.log(record);
    }

    handleSearch(text) {
        this.#fetch(text);
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
                {this.props.paginate && <DatatablePagination pages={5} />}
            </>
        );
    }
}