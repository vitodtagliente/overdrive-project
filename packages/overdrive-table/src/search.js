import Component from './component';
import Utils from './utils';

export default class Search extends Component {
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