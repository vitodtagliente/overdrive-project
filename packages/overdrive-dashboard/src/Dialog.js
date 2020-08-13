import React from 'react';

export default class Dialog extends React.Component {

    #id = null;

    constructor(props) {
        super(props);
        this.#id = Date.now();
    }

    get id() {
        return this.#id;
    }

    close() {
        document.getElementById(this.id).modal({ show: false });
    }

    show() {
        document.getElementById(this.id).modal({ show: true });
    }

    toggle() {

    };

    render() {
        return (
            <div className="modal fade" id={this.id} data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}