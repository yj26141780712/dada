
import { _decorator, Component, Node, Label } from 'cc';
import { AlertOption } from './Alert-types';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Alert
 * DateTime = Wed Feb 23 2022 14:15:11 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = Alert.ts
 * FileBasenameNoExtension = Alert
 * URL = db://assets/scripts/prefabs/Alert.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Alert')
export class Alert extends Component {

    @property(Node)
    public titleNode: Node = null;

    @property(Node)
    public contentNode: Node = null;

    @property(Node)
    public btnOkNode: Node = null;

    @property(Node)
    public btnCancle: Node = null;

    title: Label;
    content: Label;
    option: AlertOption;
    start() {
        this.title = this.titleNode.getComponent(Label);
        this.content = this.contentNode.getComponent(Label);
    }

    show(option: AlertOption) {
        this.option = option;
        this.title.string = option.title;
        this.content.string = option.content;
        this.node.active = true;
    }

    onOKClicked() {
        this.node.active = false;
        if (this.option && this.option.onOk) {
            this.option.onOk(null);
        }
    }

    onCancleClicked() {
        this.node.active = false;
        if (this.option && this.option.onCancel) {
            this.option.onCancel(null);
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
