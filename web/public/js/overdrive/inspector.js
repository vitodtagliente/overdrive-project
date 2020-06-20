class Inspector {
    #data = null;
    #selectedRow = null;
    #table = null;
    #widget = null;

    constructor() {
    }

    get data() {
        return this.#data;
    }

    #createField = (name, type, value) => {

        const isCheckbox = type == 'checkbox';

        const applyClasses = (element, classes) => {
            for (const style of classes)
            {
                element.classList.add(style);
            }
        }

        const div = document.createElement('div');
        applyClasses(div, isCheckbox ? ['form-check'] : ['form-group', 'row']);

        const label = document.createElement('label');
        applyClasses(label, !isCheckbox ? ['col-sm-2', 'col-form-label'] : ['form-check-label']);
        label.setAttribute('for', name);
        label.innerHTML = isCheckbox ? name : "<b>" + name + "</b>";

        const inputDiv = document.createElement('div');
        applyClasses(inputDiv, ['col-sm-10']);

        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', name);
        input.value = value;
        applyClasses(input, !isCheckbox ? ['form-control', 'form-control-sm'] : ['from-check-input']);

        inputDiv.appendChild(input);

        if (isCheckbox)
        {
            div.appendChild(inputDiv);
            div.appendChild(label);
        }
        else 
        {
            div.appendChild(label);
            div.appendChild(inputDiv);
        }
        return div;
    }

    render(row, model) {
        this.#data = model;

        if (this.#widget != null)
        {
            this.#widget.remove();
        }

        if (this.#selectedRow == row)
        {
            this.#selectedRow.classList.remove('table-primary');
            this.#selectedRow = null;
            return;
        }

        if (this.#selectedRow)
        {
            this.#selectedRow.classList.remove('table-primary');
        }
        this.#selectedRow = row;
        row.classList.add('table-primary');

        this.#widget = document.createElement('tr');
        this.#widget.classList.remove('hover');
        const td = document.createElement('td');
        td.setAttribute('colspan', '100%');
        this.#widget.appendChild(td);

        const div = document.createElement('div');
        div.classList.add('container');
        div.classList.add('p-2');

        for (const field of Object.keys(this.data))
        {
            const value = this.data[field];
            let type = 'text';
            console.log(value);
            if (typeof value === typeof true)
            {
                type = 'checkbox';
            }
            else if (!isNaN(value))
            {
                type = 'number';
            }
            div.appendChild(this.#createField(field, type, value));
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