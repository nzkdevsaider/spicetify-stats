import React from "react";
import PlaylistPage from "../pages/playlist";
import { STATS_VERSION } from "../constants";

(async function stats() {
    if (!Spicetify.Platform) {
        setTimeout(stats, 100);
        return;
    }

    const version = localStorage.getItem("stats:version");
    if (!version || version !== STATS_VERSION) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i) as string;
            if (key.startsWith("stats:") && !key.startsWith("stats:config:")) {
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem("stats:version", STATS_VERSION);
    }

    Spicetify.LocalStorage.set("stats:cache-info", JSON.stringify([0, 0, 0, 0, 0, 0]));

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/spicetify-routes-stats.css";
    document.head.appendChild(styleLink);

    const playlistEdit = new Spicetify.Topbar.Button("playlist-stats", "visualizer", () => {
        const playlistUri = `spotify:playlist:${Spicetify.Platform.History.location.pathname.split("/")[2]}`;
        // @ts-ignore
        Spicetify.PopupModal.display({ title: "Playlist Stats", content: <PlaylistPage uri={playlistUri} />, isLarge: true });
    });
    playlistEdit.element.classList.toggle("hidden", true);

    Spicetify.Platform.History.listen(({ pathname }: { pathname: string }) => {
        const [, type, uid] = pathname.split("/");
        const isPlaylistPage = type === "playlist" && uid;
        playlistEdit.element.classList.toggle("hidden", !isPlaylistPage);
    });
})();
