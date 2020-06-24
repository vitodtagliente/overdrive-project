import Pagination from './pagination';
import Search from './search';
import Inspector from './inspector';

export default class Table {

    /// The datatable instances
    static #instances = Array();

    /// Retrieve a table instance
    /// @param id - The id of the table, if many are instanciatedù
    /// @return - The table instance, if exists
    static instance(id) {
        if (id == null && this.#instances.length == 1)
        {
            return this.#instances[0];
        }

        for (let i = 0; i < this.#instances.length; ++i)
        {
            const table = this.#instances[i];
            if (table.id == id)
            {
                return table;
            }
        }
        return null;
    }

    /// The usage method type
    static get Mode() {
        return {
            Ajax: 'ajax',
            Data: 'data'
        };
    }
    /// constructor
    /// @param id - The id of the table, can be null
    constructor(id) {
        this.#id = id || new Date().valueOf();
        
        // initialize the components
        this.#pagination = new Pagination(this);
        this.#search = new Search(this);
        this.#inspector = new Inspector(this);

        /// register this instance
        Table.#instances.push(this);
    }

    /// Retrieve the body DOM
    /// @return - The DOM
    get body() {
        return this.#dom.table_body;
    }

    /// Retrieve the columns of the table
    /// @return - The columns
    get columns() {
        return this.#columns;
    }

    /// Set the columns
    /// @param value - The columns
    set columns(value) {
        if (Array.isArray(value))
        {
            this.#columns = Array();
            for (const column of value)
            {
                this.#columns[column] = column;
            }
        }
        else 
        {
            this.#columns = value;
        }
    }

    /// Generate the request url including the pagination
    /// @return - The url for the request
    #composeRequest = () => {
        const url = [this.url];
        let first = true;
        if (this.search.enabled)
        {
            const filter = 'any=like=' + this.search.value;
            if (filter.length != 0)
            {
                url.push(first ? '?' : '&');
                url.push('filter=');
                url.push(filter);
                first = false;
            }
        }
        if (this.pagination.enabled)
        {
            url.push(first ? '?' : '&');
            url.push('skip=');
            url.push(this.pagination.offset);
            url.push('&limit=');
            url.push(this.pagination.limit);
            first = false;
        }
        return url.join('');
    };

    /// Retrieve the data of the table
    /// @return - The table
    get data() {
        return this.#data;
    }

    /// Retrieve the DOM object
    /// @return - The DOM
    get DOM() {
        return this.#dom;
    }

    /// Update the data
    /// #param url - The new url on which request data
    /// @return - The fetched data
    #fetch = async () => {
        if (this.mode == Table.Mode.Ajax)
        {
            const url = this.#composeRequest();
            console.log(`Datatable ${this.id} request: ${url}`);
            let result = await $.get(
                url
            );
            if (Array.isArray(result))
            {
                result = {
                    data: result,
                    recordsTotal: result.length,
                    recordsFiltered: result.length
                };
            }
            return result;
        }
    }

    /// Register a custom renderer for a specific field
    /// @param name - The name of the field
    /// @param renderer - The render callback
    field(name, renderer) {
        this.#fields[name] = renderer;
    }

