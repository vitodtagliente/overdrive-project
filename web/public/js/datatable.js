class SearchCache {

}

class Pagination {
    /// constructor
    constructor() {

    }

    get container() {
        return this.#container;
    }

    async render() {
        if (this.widget == null)
        {
            if (!await this.create())
            {
                console.log('Error on creating the navigation widget!');
                return false;
            }
        }



    }

    get page() {
        return this.#state.offset / this.limit;
    }

    get pages() {
        return this.#state.count / this.limit;
    }

    get widget() {
        return this.#widget;
    }

    async create(container) {
        this.#container = container;
        if (this.#container)
        {
            this.#container.innerHTML = "\
                <nav aria-label='...''>\
                <ul class='pagination pagination-sm'>\
                <li class='page-item active'><a class='page-link' href='#'>1</a></li>\
                <li class='page-item'><a class='page-link' href='#'>2</a></li>\
                <li class='page-item'><a class='page-link' href='#'>3</a></li>\
                </ul>\
                </nav>\
            ";
            return true;
        }
        return false;
    }

    enabled = true;
    limit = 10;

    #container = null;
    #state = {
        offset: 0,
        count: 0
    }
    #widget = null;
}

class Table {
    /// The usage method
    static get Mode() {
        return {
            Ajax: 'ajax',
            Data: 'data'
        };
    }
    /// constructor
    /// @param data - can be a static array of data or the base url for retrieving data
    constructor(data) {
        if (Array.isArray(data))
        {
            this.#mode = Table.Mode.Data;
            this.#data = data;
        }
        else
        {
            this.#mode = Table.Mode.Ajax;
            this.#url = data;
        }
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

    /// Retrieve the data of the table
    /// @return - The table
    get data() {
        return this.#data;
    }

    /// Update the data
    /// #param url - The new url on which request data
    /// @return - The fetched data
    async fetch(url) {
        if (this.mode == Table.Mode.Data)
        {
            return this.data;
        }
        else 
        {
            if (this.url != url
                || this.#data == null
                || Array.isArray(this.#data) && this.#data.length == 0)
            {
                this.#url = url;
                this.#data = await $.get(
                    url
                );
            }
            return this.data;
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

    /// Retrieve the table id
    /// @return - The id
    get id() {
        return this.#id;
    }

    /// Retrieve the table mode
    /// @return - The mode
    get mode() {
        return this.#mode;
    }

    /// Return the parent widget
    get parent() {
        return this.#dom.parent;
    }

    /// Render the datatable 
    /// @param id - The id of the DOM element in which render the datatable
    async render(id) {
        // update date
        await this.fetch(this.url);

        // create the table at the first time
        if (this.parent == null)
        {
            this.#dom.parent = document.getElementById(id);
            if (this.parent == null)
            {
                console.log('Unable to create the table! Invalid contained id');
                return false;
            }

            // create the table
            this.#id = new Date().valueOf();
            this.#dom.table = document.createElement('table');
            for (const css_class of this.classes.table)
            {
                this.table.classList.add(css_class);
            }            
            this.table.setAttribute('id', this.id);
            this.parent.append(this.table);

            // setup the columns
            if ((this.#columns == null
                || (Array.isArray(this.#columns) && this.#columns.length == 0))
                && this.data.length > 0)
            {
                this.columns = Object.keys(this.data[0]);
            }

            // render the table head
            await this.#renderHead();
        }

        // render the table body
        await this.#renderBody();

        //const paginationDiv = document.createElement('div');
        //console.log(await this.pagination.create(paginationDiv));
        //container.append(paginationDiv);
    }

    /// Render the body of the table
    #renderBody = async () => {
        // create the body if not exist or clear it
        if (this.#dom.table_body == null)
        {
            this.#dom.table_body = this.table.createTBody();
        }
        else
        {
            this.#dom.table_body.innerHTML = '';
        }

        //const count = this.pagination.enabled
        //    ? Math.min(data.length, this.pagination.limit)
        //    : data.length;
        const count = this.data.length;
        const columns = Object.keys(this.columns);
        for (let i = 0; i < count; ++i)
        {
            const model = this.data[i];
            const row = this.#dom.table_body.insertRow();
            row.setAttribute('id', model.id || model._id);
            await this.renderRow(row, model, columns);
        }
    }

    /// Render the column header
    /// @param cell - The head row cell
    /// @param name - The name of the column
    renderColumn = async (cell, name) => {
        cell.innerHTML = name;
    }

    /// Render the head of the table
    #renderHead = async () => {
        this.#dom.table_head = this.table.createTHead();
        const row = this.#dom.table_head.insertRow();
        const columns = this.columns;
        for (const column of Object.keys(columns))
        {
            const cell = row.insertCell();
            await this.renderColumn(cell, columns[column]);
            cell.setAttribute('scope', 'col');
        }
    }

    /// Render a row in the table
    /// @param row - The table row
    /// @param model - the model
    /// @param fields - The columns of the table
    renderRow = async (row, model, fields) => {
        for (const field of fields)
        {
            const cell = row.insertCell();
            const renderer = this.#findFieldRenderer(field);
            if (renderer != null)
            {
                await renderer(cell, model);
            }
            else 
            {
                cell.innerHTML = model[field];
            }
        }
    };

    /// Retrieve the DOM table
    /// @return - The DOM table
    get table() {
        return this.#dom.table;
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
        table: ['table', 'table-hover']
    };
    pagination = new Pagination();

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
    /// The mode of the table
    #mode = null;
    /// The url for Ajax mode
    #url = null;
}