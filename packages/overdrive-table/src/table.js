import Event from './event';
import Pagination from './pagination';
import Search from './search';
import Toolbar from './toolbar';
import Utils from './utils';

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

    /// constructor
    /// @param id - The id of the table, can be null
    constructor(id) {
        this.#id = id || new Date().valueOf();

        // initialize the components
        this.#components.pagination = new Pagination(this);
        this.#components.search = new Search(this);
        this.#components.toolbar = new Toolbar(this);

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
        let columns = {};
        for (const column of Object.keys(this.#columns))
        {
            if (this.hiddenColumns.includes(column) == false)
            {
                columns[column] = this.#columns[column];
            }
        }
        return columns;
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

    /// Retrieve the components
    /// @return - The components
    get components() {
        return this.#components;
    }

    /// Generate the request url including the pagination
    /// @return - The url for the request
    #composeRequest = () => {
        const url = [this.url.read];
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

    /// On row selection event
    /// @param row - The selected row
    /// @param model - The model of that row
    /// @param selected - If the row is selected or not
    onRowSelection = new Event();

    /// Notify when the table is ready
    /// @param table - The table
    onReady = new Event();

    /// Notify before rendering a row
    /// @param table - The table
    /// @param model -The rendered model
    onRowRendering = new Event();

    /// Retrieve the pagination system
    /// @return - The pagination
    get pagination() {
        return this.components.pagination;
    }

    /// Return the parent widget
    get parent() {
        return this.#dom.parent;
    }

    /// Parse the configuration file
    /// @param config - The configuration file
    #parseConfig = (config) => {
        // url
        if (typeof config.url === typeof "")
        {
            this.url = {
                create: config.url,
                read: config.url,
                update: config.url,
                delete: config.url
            };
        }
        else 
        {
            this.url = {
                create: config.url.create || null,
                read: config.url.read || null,
                update: config.url.update || null,
                delete: config.url.delete || null
            };
        }
        // columns
        this.columns = config.columns.visible || {};
        this.hiddenColumns = config.columns.hidden || ['id', '_id'];
        // schema
        this.schema = config.schema;
        // fields
        if (config.fields)
        {
            for (const field of Object.keys(config.fields))
            {
                this.#fields[field] = config.fields[field];
            }
        }
        // toolbar
        if (config.toolbar)
        {
            this.toolbar.enabled = config.toolbar.enabled || true;
            this.toolbar.buttons = config.toolbar.buttons || this.toolbar.buttons;
        }
    }

    /// Render the datatable 
    /// @param data - Can be an array of records or the url on which fetch data
    /// @param container_id - The id of the DOM container
    async render(parent_id, config) {
        // create the table at the first time
        if (this.table == null)
        {
            this.#parseConfig(config);
            this.#data = await this.#fetch();

            this.#dom.parent = document.getElementById(parent_id);
            if (this.parent == null)
            {
                console.error(`Unable to create the table! Invalid container ${container_id}`);
                return false;
            }

            // create the toolbar 
            if (this.toolbar.enabled)
            {
                this.toolbar.render();
            }

            // create the search box
            if (this.search.enabled)
            {
                this.search.render();
            }

            // create the table
            this.#dom.table = Utils.createChild(this.parent, 'table', (table) => {
                Utils.addClasses(table, this.classes.table);
                table.setAttribute('id', this.id);
            });

            // setup the columns if not set at the table initialization
            if ((this.#columns == null
                || JSON.stringify(this.#columns) == JSON.stringify({})
                || (Array.isArray(this.#columns) && this.#columns.length == 0))
                && this.data.recordsFiltered > 0)
            {
                this.columns = Object.keys(this.data.data[0]);
            }

            // render the table head
            this.#renderHead();

            // the table has been created
            this.onReady.broadcast(this);
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
            Utils.addClasses(this.body, this.classes.tbody);
        }
        else
        {
            this.body.innerHTML = '';
        }

        const count = this.pagination.enabled
            ? Math.min(this.data.recordsFiltered, this.pagination.limit)
            : this.data.recordsFiltered;
        const offset = 0;

        const columns = Object.keys(this.columns);
        for (let i = offset; i < (offset + count); ++i)
        {
            const model = this.data.data[i];
            this.onRowRendering.broadcast(this, model);
            const row = this.body.insertRow();
            if (model != null)
            {
                row.setAttribute('id', model.id || model._id);
                row.onclick = () => {
                    if (this.selectedRow != null)
                    {
                        Utils.removeClasses(this.selectedRow, this.classes.selectedRow);
                        if (this.selectedRow == row)
                        {
                            this.#selectedRow = null;
                            this.#selectedModel = null;
                            this.onRowSelection.broadcast(row, model, false);
                            return;
                        }
                    }
                    this.#selectedRow = row;
                    this.#selectedModel = model;
                    Utils.addClasses(row, this.classes.selectedRow);
                    this.onRowSelection.broadcast(row, model, true);
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
        return this.components.search;
    }

    /// Retrieve the selected model
    /// @return - The model
    get selectedModel() {
        return this.#selectedModel;
    }

    /// Retrieve the selected row
    /// @return - The selected row
    get selectedRow() {
        return this.#selectedRow;
    }

    /// Retrieve the DOM table
    /// @return - The DOM table
    get table() {
        return this.#dom.table;
    }

    /// Retrieve the toolbar component
    /// @return - The toolbar
    get toolbar() {
        return this.components.toolbar;
    }

    /// update the data table
    /// @param refresh - Specify if to refresh data
    async update(refresh = true) {
        if (this.table != null)
        {
            // fetch the data
            this.#data = await this.#fetch();

            // reset the row selection events
            this.#selectedRow = null;
            this.onRowSelection.broadcast(null, null, false);

            // render the table body
            this.#renderBody();

            // render the pagination widget
            this.pagination.render(this.data.recordsTotal);
        }
    }

    /// let to customize the table css per element
    /// basic bootstrap classes by default
    classes = {
        selectedRow: ['table-primary'],
        col: Array(),
        row: Array(),
        table: ['table', 'table-striped', 'table-hover', 'table-sm', 'mt-2'],
        tbody: Array(),
        thead: ['thead-dark']
    };
    /// The hidden columns
    hiddenColumns = Array();
    /// The data schema
    schema = {};
    /// The url for Ajax requests
    url = null;

    /// The columns of the table
    /// can contains the showed name
    #columns = Array();
    /// The components
    #components = {
        pagination: null,
        search: null,
        toolbar: null
    }
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
    /// The table id
    #id = null;
    /// The selected model
    #selectedModel = null;
    /// The selected row
    #selectedRow = null;
}