import { _decorator, Component, EventHandler, Node, Sprite, ParticleSystem2D, log } from 'cc';
import { screenEventTarget } from './ScreenManager';
const { ccclass, property } = _decorator;

@ccclass('LayoutAdjuster')
export class LayoutAdjuster extends Component {

    // danh sách node dọc
    @property([Node])
    verticalNodes: Node[] = [];
    // danh sách node ngang
    @property([Node])
    horizontalNodes: Node[] = [];

    @property([EventHandler])
    onHorizontalScreen: EventHandler[] = [];

    @property([EventHandler])
    onVerticalScreen: EventHandler[] = [];

    @property()
    thresholdRatio: number = 1;

    onLoad() {
        screenEventTarget.on('aspect-ratio-changed', this.onAspectRatioChanged, this);
    }

    cleanupCameraResources() {
        screenEventTarget.off('aspect-ratio-changed', this.onAspectRatioChanged, this);
    }

    onAspectRatioChanged(ratio: number) {
        console.log("Aspect ratio changed: " + ratio, this.node.name);
        if (ratio > 1) {
            EventHandler.emitEvents(this.onHorizontalScreen);
            this.horizontalNodes.forEach(node => this.setNodeActiveState(node, true, ratio));
            this.verticalNodes.forEach(node => this.setNodeActiveState(node, false));
        } else {
            EventHandler.emitEvents(this.onVerticalScreen);
            this.horizontalNodes.forEach(node => this.setNodeActiveState(node, false));
            this.verticalNodes.forEach(node => this.setNodeActiveState(node, true));
        }
    }

    // xử lý active node bị tắt theo ratio
    setNodeActiveState(node: Node, active: boolean, ratio?: number) {
        node.active = true;
        // if (!node.parent.active) return;

        log("Active node %s active state to %s", node.name, active.toString(), this.node.name);
        if (active) {
            if (ratio < this.thresholdRatio) node.setScale(0.65, 0.65, 1);
            else node.setScale(1, 1, 1);
        }
        else {
            // Scale = 1
            node.setScale(0, 0, 1);
        }
    }
}