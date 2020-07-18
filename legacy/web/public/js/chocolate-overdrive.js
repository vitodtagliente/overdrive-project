var Overdrive = {};

Overdrive.Dashboard = class extends Chocolate.Component {
    constructor() {
        super();


    }

    render() {
        const div = Chocolate.DOM.createElement('div', 'page-wrapper default-theme siebar-gb bg1 toggled');
        Chocolate.DOM.render(new Overdrive.Sidebar(), div);
        const page = Chocolate.DOM.createElement('main', 'page-content');
        div.appendChild(page);
        Chocolate.DOM.render(new Overdrive.Navbar(), page);
        return div;
    }
};

Overdrive.Sidebar = class extends Chocolate.Component {
    render() {
        const nav = Chocolate.DOM.createElement('nav', 'sidebar-wrapper');
        const content = Chocolate.DOM.createElement('div', 'sidebar-content');
        nav.appendChild(content);
        Chocolate.DOM.render(new Overdrive.SidebarBrand({
            brand: 'Overdrive',
            link: '/'
        }), content);
        return nav;
    }
};

Overdrive.SidebarBrand = class extends Chocolate.Component {
    render() {
        const div = Chocolate.DOM.createElement('div', 'sidebar-item sidebar-brand');
        div.appendChild(Chocolate.HTML.parse(`<a href='${this.state.link}'>${this.state.brand}</a>`));
        return div;
    }
}

Overdrive.Navbar = class extends Chocolate.Component {
    render() {
        const nav = Chocolate.DOM.createElement('nav', 'navbar navbar-light navbar-dashboard sticky-top');
        nav.appendChild(Chocolate.HTML.parse('<a id="toggle-sidebar" class="btn"><i class="fas fa-bars"></i></a>'));
        return nav;
    }
};