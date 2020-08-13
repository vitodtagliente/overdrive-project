import React from 'react';
import style from './Card.css';
import Icon from './Icon';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`${style['card-box']} ${this.props.variant || style['bg-green']}`}>
                <div className={style.inner}>
                    {this.props.children}
                </div>
                <div className={style.icon}>
                    <Icon icon={this.props.icon} />
                </div>
                {this.props.url && <a
                    href={this.props.url}
                    className={style['card-box-footer']}>
                    View More <Icon icon={Icon.Images.faArrowAltCircleRight} />
                </a>}
            </div>
        );
    }
}