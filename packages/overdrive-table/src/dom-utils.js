export default class DOMUtils {
    /// Add classes to a DOM element
    /// @param element - The element
    /// @param classList - The list of classes to apply
    static addClasses(element, classList) {
        for (const cl of classList)
        {
            element.classList.add(cl);
        }
    }

    /// Set DOM element attributes
    /// @param element - The element
    /// @param attributes - The attributes to set
    static setAttributes(element, attributes) {
        for (const name of Object.keys(attributes))
        {
            element.setAttribute(name, attributes[name]);
        }
    }

    /// Create a new element and add to the selected element
    /// @param parent - The parent element
    /// @param type - The type of element
    /// @param callback - The function used to customize the new element
    /// @return - The new element
    static createChild(parent, type, callback = (element) => { }) {
        console.assert(parent != null, "Invalid parent object!");
        const element = document.createElement(type);
        console.assert(element != null, `Invalid element type: ${type}`);
        parent.appendChild(element);
        if (callback != null)
        {
            callback(element);
        }
        return element;
    }
}