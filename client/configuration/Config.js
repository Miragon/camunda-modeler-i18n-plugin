import generateId from "../utils/generate-id";

export default class Config {

    constructor(ipcRenderer) {
        this.ipcRenderer = ipcRenderer;
    }

    once (event, callback) {
        this.ipcRenderer.once(event, callback);
    }

    set(...args){
        this.send("config:set", ...args);
    }

    get( ...args) {
        return this.send("config:get", ...args);
    }

    send(event, ...args){
        return new Promise((resolve, reject) => {

            const id = generateId();

            this.once(event + ':response:' + id, function (evt, args) {
                if (args[0] !== null) {
                    reject(args[0]);
                }

                // promises can only resolve with one argument
                return resolve(args[1]);
            });

            this.ipcRenderer.send(event, id, args);
        });
    }

}