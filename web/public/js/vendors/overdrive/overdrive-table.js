class Pagination {
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        this.#table = table;
    }

    /// Retrieve the DOM elements
    /// @return - The DOM elements
    get DOM() {
        return this.#DOM;
    }

    /// Retrieve the limit select box
    /// @return - The limit select
    get limitSelect() {
        return this.DOM.limitSelect;
    }

    /// Retrieve the offset of the pagination
    /// @return - The offset
    get offset() {
        return this.#state.offset;
    }

    /// Retrieve the current page
    /// @return - The page
    get page() {
        return this.#state.offset / this.limit;
    }

    /// Retrieve the num of pages
    /// @return - The pages num
    get pages() {
        return this.#state.count / this.limit;
    }
    /// Retrieve the pagination widget
    /// @return - The DOM element
    get pagination() {
        return this.DOM.paginationWidget;
    }

    /// Retrieve the pagination body DOM
    /// @return - The DOM element
    get paginationBody() {
        return this.DOM.paginationBody;
    }

    /// Retrieve the parent DOM
    /// @return - The DOM of the parent element
    get parent() {
        return this.DOM.parent;
    }

    /// Render the widget
    /// @param count - The num of records
    render(count) {
        // create the parent container if not exists
        if (this.parent == null)
        {
            if (this.table == null)
            {
                console.error('Unable to create the pagination widget!');
                return;
            }

            this.#DOM.parent = document.createElement('div');
            this.parent.classList.add('row');
            this.table.parent.append(this.parent);

            this.#DOM.limitDiv = document.createElement('div');
            this.#DOM.limitDiv.classList.add('col-2');
            this.parent.appendChild(this.#DOM.limitDiv);

            if (this.limits.length > 0)
            {
                this.#DOM.limitSelect = document.createElement("select");
                this.limitSelect.classList.add('form-control');
                this.limitSelect.classList.add('form-control-sm');

                if (!this.limits.includes(this.limit))
                {
                    this.limit = this.limits[0];
                }

                for (const limit of this.limits)
                {
                    const option = document.createElement('option');
                    option.value = limit;
                    option.text = limit;
                    this.limitSelect.appendChild(option);
                }

                this.limitSelect.value = this.limit;

                this.limitSelect.onchange = async () => {
                    this.limit = this.limitSelect.value;
                    await this.table.update();
                };
                this.#DOM.limitDiv.append(this.limitSelect);
            }

            this.#DOM.paginationDiv = document.createElement('div');
            this.#DOM.paginationDiv.classList.add('col-10');
            this.parent.appendChild(this.#DOM.paginationDiv);

            this.#DOM.paginationWidget = document.createElement('nav');
            this.pagination.setAttribute('id', 'nav-' + this.table.id);
            for (const css_class of this.classes.nav)
            {
                this.pagination.classList.add(css_class);
            }
            this.#DOM.paginationBody = document.createElement('ul');
            for (const css_class of this.classes.ul)
            {
                this.paginationBody.classList.add(css_class);
            }
            this.pagination.append(this.paginationBody);
            this.#DOM.paginationDiv.append(this.pagination);
        }

        // clear the content
        this.paginationBody.innerHTML = '';

        this.#state.count = count;
        if (this.#state.offset > count)
        {
            this.#state.offset = 0;
        }

        let startPage = this.pages > this.maxPages
            ? Math.max(0, this.page - Math.round(this.maxPages / 2))
            : 0;

        let endPage = this.pages > this.maxPages
            ? Math.min(this.pages, this.page + Math.round(this.maxPages / 2) + 1)
            : this.pages;

        const createChild = (isActive, text, callback) => {
            const li = document.createElement('li');
            for (const css_class of this.classes.li)
            {
                li.classList.add(css_class);
            }

            if (isActive)
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

            a.innerHTML = text;
            a.onclick = callback;
            li.append(a);

            this.paginationBody.append(li);
        };

        createChild(false, '<span aria-hidden="true">&laquo;</span>', async () => {
            this.#state.offset = Math.max(0, this.limit * (this.page - 1));
            await this.table.update();
        });
        for (let i = startPage; i < endPage; ++i)
        {
            createChild(this.page == i, i + 1,
                async () => {
                    this.#state.offset = this.limit * i;
                    await this.table.update();
                }
            );
        }
        createChild(false, '<span aria-hidden="true">&raquo;</span>', async () => {
            this.#state.offset = Math.min(
                Math.max((this.pages - 1) * this.limit, 0),
                this.limit * (this.page + 1)
            );
            await this.table.update();
        });
    }

    /// Retrieve the table
    /// @return - The table
    get table() {
        return this.#table;
    }

    /// Styles
    classes = {
        a: ['page-link'],
        active: ['active'],
        li: ['page-item'],
        nav: [],
        ul: ['pagination', 'pagination-sm', 'justify-content-end']
    }
    /// DOM elements
    #DOM = {
        limitDiv: null,
        paginationDiv: null,
        limitSelect: null,
        paginationWidget: null,
        paginationBody: null,
        parent: null
    }
    /// used to enable/disable the pagination
    enabled = true;
    /// the limit of elements per page
    limit = 10;
    /// The available limit options
    limits = [10, 25, 50, 100];
    /// The max pages
    maxPages = 6;
    /// The internal state
    #state = {
        offset: 0,
        count: 0
    }
    /// The table
    #table = null;
}

