import React from 'react';
import { Table, Pagination, Button, ButtonGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };

        this.timer = null;
    }

    handleTextChange(text) {
        // Clears the previously set timer.
        clearTimeout(this.timer);

        // Reset the timer, to make the http call after 475MS (this.callSearch is a method which will call the search API. Don't forget to bind it in constructor.)
        this.timer = setTimeout(() => this.callSearch(), this.props.delay || 475);

        this.setState({
            text: text
        });
    }

    callSearch() {
        if (this.props['onTextChange'])
        {
            this.props.onTextChange(this.state.text);
        }
    }

    render() {
        return (
            <div className="mb-2">
                <Form.Control
                    type="text"
                    placeholder="Search"
                    size="sm"
                    onKeyUp={(e) => { this.handleTextChange(e.target.value); }}
                />
            </div>
        );
    }
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

        const delta = Math.max(1, Math.round((range - 1) / 2));
        let min = Math.max(1, page - delta);
        let max = Math.min(pages, page + delta);

        if (page === min)
        {
            max = Math.min(pages, max + 1);
        }
        else if (page === pages)
        {
            min = Math.max(1, min - 1);
        }

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
            <Pagination size="sm" className="justify-content-end">
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
            filter: '',
            selectedRow: -1
        };

        this.table = React.createRef();
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
                recordsFiltered: res.data.recordsFiltered,
                selectedRow: -1
            });
        })).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.#fetch(this.state.filter, this.state.page);
    }

    handleRowSelection(e, index, record) {
        const selection = this.state.selectedRow === index ? -1 : index;
        this.setState({
            selectedRow: selection
        });

        if (this.props['onRowSelection'])
        {
            this.props.onRowSelection(selection >= 0 ? record : null);
        }
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
            <tr key={index}
                onClick={(e) => this.handleRowSelection(e, index, record)}
                className={this.state.selectedRow == index ? 'table-primary' : ''}>
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
                {this.props.search && <Search onTextChange={(e) => this.handleSearch(e)} />}
                <Table
                    ref={this.table}
                    responsive
                    striped
                    bordered
                    hover
                    size="sm">
                    <thead>
                        <tr>
                            {head}
                        </tr>
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </Table>
                <div>
                    {this.props.paginate && <DatatablePagination
                        pages={pages}
                        onPageChange={(e) => this.handlePageChange(e)}
                    />}
                </div>
            </>
        );
    }
}