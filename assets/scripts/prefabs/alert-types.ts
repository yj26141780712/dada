const noopFun = () => void 0;

export type OnClickCallback<T> = (instance: T) => (false | void | {}) | Promise<false | void | {}>;

export class AlertOption<T = any, R = any> {
    title?: string = '提示';
    content?: string = '提示内容';
    onOk?: OnClickCallback<T> = noopFun;
    onCancel?: OnClickCallback<T> = noopFun;
}