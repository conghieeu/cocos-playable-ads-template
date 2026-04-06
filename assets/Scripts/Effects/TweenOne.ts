import { _decorator, Component, Node, tween, Vec3, UITransform, Size, Vec2, Sorting2D, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TweenOne')
export class TweenOne extends Component {
    
    @property(Node)
    nodeA: Node = null;

    @property(Node)
    nodeB: Node = null;

    @property({
        tooltip: "Thời gian tween (giây)"
    })
    duration: number = 1.0;

    @property({
        tooltip: "Tự động bắt đầu khi start"
    })
    autoStart: boolean = false;

    private isTweening: boolean = false;

    start() {
        if (this.autoStart) {
            this.startTween();
        }
    }

    public startTween() {
        if (!this.nodeA || !this.nodeB) {
            console.warn("NodeA hoặc NodeB chưa được gán!");
            return;
        }

        if (this.isTweening) { 
            return;
        }

        const targetPosition = this.nodeB.position.clone();
        const targetScale = this.nodeB.scale.clone();
        const targetRotation = this.nodeB.eulerAngles.clone();

        let targetContentSize: Size = null;
        let targetAnchorPoint: Vec2 = null;
        const uiTransformA = this.nodeA.getComponent(UITransform);
        const uiTransformB = this.nodeB.getComponent(UITransform);

        if (uiTransformA && uiTransformB) {
            targetContentSize = new Size(uiTransformB.contentSize.width, uiTransformB.contentSize.height);
            targetAnchorPoint = new Vec2(uiTransformB.anchorX, uiTransformB.anchorY);
        }

        let targetSortingOrder: number = null;
        const sorting2DA = this.nodeA.getComponent(Sorting2D);
        const sorting2DB = this.nodeB.getComponent(Sorting2D);

        if (sorting2DA && sorting2DB) {
            targetSortingOrder = sorting2DB.sortingOrder;
        }

        let targetColor: Color = null;
        const spriteA = this.nodeA.getComponent(Sprite);
        const spriteB = this.nodeB.getComponent(Sprite);

        if (spriteA && spriteB) {
            targetColor = spriteB.color.clone();
        }

        this.isTweening = true;

        tween(this.nodeA)
            .to(this.duration, {
                position: targetPosition,
                scale: targetScale,
                eulerAngles: targetRotation
            }, {
                onUpdate: (target: Node, ratio: number) => {
                    if (uiTransformA && targetContentSize) {
                        if (!this['_initialContentSize']) {
                            this['_initialContentSize'] = new Size(uiTransformA.contentSize.width, uiTransformA.contentSize.height);
                            this['_initialAnchor'] = new Vec2(uiTransformA.anchorX, uiTransformA.anchorY);
                        }
                        const newWidth = this['_initialContentSize'].width + 
                            (targetContentSize.width - this['_initialContentSize'].width) * ratio;
                        const newHeight = this['_initialContentSize'].height + 
                            (targetContentSize.height - this['_initialContentSize'].height) * ratio;
                        const newAnchorX = this['_initialAnchor'].x + 
                            (targetAnchorPoint.x - this['_initialAnchor'].x) * ratio;
                        const newAnchorY = this['_initialAnchor'].y + 
                            (targetAnchorPoint.y - this['_initialAnchor'].y) * ratio;
                        uiTransformA.setContentSize(newWidth, newHeight);
                        uiTransformA.setAnchorPoint(newAnchorX, newAnchorY);
                    }

                    if (sorting2DA && targetSortingOrder !== null) {
                        if (!this['_initialSortingOrder']) {
                            this['_initialSortingOrder'] = sorting2DA.sortingOrder;
                        }
                        sorting2DA.sortingOrder = Math.round(this['_initialSortingOrder'] + 
                            (targetSortingOrder - this['_initialSortingOrder']) * ratio);
                    }

                    if (spriteA && targetColor) {
                        if (!this['_initialColor']) {
                            this['_initialColor'] = spriteA.color.clone();
                        }
                        const newR = this['_initialColor'].r + (targetColor.r - this['_initialColor'].r) * ratio;
                        const newG = this['_initialColor'].g + (targetColor.g - this['_initialColor'].g) * ratio;
                        const newB = this['_initialColor'].b + (targetColor.b - this['_initialColor'].b) * ratio;
                        const newA = this['_initialColor'].a + (targetColor.a - this['_initialColor'].a) * ratio;
                        spriteA.color = new Color(newR, newG, newB, newA);
                    }
                }
            })
            .call(() => {
                this.isTweening = false;
                delete this['_initialContentSize'];
                delete this['_initialAnchor'];
                delete this['_initialSortingOrder'];
                delete this['_initialColor'];
            })
            .start();
    }

    public stopTween() {
        if (this.nodeA) {
            tween(this.nodeA).stop();
            this.isTweening = false;
            delete this['_initialContentSize'];
            delete this['_initialAnchor'];
            delete this['_initialColor'];
            delete this['_initialSortingOrder'];
        }
    }

    public getIsTweening(): boolean {
        return this.isTweening;
    }

    public tweenNodes(nodeA: Node, nodeB: Node) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.startTween();
    }
}


