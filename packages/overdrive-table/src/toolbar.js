import Component from './component';
import Dialog from './dialog';
import Inspector from './inspector';
import Utils from './utils';

class ToolbarButton {
    /// Prefab buttons
    static get Prefabs() {
        return {
            Add: new ToolbarButton(
                'New',
                'plus',
                'btn-success',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = '<i class="fa fa-plus"></i> New';
                    const inspector = new Inspector(table);
                    inspector.render(dialog.body);
                    dialog.addButton('Save', 'btn-success', (e) => {
                        const data = inspector.serialize();
                        console.log(data);

                        const url = table.url.create;
                        console.log("[POST] request:" + url);

                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: data
                        }).done(function () {
                            dialog.close();
                            table.update();
                        }).fail(function (error) {
                            dialog.alert(
                                'Unable to add the new item. Make sure that all required info are set up.',
                                'alert-danger'
                            );
                        });
                    }, false);
                    dialog.addCancelButton();
                    dialog.show();
                }
            ),
            Edit: new ToolbarButton(
                'Edit',
                'pen',
                'btn-warning',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = '<i class="fa fa-pen"></i> Edit';
                    const inspector = new Inspector(table);
                    const model = table.selectedModel;
                    inspector.render(dialog.body, model);
                    dialog.addButton('Save', 'btn-warning', (e) => {
                        const data = inspector.serialize();
                        console.log(data);

                        const url = `${table.url.update}/${model.id || model._id}`;
                        console.log("[PATCH] request: " + url);

                        $.ajax({
                            type: 'PATCH',
                            url: url,
                            data: data
                        }).done(function () {
                            dialog.close();
                            table.update();
                        }).fail(function (error) {
                            dialog.alert('Unable to update the selected item.', 'alert-danger');
                        });
                    }, false);
                    dialog.addCancelButton();
                    dialog.show();
                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            EditWithRedirect: new ToolbarButton(
                'Edit',
                'pen',
                'btn-light',
                (table) => {
                    const id = table.selectedModel._id || table.selectedModel.id;
                    window.location.href = `${table.url.read}/${id}`;
                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            Inspect: new ToolbarButton(
                'Inspect',
                'eye',
                'btn-info',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = '<i class="fa fa-eye"></i> Inspect';
                    const inspector = new Inspector(table);
                    const model = table.selectedModel;
                    inspector.render(dialog.body, model, true);
                    dialog.addCancelButton('Close', 'btn-info');
                    dialog.show();
                },
                ToolbarButton.RenderMode.OnRowSelection
            ),
            Remove: new ToolbarButton(
                'Delete',
                'trash',
                'btn-danger',
                (table) => {
                    const dialog = table.dialog;
                    dialog.clear();
                    dialog.title.innerHTML = '<i class="fa fa-trash"></i> Delete';
                    dialog.body.innerHTML = "Are you sure to delete the selected item?";
                    const model = table.selectedModel;
                    dialog.addButton('Delete', 'btn-danger', (e) => {
                        const url = `${table.url.delete}/${model.id || model._id}`;
                        console.log("[DELETE] request: " + url);

                        $.ajax({
                            type: 'DELETE',
                            url: url
                        }).done(function () {
                            dialog.close();
                            table.update();
                        }).fail(function (error) {
                            dialog.alert('Unable to delete the selected item', 'alert-danger');
                        });
                    });
                    dialog.addCancelButton();
                    dialog.show();
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

    show(parent, visible, classes, table) {
        if (visible && this.widget == null)
        {
            this.#widget = Utils.createChild(parent, 'button', (button) => {
                Utils.setAttributes(button, {
                    type: 'button'
                });
                Utils.addClasses(button, this.style.concat(classes));
                button.innerHTML = `<i class="fa fa-${this.icon}"></i> ${this.name}`;
                button.onclick = () => {
                    this.#behaviour(table);
                }
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
    buttons = Array();
    /// The widget DOM
    #widget = null;
    /// constructor
    /// @param table - The table on which refers to
    constructor(table) {
        super(table);
        this.buttons.push(ToolbarButton.Prefabs.Add);
        this.buttons.push(ToolbarButton.Prefabs.Edit);
        this.buttons.push(ToolbarButton.Prefabs.Inspect);
        this.buttons.push(ToolbarButton.Prefabs.Remove);

        table.onRowSelection.bind((row, model, selected) => {
            this.#update();
        });
    }

    /// Remove all the buttons
    clear() {
        this.buttons = Array();
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
                button.show(this.widget, visible, this.classes.button, this.table);
            }
        }
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