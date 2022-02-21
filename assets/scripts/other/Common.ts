import { Http } from "./Http";
import { UserManager } from "./UserManager";

export class Common {
    static userManager: UserManager;
    static http: Http;
    static initManager() {
        this.userManager = new UserManager();
    }
}