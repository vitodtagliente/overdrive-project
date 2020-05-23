class Element {
    #name = null;
    #children = Array();
    #icon = null;
    #url = null;
    /// constructor
    constructor(name, icon, url) {
        this.#name = name;
        this.#icon = icon;
        this.#url = url;
    }

    add(name, icon, url) {
        const element = new Element(name, icon, url);
        this.#children.push(element);
        return element;
    }

    get name() {
        return this.#name;
    }

    get children() {
        return this.#children;
    }

    get icon() {
        return this.#icon;
    }

    /// Render this element
    render = () => {

    }

    get url() {
        return this.#url;
    }
}

class Sidebar {
    #elements = Array();
    /// constructor
    constructor() {

    }

    add(name, icon, url) {
        const element = new Element(name, icon, url);
        this.#elements.push(element);
        return element;
    }

    get elements() {
        return this.#elements;
    }

    /// Render the content
    /// @param id - The id of the DOM parent node on which attach the generated HTML
    render = () => {
        return "foo";
    }
}

module.exports = Sidebar;