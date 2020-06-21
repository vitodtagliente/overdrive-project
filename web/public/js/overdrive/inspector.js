class Inspector {
    #data = null;
    #selectedRow = null;
    #table = null;
    #widget = null;
    #url = null;

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
        applyClasses(div, ['form-group', 'row']);

        const label = document.createElement('label');
        applyClasses(label, ['col-sm-2', 'col-form-label', 'pt-0', 'pb-0']);
        label.setAttribute('for', name);
        label.innerHTML = "<b>" + name + "</b>";

        const inputDiv = document.createElement('div');
        applyClasses(inputDiv, isCheckbox ? ['col-sm-10'] : ['col-sm-10']);

        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', name);
        if (isCheckbox)
        {
            input.checked = value;
            input.value = true;
        }
        else 
        {
            input.value = value;
        }
        applyClasses(input, !isCheckbox ? ['form-control', 'form-control-sm'] : ['from-check-input']);

        inputDiv.appendChild(input);

        div.appendChild(label);
        div.appendChild(inputDiv);

        return div;
    }

    #createButton = (text, color, callback) => {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('btn');
        button.classList.add(color);
        button.classList.add('btn-sm');
        button.innerHTML = text;
        button.onclick = callback;
        return button;
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
        this.#widget.classList.add('table-light');
        const td = document.createElement('td');
        td.setAttribute('colspan', '100%');
        this.#widget.appendChild(td);

        const form = document.createElement('form');
        form.id = "inspector-form";
        form.classList.add('container');
        form.classList.add('p-2');

        for (const field of Object.keys(this.data))
        {
            const value = this.data[field];
            let type = 'text';
            if (typeof value === typeof true)
            {
                type = 'checkbox';
            }
            else if (!isNaN(value))
            {
                type = 'number';
            }
            form.appendChild(this.#createField(field, type, value));
        }

        form.appendChild(this.#createButton('Save', 'btn-warning', function (e) {
            e.preventDefault();

            let data = $("#inspector-form").serialize();

            // include unchecked checkboxes. use filter to only include unchecked boxes.
            $.each($('form input[type=checkbox]')
                .filter(function (idx) {
                    return $(this).prop('checked') === false
                }),
                function (idx, el) {
                    // attach matched element names to the formData with a chosen value.
                    data += '&' + $(el).attr('name') + '=false';
                }
            );

            const url = '/api/items/' + model._id;
            console.log("sending data to " + url);
            console.log(data);

            $.ajax({
                type: 'PATCH',
                url: url,
                data: data,
            }).done(function (data) {
                console.log("success");
                console.log(data);
            }).fail(function (data) {
                console.log(error);
            });

            Table.instance().update();
        }));
        form.appendChild(this.#createButton('Close', 'btn-light', function () {
            // close function
        }));

        row.parentNode.insertBefore(this.#widget, row.nextSibling);

        td.appendChild(form);
        row.scrollIntoView();
    }

    attach(table) {
        this.#table = table;
        table.onRowClick = (row, model) => {
            this.render(row, model);
        };
        this.#url = '/api/items';
    }

    get table() {
        return this.#table;
    }

    get url() {
        return this.#url;
    }
}