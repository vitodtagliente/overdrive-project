import React from 'react';
import { Module, Sidebar, Datatable, DataProvider, Inspector, ActionBar } from 'overdrive-dashboard';

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
        const dataProvider = new DataProvider("http://localhost:9000/api/items");

        /*
        return (
            <Module.Content
                name="Test"
                description="test component"
            >
                <ActionBar>
                    <ActionBar.Button 
                        variant="info"
                        onClick={(e) => console.log("ciao")}>
                        Add Move
                    </ActionBar.Button>
                </ActionBar>
                <Datatable
                    columns={{ _id: 'Id', name: 'Name' }}
                    dataProvider={dataProvider}
                    paginate={true}
                    search={true}
                    onRowSelection={(record) => console.log(record)}
                ></Datatable>
            </Module.Content>
        );
        */
        return (
            <Module.SimpleCRUD
                name="Test Component"
                description="Foo sisjfiowegsopgehesgji"
                columns={{ _id: 'Id', name: 'Name' }}
                schema={Schema}
                api="http://localhost:9000/api/items"
            >
            </Module.SimpleCRUD>
        );
    }
};