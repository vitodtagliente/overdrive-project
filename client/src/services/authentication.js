import axios from 'axios';

const url = "http://localhost:9000/auth";

export default class Authentication {
    constructor() {

    }

    static signin(email, password) {
        return axios.post(`${url}/signin`, {
            email,
            password
        });
    }

    static signup(email, password) {
        return axios.post(`${url}/signup`, {
            email,
            password
        });
    }

    isAuthenticated() {
        return false;
    }
}