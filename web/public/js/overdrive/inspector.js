class Inspector {
    #data = null;
    #table = null;
    #widget = null;

    constructor() {
    }

    get data() {
        return this.#data;
    }

    #createField = (name, type, value) => {

        const applyClasses = (element, classes) => {
            for (const style of classes)
            {
                element.classList.add(style);
            }
        }

        const div = document.createElement('div');
        applyClasses(div, ['form-group', 'row']);

        const label = document.createElement('label');
        applyClasses(label, ['col-sm-2', 'col-form-label']);
        label.setAttribute('for', name);
        label.innerHTML = name;
        div.appendChild(label);

        const inputDiv = document.createElement('div');
        applyClasses(inputDiv, ['col-sm-10']);

        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', name);
        input.value = value;
        applyClasses(input, ['form-control', 'form-control-sm']);

        inputDiv.appendChild(input);

        div.appendChild(inputDiv);
        return div;
    }

    render(row, model) {
        this.#data = model;

        if (this.#widget != null)
        {
            this.#widget.remove();
        }

        this.#widget = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '100%');
        this.#widget.appendChild(td);

        const div = document.createElement('div');
        div.classList.add('container');
        div.classList.add('p-2');

        for (const field of Object.keys(this.data))
        {
            div.appendChild(this.#createField(field, 'text', this.data[field]));
        }

        row.parentNode.insertBefore(this.#widget, row.nextSibling);

        td.appendChild(div);
    }

    attach(table) {
        this.#table = table;
        table.onRowClick = (row, model) => {
            this.render(row, model);
        };
    }

    get table() {
        return this.#table;
    }
}