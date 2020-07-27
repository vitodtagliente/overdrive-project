import React from 'react';
import Navbar from './Navbar';
import { Sidebar, Menu, Content, Footer, Item, Brand, User, Section } from './Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import './Dashboard.css';
import { Container } from 'react-bootstrap';
import { Datatable } from './Datatable';
import DataProvider from '../DataProvider';
import { CreateItems, EditItems } from '../modules/Items';

const Actions = {
    Create: 'create',
    Delete: 'delete',
    Edit: 'edit',
    List: 'list'
}

class Module extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(props.api),
            action: Actions.List
        };
    }

    getContent() {
        switch (this.state.action)
        {
            case Actions.List:
                {
                    if (this.props.list) return this.props.list;
                    return (
                        <Datatable
                            columns={{ _id: 'Id', name: 'Name' }}
                            dataProvider={this.state.dataProvider}
                            paginate={true}
                            search={true}
                        ></Datatable>
                    );
                }
            default: return (<></>);
        }
    }

    render() {
        return (
            <>
                {this.props.name && <h1>{this.props.name}</h1>}
                {this.props.description && <p className="lead">{this.props.description}</p>}
                {this.getContent()}
                {this.props.children}
            </>
        );
    }
}

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div className="page-wrapper default-theme toggled">
                <Sidebar>
                    <Content>
                        <Brand name="Dashboard" />
                        <User name="Vito Domenico" surname="Tagliente" role="Administrator" />
                        <Menu>
                            <Section name="General" />
                            <Item name="Dashboard" icon={faTachometerAlt} url="/" />
                        </Menu>
                    </Content>
                    <Footer>
                        <a data-toggle="modal" data-target="#logout-modal" href="#">
                            <FontAwesomeIcon icon={faPowerOff} />
                        </a>
                    </Footer>
                </Sidebar>
                <main className="page-content">
                    <Navbar />
                    <Container fluid className="mt-3">
                        <Module
                            name="Test Module"
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In feugiat interdum nibh, vitae aliquam leo"
                            api="http://localhost:9000/api/items"
                        ></Module>
                    </Container>
                </main>
            </div >
        );
    }
}