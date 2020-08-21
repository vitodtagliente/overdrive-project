import React from 'react';

export default class Alert extends React.Component {
    render() {
        return (
            <div
                className={`alert alert-${this.props.variant ? this.props.variant : 'info'} alert-dismissible rounded-0 fade show`}
                role="alert"
            >
                {this.props.children}
                {
                    this.props.closable &&
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                }
            </div>
        );
    }
}