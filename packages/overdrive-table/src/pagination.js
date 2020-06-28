import Component from './component';
import Utils from './utils';

export default class Pagination extends Component {
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

        let delta = Math.round(this.maxPages / 2);
        let startPage = this.pages > this.maxPages
            ? Math.max(0, this.page - delta)
            : 0;
        delta = Math.max(delta, delta * 2 - this.page);

        let endPage = this.pages > this.maxPages
            ? Math.min(this.pages, this.page + delta)
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
                Math.max((this.pages) * this.limit, 0),
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