import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VerticalStepMover')
export class VerticalStepMover extends Component {

    @property({ tooltip: 'Hệ số di chuyển (khoảng cách mỗi lần trượt)' })
    moveDistance: number = 2;

    @property({ tooltip: 'Giới hạn vị trí Y tối thiểu (thấp nhất)' })
    minY: number = -100;

    @property({ tooltip: 'Giới hạn vị trí Y tối đa (cao nhất)' })
    maxY: number = 100;

    public moveUp() {
        const currentPos = this.node.position;
        let newY = currentPos.y + this.moveDistance;
        
        // Giới hạn newY không vượt quá maxY
        if (newY > this.maxY) {
            newY = this.maxY;
        }
        
        this.node.setPosition(currentPos.x, newY, currentPos.z);
    }

    public moveDown() {
        const currentPos = this.node.position;
        let newY = currentPos.y - this.moveDistance;
        
        // Giới hạn newY không thấp hơn minY
        if (newY < this.minY) {
            newY = this.minY;
        }
        
        this.node.setPosition(currentPos.x, newY, currentPos.z);
    }
}


