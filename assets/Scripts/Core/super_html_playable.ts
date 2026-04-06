/**
 * super-html playable adapter
 * @help https://store.cocos.com/app/detail/3657
 * @home https://github.com/magician-f/cocos-playable-demo
 * @author https://github.com/magician-f
 */
export class super_html_playable {
    game_ready() {
        console.log("game ready");
        //@ts-ignore
        window.super_html && super_html.game_ready();
    }

    game_track(event: string, data: any) {
        console.log("game track", event, data);
        //@ts-ignore
        window.super_html && super_html.game_track(event, data);
    } 

    /**
     * 游戏开始
     * channel : unity
     */
    game_start() {
        console.log("game start");
        //@ts-ignore
        window.super_html && super_html.game_start();
    }

    download() {
        console.log("download");
        //@ts-ignore
        window.super_html && super_html.download();
    }

    game_end() {
        console.log("game end");
        //@ts-ignore
        window.super_html && super_html.game_end();
    }

    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    is_hide_download() {
        //@ts-ignore
        if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
        }
        return false
    }

    /**
     * 设置商店地址
     * channel : unity
     * @param url https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp
     */
    set_google_play_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    }

    /**
    * 设置商店地址
    * channel : unity
    * @param url https://apps.apple.com/us/app/ad-testing/id1463016906
    */
    set_app_store_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    }
}
export default new super_html_playable();