class Component {
    enabled = true;
    #table = null;
    /// Constructor
    /// @param table - The table
    constructor(table) {
        this.#table = table;
    }

    /// Render/create the component
    render() {

    }

    /// Retrieve the table
    get table() {
        return this.#table;
    }
}

class Utils {
    /// Add classes to a DOM element
    /// @param element - The element
    /// @param classList - The list of classes to apply
    static addClasses(element, classList) {
        for (const cl of classList)
        {
            element.classList.add(cl);
        }
    }

    /// Set DOM element attributes
    /// @param element - The element
    /// @param attributes - The attributes to set
    static setAttributes(element, attributes) {
        for (const name of Object.keys(attributes))
        {
            element.setAttribute(name, attributes[name]);
        }
    }

    /// Create a new element and add to the selected element
    /// @param parent - The parent element
    /// @param type - The type of element
    /// @param callback - The function used to customize the new element
    /// @return - The new element
    static createChild(parent, type, callback = (element) => { }) {
        console.assert(parent != null, "Invalid parent object!");
        const element = document.createElement(type);
        console.assert(element != null, `Invalid element type: ${type}`);
        parent.appendChild(element);
        if (callback != null)
        {
            callback(element);
        }
        return element;
    }
}

class Search extends Component {
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
    }

    /// Retrieve the DOM elements
    /// @return - The DOM elements
    get DOM() {
        return this.#DOM;
    }

    /// Retrieve the parent DOM element
    /// @return - The parent DOM 
    get parent() {
        return this.DOM.parent;
    }

    /// Render/create the component
    render() {
        if (this.table != null && this.table.parent != null)
        {
            this.#DOM.parent = Utils.createChild(this.table.parent, 'div', (div) => {
                this.#DOM.searchBox = Utils.createChild(div, 'input', (searchbox) => {
                    Utils.setAttributes(searchbox, {
                        id: `search-component-${this.table.id}`,
                        placeholder: 'Search',
                        type: 'text'
                    });
                    Utils.addClasses(searchbox, ["form-control"]);
                    searchbox.onkeyup = () => {
                        this.table.update();
                    };
                });
            });
        }
        else 
        {
            console.error("Cannot initialize the Search component, invlaid table object");
        }
    }

    /// Retrieve the search box
    /// @return - The search input
    get searchBox() {
        return this.DOM.searchBox;
    }

    /// Retrieve the current value
    /// @return - The value
    get value() {
        if (this.DOM.searchBox)
        {
            return this.DOM.searchBox.value;
        }
        return "";
    }

    /// DOM elements
    #DOM = {
        parent: null,
        searchBox: null
    }
}

class Inspector {
    #data = null;
    #selectedRow = null;
    #table = null;
    #widget = null;
    #url = null;

    constructor() {
    }

    get data() {
        return this.#data;
    }

    #createField = (name, type, value) => {

        const isCheckbox = type == 'checkbox';

