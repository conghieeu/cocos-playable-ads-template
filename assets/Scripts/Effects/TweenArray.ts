import { _decorator, Component, EventHandler, Node } from 'cc';
import { TweenOne } from './TweenOne';
const { ccclass, property } = _decorator;

@ccclass('TweenArray')
export class TweenArray extends Component {
    
    @property([Node])
    nodes: Node[] = [];

    @property([EventHandler])
    onNextEventHandlers: EventHandler[] = [];

    @property({
        tooltip: "Thời gian tween (giây)"
    })
    duration: number = 1.0;

    private tweenComponents: TweenOne[] = [];

    start() {
        this.initializeTweenComponents();
    }

    private initializeTweenComponents() {
        this.tweenComponents = [];
        for (let i = 0; i < this.nodes.length; i++) {
            if (!this.nodes[i]) {
                console.warn(`Node at index ${i} is null or undefined`);
                continue;
            }
            let tweenComp = this.nodes[i].getComponent(TweenOne);
            if (!tweenComp) {
                tweenComp = this.nodes[i].addComponent(TweenOne);
            }
            tweenComp.duration = this.duration;
            this.tweenComponents.push(tweenComp);
        }
    }

    public moveForward() {
        if (this.nodes.length < 2 || this.tweenComponents.length === 0) return;

        const length = this.nodes.length;
        for (let i = 0; i < length; i++) {
            if (!this.tweenComponents[i]) continue;
            const nodeA = this.nodes[i];
            const nodeB = this.nodes[(i + 1) % length];
            this.tweenComponents[i].tweenNodes(nodeA, nodeB);
            EventHandler.emitEvents(this.onNextEventHandlers);
        }
    }

    public moveBackward() {
        if (this.nodes.length < 2 || this.tweenComponents.length === 0) return;

        const length = this.nodes.length;
        for (let i = 0; i < length; i++) {
            if (!this.tweenComponents[i]) continue;
            const nodeA = this.nodes[i];
            const nodeB = this.nodes[(i - 1 + length) % length];
            this.tweenComponents[i].tweenNodes(nodeA, nodeB);
            EventHandler.emitEvents(this.onNextEventHandlers);
        }
    }
}


