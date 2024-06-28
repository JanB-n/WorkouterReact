import axios from 'axios';

const BASE_URL = 'https://workoutersql.azurewebsites.net'
// const BASE_URL = 'http://localhost:8088'

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    //withCredentials: true
});
