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
        const isEmpty = (str) => {
            return (str == null || str.length === 0 || !str.trim());
        }

        Utils.createChild(form, 'div', (div) => {
            Utils.addClasses(div, ['form-group', 'row']);
            Utils.createChild(div, 'label', (label) => {
                Utils.addClasses(label, ['col-sm-2', 'col-form-label', 'pt-0', 'pb-0']);
                Utils.setAttributes(label, {
                    for: `inspector-${definition.name}`
                });
                label.innerHTML = `<b>${definition.display}</b>`;
            });
            Utils.createChild(div, 'div', (inputDiv) => {
                Utils.addClasses(inputDiv, ['col-sm-10']);
                Utils.createChild(inputDiv, 'input', (input) => {
                    Utils.setAttributes(input, {
                        id: `inspector-${definition.name}`,
                        name: definition.name
                    });

                    input.required = definition.required;

                    if (definition.readonly)
                    {
                        Utils.setAttributes(input, { readonly: true });
                    }

                    if (definition.default)
                    {
                        Utils.setAttributes(input, { default: definition.default });
                    }

                    if (!isEmpty(definition.placeholder))
                    {
                        Utils.setAttributes(input, { placeholder: definition.placeholder });
                    }

                    if (definition.type == Boolean)
                    {
                        Utils.addClasses(input, ['form-check-input', 'ml-0']);
                        Utils.setAttributes(input, { type: 'checkbox' });
                        input.checked = value || false;
                        input.value = true;
                        if (definition.readonly)
                        {
                            input.disabled = true;
                        }
                    }
                    else if (definition.type == Number)
                    {
                        Utils.addClasses(input, ['form-control', 'form-control-sm']);
                        Utils.setAttributes(input, {
                            type: 'number',
                            value: value || 0
                        });
                    }
                    else 
                    {
                        Utils.addClasses(input, ['form-control', 'form-control-sm']);
                        Utils.setAttributes(input, {
                            type: 'text'
                        });
                        if (!isEmpty(value))
                        {
                            Utils.setAttributes(input, { value: value });
                        }
                    }
                });
            });
        });
    }

    #getSchema = (model, forceReadonly = false) => {
        let schema = {};

        const definition = (name, def) => {
            return {
                name: def.name || name,
                display: def.display || name,
                required: def.required || false,
                readonly: (def.readonly || forceReadonly) || false,
                default: def.default || null,
                type: def.type || String,
                placeholder: def.placeholder || ""
            };
        }

        for (const field of Object.keys(this.table.schema))
        {
            schema[field] = definition(field, this.table.schema[field]);
        }

        if (model != null)
        {
            for (const field of Object.keys(model))
            {
                const value = model[field];
                let type = String;
                if (value != null)
                {
                    if (typeof value === typeof true)
                    {
                        type = Boolean;
                    }
                    else if (!isNaN(value))
                    {
                        type = Number;
                    }
                }

                let def = schema[field] || definition(field, {});
                def.type = type;
                schema[field] = def;
            }
        }

        return schema;
    }

    #create = (parent, model, forceReadonly = false) => {
        this.#parent = parent;
        this.#widget = Utils.createChild(parent, 'form', (form) => {
            Utils.setAttributes(form, {
                id: this.id,
                novalidate: true
            });
            Utils.addClasses(form, ['container', 'p-2', 'needs-validation']);

            const schema = this.#getSchema(model, forceReadonly);
            for (const field of Object.keys(schema))
            {
                if (this.table.hiddenColumns.includes(field)) 
                {
                    continue;
                }

                let value = null;
                if (model != null)
                {
                    value = model[field];
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
        $.each($(`#${this.id} input[type=checkbox]`)
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
    render(parent, model, forceReadonly = false) {
        if (this.isOpen)
        {
            this.close();
        }
        this.#create(parent, model, forceReadonly);
    }

    validate() {
        if (this.widget)
        {
            if (this.widget.checkValidity() === false)
            {
                Utils.addClasses(this.widget, ['was-validated']);
                return false;
            }
            return true;
        }
        return false;
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