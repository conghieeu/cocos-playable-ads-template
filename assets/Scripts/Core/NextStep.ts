import { _decorator, Component, Node } from 'cc';
import { PlayableAdManager } from './PlayableAdManager';
const { ccclass, property } = _decorator;

@ccclass('NextStep')
export class NextStep extends Component {

    // node current step
    @property(Node)
    currentStepNode: Node = null;

    // node next step
    @property([Node])
    nextStepNode: Node = null;

    // func go next step
    public nextStep() {
        this.currentStepNode.active = false;
        this.nextStepNode.active = true;
    }
}


