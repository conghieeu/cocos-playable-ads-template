import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SnapSlider')
export class SnapSlider extends Component {

    @property({ tooltip: 'Giới hạn vị trí Y tối thiểu (mốc đầu tiên)' })
    minY: number = 0;

    @property({ tooltip: 'Giới hạn vị trí Y tối đa (mốc cuối cùng)' })
    maxY: number = 10;

    @property({ tooltip: 'Tổng số lượng mốc (ví dụ: 6 mốc sẽ chia đều thành 5 khoảng là 0,2,4,6,8,10)' })
    numberOfSteps: number = 6;

    // Biến lưu trạng thái mốc hiện hành (từ 0 đến numberOfSteps - 1)
    private currentIndex: number = 0;

    protected start() {
        // Khi game bắt đầu, tính toán xem vị trí Y hiện tại của Node này đang gần mốc thứ mấy nhất
        this.calculateInitialIndex();
    }

    private calculateInitialIndex() {
        if (this.numberOfSteps <= 1) return;

        const currentY = this.node.position.y;

        // Ví dụ: max = 10, min = 0, numberOfSteps = 6 -> khoảng cách mỗi bước là 10 / 5 = 2.
        const stepDistance = (this.maxY - this.minY) / (this.numberOfSteps - 1);

        // Tính toán index gần nhất với tọa độ y hiện tại
        let closestIndex = Math.round((currentY - this.minY) / stepDistance);

        // Giới hạn index nằm trong phạm vi cho phép
        if (closestIndex < 0) closestIndex = 0;
        if (closestIndex > this.numberOfSteps - 1) closestIndex = this.numberOfSteps - 1;

        this.currentIndex = closestIndex;

        // Tùy chọn: có thể muốn node tự động snap lại vào mốc chuẩn ngay khi start
        this.snapToCurrentIndex();
    }

    public moveUp() {
        // Tăng index lên 1 mốc nếu chưa tới mốc tối đa
        if (this.currentIndex < this.numberOfSteps - 1) {
            this.currentIndex++;
            this.snapToCurrentIndex();
        }
    }

    public moveDown() {
        // Giảm index xuống 1 mốc nếu chưa ở mốc tối thiểu
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.snapToCurrentIndex();
        }
    }

    // Hàm thực hiện di chuyển chuẩn xác vào tọa độ Y của mốc hiện tại
    private snapToCurrentIndex() {
        const stepDistance = this.numberOfSteps > 1 ? (this.maxY - this.minY) / (this.numberOfSteps - 1) : 0;

        // Tọa độ Y mục tiêu
        const targetY = this.minY + (this.currentIndex * stepDistance);

        // Cập nhật vị trí
        const currentPos = this.node.position;
        this.node.setPosition(currentPos.x, targetY, currentPos.z);
    }
}
