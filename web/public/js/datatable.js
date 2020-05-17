class SearchCache {

}

class Datatable {

    #url = null;
    #columns = Array();
    dark = false;

    /// constructor
    /// @param url - The base url for retrieving data
    constructor(url) {
        this.#url = url;
    }

    get columns() {
        return this.#columns;
    }

    set columns(value) {
        this.#columns = value;
    }

    async fetch(url) {
        return await $.get(
            url
        );
    }

    /// Render the datatable 
    /// @param id - The id of the DOM element in which render the datatable
    async render(id) {
        const container = $(id);
        if (container == null)
        {
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-hover');
        if (this.dark)
        {
            table.classList.add('table-dark');
        }

        const data = await this.fetch(this.url);
        console.log(data);

        await this.renderHeader(table, data[0]);
        await this.renderBody(table, data);

        container.append(table);
    }

    async renderHeader(table, data) {
        const header = table.createTHead();
        const row = header.insertRow();
        const columns = (this.#columns == null
            || (Array.isArray(this.#columns) && this.#columns.length == 0)
            || Object.keys(this.#columns).length == 0)
            ? data : this.#columns;
        for (const column of Object.keys(columns))
        {
            const cell = row.insertCell();
            cell.textContent = columns[column];
            cell.setAttribute('scope', 'col');
        }
    }

    async renderBody(table, data) {
        const body = table.createTBody();
        const columns = (this.#columns == null
            || (Array.isArray(this.#columns) && this.#columns.length == 0)
            || Object.keys(this.#columns).length == 0)
            ? data : this.#columns;
        for (const model of data)
        {
            const row = body.insertRow();
            for (const column of columns)
            {
                const cell = row.insertCell();
                cell.textContent = model[column];
            }
        }
    }

    get url() {
        return this.#url;
    }
}