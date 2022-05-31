import { _decorator, Component, Node, sys, tween, Vec2, Sprite, Color, Label, resources, director, Asset, game } from 'cc';
import { DEBUG, DEV } from 'cc/env';
import { Common } from '../other/Common';
const { ccclass, property } = _decorator;

const jsb = (<any>window).jsb;

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
    // 热更新
    private _updating = false;
    private _am: jsb.AssetsManager = null!;
    @property(Asset)
    manifestUrl: Asset = null!;
    _storagePath: string;
    private versionCompareHandle: (versionA: string, versionB: string) => number = null!;
    onLoad() {
        Common.initManager();
        this.splashNode.active = true;
        this.alterNode.active = false;
        if (!jsb) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        this.versionCompareHandle = function (versionA: string, versionB: string) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || '0');
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };
        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path: string, asset: any) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                //panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                //panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });
        console.log(`Hot update is ready, please check or directly update.`);
    }

    start() {
        if (sys.isNative) {
            console.log('热更新！')
            this.checkUpdate();
        } else {
            this.checkVersion();
        }
        // if (sys.os !== sys.OS.IOS || !sys.isNative) {
        //     // 1.非IOS系统  2.IOS系统非原生平台
        //     const sprite = this.splashNode.getComponent(Sprite);
        //     tween(new Vec2(0, 0)).to(0.5, new Vec2(1, 1), {
        //         onUpdate: (t, r) => {
        //             sprite.color = new Color(255, 255, 255, 255 - 255 * r);
        //         },
        //         onComplete: () => {
        //             this.checkVersion();
        //         }
        //     }).delay(3).start();
        // } else {
        //     this.splashNode.active = false;
        //     this.checkVersion();
        // }
        this.tipLabel = this.tipLabelNode.getComponent(Label);
    }


    checkVersion() {
        this.stateStr = '正在连接服务器...';
        Common.http.get('get_serverinfo').then((res) => {
            console.log(res);
            if (res.status === 200 && res.data) {
                Common.hallIP = `http://${res.data.hall}/`;
                if (res.data.version !== Common.VERSION) {
                    this.alterNode.active = true;
                } else {
                    this.startPreloading();
                }
            }
        }).catch(err => {
            console.log('服务器连接失败！');
        });
    }

    checkUpdate() {
        let infoStr = '';
        if (this._updating) {
            infoStr = 'Checking or updating ...';
            console.log(infoStr);
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            this._am.loadLocalManifest(url);
        }
        console.log(this._am.getLocalManifest());
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            infoStr = 'Failed to load local manifest ...';
            console.log(infoStr);
            return;
        }
        this._am.setEventCallback(this.checkCb);
        this._am.checkUpdate();
        this._updating = true;
    }

    checkCb = (event: any) => {
        console.log(event);
        console.log(event.getEventCode());
        let infoStr = '';
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                infoStr = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                infoStr = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                infoStr = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                infoStr = 'New version found, please try to update. (' + Math.ceil(this._am.getTotalBytes() / 1024) + 'kb)';
                this.alterNode.active = true;
                break;
        }
        console.log(infoStr);
        this._am.setEventCallback(null!);
        this._updating = false;
        if (!infoStr) {
            this.checkVersion();
        }
    }

    hotUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var url = this.manifestUrl.nativeUrl;
                this._am.loadLocalManifest(url);
            }
            this._am.update();
            this._updating = true;
        }
    }

    updateCb = (event: any) => {
        var needRestart = false;
        var failed = false;
        let infoStr = '';
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                infoStr = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                const precent = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                console.log(precent);
                var msg = event.getMessage();
                if (msg) {
                    console.log(msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                infoStr = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                infoStr = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                infoStr = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                infoStr = 'Update failed. ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                infoStr = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                infoStr = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null!);
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null!);
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            // restart game.
            setTimeout(() => {
                game.restart();
            }, 1000)
        }
    }

    startPreloading() {
        this.stateStr = '正在加载资源，请稍候';
        this.isLoading = true;
        if (DEV || DEBUG) {
            director.loadScene('login');
        } else {
            resources.loadDir("textures", (finished, total) => {
                this.progress = finished / total;
            }, () => {
                this.isLoading = false;
                this.stateStr = '准备登陆';
                director.loadScene('login');
            });
        }
    }

    onBtnDownloadClicked() {
        sys.openURL('');
    }

    onClickUpdate() {
        console.log(123);
        this.hotUpdate();
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
