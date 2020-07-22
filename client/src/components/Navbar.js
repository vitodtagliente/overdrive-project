import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

export default class extends React.Component {
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
            <Navbar bg="light" fixed="top">
                <Container>
                    <Navbar.Brand href="#">Navbar</Navbar.Brand>
                </Container>
            </Navbar>
        );
    }
}