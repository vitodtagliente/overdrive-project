class BaseElement {
    #name = null;
    #icon = null;
    #priority = 0;
    #url = null;
    /// constructor
    constructor(name, icon, url) {
        this.#name = name;
        this.#icon = icon;
        this.#url = url;
    }

    get name() {
        return this.#name;
    }

    setName(value) {
        this.#name = value;
        return this;
    }

    get icon() {
        return this.#icon;
    }

    setIcon(icon) {
        this.#icon = icon;
        return this;
    }

    get priority() {
        return this.#priority;
    }

    setPriority(value) {
        this.#priority = value;
        return this;
    }

    get url() {
        return this.#url;
    }

    setUrl(url) {
        this.#url = url;
        return this;
    }
}

class Element extends BaseElement {
    #children = Array();
    #section = null;
    /// constructor
    constructor(name, icon, url) {
        super(name, icon, url);
    }

    add(name, icon, url) {
        const element = new BaseElement(name, icon, url);
        this.#children.push(element);
        return element;
    }

    get children() {
        return this.#children;
    }

    /// Render this element
    render = () => {
        const result = Array();
        if (this.children.length > 0)
        {
            result.push('<li class="sidebar-dropdown">');
            result.push('<a>');
            result.push(`<i class="fa fa-${this.icon}"></i>`);
            result.push(`<span class="menu-text">${this.name}</span>`);
            result.push('</a>');
            result.push('<div class="sidebar-submenu">');
            result.push('<ul>');
            for (const child of this.children)
            {
                result.push('<li>');
                result.push(`<a href="${child.url}">${child.name}</i>`);
                result.push('</li>');
            }
            result.push('</ul>');
            result.push('</div>');
            result.push('</li>')
        }
        else 
        {
            result.push("<li>");
            result.push(this.url ? `<a href="${this.url}">` : '<a>');
            result.push(`<i class="fa fa-${this.icon}"></i>`);
            result.push(`<span class="menu-text">${this.name}</span>`);
            result.push("</a>");
            result.push("</li>");
        }
        return result.join("\n");
    }

    get section() {
        return this.#section;
    }

    section(section) {
        this.#section = section;
        return this;
    }
}

class Sidebar {
    #elements = Array();
    /// constructor
    constructor() {

    }

    add(name, icon) {
        const element = new Element(name, icon);
        this.#elements.push(element);
        return element;
    }

    get elements() {
        return this.#elements;
    }

    /// Render the content
    /// @param id - The id of the DOM parent node on which attach the generated HTML
    render = () => {
        const result = [];
        result.push("<div class=\"sidebar-item sidebar-menu\">");
        result.push("<ul>");
        for (const child of this.elements)
        {
            result.push(child.render());
        }
        result.push("</ul>");
        result.push("</div>");
        return result.join("\n");
    }
}

module.exports = Sidebar;