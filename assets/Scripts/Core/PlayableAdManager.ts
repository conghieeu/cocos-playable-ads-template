import { _decorator, Component, CCString } from 'cc';
import super_html_playable from './super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('PlayableAdManager')
export class PlayableAdManager extends Component {

    onLoad() {
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.lutech.arsketch");
        super_html_playable.set_app_store_url("");
    }

    on_click_game_end() {
        super_html_playable.game_end();
    }

    on_click_download() {
        super_html_playable.download();
    }

    // tải và kết thúc
    on_click_download_and_end() {
        this.on_click_download();
        this.on_click_game_end();
    }
}
