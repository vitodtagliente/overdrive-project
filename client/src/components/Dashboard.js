import React from 'react';
import Navbar from './Navbar';
import { Sidebar, Menu, Content, Footer, Item, Brand, User, Section } from './Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import './Dashboard.css';
import { Container } from 'react-bootstrap';
import { CreateItems, EditItems } from '../modules/Items';
import { Module, DatatableModule } from './DatatableModule';

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
                        <DatatableModule
                            name="Test Module"
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In feugiat interdum nibh, vitae aliquam leo"
                            api="http://localhost:9000/api/items"
                            columns={{ _id: 'Id', name: 'Name' }}
                        ></DatatableModule>
                    </Container>
                </main>
            </div >
        );
    }
}