class SearchCache {

}

class Pagination {
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        this.#table = table;
    }

    get offset() {
        return this.#state.offset;
    }

    get page() {
        return this.#state.offset / this.limit;
    }

    get pages() {
        return this.#state.count / this.limit;
    }

    get parent() {
        return this.#parent;
    }

    async render(count) {
        // create the parent container if not exists
        if (this.parent == null)
        {
            if (this.table == null)
            {
                console.log('Unable to create the pagination widget!');
                return;
            }

            this.#parent = document.createElement('div');
            this.parent.classList.add('row');
            this.table.parent.append(this.parent);

            const select_div = document.createElement('div');
            select_div.classList.add('col-2');
            this.parent.appendChild(select_div);

            const nav_div = document.createElement('div');
            nav_div.classList.add('col-10');
            this.parent.appendChild(nav_div);

            const select = document.createElement("select");
            select.classList.add('form-control');
            select.classList.add('form-control-sm');
            for (const limit of this.limits)
            {
                const option = document.createElement('option');
                option.value = limit;
                option.text = limit;
                select.appendChild(option);
            }
            select.onchange = async () => {
                this.limit = select.value;
                await this.table.update();
            };
            select_div.append(select);

            const nav = document.createElement('nav');
            nav.setAttribute('id', 'nav-' + this.table.id);
            for (const css_class of this.classes.nav)
            {
                nav.classList.add(css_class);
            }
            this.#widget = document.createElement('ul');
            for (const css_class of this.classes.ul)
            {
                this.widget.classList.add(css_class);
            }
            nav.append(this.widget);
            nav_div.append(nav);
        }

        // clear the content
        this.widget.innerHTML = '';

        this.#state.count = count;
        for (let i = 0; i < this.pages; ++i)
        {
            const li = document.createElement('li');
            for (const css_class of this.classes.li)
            {
                li.classList.add(css_class);
            }

            if (this.page == i)
            {
                for (const css_class of this.classes.active)
                {
                    li.classList.add(css_class);
                }
            }

            const a = document.createElement('a');
            for (const css_class of this.classes.a)
            {
                a.classList.add(css_class);
            }
            a.innerText = i + 1;
            a.onclick = async () => {
                this.#state.offset = this.limit * i;
                await this.table.update();
            };
            li.append(a);

            this.widget.append(li);
        }
    }

    get table() {
        return this.#table;
    }

    get widget() {
        return this.#widget;
    }

    classes = {
        a: ['page-link'],
        active: ['active'],
        li: ['page-item'],
        nav: [],
        ul: ['pagination', 'pagination-sm', 'justify-content-end']
    }
    enabled = true;
    limit = 10;
    limits = [10, 25, 50, 100];

    #parent = null;
    #state = {
        offset: 0,
        count: 0
    }
    #table = null;
    #widget = null;
}

class Table {

    static #instances = Array();

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

    /// The usage method
    static get Mode() {
        return {
            Ajax: 'ajax',
            Data: 'data'
        };
    }
    /// constructor
    /// @param id - The id of the table
    constructor(id) {
        this.#id = id || new Date().valueOf();
        this.#pagination = new Pagination(this);

        /// register this instance
        Table.#instances.push(this);
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
        if (this.pagination.enabled)
        {
            url.push('?');
            url.push('skip=');
            url.push(this.pagination.offset);
            url.push('&limit=');
            url.push(this.pagination.limit);
        }
        return url.join('');
    };

    /// Retrieve the data of the table
    /// @return - The table
    get data() {
        return this.#data;
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
                    count: result.length
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
                    count: data.length
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
                console.log('Unable to create the table! Invalid container id');
                return false;
            }

            // create the search box
            if (this.search.enabled)
            {
                this.#dom.search = document.createElement('div');
                const text = document.createElement('input');
                text.setAttribute("type", "text");
                text.classList.add('form-control');
                this.parent.append(this.#dom.search);
                this.#dom.search.append(text);
                text.onchange = (event) => {
                    console.log(88);
                    console.log(this);
                    this.update();
                };
            }

            // create the table
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
                && this.data.count > 0)
            {
                this.columns = Object.keys(this.data.data[0]);
            }

            // render the table head
            await this.#renderHead();
        }

        // update the table content
        await this.update(false);
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

        const count = this.pagination.enabled
            ? Math.min(this.data.data.length, this.pagination.limit)
            : this.data.count;
        const offset = this.pagination.enabled
            ? (this.mode == Table.Mode.Data ? this.pagination.offset : 0)
            : 0;
        const columns = Object.keys(this.columns);
        for (let i = offset; i < (offset + count); ++i)
        {
            const model = this.data.data[i];
            const row = this.#dom.table_body.insertRow();
            if (model != null)
            {
                row.setAttribute('id', model.id || model._id);
                const self = this;
                row.onclick = function () {
                    self.onRowClick(row, model);
                };
            }
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
            await this.#renderBody();

            // render the pagination widget
            await this.pagination.render(this.data.count);
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
        table: ['table', 'table-hover']
    };

    search = {
        enabled: true
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
        search: null,
        table: null,
        table_body: null,
        table_head: null
    };
    /// Collection of fields renderers
    #fields = Array();
    /// The mode of the table
    #mode = null;
    /// The pagination system
    #pagination = null;
    /// The url for Ajax mode
    #url = null;
}