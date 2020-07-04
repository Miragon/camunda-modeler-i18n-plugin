import Config from "./Config";

const {
    ipcRenderer
} = window.getAppPreload();

export const config = new Config(ipcRenderer);
