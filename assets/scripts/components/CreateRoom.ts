
import { _decorator, Component, director } from 'cc';
import { Common } from '../other/Common';
const { ccclass } = _decorator;

/**
 * Predefined variables
 * Name = CreateRoom
 * DateTime = Thu Feb 24 2022 08:25:49 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = CreateRoom.ts
 * FileBasenameNoExtension = CreateRoom
 * URL = db://assets/scripts/components/CreateRoom.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('CreateRoom')
export class CreateRoom extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start() {
        // [3]
        // Common.initManager();
        // Common.userManager.gusetLogin();
    }

    onOK() {

        var data = {
            account: Common.userManager.userInfo.account,
            sign: Common.userManager.userInfo.sign,
            conf: JSON.stringify({
                dianganghua: 0,
                difen: 0,
                huansanzhang: false,
                jiangdui: false,
                jushuxuanze: 0,
                menqing: false,
                tiandihu: false,
                type: "xzdd",
                zimo: 0,
                zuidafanshu: 0
            })
        };
        //创建房间
        Common.http.get('create_private_room', data, Common.hallIP).then(res => {
            if (res.status === 200) {
                if (res.data.errcode === -1) {
                    director.loadScene('mjgame');
                }
            }
        });
    }

    createRole() {
        Common.http.get('create_user', {
            account: Common.userManager.userInfo.account,
            sign: Common.userManager.userInfo.sign,
            name: '1号'
        }, Common.hallIP)
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
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
