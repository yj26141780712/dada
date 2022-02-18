import { UserManager } from "./UserManager";

export class Common {
    static userManager: UserManager;
    static init() {
        this.userManager = new UserManager();
    }
}