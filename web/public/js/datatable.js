class SearchCache {

}

class Pagination {
    /// constructor
    constructor() {

    }

    get container() {
        return this.#container;
    }

    async render() {
        if (this.widget == null)
        {
            if (!await this.create())
            {
                console.log('Error on creating the navigation widget!');
                return false;
            }
        }



    }

    get page() {
        return this.#state.offset / this.limit;
    }

    get pages() {
        return this.#state.count / this.limit;
    }

    get widget() {
        return this.#widget;
    }

    async create(container) {
        this.#container = container;
        if (this.#container)
        {
            this.#container.innerHTML = "\
                <nav aria-label='...''>\
                <ul class='pagination pagination-sm'>\
                <li class='page-item active'><a class='page-link' href='#'>1</a></li>\
                <li class='page-item'><a class='page-link' href='#'>2</a></li>\
                <li class='page-item'><a class='page-link' href='#'>3</a></li>\
                </ul>\
                </nav>\
            ";
            return true;
        }
        return false;
    }

    enabled = true;
    limit = 10;

    #container = null;
    #state = {
        offset: 0,
        count: 0
    }
    #widget = null;
}

class Table {
    /// constructor
    /// @param url - The base url for retrieving data
    constructor(url) {
        this.#url = url;
    }

    set columns(value) {
        this.#columns = value;
    }

    get data() {
        return this.#data;
    }

    async fetch(url) {
        /*
        return await $.get(
            url
        );
        */
        this.#data = Array();
        for (var i = 0; i < 50; ++i)
        {
            this.#data.push({
                id: i,
                name: 'name' + i,
                description: 'description' + i
            });
        }
        return this.#data;
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
        for (const css_class of this.classes.table)
        {
            this.#table.classList.add(css_class);
        }

        this.#data = await this.fetch(this.url);
        const columns = this.#getColumns(this.#data.length > 0 ? this.#data[0] : null);
        await this.renderHeader(columns);
        await this.renderBody(columns, this.#data);

        container.append(this.#table);

        const paginationDiv = document.createElement('div');
        console.log(await this.pagination.create(paginationDiv));
        container.append(paginationDiv);
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
        const count = this.pagination.enabled
            ? Math.min(data.length, this.pagination.limit)
            : data.length;
        for (let i = 0; i < count; ++i)
        {
            const model = data[i];
            const row = this.#table_body.insertRow();
            row.setAttribute('id', model.id);
            await this.renderRow(row, model, Object.keys(columns));
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

    classes = {
        col: Array(),
        row: Array(),
        table: ['table', 'table-hover']
    };
    pagination = new Pagination();
    renderRow = async (row, model, fields) => {
        for (const field of fields)
        {
            const cell = row.insertCell();
            let found = false;
            for (const name of Object.keys(this.#fieldRenderers))
            {
                if (name == field)
                {
                    await this.#fieldRenderers[name](cell, model);
                    found = true;
                    break;
                }
            }

            if (!found)
            {
                cell.innerHTML = model[field];
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