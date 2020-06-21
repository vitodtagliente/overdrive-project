import Table from './table';

export default class Component {
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