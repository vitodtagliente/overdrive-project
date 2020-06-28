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

class Dialog extends Component {
    /// The component id
    #id = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
        this.#id = `dialog-component-${table.id}`;
    }

    /// Create the element
    /// @param parent - The parent DOM element
    create = () => {
        this.#DOM.widget = Utils.createChild(this.table.parent, 'div', (modal) => {
            Utils.addClasses(modal, ['modal', 'fade']);
            Utils.setAttributes(modal, {
                id: this.id,
                'data-backdrop': 'static',
                'data-keyboard': false,
                tabIndex: -1,
                role: 'dialog',
                'aria-labelledby': "staticBackdropLabel",
                'aria-hidden': true
            });
        });
        Utils.createChild(this.widget, 'div', (dialog) => {
            Utils.addClasses(dialog, ['modal-dialog', 'modal-dialog-scrollable', 'modal-lg']);
            Utils.createChild(dialog, 'div', (content) => {
                Utils.addClasses(content, ['modal-content']);
                Utils.createChild(content, 'div', (header) => {
                    Utils.addClasses(header, ['modal-header']);
                    this.#DOM.title = Utils.createChild(header, 'div', (title) => { Utils.addClasses(title, ['modal-title']); });
                    Utils.createChild(header, 'button', (button) => {
                        Utils.addClasses(button, ['close']);
                        Utils.setAttributes(button, {
                            'data-dismiss': 'modal',
                            'aria-label': 'Close'
                        });
                        button.innerHTML = '<span aria-hidden="true">&times;</span>';
                    });
                });
                this.#DOM.body = Utils.createChild(content, 'div', (body) => { Utils.addClasses(body, ['modal-body']); });
                this.#DOM.footer = Utils.createChild(content, 'div', (footer) => { Utils.addClasses(footer, ['modal-footer']); });
            });
        });
    }

    /// Retrieve the DOM elements
    /// @return - The DOM elements
    get DOM() {
        return this.#DOM;
    }

    /// Retrieve the component id
    /// @return - The id
    get id() {
        return this.#id;
    }

    /// Retrieve the parent DOM element
    /// @return - The parent DOM 
    get parent() {
        return this.table.parent;
    }

    /// Render/create the component
    render() {
        if (this.table == null || this.table.parent == null)
        {
            console.error("Cannot initialize the Search component, invalid table object");
            return;
        }

        if (this.widget == null)
        {
            this.create();
        }
    }

    get body() {
        return this.DOM.body;
    }

    get title() {
        return this.DOM.title;
    }

    get widget() {
        return this.DOM.widget;
    }

    clear() {
        if (this.widget)
        {
            this.title.innerHTML = "";
            this.body.innerHTML = "";
            this.DOM.footer.innerHTML = "";
            this.hideFooter();
        }
    }

    bind(element) {
        Utils.setAttributes(element, {
            'data-toggle': 'modal',
            'data-target': `#${this.id}`
        });
    }

    show() {
        $(`#${this.id}`).modal('show');
    }

    close() {
        $(`#${this.id}`).modal('hide');
    }

    hideFooter() {
        if (this.footer)
        {
            this.footer.style.display = "none";
        }
    }

    showFooter() {
        if (this.footer)
        {
            this.footer.style.display = "display";
        }
    }

    addButton(name, style, callback, closeModal = true) {
        if (this.DOM.footer)
        {
            Utils.createChild(this.DOM.footer, 'button', (button) => {
                if (!Array.isArray(style))
                {
                    style = [style];
                }
                Utils.addClasses(button, this.classes.button);
                Utils.addClasses(button, style);
                if (closeModal)
                {
                    Utils.setAttributes(button, {
                        'data-dismiss': 'modal'
                    });
                }
                Utils.setAttributes(button, { type: 'button' });
                button.innerHTML = name;
                button.onclick = callback;
            });
            this.showFooter();
        }
    }

    addCancelButton(name = 'Cancel', style = 'btn-secondary') {
        this.addButton(name, style);
    }

    /// DOM elements
    #DOM = {
        parent: null,
        widget: null,
        title: null,
        body: null,
        footer: null
    }
    /// style classes
    classes = {
        button: ['btn', 'btn-sm', 'rounded-0']
    };
}

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

class Inspector extends Component {
    #id = null;
    #parent = null;
    #widget = null;
    constructor(table) {
        super(table);
        this.#id = `inspector-${new Date().valueOf()}`;
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
                        Utils.addClasses(input, ['form-check-input', 'ml-0']);
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
        const self = this;
        return Utils.createChild(parent, 'form', (form) => {
            Utils.setAttributes(form, {
                id: self.id
            });
            Utils.addClasses(form, ['container', 'p-2']);

            schema = schema || {};
            if (model != null)
            {
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
                        readonly: field == "_id" ? true : false,
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
            }
            else 
            {
                for (const field of Object.keys(schema))
                {
                    let definition = schema[field];
                    definition = {
                        name: definition.name || field,
                        display: definition.display || field,
                        required: definition.required || false,
                        readonly: definition.readonly || field == "_id" ? true : false,
                        default: definition.default || null,
                        type: definition.type || String,
                        placeholder: definition.placeholder || ''
                    };
                    schema[field] = definition;
                }
            }

            for (const field of Object.keys(schema))
            {
                if (field == "_id")
                {
                    continue;
                }

                let value = null;
                if (model != null)
                {
                    value = model[field] || null;
                }
                this.#appendField(form, schema[field], value);
            }
        });
    }

