var Chocolate = {};

Chocolate.DOM = class {
    static render(component, parent) {
        console.assert(parent != null, "Invalid parent");
        console.assert(component != null, "Invalid component");
        parent.appendChild(component.build());
        return component;
    }

    static createElement(type, classname, attributes) {
        const element = document.createElement(type);
        this.addClasses(element, classname);
        this.setAttributes(element, attributes);
        return element;
    }

    /// Add classes to a DOM element
    /// @param element - The element
    /// @param classList - The list of classes to apply
    static addClasses(element, classname = []) {
        if (typeof classname === typeof "")
        {
            classname = classname.split(" ");
        }
        for (const cl of classname)
        {
            element.classList.add(cl);
        }
    }

    /// Remove classes to a DOM element
    /// @param element - The element
    /// @param classList - The list of classes to remove
    static removeClasses(element, classname = []) {
        if (typeof classname === typeof "")
        {
            classname = classname.split(" ");
        }
        for (const cl of classname)
        {
            element.classList.remoove(cl);
        }
    }

    /// Set DOM element attributes
    /// @param element - The element
    /// @param attributes - The attributes to set
    static setAttributes(element, attributes = {}) {
        for (const name of Object.keys(attributes))
        {
            element.setAttribute(name, attributes[name]);
        }
    }
}

Chocolate.HTML = class {
    static parse(plainHTML) {
        const html = new DOMParser().parseFromString(plainHTML, 'text/html').body;
        if (html.childNodes.length > 0)
        {
            return html.childNodes[0];
        }
        return null;
    }
}

Chocolate.Component = class {
    #id = null;
    #widget = null;
    // The state of the component
    state = null;
    /// constructor
    constructor(state, id) {
        this.#id = id || 'cid-' + new Date().valueOf();
        this.state = state || {};
    }

    get id() {
        return this.#id;
    }

    get widget() {
        return this.#widget;
    }

    build() {
        if (this.widget == null)
        {
            let content = this.render();
            if (typeof content === typeof "")
            {
                content = Chocolate.HTML.parse(content);
            }
            this.#widget = content;
            this.widget.id = this.id;
        }
        return this.widget;
    }

    /// render 
    render() { }

    update() {
        
    }
};