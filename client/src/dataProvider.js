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
            params: { ...params, limit: 10 }
        });
    }
}