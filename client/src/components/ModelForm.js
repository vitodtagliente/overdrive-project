import React from 'react';
import { Container, Button, Form } from 'react-bootstrap';

class Attribute extends React.Component {
    constructor(props) {
        super(props);
    }

    handleInputchange(e) {

    }

    render() {
        const value = (this.props.model && this.props.model[this.props.name]) ?
            this.props.model[this.props.name] : undefined;

        switch (this.props.schema.type || String)
        {
            case Boolean:
                {
                    return (
                        <Form.Group controlId={'attribute-' + this.props.name}>
                            <Form.Check
                                type="checkbox"
                                label={this.props.schema.display || this.props.name}
                                name={this.props.name}
                                checked={value}
                                onChange={(e) => this.handleInputchange(e)}
                            />
                        </Form.Group>
                    );
                }
            case Number:
                {
                    return (
                        <Form.Group controlId={'attribute-' + this.props.name}>
                            <Form.Label>{this.props.schema.display || this.props.name}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={this.props.schema.placeholder || this.props.name}
                                name={this.props.name}
                                onChange={(e) => this.handleInputchange(e)}
                            />
                        </Form.Group>
                    );
                }
            case String:
            default:
                {
                    return (
                        <Form.Group controlId={'attribute-' + this.props.name}>
                            <Form.Label>{this.props.schema.display || this.props.name}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={this.props.schema.placeholder || this.props.name}
                                name={this.props.name}
                                value={value}
                                onChange={(e) => this.handleInputchange(e)}
                            />
                        </Form.Group>
                    );
                }
        }
    }
}

export default class ModelForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const content = Object.keys(this.props.schema).map((attribute, index) =>
            <Attribute key={index}
                name={attribute}
                schema={this.props.schema[attribute]}
                model={this.props.model}
            />
        );

        return (
            <Form>
                {content}
                {this.props.model == null &&
                    <Button
                        variant="success"
                        type="submit"
                        className="rounded-0"
                        size="sm"
                    >Add</Button>
                }
                {this.props.model &&
                    <Button
                        variant="warning"
                        type="submit"
                        className="rounded-0"
                        size="sm"
                    >Edit</Button>
                }
                <Button
                    variant="info"
                    className="rounded-0"
                    size="sm"
                    onClick={this.props.onCancel}
                >Cancel</Button>
            </Form>
        );
    }
}