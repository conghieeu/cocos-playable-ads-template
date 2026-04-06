import { _decorator, Component, Node, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventHolder')
export class EventHolder extends Component {

    @property(EventHandler)
    public customEvents: EventHandler[] = [];

    public triggerEvents() {
        EventHandler.emitEvents(this.customEvents, this);
    }

    public AnimationEvent() {
        console.log("Animation Event 'ShowAd' triggered!");
        // Nếu muốn trigger luôn mảng events tự tạo ở Inspector thì bỏ comment dòng dưới:
        // this.triggerEvents();
    }
}
