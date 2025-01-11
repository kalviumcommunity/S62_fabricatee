import axios from "axios";

const BASE_URL = 'http://localhost:8000'

export default axios.create({
    baseURL: BASE_URL
})

//axiosPrivate will have a an interceptor to refresh the token in case the accessToken has expired
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})