
import { _decorator, Component, Node, director, setDisplayStats, sys } from 'cc';
import { Common } from '../other/Common';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;
/**
 * Predefined variables
 * Name = Login
 * DateTime = Fri Feb 18 2022 13:54:32 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Login.ts
 * FileBasenameNoExtension = Login
 * URL = db://assets/scripts/Login.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Login')
export class Login extends Component {

    @property(Node)
    public btnVisitorNode: Node = null;

    password = '';

    onLoad() {
        if (!sys.isNative && sys.isMobile) {
            // const canvas = this.node.getComponent(Canvas);
        }

        // 播放登录场景音乐
        AudioManager.instance.playMusic(true);
        //监听是否需要创建角色 如果需要跳转到角色创建场景

        // if (!sys.isNative || sys.os === sys.OS.WINDOWS) {
        //     this.btnVisitorNode.active = false;
        // }
    }


    start() {
        setDisplayStats(false);
        // [3]
        const account = sys.localStorage.getItem("wx_account");
        const sign = sys.localStorage.getItem("wx_sign");
        if (account != null && sign != null) {
            const ret = {
                errcode: 0,
                account: account,
                sign: sign
            }
            Common.userManager.onAuth(ret);
        }
    }

    //游客登录 

    visitorLogin() {
        //游客登录成功跳转到游戏场景
        //Common.userManager.gusetLogin();
        Common.userManager.userlogin('user1');
    }

    wechatLogin() {
        Common.anySDKManager.login();
    }

    update(deltaTime: number) {
        // this.tipn
    }


}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
