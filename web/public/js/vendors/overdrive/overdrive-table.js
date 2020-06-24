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

    /// Remove classes to a DOM element
    /// @param element - The element
    /// @param classList - The list of classes to remove
    static removeClasses(element, classList) {
        for (const cl of classList)
        {
            element.classList.remove(cl);
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

class Pagination extends Component {
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
        if (this.table == null || this.table.parent == null)
        {
            console.error("Cannot initialize the Search component, invalid table object");
            return;
        }

        if (this.paginationBody == null)
        {
            this.#DOM.parent = Utils.createChild(this.table.parent, 'div', (element) => {
                Utils.addClasses(element, ['row']);
            });

            this.#DOM.limitDiv = Utils.createChild(this.parent, 'div', (element) => {
                Utils.addClasses(element, ['col-2']);
            });

            /// Create the limit selection widget
            if (this.limits.length > 0)
            {
                if (!this.limits.includes(this.limit))
                {
                    this.limit = this.limits[0];
                }

                this.#DOM.limitSelect = Utils.createChild(this.DOM.limitDiv, 'select', (element) => {
                    Utils.addClasses(element, ['form-control', 'form-control-sm']);
                    element.value = this.limit;
                    element.onchange = async () => {
                        this.limit = this.limitSelect.value;
                        await this.table.update();
                    };
                });

                for (const limit of this.limits)
                {
                    Utils.createChild(this.limitSelect, 'option', (element) => {
                        element.value = limit;
                        element.text = limit;
                    });
                }
            }

            // create the navigation widget structure
            this.#DOM.paginationDiv = Utils.createChild(this.parent, 'div', (div) => {
                Utils.addClasses(div, ['col-10']);
                this.#DOM.paginationWidget = Utils.createChild(div, 'nav', (nav) => {
                    Utils.setAttributes(nav, {
                        id: `nav-component-${this.table.id}`
                    });
                    Utils.addClasses(nav, this.classes.nav);
                    this.#DOM.paginationBody = Utils.createChild(nav, 'ul', (ul) => {
                        Utils.addClasses(ul, this.classes.ul);
                    });
                });
            });
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
            Utils.createChild(this.paginationBody, 'li', (li) => {
                Utils.addClasses(li, this.classes.li);
                if (isActive)
                {
                    Utils.addClasses(li, this.classes.active);
                }
                Utils.createChild(li, 'a', (a) => {
                    Utils.addClasses(a, this.classes.a);
                    a.innerHTML = text;
                    a.onclick = callback;
                });
            });
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

    /// Styles
    classes = {
        a: ['page-link'],
        active: ['active'],
        li: ['page-item'],
        nav: [],
        ul: ['pagination', 'pagination-sm', 'justify-content-end']
    }
    /// the limit of elements per page
    limit = 10;
    /// The available limit options
    limits = [10, 25, 50, 100];
    /// The max pages
    maxPages = 6;

    /// private:

    /// DOM elements
    #DOM = {
        limitDiv: null,
        paginationDiv: null,
        limitSelect: null,
        paginationWidget: null,
        paginationBody: null,
        parent: null
    }
    /// The internal state
    #state = {
        offset: 0,
        count: 0
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
        if (this.table == null || this.table.parent == null)
        {
            console.error("Cannot initialize the Search component, invalid table object");
            return;
        }
        
        if (this.searchBox == null)
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

    /// private:

    /// DOM elements
    #DOM = {
        parent: null,
        searchBox: null
    }
}

class InspectorWidget {
    #parent = null;
    #table = null;
    #type = null;
    #widget = null;
    constructor(type, table) {
        this.#type = type;
        this.#table = table;
    }

