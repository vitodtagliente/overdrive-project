class Event {
    #listeners = Array();

    constructor() {

    }

    broadcast() {
        for (const listener of this.#listeners)
        {
            listener(...arguments);
        }
    }

    bind(listener) {
        this.#listeners.push(listener);
    }

    unbind(listener) {
        this.#listeners.splice(listener, 1);
    }
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
    /// The component id
    #id = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
        this.#id = `search-component-${table.id}`;
    }

    /// Create the element
    /// @param parent - The parent DOM element
    create = () => {
        this.#DOM.parent = Utils.createChild(this.table.parent, 'div', (div) => {
            Utils.addClasses(div, this.classes.div);
            this.#DOM.searchBox = Utils.createChild(div, 'input', (searchbox) => {
                Utils.setAttributes(searchbox, {
                    id: this.id,
                    placeholder: 'Search',
                    type: 'text'
                });
                Utils.addClasses(searchbox, this.classes.input);
                searchbox.onkeyup = () => {
                    this.table.update();
                };
            });
        });
    }

    /// Retrieve the DOM elements
    /// @return - The DOM elements
    get DOM() {
        return this.#DOM;
    }

    /// Retrieve the search value
    /// @return - The value
    getValue = () => {
        if (this.DOM.searchBox)
        {
            return this.DOM.searchBox.value;
        }
        return "";
    }

    /// Retrieve the component id
    /// @return - The id
    get id() {
        return this.#id;
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
            this.create();
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
        return this.getValue();
    }

    /// private:

    /// DOM elements
    #DOM = {
        parent: null,
        searchBox: null
    }
    /// style classes
    classes = {
        div: Array(),
        input: ["form-control"]
    };
}

class ToolbarButton {
    /// Prefab buttons
    static get Prefabs() {
        return {
            Add: new ToolbarButton(
                'New',
                'plus',
                'btn-success',
                () => {

                }
            ),
            Edit: new ToolbarButton(
                'Edit',
                'pen',
                'btn-light',
                () => {

                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            Remove: new ToolbarButton(
                'Delete',
                'trash',
                'btn-danger',
                () => {

                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
        }
    }

    static get RenderMode() {
        return {
            Always: 'always',
            OnRowSelection: 'selection'
        };
    }

    /// The id
    #id = null;
    name = null;
    icon = null;
    style = [];
    #behaviour = null;
    #mode = null;
    #widget = null;
    /// Constructor
    constructor(name, icon, style, behaviour, mode) {
        this.#id = `toolbar-button-${new Date().valueOf()}`;
        this.name = name;
        this.icon = icon;
        this.style = style;
        if (!Array.isArray(this.style))
        {
            this.style = [this.style];
        }
        this.#behaviour = behaviour;
        this.#mode = mode || ToolbarButton.RenderMode.Always;
    }

    show(parent, visible, classes) {
        if (visible && this.widget == null)
        {
            this.#widget = Utils.createChild(parent, 'button', (button) => {
                Utils.setAttributes(button, {
                    type: 'button'
                });
                Utils.addClasses(button, this.style.concat(classes));
                button.innerHTML = `<i class="fa fa-${this.icon}"></i> ${this.name}`;
                button.onclick = this.behaviour;
            });
        }
        else if (!visible && this.widget != null)
        {
            this.widget.remove();
            this.#widget = null;
        }
    }

    get id() {
        return this.#id;
    }

    get behaviour() {
        return this.#behaviour;
    }

    get mode() {
        return this.#mode;
    }

    get widget() {
        return this.#widget;
    }
}

class Toolbar extends Component {
    static Button = ToolbarButton;
    /// The buttons
    #buttons = Array();
    /// The widget DOM
    #widget = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
        this.buttons.push(ToolbarButton.Prefabs.Add);
        this.buttons.push(ToolbarButton.Prefabs.Edit);
        this.buttons.push(ToolbarButton.Prefabs.Remove);

        table.onRowSelection.bind((row, model, selected) => {
            this.#update();
        });
    }

    /// Remove all the buttons
    clear() {
        this.#buttons = Array();
        this.update(false);
    }

    /// Create the widget
    create = () => {
        this.#widget = Utils.createChild(this.table.parent, 'div', (div) => {
            Utils.addClasses(div, this.classes.toolbar);

        });
    }

    /// Render/create the component
    render() {
        if (this.table == null || this.table.parent == null)
        {
            console.error("Cannot initialize the Toolbar component, invalid table object");
            return;
        }

        if (this.widget == null)
        {
            this.create();
        }

        this.#update();
    }

    #update = () => {
        for (const button of this.buttons)
        {
            if (button != null)
            {
                const visible = button.mode == ToolbarButton.RenderMode.Always || this.table.selectedRow != null;
                button.show(this.widget, visible, this.classes.button);
            }
        }
    }

    get buttons() {
        return this.#buttons;
    }

    get widget() {
        return this.#widget;
    }

    /// The style classes
    classes = {
        button: ['btn', 'btn-sm', 'rounded-0'],
        toolbar: ['pt-2', 'pb-2']
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
        const offset = this.pagination.enabled
            ? this.pagination.offset
            : 0;

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
                            this.onRowSelection.broadcast(row, model, false);
                            return;
                        }
                    }
                    this.#selectedRow = row;
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
    /// The selected row
    #selectedRow = null;
}
