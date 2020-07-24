import React from 'react';
import Navbar from './Navbar';
import { Sidebar, Menu, Content, Footer, Item, Brand, User, Section } from './Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import './Dashboard.css';
import { Container } from 'react-bootstrap';
import { Datatable } from './Datatable';

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
        const data = [
            {
                name: "ciao",
                id: 1
            },
            {
                name: "ciao2",
                id: 2
            },
            {
                name: "ciao3",
                id: 3
            }
        ]

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
                    <Container>
                        <Datatable
                            columns={Datatable.columns(data)}
                            data={data}
                            paginate={true}
                        ></Datatable>
                    </Container>
                </main>
            </div>
        );
    }
}