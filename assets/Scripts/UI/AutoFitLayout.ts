import { _decorator, Component, view, UITransform, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

enum FitMode {
    FitInside,
    FitOutside
}

@ccclass('AutoFitLayout')
export class AutoFitLayout extends Component {
    @property({ type: Enum(FitMode) })
    mode: FitMode = FitMode.FitOutside;

    @property(Node)
    parentNode: Node = null;

    onLoad() {
        this.scheduleOnce(() => this.applyFit(), 0);
        view.on('canvas-resize', this.delayedApplyFit, this);
        view.on('design-resolution-changed', this.delayedApplyFit, this);
    }

    cleanupCameraResources() {
        view.off('canvas-resize', this.delayedApplyFit, this);
        view.off('design-resolution-changed', this.delayedApplyFit, this);
    }

    delayedApplyFit() {
        this.scheduleOnce(() => this.applyFit(), 0);
    }

    applyFit() {
        const parentNode = this.parentNode || this.node.parent;
        const parentSize = parentNode?.getComponent(UITransform)?.contentSize;
        const nodeSize = this.node.getComponent(UITransform)?.contentSize;
        const uiTransform = this.node.getComponent(UITransform);

        if (!parentSize || !nodeSize || !uiTransform) return;

        const scaleX = parentSize.width / nodeSize.width;
        const scaleY = parentSize.height / nodeSize.height;
        const scale = this.mode === FitMode.FitOutside ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

        uiTransform.width = nodeSize.width * scale;
        uiTransform.height = nodeSize.height * scale;
    }
}