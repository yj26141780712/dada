import { UserManager } from "./UserManager";

export class Common {
    static userManager: UserManager;
    static initManager() {
        this.userManager = new UserManager();
    }
}