    close() {
        if (this.isOpen)
        {
            this.widget.remove();
            this.#widget = null;
            this.#parent = null;
            this.onclose();
        }
    }

    onclose = () => {

    }

    get id() {
        return this.#id;
    }

    /// Check if the inspector is open
    /// @return - True if open
    get isOpen() {
        return this.widget != null;
    }

    serialize() {
        let data = $(`#${this.id}`).serialize();

        // include unchecked checkboxes. use filter to only include unchecked boxes.
        $.each($(`#${this.id} form input[type=checkbox]`)
            .filter(function (idx) {
                return $(this).prop('checked') === false
            }),
            function (idx, el) {
                // attach matched element names to the formData with a chosen value.
                data += '&' + $(el).attr('name') + '=false';
            }
        );

        return data;
    }

    /// Render the inspector
    /// @param parent - The parent element
    /// @param schema - The schema
    /// @param url - The url
    /// @param model - The model
    render(parent, schema, url, model) {
        if (this.isOpen)
        {
            this.close();
        }

        this.#parent = parent;
        this.#createForm(parent, schema, url, model);
    }

    /// Retrieve the parent DOM
    /// @return - The parent
    get parent() {
        return this.#parent;
    }

    /// Retrieve the DOM widget
    /// @return - The widget
    get widget() {
        return this.#widget;
    }
}

class ToolbarButton {
    /// Prefab buttons
    static get Prefabs() {
        return {
            Add: new ToolbarButton(
                'New',
                'plus',
                'btn-success',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = "Add new";
                    const inspector = new Inspector(table);
                    inspector.render(dialog.body, table.schema, table.url.create);
                    dialog.addButton('Save', 'btn-success', (e) => {
                        e.preventDefault();

                        const data = inspector.serialize();
                        console.log(data);

                        const url = table.url.create;
                        console.log("[POST] request:" + url);

                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: data
                        }).done(function () {
                            dialog.close();
                            table.update();
                        }).fail(function (error) {
                            console.log(error);
                        });
                    });
                    dialog.addCancelButton();
                    dialog.show();
                }
            ),
            Edit: new ToolbarButton(
                'Edit',
                'pen',
                'btn-light',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = "Edit";
                    const inspector = new Inspector(table);
                    const model = table.selectedModel;
                    inspector.render(dialog.body, table.schema, table.url.create, model);
                    dialog.addButton('Save', 'btn-warning', (e) => {
                        e.preventDefault();

                        const data = inspector.serialize();
                        console.log(data);

                        const url = `${table.url.update}/${model.id || model._id}`;
                        console.log("[PATCH] request: " + url);

                        $.ajax({
                            type: 'PATCH',
                            url: url,
                            data: data
                        }).done(function () {
                            dialog.close();
                            table.update();
                        }).fail(function (error) {
                            console.log(error);
                        });
                    });
                    dialog.addCancelButton();
                    dialog.show();
                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            EditWithRedirect: new ToolbarButton(
                'Edit',
                'pen',
                'btn-light',
                (table) => {
                    const id = table.selectedModel._id || table.selectedModel.id;
                    window.location.href = `${table.url.read}/${id}`;
                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            Remove: new ToolbarButton(
                'Delete',
                'trash',
                'btn-danger',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = "Delete record";
                    dialog.body.innerHTML = "Are you sure to delete the selected item?";
                    const model = table.selectedModel;
                    dialog.addButton('Delete', 'btn-danger', (e) => {
                        e.preventDefault();

                        const url = `${table.url.delete}/${model.id || model._id}`;
                        console.log("[DELETE] request: " + url);

                        $.ajax({
                            type: 'DELETE',
                            url: url
                        }).done(function () {
                            dialog.close();
                            table.update();
                        }).fail(function (error) {
                            console.log(error);
                        });
                    });
                    dialog.addCancelButton();
                    dialog.show();
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

    show(parent, visible, classes, table) {
        if (visible && this.widget == null)
        {
            this.#widget = Utils.createChild(parent, 'button', (button) => {
                Utils.setAttributes(button, {
                    type: 'button'
                });
                Utils.addClasses(button, this.style.concat(classes));
                button.innerHTML = `<i class="fa fa-${this.icon}"></i> ${this.name}`;
                button.onclick = () => {
                    this.#behaviour(table);
                };
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
    buttons = Array();
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
        this.buttons = Array();
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
                button.show(this.widget, visible, this.classes.button, this.table);
            }
        }
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
        this.#components.dialog = new Dialog(this);
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

    /// Retrieve the dialog component
    /// @return - The component
    get dialog() {
        return this.components.dialog;
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

            /// render the dialog component
            this.dialog.render();

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
        cell.innerHTML = `<b>${name}</b>`;
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
        dialog: null,
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
