import React from 'react';
import { Icon } from 'overdrive-dashboard';
import './Footer.css';

export default function Footer() {
    const url = "https://github.com/vitodtagliente/overdrive-project";

    return (
        <footer className="footer mt-auto py-3">
            <div className="container">
                <span className="text-muted">
                    Powered by <a href={url} target="_blank" rel="noopener noreferrer">overdrive</a> <Icon color='red' icon={Icon.Images.faHeart} />
                </span>
            </div>
        </footer>
    );
}