import Table from './table';

export default class Pagination {
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        this.#table = table;
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
        // create the parent container if not exists
        if (this.parent == null)
        {
            if (this.table == null)
            {
                console.error('Unable to create the pagination widget!');
                return;
            }

            this.#DOM.parent = document.createElement('div');
            this.parent.classList.add('row');
            this.table.parent.append(this.parent);

            this.#DOM.limitDiv = document.createElement('div');
            this.#DOM.limitDiv.classList.add('col-2');
            this.parent.appendChild(this.#DOM.limitDiv);

            if (this.limits.length > 0)
            {
                this.#DOM.limitSelect = document.createElement("select");
                this.limitSelect.classList.add('form-control');
                this.limitSelect.classList.add('form-control-sm');

                if (!this.limits.includes(this.limit))
                {
                    this.limit = this.limits[0];
                }

                for (const limit of this.limits)
                {
                    const option = document.createElement('option');
                    option.value = limit;
                    option.text = limit;
                    this.limitSelect.appendChild(option);
                }

                this.limitSelect.value = this.limit;

                this.limitSelect.onchange = async () => {
                    this.limit = this.limitSelect.value;
                    await this.table.update();
                };
                this.#DOM.limitDiv.append(this.limitSelect);
            }

            this.#DOM.paginationDiv = document.createElement('div');
            this.#DOM.paginationDiv.classList.add('col-10');
            this.parent.appendChild(this.#DOM.paginationDiv);

            this.#DOM.paginationWidget = document.createElement('nav');
            this.pagination.setAttribute('id', 'nav-' + this.table.id);
            for (const css_class of this.classes.nav)
            {
                this.pagination.classList.add(css_class);
            }
            this.#DOM.paginationBody = document.createElement('ul');
            for (const css_class of this.classes.ul)
            {
                this.paginationBody.classList.add(css_class);
            }
            this.pagination.append(this.paginationBody);
            this.#DOM.paginationDiv.append(this.pagination);
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
            const li = document.createElement('li');
            for (const css_class of this.classes.li)
            {
                li.classList.add(css_class);
            }

            if (isActive)
            {
                for (const css_class of this.classes.active)
                {
                    li.classList.add(css_class);
                }
            }

            const a = document.createElement('a');
            for (const css_class of this.classes.a)
            {
                a.classList.add(css_class);
            }

            a.innerHTML = text;
            a.onclick = callback;
            li.append(a);

            this.paginationBody.append(li);
        }

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

    /// Retrieve the table
    /// @return - The table
    get table() {
        return this.#table;
    }

    /// Styles
    classes = {
        a: ['page-link'],
        active: ['active'],
        li: ['page-item'],
        nav: [],
        ul: ['pagination', 'pagination-sm', 'justify-content-end']
    }
    /// DOM elements
    #DOM = {
        limitDiv: null,
        paginationDiv: null,
        limitSelect: null,
        paginationWidget: null,
        paginationBody: null,
        parent: null
    }
    /// used to enable/disable the pagination
    enabled = true;
    /// the limit of elements per page
    limit = 10;
    /// The available limit options
    limits = [10, 25, 50, 100];
    /// The max pages
    maxPages = 6;
    /// The internal state
    #state = {
        offset: 0,
        count: 0
    }
    /// The table
    #table = null;
}