import { _decorator, Component, Node, Sprite, Color, Button, EventHandler, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeActions')
export class NodeActions extends Component {

    /**
     * Kích hoạt node này
     */
    public active(): void {
        log("Activating node %s", this.node.name);
        this.node.active = true;
    }

    /**
    * Tắt node này
    */
    public deactive(): void {
        log("Deactivating node %s", this.node.name);
        this.node.active = false;
    }

    // xóa node
    public destroyNode(): void {
        log("Destroying node %s", this.node.name);
        this.node.destroy();
    }

    /**
     * Toggle trạng thái active của node
     */
    public toggleActive(): void {
        this.node.active = !this.node.active;
    }

    /**
     * Kiểm tra node có đang active không
     */
    public isActive(): boolean {
        return this.node.active;
    }

    /**
     * Chuyển màu cho sprite nếu có
     */
    public changeColor(color: string): void {
        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color().fromHEX(color);
        }
    }

    /**
     * Kích hoạt click event của button
     */
    public simulateClick(): void {
        const button = this.node.getComponent(Button);
        if (button && button.interactable) {
            button.clickEvents.forEach((eventHandler: EventHandler) => {
                eventHandler.emit([]);
            });
        }
    }
}
