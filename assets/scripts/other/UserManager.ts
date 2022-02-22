import { director, sys } from "cc";
import { Common } from "./Common";

export class UserManager {
    hallUrl: string;
    account: string;
    sign: string;

    onAuth(ret: any) {
        if (ret.errcode !== 0) {
            console.log(ret.errmsg);
        }
        else {
            this.account = ret.account;
            this.sign = ret.sign;
            this.login();
        }
    }

    gusetLogin() {
        let account = '';
        if (!account) {
            account = sys.localStorage.getItem("account");
        }

        if (!account) {
            account = Date.now().toString();
            sys.localStorage.setItem("account", account);
        }

        Common.http.get('guest', { account: account }).then(res => {
            if (res.status === 200 && res.data) {
                this.onAuth(res.data);
            }
        })
    }

    login() {
        Common.http.get('login', {
            account: this.account,
            sign: this.sign
        }, Common.hallIP).then(res => {
            if (res.status === 200 && res.data) {
                const user = res.data;
                if (user.userid) { // 角色已经创建
                    //跳转到角色创建场景
                    director.loadScene('createRole');
                } else {
                    //跳转到大厅场景
                    director.loadScene('hall');
                }
            } else {
                console.log('登录失败,', res.statusText);
            }
        })
    }
}