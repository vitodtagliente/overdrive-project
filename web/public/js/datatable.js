class SearchCache {

}

class Datatable {
    /// constructor
    /// @param url - The base url for retrieving data
    constructor(url) {
        this.#url = url;
    }

    set columns(value) {
        this.#columns = value;
    }

    async fetch(url) {
        return await $.get(
            url
        );
    }

    field(name, renderer) {
        if (renderer != null)
        {
            this.#fieldRenderers[name] = renderer;
        }
    }

    /// Render the datatable 
    /// @param id - The id of the DOM element in which render the datatable
    async render(id) {
        const container = $(id);
        if (container == null)
        {
            return;
        }

        this.#table = document.createElement('table');
        this.#table.classList.add('table');
        this.#table.classList.add('table-hover');
        if (this.dark)
        {
            this.#table.classList.add('table-dark');
        }

        this.#data = await this.fetch(this.url);
        const columns = this.#getColumns(this.#data.length > 0 ? this.#data[0] : null);
        await this.renderHeader(columns);
        await this.renderBody(columns, this.#data);

        container.append(this.#table);
    }

    async renderHeader(columns) {
        this.#table_head = this.#table.createTHead();
        const row = this.#table_head.insertRow();
        for (const column of Object.keys(columns))
        {
            const cell = row.insertCell();
            cell.textContent = columns[column];
            cell.setAttribute('scope', 'col');
        }
    }

    async renderBody(columns, data) {
        this.#table_body = this.#table.createTBody();
        for (const model of data)
        {
            const row = this.#table_body.insertRow();
            await this.renderModel(row, model, Object.keys(columns));
        }
    }

    get url() {
        return this.#url;
    }

    #getColumns = (model) => {
        if (this.#columns == null
            || (Array.isArray(this.#columns) && this.#columns.length == 0)
            || Object.keys(this.#columns).length == 0)
        {
            let columns = {};
            for (const column of Object.keys(model))
            {
                columns[column] = column;
            }
            return columns;
        }
        else if (Array.isArray(this.#columns))
        {
            let columns = {};
            for (const column of this.#columns)
            {
                columns[column] = column;
            }
            return columns;
        }
        return this.#columns;
    }

    dark = false;
    limit = 10;
    renderModel = async (row, model, fields) => {
        for (const field of fields)
        {
            const cell = row.insertCell();
            let found = false;
            for (const name of Object.keys(this.#fieldRenderers))
            {
                if (name == field)
                {
                    cell.textContent = await this.#fieldRenderers[name](model);
                    found = true;
                    break;
                }
            }

            if (!found)
            {
                cell.textContent = model[field];
            }
        }
    };

    #columns = Array();
    #data = null;
    #fieldRenderers = Array();
    #table = null;
    #table_body = null;
    #table_head = null;
    #url = null;
}