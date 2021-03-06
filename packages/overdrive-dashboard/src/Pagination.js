import React from 'react';
import Icon from './Icon';
import style from './style.css';

function Page(props) {
    return (
        <li className={props.active ? `page-item active` : "page-item"}>
            <a
                className={`page-link ${style['pagination-page']} ${props.active ? style['pagination-active'] : ''}`}
                href="#"
                onClick={(e) => { if (props['onClick']) props.onClick(e); }}
            >
                {props.children}
            </a>
        </li>
    );
}

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: props.page || 1
        };
    }

    handlePageSelection(page) {
        this.setState({
            page
        });

        if (this.props['onPageChange'])
        {
            this.props.onPageChange(page);
        }
    }

    render() {
        const range = this.props.range || 3;
        const page = this.state.page;
        const pages = this.props.pages || 1;

        const delta = Math.max(1, Math.round((range - 1) / 2));
        let min = Math.max(1, page - delta);
        let max = Math.min(pages, page + delta);

        if (page === min)
        {
            max = Math.min(pages, max + 1);
        }
        else if (page === pages)
        {
            min = Math.max(1, min - 1);
        }

        const items = [];
        for (let i = min; i <= max; ++i)
        {
            items.push(
                <Page
                    onClick={() => this.handlePageSelection(i)}
                    key={i}
                    active={i === page}>
                    {i}
                </Page>
            );
        }

        return (
            <nav>
                <ul className="pagination pagination-sm justify-content-end">
                    <Page key="first" onClick={() => this.handlePageSelection(1)}>
                        <Icon icon={Icon.Images.faAngleDoubleLeft} />
                    </Page>
                    <Page key="previous" onClick={() => this.handlePageSelection(Math.max(1, page - 1))}>
                        <Icon icon={Icon.Images.faAngleLeft} />
                    </Page>
                    {items}
                    <Page key="next" onClick={() => this.handlePageSelection(Math.min(pages, page + 1))}>
                        <Icon icon={Icon.Images.faAngleRight} />
                    </Page>
                    <Page key="last" onClick={() => this.handlePageSelection(pages)}>
                        <Icon icon={Icon.Images.faAngleDoubleRight} />
                    </Page>
                </ul>
            </nav >
        );
    }
}