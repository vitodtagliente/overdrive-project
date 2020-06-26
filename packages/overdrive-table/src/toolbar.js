import Component from './component';
import Utils from './utils';

class ToolbarButton {
    /// Prefab buttons
    static get Prefabs() {
        return {
            Add: new ToolbarButton(
                'New',
                'plus',
                'btn-success',
                () => {

                }
            ),
            Edit: new ToolbarButton(
                'Edit',
                'pen',
                'btn-light',
                () => {

                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            Remove: new ToolbarButton(
                'Delete',
                'trash',
                'btn-danger',
                () => {

                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
        }
    }

    static get RenderMode() {
        return {
            Always: 'always',
            OnRowSelection: 'selection'
        };
    }

    /// The id
    #id = null;
    name = null;
    icon = null;
    style = [];
    #behaviour = null;
    #mode = null;
    #widget = null;
    /// Constructor
    constructor(name, icon, style, behaviour, mode) {
        this.#id = `toolbar-button-${new Date().valueOf()}`;
        this.name = name;
        this.icon = icon;
        this.style = style;
        if (!Array.isArray(this.style))
        {
            this.style = [this.style];
        }
        this.#behaviour = behaviour;
        this.#mode = mode || ToolbarButton.RenderMode.Always;
    }

    show(parent, visible, classes) {
        if (visible && this.widget == null)
        {
            this.#widget = Utils.createChild(parent, 'button', (button) => {
                Utils.setAttributes(button, {
                    type: 'button'
                });
                Utils.addClasses(button, this.style.concat(classes));
                button.innerHTML = `<i class="fa fa-${this.icon}"></i> ${this.name}`;
                button.onclick = this.behaviour;
            });
        }
        else if (!visible && this.widget != null)
        {
            this.widget.remove();
            this.#widget = null;
        }
    }

    get id() {
        return this.#id;
    }

    get behaviour() {
        return this.#behaviour;
    }

    get mode() {
        return this.#mode;
    }

    get widget() {
        return this.#widget;
    }
}

export default class Toolbar extends Component {
    static Button = ToolbarButton;
    /// The buttons
    #buttons = Array();
    /// The widget DOM
    #widget = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
        this.buttons.push(ToolbarButton.Prefabs.Add);
        this.buttons.push(ToolbarButton.Prefabs.Edit);
        this.buttons.push(ToolbarButton.Prefabs.Remove);

        table.onRowSelection.bind((row, model, selected) => {
            this.#update();
        });
    }

    /// Remove all the buttons
    clear() {
        this.#buttons = Array();
        this.update(false);
    }

    /// Create the widget
    create = () => {
        this.#widget = Utils.createChild(this.table.parent, 'div', (div) => {
            Utils.addClasses(div, this.classes.toolbar);

        });
    }

    /// Render/create the component
    render() {
        if (this.table == null || this.table.parent == null)
        {
            console.error("Cannot initialize the Toolbar component, invalid table object");
            return;
        }

        if (this.widget == null)
        {
            this.create();
        }

        this.#update();
    }

    #update = () => {
        for (const button of this.buttons)
        {
            if (button != null)
            {
                const visible = button.mode == ToolbarButton.RenderMode.Always || this.table.selectedRow != null;
                button.show(this.widget, visible, this.classes.button);
            }
        }
    }

    get buttons() {
        return this.#buttons;
    }

    get widget() {
        return this.#widget;
    }

    /// The style classes
    classes = {
        button: ['btn', 'btn-sm', 'rounded-0'],
        toolbar: ['pt-2', 'pb-2']
    }
}