        const applyClasses = (element, classes) => {
            for (const style of classes)
            {
                element.classList.add(style);
            }
        };

        const div = document.createElement('div');
        applyClasses(div, ['form-group', 'row']);

        const label = document.createElement('label');
        applyClasses(label, ['col-sm-2', 'col-form-label', 'pt-0', 'pb-0']);
        label.setAttribute('for', name);
        label.innerHTML = "<b>" + name + "</b>";

        const inputDiv = document.createElement('div');
        applyClasses(inputDiv, isCheckbox ? ['col-sm-10'] : ['col-sm-10']);

        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', name);
        if (isCheckbox)
        {
            input.checked = value;
            input.value = true;
        }
        else 
        {
            input.value = value;
        }
        applyClasses(input, !isCheckbox ? ['form-control', 'form-control-sm'] : ['from-check-input']);

        inputDiv.appendChild(input);

        div.appendChild(label);
        div.appendChild(inputDiv);

        return div;
    }

    #createButton = (text, color, callback) => {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('btn');
        button.classList.add(color);
        button.classList.add('btn-sm');
        button.innerHTML = text;
        button.onclick = callback;
        return button;
    }

    render(row, model) {
        this.#data = model;

        if (this.#widget != null)
        {
            this.#widget.remove();
        }

        if (this.#selectedRow == row)
        {
            this.#selectedRow.classList.remove('table-primary');
            this.#selectedRow = null;
            return;
        }

        if (this.#selectedRow)
        {
            this.#selectedRow.classList.remove('table-primary');
        }
        this.#selectedRow = row;
        row.classList.add('table-primary');

        this.#widget = document.createElement('tr');
        this.#widget.classList.add('table-light');
        const td = document.createElement('td');
        td.setAttribute('colspan', '100%');
        this.#widget.appendChild(td);

        const form = document.createElement('form');
        form.id = "inspector-form";
        form.classList.add('container');
        form.classList.add('p-2');

        for (const field of Object.keys(this.data))
        {
            const value = this.data[field];
            let type = 'text';
            if (typeof value === typeof true)
            {
                type = 'checkbox';
            }
            else if (!isNaN(value))
            {
                type = 'number';
            }
            form.appendChild(this.#createField(field, type, value));
        }

        form.appendChild(this.#createButton('Save', 'btn-warning', function (e) {
            e.preventDefault();

            let data = $("#inspector-form").serialize();

            // include unchecked checkboxes. use filter to only include unchecked boxes.
            $.each($('form input[type=checkbox]')
                .filter(function (idx) {
                    return $(this).prop('checked') === false
                }),
                function (idx, el) {
                    // attach matched element names to the formData with a chosen value.
                    data += '&' + $(el).attr('name') + '=false';
                }
            );

            const url = '/api/items/' + model._id;
            console.log("sending data to " + url);
            console.log(data);

            $.ajax({
                type: 'PATCH',
                url: url,
                data: data,
            }).done(function (data) {
                console.log("success");
                console.log(data);
            }).fail(function (data) {
                console.log(error);
            });

            Table.instance().update();
        }));
        form.appendChild(this.#createButton('Close', 'btn-light', function () {
            // close function
        }));

        row.parentNode.insertBefore(this.#widget, row.nextSibling);

        td.appendChild(form);
        row.scrollIntoView();
    }

    attach(table) {
        this.#table = table;
        table.onRowClick = (row, model) => {
            this.render(row, model);
        };
        this.#url = '/api/items';
    }

    get table() {
        return this.#table;
    }

    get url() {
        return this.#url;
    }
}

class Table {

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
        this.#inspector = new Inspector();
        this.inspector.attach(this);

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

    /*
    renderSearchRow = async (row, fields) => {
        for (const field of fields)
        {
            const cell = row.insertCell();
            const textbox = document.createElement('input');
            textbox.setAttribute("type", "text");
            textbox.setAttribute("name", field);
            textbox.setAttribute("id", `search-${field}`);
            textbox.classList.add('form-control');
            textbox.classList.add('form-control-sm');
            cell.appendChild(textbox);
            textbox.onkeyup = (event) => {
                this.search.update(field, textbox.value);
                event.preventDefault();
            };
        }
    }
    */

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
