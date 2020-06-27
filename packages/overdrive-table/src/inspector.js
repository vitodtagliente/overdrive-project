import Component from './component';
import Utils from './utils';

export default class Inspector extends Component {
    #id = null;
    #parent = null;
    #widget = null;
    constructor(table) {
        super(table)
        this.#id = `inspector-${new Date().valueOf()}`;
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
            if (model != null)
            {
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
            }
            else 
            {
                for (const field of Object.keys(schema))
                {
                    let definition = schema[field];
                    definition = {
                        name: definition.name || field,
                        display: definition.display || field,
                        required: definition.required || false,
                        readonly: definition.readonly || field == "_id" ? true : false,
                        default: definition.default || null,
                        type: definition.type || String,
                        placeholder: definition.placeholder || ''
                    };
                    schema[field] = definition;
                }
            }

            for (const field of Object.keys(schema))
            {
                if (field == "_id")
                {
                    continue;
                }

                let value = null;
                if (model != null)
                {
                    value = model[field] || null;
                }
                this.#appendField(form, schema[field], value);
            }
        });
    }

    close() {
        if (this.isOpen)
        {
            this.widget.remove();
            this.#widget = null;
            this.#parent = null;
            this.onclose();
        }
    }

    onclose = () => {

    }

    get id() {
        return this.#id;
    }

    /// Check if the inspector is open
    /// @return - True if open
    get isOpen() {
        return this.widget != null;
    }

    serialize() {
        let data = $(`#${this.id}`).serialize();

        // include unchecked checkboxes. use filter to only include unchecked boxes.
        $.each($(`#${this.id} form input[type=checkbox]`)
            .filter(function (idx) {
                return $(this).prop('checked') === false
            }),
            function (idx, el) {
                // attach matched element names to the formData with a chosen value.
                data += '&' + $(el).attr('name') + '=false';
            }
        );

        return data;
    }

    /// Render the inspector
    /// @param parent - The parent element
    /// @param schema - The schema
    /// @param url - The url
    /// @param model - The model
    render(parent, schema, url, model) {
        if (this.isOpen)
        {
            this.close();
        }

        this.#parent = parent;
        this.#createForm(parent, schema, url, model);
    }

    /// Retrieve the parent DOM
    /// @return - The parent
    get parent() {
        return this.#parent;
    }

    /// Retrieve the DOM widget
    /// @return - The widget
    get widget() {
        return this.#widget;
    }
}