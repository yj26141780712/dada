import { DEV } from "cc/env";
// import axios from 'axios'; 打包微信小程序有问题
// import { assetManager } from "cc";

export interface ServerInfo {
    version: string;
}

interface HttpOptions {
    method?: string;
    url: string;
    data?: any;
}

interface HttpResponse<T = any> {
    data: T;
    status: number;
    statusText?: string;
}

const URL = DEV ? "http://120.79.100.219:9000/" : "http://120.79.100.219:9000/";

export class Http {

    get(path: string, data?: any, extraUrl?: string) {
        return this.http({
            url: `${extraUrl || URL}${path}`,
            data
        });
    }

    post(path: string, data: any, extraUrl?: string) {
        //return Promise.resolve();
        //return axios.post(`${extraUrl || URL}${path}`, data);
        return this.http({
            method: 'post',
            url: `${extraUrl || URL}${path}`,
            data
        })
    }

    request() {
        //assetManager.
    }

    http(options: HttpOptions): Promise<HttpResponse> {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    const res = JSON.parse(xhr.responseText);
                    resolve({
                        data: res,
                        status: xhr.status
                    });
                }
            }
            xhr.timeout = 50000;
            const method = options.method || 'get';
            const url = options.url;
            const data = options.data;
            if (method === 'get' || method === 'GET') {
                const query = this.encode(data);
                const getUrl = query ? `${url}?${query}` : url;
                xhr.open(method, getUrl, true);
                xhr.send();
            } else {
                xhr.open(method, url, true);
                xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
                xhr.send(JSON.stringify(data));
            }
        });
    }

    encode(params: any) {
        let str = '';
        if (params) {
            const arr = [];
            for (const key in params) {
                const value = params[key] || '';
                arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
            str = arr.join('&');
        }
        return str;
    }
}