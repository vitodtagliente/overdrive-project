import React, { Fragment } from 'react';

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
                <div className="form-group from-group-sm">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                    </div>
                    <input
                        type="text"
                        className="from-control form-control-sm"
                        placeholder="Search"
                        onKeyUp={(e) => { this.handleTextChange(e.target.value); }}
                    />
                </div>
            </div>
        );
    }
}

function Page(props) {
    return (
        <li key={props.key} className={props.active ? "page-item active" : "page-item"}>
            <a
                className="page-link"
                href="#"
                onClick={(e) => { if (props['onClick']) props.onClick(e); }}
            >
                {props.children}
            </a>
        </li>
    );
}

class Pagination extends React.Component {
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
            items.push(
                <Page
                    onClick={() => this.handlePageSelection(i)}
                    key={i}
                    active={i === page}>
                    {i}
                </Page>
            );
        }

        return (
            <nav>
                <ul className="pagination pagination-sm justify-content-end">
                    <Page onClick={() => this.handlePageSelection(1)}>First</Page>
                    <Page onClick={() => this.handlePageSelection(Math.max(1, page - 1))}>Previous</Page>
                    {items}
                    <Page onClick={() => this.handlePageSelection(Math.min(pages, page + 1))}>Next</Page>
                    <Page onClick={() => this.handlePageSelection(pages)}>Last</Page>
                </ul>
            </nav>
        );
    }
}

export default class Datatable extends React.Component {
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

    #fetch = (filter, page, limit) => {
        if (!this.dataProvider) return;

        this.dataProvider.getList({
            offset: (page - 1) * limit,
            limit: limit,
            filter: filter
        }).then((res => {
            this.setState({
                data: res.data.data,
                page: page,
                filter: filter,
                recordsTotal: res.data.recordsTotal,
                recordsFiltered: res.data.recordsFiltered,
                selectedRow: -1,
                limit: limit
            });
        })).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.#fetch(this.state.filter, this.state.page, this.state.limit);
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
        this.#fetch(text, this.state.page, this.state.limit);
    }

    handlePageChange(page) {
        this.#fetch(this.state.filter, page, this.state.limit);
    }

    handleLimitChange(e) {
        this.#fetch(this.state.filter, this.state.page, e.target.value);
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
                <table
                    ref={this.table}
                    className="table table-responsive table-bordered table-hover table-striped table-sm">
                    <thead>
                        <tr>
                            {head}
                        </tr>
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </table>
                {this.props.paginate &&
                    <div className="row">
                        <div className="col-sm-12 col-md-5 align-items-center">
                            <span>Showing </span>
                            <select
                                className="form-control from-control-sm"
                                onChange={(e) => this.handleLimitChange(e)}
                                style={{ width: '80px' }}>
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            <span> of {this.state.recordsTotal} records</span>
                        </div>
                        <div className="col-sm-12 col-md-7">
                            <Pagination
                                pages={pages}
                                onPageChange={(e) => this.handlePageChange(e)}
                            />
                        </div>
                    </div>
                }
            </>
        );
    }
}