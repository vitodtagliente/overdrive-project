import Component from './component';
import Utils from './utils';

class InspectorWidget {
    #parent = null;
    #table = null;
    #type = null;
    #widget = null;
    constructor(type, table) {
        this.#type = type;
        this.#table = table;
    }

    #appendButton = (form, text, classes, callback) => {
        Utils.createChild(form, 'button', (button) => {
            Utils.setAttributes(button, {
                type: 'button'
            });
            Utils.addClasses(button, ['btn', 'btn-sm']);
            Utils.addClasses(button, classes);
            button.innerHTML = text;
            button.onclick = callback;
        });
    }

    #appendField = (form, definition, value) => {
        Utils.createChild(form, 'div', (div) => {
            Utils.addClasses(div, ['form-group', 'row']);
            Utils.createChild(div, 'label', (label) => {
                Utils.addClasses(label, ['col-sm-2', 'col-form-label', 'pt-0', 'pb-0']);
                Utils.setAttributes(label, {
                    for: definition.display
                });
                label.innerHTML = `<b>${definition.name}</b>`;
            });
            Utils.createChild(div, 'div', (inputDiv) => {
                Utils.addClasses(inputDiv, ['col-sm-10']);
                Utils.createChild(inputDiv, 'input', (input) => {
                    Utils.setAttributes(input, {
                        id: definition.name,
                        name: definition.name
                    });

                    if (definition.default)
                    {
                        Utils.setAttributes(input, { required: 'required' });
                    }

                    if (definition.default)
                    {
                        Utils.setAttributes(input, { default: definition.default });
                    }

                    if (definition.type == Boolean)
                    {
                        Utils.addClasses(input, ['form-check-input']);
                        Utils.setAttributes(input, { type: 'checkbox' });
                        input.checked = value;
                        input.value = true;
                    }
                    else if (definition.type == Number)
                    {
                        Utils.addClasses(input, ['form-control', 'form-control-sm']);
                        Utils.setAttributes(input, { type: 'number' });
                        input.value = value;
                    }
                    else 
                    {
                        Utils.addClasses(input, ['form-control', 'form-control-sm']);
                        Utils.setAttributes(input, { type: 'text' });
                        input.value = value;
                    }
                });
            });
        });
    }

    #createForm = (parent, schema, url, model) => {
        return Utils.createChild(parent, 'form', (form) => {
            Utils.setAttributes(form, {
                id: 'edit-inspector'
            });
            Utils.addClasses(form, ['container', 'p-2']);

            const fields = Object.keys(model);
            for (const field of fields)
            {
                let definition = {};
                const value = model[field] || null;

                if (definition.type == null)
                {
                    definition.type = String;
                    if (typeof value === typeof true)
                    {
                        definition.type = Boolean;
                    }
                    else if (!isNaN(value))
                    {
                        definition.type = Number;
                    }
                }

                definition.display = definition.display || field;
                definition.name = definition.name || field;
                definition.required = definition.required || false;
                definition.default = definition.default || null;

                this.#appendField(form, definition, value);
            }

            this.#appendButton(form, 'Save', ['btn-warning'], function (e) {
                e.preventDefault();

                let data = form.serialize();

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

                this.table.update();
            });
            this.#appendButton(form, 'Close', ['btn-light'], function (e) {
                // close function
                this.close();
            });
        });
    }

    close() {
        if (this.isOpen)
        {
            this.widget.remove();
            this.#widget = null;
        }
    }

    get isOpen() {
        return this.widget != null;
    }

    open(parent, schema, url, model) {
        if (this.isOpen)
        {
            this.close();
        }

        this.#parent = parent;

        if (this.type == 'edit')
        {
            this.#widget = document.createElement('tr');
            parent.parentNode.insertBefore(this.widget, parent.nextSibling);

            Utils.addClasses(this.widget, ['table-light']);
            Utils.createChild(this.widget, 'td', (td) => {
                Utils.setAttributes(td, {
                    colspan: '100%'
                });

                this.#createForm(td, schema, url, model);
            });
        }
        else 
        {

        }
    }

    get parent() {
        return this.#parent;
    }

    get table() {
        return this.#table;
    }

    get type() {
        return this.#type;
    }

    get widget() {
        return this.#widget;
    }
}

export default class Inspector extends Component {

    Type = {
        Create: 'create',
        Edit: 'edit'
    };

    schema = null;
    #widgets = Array();
    constructor(table) {
        super(table);

        // initialize the widgets
        for (const type of Object.keys(this.Type))
        {
            const value = this.Type[type];
            this.#widgets[value] = new InspectorWidget(value, table);
        }

        table.onRowClick = (row, model) => {
            if (this.enabled == false) return;

            if (this.editInspector.parent != null)
            {
                Utils.removeClasses(this.editInspector.parent, this.classes.activeRow);
            }
            if (row == this.editInspector.parent)
            {
                this.editInspector.close();
            }
            else 
            {
                Utils.addClasses(row, this.classes.activeRow);
                this.editInspector.open(row, this.schema, `${this.table.url}/${model.id}`, model);
                row.scrollIntoView();
            }
        };
    }

    get editInspector() {
        return this.#getWidget(this.Type.Edit);
    }

    #getWidget = (type) => {
        if (Object.keys(this.widgets).includes(type))
            return this.widgets[type];
        return null;
    }

    get widgets() {
        return this.#widgets;
    }

    classes = {
        activeRow: ['table-primary']
    }
}