import { AnySDKManager } from "./AnySDKManager";
import { GameNetManager } from "./GameNetManager";
import { Http } from "./Http";
import { MahjongManager } from "./MahjongManager";
import { Net } from "./Net";
import { UserManager } from "./UserManager";

const VERSION = '20161227';

export class Common {
    static gameNetManager: GameNetManager;
    static anySDKManager: AnySDKManager;
    static userManager: UserManager;
    static mahjongManager: MahjongManager;
    static http: Http;
    static net: Net;
    static VERSION = VERSION;
    static hallIP = '';
    static initManager() {
        this.userManager = new UserManager();
        this.http = new Http();
        this.net = new Net();
        this.anySDKManager = new AnySDKManager();
        this.gameNetManager = new GameNetManager();
        this.mahjongManager = new MahjongManager();
        this.mahjongManager.init();
    }
}