    /// Find a field renderer
    /// @param name - The name of the field
    /// @return - The renderer callback if exists
    #findFieldRenderer = (name) => {
        for (const field of Object.keys(this.#fields))
        {
            if (field == name)
            {
                return this.#fields[name];
            }
        }
        return null;
    }

    /// Retrieve the head DOM
    /// @return - The DOM
    get head() {
        return this.#dom.table_head;
    }

    /// Retrieve the table id
    /// @return - The id
    get id() {
        return this.#id;
    }

    /// Retrieve the inspector component
    /// @return - The inspector
    get inspector() {
        return this.#inspector;
    }

    /// Retrieve the table mode
    /// @return - The mode
    get mode() {
        return this.#mode;
    }

    /// On row click event
    /// @param row - The selected row
    /// @param model - The model of that row
    onRowClick = (row, model) => {

    };

    /// Retrieve the pagination system
    /// @return - The pagination
    get pagination() {
        return this.#pagination;
    }

    /// Return the parent widget
    get parent() {
        return this.#dom.parent;
    }

    /// Render the datatable 
    /// @param data - Can be an array of records or the url on which fetch data
    /// @param container_id - The id of the DOM container
    async render(data, container_id) {
        if (data != null)
        {
            if (Array.isArray(data))
            {
                this.#mode = Table.Mode.Data;
                this.#data = {
                    data,
                    recordsTotal: data.length,
                    recordsFiltered: data.length
                };
            }
            else
            {
                this.#url = data;
                this.#mode = Table.Mode.Ajax;
                this.#data = await this.#fetch();
            }
        }

        // create the table at the first time
        if (this.table == null)
        {
            this.#dom.parent = document.getElementById(container_id);
            if (this.parent == null)
            {
                console.error(`Unable to create the table! Invalid container ${container_id}`);
                return false;
            }

            // create the search box
            if (this.search.enabled)
            {
                this.search.render();
            }

            // create the table
            this.#dom.table = document.createElement('table');
            for (const css_class of this.classes.table)
            {
                this.table.classList.add(css_class);
            }
            this.table.setAttribute('id', this.id);
            this.parent.append(this.table);

            // setup the columns if not set at the table initialization
            if ((this.#columns == null
                || (Array.isArray(this.#columns) && this.#columns.length == 0))
                && this.data.recordsFiltered > 0)
            {
                this.columns = Object.keys(this.data.data[0]);
            }

            // render the table head
            this.#renderHead();
        }

        // update the table content
        await this.update(false);

        return true;
    }

    /// Render the body of the table
    #renderBody = () => {
        // create the body if not exist or clear it
        if (this.#dom.table_body == null)
        {
            this.#dom.table_body = this.table.createTBody();
            for (const css_class of this.classes.tbody)
            {
                this.body.classList.add(css_class);
            }
        }
        else
        {
            this.body.innerHTML = '';
        }

        const count = this.pagination.enabled
            ? Math.min(this.data.recordsFiltered, this.pagination.limit)
            : this.data.recordsFiltered;
        const offset = this.pagination.enabled
            ? (this.mode == Table.Mode.Data ? this.pagination.offset : 0)
            : 0;
        const columns = Object.keys(this.columns);
        for (let i = offset; i < (offset + count); ++i)
        {
            const model = this.data.data[i];
            const row = this.body.insertRow();
            if (model != null)
            {
                row.setAttribute('id', model.id || model._id);
                const self = this;
                row.onclick = function () {
                    self.onRowClick(row, model);
                };
            }
            this.renderRow(row, model, columns);
        }
    }

    /// Render the column header
    /// @param cell - The head row cell
    /// @param name - The name of the column
    renderColumn = async (cell, name) => {
        cell.innerHTML = name;
    }

    /// Render the head of the table
    #renderHead = () => {
        this.#dom.table_head = this.table.createTHead();
        for (const css_class of this.classes.thead)
        {
            this.head.classList.add(css_class);
        }
        const row = this.head.insertRow();
        const columns = this.columns;
        for (const column of Object.keys(columns))
        {
            const cell = row.insertCell();
            this.renderColumn(cell, columns[column]);
            cell.setAttribute('scope', 'col');
        }
    }

    /// Render a row in the table
    /// @param row - The table row
    /// @param model - the model
    /// @param fields - The columns of the table
    renderRow = (row, model, fields) => {
        for (const field of fields)
        {
            const cell = row.insertCell();
            const renderer = this.#findFieldRenderer(field);
            if (renderer != null)
            {
                renderer(cell, model);
            }
            else 
            {
                cell.innerHTML = model[field];
            }
        }
    };

    /// Retrieve the search system
    /// @return - The search
    get search() {
        return this.#search;
    }

    /// Retrieve the DOM table
    /// @return - The DOM table
    get table() {
        return this.#dom.table;
    }

    /// update the data table
    /// @param refresh - Specify if to refresh data
    async update(refresh = true) {
        if (this.table != null)
        {
            if (refresh && this.mode == Table.Mode.Ajax)
            {
                this.#data = await this.#fetch();
            }

            // render the table body
            this.#renderBody();

            // render the pagination widget
            this.pagination.render(this.data.recordsTotal);
        }
    }

    /// Retrieve the url
    /// #return - The url
    get url() {
        return this.#url;
    }

    /// let to customize the table css per element
    /// basic bootstrap classes by default
    classes = {
        col: Array(),
        row: Array(),
        table: ['table', 'table-striped', 'table-hover'],
        tbody: Array(),
        thead: ['thead-dark']
    };

    /// The table id
    #id = null;
    /// The columns of the table
    /// can contains the showed name
    #columns = Array();
    /// The fetched data
    #data = null;
    /// The DOM elements
    #dom = {
        parent: null,
        table: null,
        table_body: null,
        table_head: null
    };
    /// Collection of fields renderers
    #fields = Array();
    /// The inspector component
    #inspector = null;
    /// The mode of the table
    #mode = null;
    /// The pagination system
    #pagination = null;
    /// The search system
    #search = null;
    /// The url for Ajax mode
    #url = null;
}