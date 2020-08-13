import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

export default function Icon(props) {
    return (
        <>
            {props.icon && <FontAwesomeIcon icon={props.icon} />}
        </>
    );
}

Icon.Images = Icons;