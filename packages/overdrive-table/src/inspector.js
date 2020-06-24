import Component from './component';
import Utils from './utils';

class InspectorWidget {
    #id = null;
    #parent = null;
    #table = null;
    #type = null;
    #widget = null;
    constructor(type, table) {
        this.#id = `inspector-${type}-${table.id}`;
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
                        name: definition.name,
                        placeholder: definition.placeholder
                    });

                    if (definition.required)
                    {
                        Utils.setAttributes(input, { required: 'required' });
                    }

                    if (definition.readonly)
                    {
                        Utils.setAttributes(input, { readonly: true });
                    }

                    if (definition.default)
                    {
                        Utils.setAttributes(input, { default: definition.default });
                    }

                    if (definition.type == Boolean)
                    {
                        Utils.addClasses(input, ['form-check-input', 'ml-0']);
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
        const self = this;
        return Utils.createChild(parent, 'form', (form) => {
            Utils.setAttributes(form, {
                id: self.id
            });
            Utils.addClasses(form, ['container', 'p-2']);

            schema = schema || {};
            for (const field of Object.keys(model))
            {
                if (schema[field] != null)
                {
                    continue;
                }

                let definition = {
                    name: field,
                    display: field,
                    required: false,
                    readonly: field == "_id" ? true : false,
                    default: null,
                    type: String,
                    placeholder: ''
                };

                const value = model[field];
                if (value != null)
                {
                    if (typeof value === typeof true)
                    {
                        definition.type = Boolean;
                    }
                    else if (!isNaN(value))
                    {
                        definition.type = Number;
                    }
                }

                schema[field] = definition;
            }

            for (const field of Object.keys(schema))
            {
                const value = model[field] || null;
                this.#appendField(form, schema[field], value);
            }

            this.#appendButton(form, 'Save', ['btn-warning'], function (e) {
                e.preventDefault();

                let data = $(`#${self.id}`).serialize();

                // include unchecked checkboxes. use filter to only include unchecked boxes.
                $.each($(`#${self.id} form input[type=checkbox]`)
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
                    self.table.update();
                }).fail(function (error) {
                    console.log(error);
                });
            });
            this.#appendButton(form, 'Close', ['btn-light'], function (e) {
                // close function
                self.close();
            });
        });
    }

    close() {
        if (this.isOpen)
        {
            this.widget.remove();
            this.#widget = null;
            this.#parent = null;
        }
    }

    get id() {
        return this.#id;
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

    schema = {};
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
                this.editInspector.open(row, this.schema, `${this.table.url}/${model._id}`, model);
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