
import { _decorator, Component, Node, AudioSource, assert, game } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameRoot
 * DateTime = Tue Feb 22 2022 15:47:28 GMT+0800 (中国标准时间)
 * Author = yj261417807
 * FileBasename = GameRoot.ts
 * FileBasenameNoExtension = GameRoot
 * URL = db://assets/scripts/components/GameRoot.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(AudioSource)
    _audioSource: AudioSource = null;

    onLoad() {
        const audioSource = this.node.getComponent(AudioSource);
        assert(audioSource);
        this._audioSource = audioSource;
        game.addPersistRootNode(this.node);
        AudioManager.instance.init(this._audioSource);
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
