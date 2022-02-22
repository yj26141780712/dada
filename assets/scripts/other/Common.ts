import { AnySDKManager } from "./AnySDKManager";
import { Http } from "./Http";
import { Net } from "./Net";
import { UserManager } from "./UserManager";

const VERSION = '20161227';

export class Common {
    static anySDKManager: AnySDKManager;
    static userManager: UserManager;
    static http: Http;
    static net: Net;
    static VERSION = VERSION;
    static hallIP = '';
    static initManager() {
        this.userManager = new UserManager();
        this.http = new Http();
        this.net = new Net();
        this.anySDKManager = new AnySDKManager();
    }
}