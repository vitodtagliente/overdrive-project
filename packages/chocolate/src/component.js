export default class Component {
    #id = null;
    #parent = null;
    #widget = null;
    // The state of the component
    state = null;
    /// constructor
    constructor(state, id) {
        this.#id = id || new Date().valueOf();
        this.state = state || {};
    }

    get id() {
        return this.#id;
    }

    get isRendering() {
        return this.widget != null;
    }

    get parent() {
        return this.#parent;
    }

    get widget() {
        return this.#widget;
    }

    /// attach the element to a ui element
    attach(id) {
        this.deattach();
        this.#parent = document.getElementById(id);
        console.assert(this.parent != null, "Invalid parent");
    }

    deattach() {
        if (this.widget != null)
        {
            this.widget.remove();
        }
    }

    /// render 
    render() { }
}