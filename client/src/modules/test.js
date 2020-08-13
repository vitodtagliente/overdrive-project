import React from 'react';
import { Module, Sidebar, Datatable } from 'overdrive-dashboard';

export default class TestModule extends Module {
    constructor(url, id) {
        super(url, id);
    }

    sidebar() {
        return (
            <>
                <Sidebar.Item url={this.url} name="test" />
                <Sidebar.Item url={this.url + '/1'} name="test1" />
            </>
        );
    }

    content(context) {
        return (
            <Module.Content
                name="Test"
                description="test component"
            >
                <Datatable
                    columns={{ _id: 'Id', name: 'Name' }}
                    dataProvider={null}
                    paginate={true}
                    search={true}
                    onRowSelection={(record) => console.log(record)}
                ></Datatable>
            </Module.Content>
        );
    }
};