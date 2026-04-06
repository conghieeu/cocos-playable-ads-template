import { _decorator, Component, Node, Animation, AnimationClip, Event, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationTrigger')
export class AnimationTrigger extends Component {

    @property(Animation)
    private targetAnimation: Animation | null = null;

    onLoad() {
        if (!this.targetAnimation) {
            this.targetAnimation = this.getComponent(Animation);
        }
    }

    public playAnimationByName(animName: string) {
        console.log(`[AnimationTrigger] Đang phát animation: ${animName}`);
        this.targetAnimation.play(animName);
    }
}
