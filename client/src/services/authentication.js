import axios from 'axios';

const url = "http://localhost:9000/auth";

export default class Authentication {
    static signin(email, password) {
        return axios.post(`${url}/signin`, {
            email,
            password
        });
    }

    static signup(username, email, password) {
        return axios.post(`${url}/signup`, {
            username,
            email,
            password
        });
    }

    isAuthenticated() {
        return true;
    }
}