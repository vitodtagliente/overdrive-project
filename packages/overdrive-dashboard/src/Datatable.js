import React, { Fragment } from 'react';
import Pagination from './Pagination';

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
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        onKeyUp={(e) => { this.handleTextChange(e.target.value); }}
                    />
                </div>
            </div>
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
            <th key={index} scope="col">{this.props.columns[column] || column}</th>
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
                    className="table table-bordered table-hover table-striped table-sm">
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
                                className="form-control form-control-sm"
                                onChange={(e) => this.handleLimitChange(e)}
                                style={{ width: '80px', display: 'inline' }}>
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