import { _decorator, Component, EventHandler, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchEventListener')
export class TouchEventListener extends Component {
    @property([EventHandler])
    onTouchStart: EventHandler[] = [];

    @property([EventHandler])
    onTouchMove: EventHandler[] = [];

    @property([EventHandler])
    onTouchEnd: EventHandler[] = [];

    @property([EventHandler])
    onTouchCancel: EventHandler[] = [];

    onEnable() {
        this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    _onTouchStart() {
        console.log("Touch Start");
    }

    _onTouchMove() {
        console.log("Touch Move");
    }

    _onTouchEnd() {
        console.log("Touch End");
    }   
    
    _onTouchCancel() {
        console.log("Touch Cancel");
    }
    
}


