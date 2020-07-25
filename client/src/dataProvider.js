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
}