    #appendButton = (form, text, classes, callback) => {
        Utils.createChild(form, 'button', (button) => {
            Utils.setAttributes(button, {
                type: 'button'
            });
            Utils.addClasses(button, ['btn', 'btn-sm']);
            Utils.addClasses(button, classes);
            button.innerHTML = text;
            button.onclick = callback;
        });
    }

    #appendField = (form, definition, value) => {
        Utils.createChild(form, 'div', (div) => {
            Utils.addClasses(div, ['form-group', 'row']);
            Utils.createChild(div, 'label', (label) => {
                Utils.addClasses(label, ['col-sm-2', 'col-form-label', 'pt-0', 'pb-0']);
                Utils.setAttributes(label, {
                    for: definition.display
                });
                label.innerHTML = `<b>${definition.name}</b>`;
            });
            Utils.createChild(div, 'div', (inputDiv) => {
                Utils.addClasses(inputDiv, ['col-sm-10']);
                Utils.createChild(inputDiv, 'input', (input) => {
                    Utils.setAttributes(input, {
                        id: definition.name,
                        name: definition.name,
                        placeholder: definition.placeholder
                    });

                    if (definition.required)
                    {
                        Utils.setAttributes(input, { required: 'required' });
                    }

                    if (definition.readonly)
                    {
                        Utils.setAttributes(input, { readonly: true });
                    }

                    if (definition.default)
                    {
                        Utils.setAttributes(input, { default: definition.default });
                    }

                    if (definition.type == Boolean)
                    {
                        Utils.addClasses(input, ['form-check-input']);
                        Utils.setAttributes(input, { type: 'checkbox' });
                        input.checked = value;
                        input.value = true;
                    }
                    else if (definition.type == Number)
                    {
                        Utils.addClasses(input, ['form-control', 'form-control-sm']);
                        Utils.setAttributes(input, { type: 'number' });
                        input.value = value;
                    }
                    else 
                    {
                        Utils.addClasses(input, ['form-control', 'form-control-sm']);
                        Utils.setAttributes(input, { type: 'text' });
                        input.value = value;
                    }
                });
            });
        });
    }

    #createForm = (parent, schema, url, model) => {
        return Utils.createChild(parent, 'form', (form) => {
            Utils.setAttributes(form, {
                id: 'edit-inspector'
            });
            Utils.addClasses(form, ['container', 'p-2']);

            schema = schema || {};
            for (const field of Object.keys(model))
            {
                if (schema[field] != null)
                {
                    continue;
                }

                let definition = {
                    name: field,
                    display: field,
                    required: false,
                    readonly: field == "_id" ?  true : false,
                    default: null,
                    type: String,
                    placeholder: ''
                };

                const value = model[field];
                if (value != null)
                {
                    if (typeof value === typeof true)
                    {
                        definition.type = Boolean;
                    }
                    else if (!isNaN(value))
                    {
                        definition.type = Number;
                    }
                }

                schema[field] = definition;
            }

            for (const field of Object.keys(schema))
            {
                const value = model[field] || null;
                this.#appendField(form, schema[field], value);
            }

            this.#appendButton(form, 'Save', ['btn-warning'], function (e) {
                e.preventDefault();

                let data = form.serialize();

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

                this.table.update();
            });
            this.#appendButton(form, 'Close', ['btn-light'], function (e) {
                // close function
                this.close();
            });
        });
    }

    close() {
        if (this.isOpen)
        {
            this.widget.remove();
            this.#widget = null;
        }
    }

    get isOpen() {
        return this.widget != null;
    }

    open(parent, schema, url, model) {
        if (this.isOpen)
        {
            this.close();
        }

        this.#parent = parent;

        if (this.type == 'edit')
        {
            this.#widget = document.createElement('tr');
            parent.parentNode.insertBefore(this.widget, parent.nextSibling);

            Utils.addClasses(this.widget, ['table-light']);
            Utils.createChild(this.widget, 'td', (td) => {
                Utils.setAttributes(td, {
                    colspan: '100%'
                });

                this.#createForm(td, schema, url, model);
            });
        }
    }

    get parent() {
        return this.#parent;
    }

    get table() {
        return this.#table;
    }

    get type() {
        return this.#type;
    }

    get widget() {
        return this.#widget;
    }
}

class Inspector extends Component {

    Type = {
        Create: 'create',
        Edit: 'edit'
    };

    schema = {};
    #widgets = Array();
    constructor(table) {
        super(table);

        // initialize the widgets
        for (const type of Object.keys(this.Type))
        {
            const value = this.Type[type];
            this.#widgets[value] = new InspectorWidget(value, table);
        }

        table.onRowClick = (row, model) => {
            if (this.enabled == false) return;

            if (this.editInspector.parent != null)
            {
                Utils.removeClasses(this.editInspector.parent, this.classes.activeRow);
            }
            if (row == this.editInspector.parent)
            {
                this.editInspector.close();
            }
            else 
            {
                Utils.addClasses(row, this.classes.activeRow);
                this.editInspector.open(row, this.schema, `${this.table.url}/${model.id}`, model);
                row.scrollIntoView();
            }
        };
    }

    get editInspector() {
        return this.#getWidget(this.Type.Edit);
    }

    #getWidget = (type) => {
        if (Object.keys(this.widgets).includes(type))
            return this.widgets[type];
        return null;
    }

    get widgets() {
        return this.#widgets;
    }

    classes = {
        activeRow: ['table-primary']
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
