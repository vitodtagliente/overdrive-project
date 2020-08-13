import axios from 'axios';

export default class DataProvider {
    #url = '/';
    constructor(url) {
        this.#url = url;
    }

    get url() {
        return this.#url;
    }

    getList(params = {}) {
        return axios.get(this.url, {
            params: { limit: 10, offset: 0, ...params }
        });
    }

    create(model = {}) {
        return axios.post(this.url, model);
    }

    update(model = {}) {
        const url = this.url + '/' + (model.id || model._id);
        // mongodb fix
        delete model['id'];
        delete model['_id'];
        return axios.patch(url, model);
    }
}