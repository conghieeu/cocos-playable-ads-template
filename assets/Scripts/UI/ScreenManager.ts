import { _decorator, Component, view, EventTarget, UITransform } from 'cc';
import { FullScreenNode } from './FullScreenNode';
const { ccclass, property } = _decorator;


export const screenEventTarget = new EventTarget();
@ccclass('ScreenManager')
export class ScreenManager extends Component {
    // FullScreenNode
    @property(FullScreenNode)
    fullScreenNode: FullScreenNode = null;

    onLoad() {
        view.on('canvas-resize', this.onCanvasResize, this);
    }

    start() {
        this.onCanvasResize();
    }

    cleanupCameraResources() {
        view.off('canvas-resize', this.onCanvasResize, this);
    }

    onCanvasResize() {
        const visibleSize = view.getVisibleSize();
        const aspectRatio = this.fullScreenNode.getComponent(UITransform).width / this.fullScreenNode.getComponent(UITransform).height;
        screenEventTarget.emit('aspect-ratio-changed', aspectRatio);
    }

    getAspectRatio(): number {
        return this.fullScreenNode.getComponent(UITransform).width / this.fullScreenNode.getComponent(UITransform).height;
    }
}