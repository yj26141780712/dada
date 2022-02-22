import { _decorator, Component, Node, sys, tween, setDisplayStats, Vec2, Sprite, Color, Label, resources, director } from 'cc';
import { Common } from '../other/Common';
const { ccclass, property } = _decorator;



/**
 * Predefined variables
 * Name = Loading
 * DateTime = Fri Feb 18 2022 14:44:47 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Loading.ts
 * FileBasenameNoExtension = Loading
 * URL = db://assets/scripts/Loading.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Loading')
export class Loading extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(Node)
    public tipLabelNode: Node = null;

    @property(Node)
    public splashNode: Node = null;

    @property(Node)
    public alterNode: Node = null;

    @property()
    public splashShowTime = 3;

    stateStr = '';
    progress = 0.0;
    isLoading = false;
    tipLabel: Label;
    onLoad() {
        Common.initManager();
        this.splashNode.active = true;
    }

    start() {
        setDisplayStats(false); //隐藏状态显示
        // [3] 
        console.log('loadingstart');
        if (sys.os !== sys.OS.IOS || !sys.isNative) {
            // 1.非IOS系统  2.IOS系统非原生平台
            const sprite = this.splashNode.getComponent(Sprite);
            tween(new Vec2(0, 0)).to(0.5, new Vec2(1, 1), {
                onUpdate: (t, r) => {
                    sprite.color = new Color(255, 255, 255, 255 - 255 * r);
                },
                onComplete: () => {
                    this.checkVersion();
                }
            }).delay(3).start();
        } else {
            this.splashNode.active = false;
            this.checkVersion();
        }
        this.tipLabel = this.tipLabelNode.getComponent(Label);
    }


    checkVersion() {
        console.log('检查程序版本');
        this.stateStr = '正在连接服务器...';
        Common.http.get('get_serverinfo').then((res) => {
            if (res.status === 200 && res.data) {
                Common.hallIP = res.data.hall;
                if (res.data.version !== Common.VERSION) {
                    this.alterNode.active = true;
                } else {
                    this.startPreloading();
                }
            }
        }).catch(err => {
            console.log('服务器连接失败！');
        });
        // 请求失败
        // 请求成功
    }

    startPreloading() {
        this.stateStr = '正在加载资源，请稍候';
        this.isLoading = true;
        resources.loadDir("textures", (finished, total) => {
            this.progress = finished / total;
        }, () => {
            this.isLoading = false;
            this.stateStr = '准备登陆';
            director.loadScene('login');
        });
    }

    onBtnDownloadClicked() {
        sys.openURL('');
    }

    update(deltaTime: number) {
        this.tipLabel.string = this.stateStr;
        if (this.isLoading) {
            this.tipLabel.string += Math.floor(this.progress * 100) + "%";
        }
        else {
            var t = Math.floor(Date.now() / 1000) % 4;
            for (var i = 0; i < t; ++i) {
                this.tipLabel.string += '.';
            }
        }
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
