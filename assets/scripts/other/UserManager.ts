import { director, sys } from "cc";
import { Common } from "./Common";

/**
 * 用户信息
 */
export interface Userinfo {
    /**
     * 账号
     */
    account?: string;
    /**
     * 验证
     */
    sign?: string;
    /**
     * 用户ID
     */
    userId?: number;
    /**
     * 用户名
     */
    userName?: string;
    /**
     * 用户等级
     */
    lv?: number;
    /**
     * 用户经验
     */
    exp?: number;
    /**
     * 硬币
     */
    coins?: number;
    /**
     * 
     */
    gems?: number;
    /**
     * ip
     */
    ip?: string;
    /**
     * 性别
     */
    sex?: number;
    /**
     * 房间id
     */
    roomData?: number;
}

export class UserManager {
    hallUrl: string;
    userInfo: Userinfo = {};
    onAuth(ret: any) {
        console.log(ret);
        if (ret.errcode !== 0) {
            console.log(ret.errmsg);
        }
        else {
            this.userInfo.account = ret.account;
            this.userInfo.sign = ret.sign;
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
            account: this.userInfo.account,
            sign: this.userInfo.sign
        }, Common.hallIP).then(res => {
            if (res.status === 200 && res.data) {
                const user = res.data;
                if (!user.userid) { // 角色已经创建
                    //跳转到角色创建场景
                    director.loadScene('createRole');
                } else {
                    // this.userInfo.account = res.data.account;
                    this.userInfo.userId = res.data.userid;
                    this.userInfo.userName = res.data.name;
                    this.userInfo.lv = res.data.lv;
                    this.userInfo.exp = res.data.exp;
                    this.userInfo.coins = res.data.coins;
                    this.userInfo.gems = res.data.gems;
                    this.userInfo.sex = res.data.sex;
                    this.userInfo.ip = res.data.ip;
                    this.userInfo.roomData = res.data.roomid
                    //跳转到大厅场景
                    director.loadScene('hall');
                }
            } else {
                console.log('登录失败,', res.statusText);
            }
        })
    }
}