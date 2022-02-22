import { Http } from "./Http";
import { Net } from "./Net";
import { UserManager } from "./UserManager";

const VERSION = '20161227';

export class Common {
    static userManager: UserManager;
    static http: Http;
    static net: Net;
    static VERSION = VERSION;
    static initManager() {
        this.userManager = new UserManager();
        this.http = new Http();
        this.net = new Net();
    }
}