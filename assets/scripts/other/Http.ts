import { DEV } from "cc/env";
import axios from 'axios';

export interface ServerInfo {
    version: string;

}

const URL = DEV ? "http://localhost:9000/" : "http://localhost:9000/";

export class Http {
    get(path: string, data?: any, extraUrl?: string) {
        let str = '';
        for (let key in data) {
            str += `${key}=${data[key]}`
        }
        path = str ? `${path}?${str}` : path;
        return axios.get(`${extraUrl || URL}${path}`);
    }
    post(path: string, data: any, extraUrl?: string) {
        return axios.post(`${extraUrl || URL}${path}`, data);
    }
}