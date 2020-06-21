import Component from './component';
import Utils from './utils';

export default class Search extends Component {
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