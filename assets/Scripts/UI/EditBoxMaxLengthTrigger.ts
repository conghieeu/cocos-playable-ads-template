import { _decorator, Component, EditBox, EventHandler } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('EditBoxMaxLengthTrigger')
@requireComponent(EditBox) // Đảm bảo phải có EditBox trên cùng Node
export class EditBoxMaxLengthTrigger extends Component {

    @property({ type: [EventHandler], tooltip: 'Danh sách các event được gọi khi đạt Max Length' })
    public onMaxLengthReached: EventHandler[] = [];

    private _editBox: EditBox | null = null;
    private _lastTextLength: number = 0;

    protected onLoad() {
        this._editBox = this.getComponent(EditBox);

        if (this._editBox) {
            // Đăng ký sự kiện text-changed của EditBox
            this._editBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onTextChanged, this);
        }
    }

    protected onDestroy() {
        if (this._editBox) {
            // Hủy đăng ký sự kiện khi component bị xóa
            this._editBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onTextChanged, this);
        }
    }

    private onTextChanged(editbox: EditBox) {
        if (!this._editBox) return;

        const currentTextLength = editbox.string.length;
        const maxLength = this._editBox.maxLength;

        // Nếu giới hạn maxLength chưa được cài đặt (thường là < 0), ta bỏ qua
        if (maxLength < 0) return;

        // Chỉ trigger khi số lượng ký tự đạt hoặc vượt mức maxLength
        // Đồng thời kiểm tra xem độ dài trước đó đã đạt max chưa (để tránh trigger liên tục nếu user gõ thêm khi đã đầy)
        if (currentTextLength >= maxLength && this._lastTextLength < maxLength) {
            // Emit mảng event handlers
            EventHandler.emitEvents(this.onMaxLengthReached, this, editbox.string);
        }

        // Cập nhật lại độ dài trước đó
        this._lastTextLength = currentTextLength;
    }
}
