import React, { Fragment } from 'react';
import Button from './Button';
import Icon from './Icon';

class Attribute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleInputchange(name, value) {
        if (this.props['onChange'])
        {
            this.props.onChange(name, value);
        }
    }

    render() {
        const value = (this.props.model && this.props.model[this.props.name]) ?
            this.props.model[this.props.name] : undefined;

        const readonly = this.props.model && this.props.schema.readonly;

        switch (this.props.schema.type || String)
        {
            case Boolean:
                {
                    return (
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input rounded-0"
                                label={this.props.schema.display || this.props.name}
                                name={this.props.name}
                                defaultChecked={value}
                                readOnly={readonly}
                                required={this.props.schema.required || false}
                                onChange={(e) => this.handleInputchange(this.props.name, e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={this.props.name}>
                                {this.props.schema.display || this.props.name}
                            </label>
                        </div>
                    );
                }
            case Number:
                {
                    return (
                        <div className="form-group">
                            <label htmlFor={this.props.name}>{this.props.schema.display || this.props.name}</label>
                            <input
                                type="number"
                                className="form-control form-control-sm rounded-0"
                                placeholder={this.props.schema.placeholder || this.props.name}
                                name={this.props.name}
                                defaultValue={value}
                                readOnly={readonly}
                                required={this.props.schema.required || false}
                                onChange={(e) => this.handleInputchange(this.props.name, e.target.value)}
                            />
                        </div>
                    );
                }
            case String:
            default:
                {
                    return (
                        <div className="form-group">
                            <label htmlFor={this.props.name}>{this.props.schema.display || this.props.name}</label>
                            <input
                                type={this.props.name != 'password' ? 'text' : 'password'}
                                className="form-control form-control-sm rounded-0"
                                placeholder={this.props.schema.placeholder || this.props.name}
                                name={this.props.name}
                                defaultValue={value}
                                readOnly={readonly}
                                required={this.props.schema.required || false}
                                onChange={(e) => this.handleInputchange(this.props.name, e.target.value)}
                            />
                        </div>
                    );
                }
        }
    }
}

export default class Inspector extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.model || {};

        this.form = React.createRef();
    }

    get dataProvider() {
        return this.props.dataProvider;
    }

    handleOnChange(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state);
    }

    handleAdd(e) {
        e.preventDefault();

        if (!this.dataProvider) return;

        this.dataProvider.create(
            this.state
        ).then((res => {
            this.props.onCancel();
        })).catch((err) => {
            this.handleError(err.response);
        });
    }

    handleEdit(e) {
        e.preventDefault();

        if (!this.dataProvider) return;

        this.dataProvider.update(
            this.state
        ).then((res => {
            this.props.onCancel();
        })).catch((err) => {
            this.handleError(err.response);
        });
    }

    handleError(error) {
        if (this.props['onError'])
        {
            this.props.onError(error);
        }
    }

    render() {
        const content = Object.keys(this.props.schema).map((attribute, index) =>
            <Attribute key={index}
                name={attribute}
                schema={this.props.schema[attribute]}
                model={this.props.model}
                onChange={(name, value) => this.handleOnChange(name, value)}
            />
        );

        return (
            <form ref={this.form}>
                {content}
                {this.props.model == null &&
                    <Button
                        color="green"
                        icon={Icon.Images.faPlus}
                        name="Add"
                        type="submit"
                        onClick={(e) => this.handleAdd(e)}
                    />
                }
                {this.props.model &&
                    <Button
                        color="orange"
                        icon={Icon.Images.faPen}
                        name="Edit"
                        type="submit"
                        onClick={(e) => this.handleEdit(e)}
                    />
                }
                &nbsp;
                <Button
                    name="Cancel"
                    onClick={this.props.onCancel}
                />
            </form>
        );
    }
}