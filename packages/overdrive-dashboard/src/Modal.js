import React from 'react';
import $ from 'jquery';
import 'bootstrap';
import Button from './Button'

export default class Modal extends React.Component {

    #id = null;

    constructor(props) {
        super(props);
        this.#id = Date.now();
        this.state = {
            show: false
        };
    }

    get id() {
        return this.#id;
    }

    close() {
        $(`#${this.id}`).modal('hide');
    }

    show() {
        $(`#${this.id}`).modal('show');
    }

    toggle() {
        $(`#${this.id}`).modal('toggles');
    };

    render() {
        return (
            <div
                className="modal fade"
                id={this.id}
                data-backdrop="static"
                data-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <Button
                                name={this.props.buttonName || 'Ok'}
                                onClick={(e) => {
                                    if (this.props['onAction'])
                                    {
                                        this.props.onAction(e);
                                    }
                                    this.close();
                                }}
                            />
                            <Button
                                name="Cancel"
                                onClick={(e) => this.close()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}