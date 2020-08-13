import React from 'react';
import { Module, Sidebar, Card, Icon } from 'overdrive-dashboard';

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

export default class TestModule extends Module {
    constructor(url, id) {
        super(url, id);
    }

    sidebar() {
        return (
            <Sidebar.DropdownItem
                name="Foo"
            >
                <Sidebar.Item url={this.url} name="test" />
                <Sidebar.Item url={this.url + '/1'} name="test1" />
            </Sidebar.DropdownItem>
        );
    }

    content(context) {
        return (
            <>
                <Card
                    url="/foo"
                    icon={Icon.Images.faMoneyBill}
                >
                    <h3> ₹185358 </h3>
                    <p> Today’s Collection </p>
                </Card>
                <Module.SimpleCRUD
                    name="Test Component"
                    description="Foo sisjfiowegsopgehesgji"
                    columns={{ _id: 'Id', name: 'Name' }}
                    schema={Schema}
                    api="http://localhost:9000/api/items"
                >
                </Module.SimpleCRUD>
            </>
        );
    }
};