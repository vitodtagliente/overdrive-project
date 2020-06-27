import Component from './component';
import Utils from './utils';

export default class Dialog extends Component {
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
            Utils.addClasses(dialog, ['modal-dialog']);
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
        div: Array(),
        input: ["form-control"]
    };
}