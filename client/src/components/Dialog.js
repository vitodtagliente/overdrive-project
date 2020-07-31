import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show || false
        }
    }

    close() {
        this.setState({
            show: false
        });
    }

    show() {
        this.setState({
            show: true
        });
    }

    toggle() {
        this.setState({
            show: !this.state.show
        })
    };

    render() {
        return (
            <Modal
                show={this.state.show}
                onHide={() => this.close()}
                backdrop={this.props.static ? "static" : false}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.close()}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}