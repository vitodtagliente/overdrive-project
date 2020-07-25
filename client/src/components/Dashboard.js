import React from 'react';
import Navbar from './Navbar';
import { Sidebar, Menu, Content, Footer, Item, Brand, User, Section } from './Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import './Dashboard.css';
import { Container } from 'react-bootstrap';
import { Datatable } from './Datatable';
import DataProvider from '../DataProvider';

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
                        <Datatable
                            columns={{ _id: 'Id', name: 'Name' }}
                            dataProvider={new DataProvider('http://localhost:9000/api/items')}
                            paginate={true}
                            search={true}
                            crud={{
                                create: null,
                                update: null,
                                delete: null
                            }}
                        ></Datatable>
                    </Container>
                </main>
            </div >
        );
    }
}