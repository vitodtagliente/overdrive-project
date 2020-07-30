import React from 'react';
import ModelForm from '../components/ModelForm';

const Schema = {
    name: {
        display: "Name",
        required: true,
        type: String,
        placeholder: "Enter the item name"
    },
    type: {
        display: "Type",
        required: true,
        type: String,
        placeholder: "Enter the type"
    },
    isConsumable: {
        type: Boolean
    },
    isStackable: {
        type: Boolean
    },
    isEquippable: {
        type: Boolean
    },
    power: {
        display: "Power",
        type: Number,
        placeholder: "Enter the power"
    }
}

export function CreateItems(props) {
    return (
        <ModelForm
            schema={Schema}
            onCancel={props.onCancel}
        ></ModelForm>
    );
}

export function EditItems(props) {
    return (
        <ModelForm
            schema={Schema}
            model={props.model}
            onCancel={props.onCancel}
        ></ModelForm>
    );
}