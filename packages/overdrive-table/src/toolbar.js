import Component from './component';
import Utils from './utils';
import Inspector from './inspector';

export default class Toolbar extends Component {
    #buttons = Array();
    #widget = null;
    #createWidget = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
    }

    #appendButton = (parent, text, icon, classes, callback) => {
        Utils.createChild(parent, 'button', (button) => {
            Utils.setAttributes(button, {
                type: 'button'
            });
            Utils.addClasses(button, ['btn', 'btn-sm', 'rounded-0']);
            Utils.addClasses(button, classes);
            button.innerHTML = `<i class="fa fa-${icon}"></i> ${text}`;
            button.onclick = callback;
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
            const self = this;
            this.#widget = Utils.createChild(this.table.parent, 'div', (div) => {
                Utils.addClasses(div, ['pt-2', 'pb-2']);
                this.#appendButton(div, 'New', 'plus', ['btn-success'], (event) => {
                    event.preventDefault();

                    self.table.inspector.open(
                        Inspector.Type.Create,
                        self.#createWidget,
                        self.table.url
                    );
                });
            });
            this.#createWidget = Utils.createChild(this.table.parent, 'div', (div) => {
                
            });
        }
    }

    get buttons() {
        return this.#buttons;
    }

    get widget() {
        return this.#widget;
    }
}