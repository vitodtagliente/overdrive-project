import Component from './component';
import Utils from './utils';
import Inspector from './inspector';

export default class Toolbar extends Component {
    /// The buttons
    #buttons = Array();
    #createWidget = null;
    /// Button are stored temporarly here untile the widget is not rendered
    #pendingButtons = Array();
    /// The widget DOM
    #widget = null;
    #inspector = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
        this.#inspector = new Inspector(table);
        /*
        table.onRowClick.push((row, model) => {
            if (table.selectedRow != null)
            {
                this.addButton('Delete', 'trash', ['btn-danger'], (event) => {

                });
            }
            else 
            {
                for (const button of this.buttons)
                {
                    if (button.getAttribute('name') == 'Delete')
                    {
                        const index = this.buttons.indexOf(button);
                        if (index > -1)
                        {
                            this.buttons.splice(index, 1);
                        }
                        button.remove();
                        console.log(this.buttons);
                        break;
                    }
                }
            }
        });
        */
    }

    /// Add a new button
    /// @param text - The button text
    /// @param icon - The button icon
    /// @param classes - The button classes
    /// @param callback - The button callback
    addButton(text, icon, classes, callback) {
        if (typeof classes == typeof String)
        {
            classes = [classes];
        }

        if (this.widget != null)
        {
            this.#buttons.push(Utils.createChild(this.widget, 'button', (button) => {
                Utils.setAttributes(button, {
                    type: 'button'
                });
                Utils.addClasses(button, this.classes.button);
                Utils.addClasses(button, classes);
                button.innerHTML = `<i class="fa fa-${icon}"></i> ${text}`;
                button.onclick = callback;
                Utils.setAttributes(button, {
                    name: text
                });
            }));
        }
        else 
        {
            this.#pendingButtons.push({
                text: text,
                icon: icon,
                classes: classes,
                callback: callback
            });
        }
    }

    /// Remove all the buttons
    clear() {
        for (const button of this.buttons)
        {
            button.remove();
        }
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
            this.#widget = Utils.createChild(this.table.parent, 'div', (div) => {
                Utils.addClasses(div, this.classes.toolbar);
                this.addButton('New', 'plus', ['btn-success'], (event) => {
                    event.preventDefault();

                    this.inspector.render(
                        this.#createWidget,
                        this.table.schema,
                        this.table.url
                    );
                });

            });
            this.#createWidget = Utils.createChild(this.table.parent, 'div', (div) => {

            });

            for (const button of this.#pendingButtons)
            {
                this.addButton(button.text, button.icon, button.classes, button.callback);
            }
            this.#pendingButtons = Array();
        }
    }

    get buttons() {
        return this.#buttons;
    }

    get inspector() {
        return this.#inspector;
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