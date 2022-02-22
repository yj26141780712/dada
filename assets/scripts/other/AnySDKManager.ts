import { sys } from "cc";

export class AnySDKManager {

    /**
     * 微信登录
     */
    login() {
        if (sys.os == sys.OS.ANDROID) {  // 安卓系统
            // jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
        else if (sys.os == sys.OS.IOS) {
            // jsb.reflection.callStaticMethod(this.IOS_API, "login");
        }
        else {
            console.log("platform:" + sys.os + " dosn't implement share.");
        }
    }

}