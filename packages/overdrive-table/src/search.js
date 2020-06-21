import Table from './table';

export default class Search {
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        this.#table = table;
    }

    get DOM() {
        return this.#dom;
    }

    get parent() {
        return this.DOM.parent;
    }

    /// The owning table
    /// @return - The table
    get table() {
        return this.#table;
    }

    get(field) {
        if (Object.keys(this.#fields).includes(field))
        {
            return this.#fields[field];
        }
        return null;
    }

    render() {
        if (this.table != null && this.table.parent != null)
        {
            this.#dom.parent = document.createElement('div');
            this.#dom.search = document.createElement('input');
            this.#dom.search.setAttribute("type", "text");
            this.#dom.search.classList.add('form-control');
            this.table.parent.append(this.parent);
            this.parent.append(this.#dom.search);
            this.#dom.search.onkeyup = () => {
                this.#search = this.#dom.search.value;
                this.table.update();
            };
        }
    }

    update(field, value) {
        this.#fields[field] = value;
        this.table.update();
    }

    toString() {
        let result = Array();
        for (const field of Object.keys(this.#fields))
        {
            result.push(result.length == 0 ? '' : ' and ');
            result.push(`${field}=like=${this.#fields[field]}`);
        }
        if (this.#search && this.#search.length > 0)
        {
            result.push(result.length == 0 ? '' : ' or ');
            result.push(`any=like=${this.#search}`);
        }
        return result.join("");
    }

    /// Specify if the search is enabled
    enabled = true;
    /// DOM elements
    #dom = {
        parent: null,
        search: null
    }
    /// The mathc for each field
    #fields = {};
    /// any search
    #search = null;
    /// The table
    #table = null;
}