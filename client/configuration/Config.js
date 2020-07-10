/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import generateId from "../utils/generate-id";

/**
 * This class allows reading from and writing to the Camunda Modeler
 * configuration. It is located in the {APP_DIRECTORY}/config.js file.
 *
 * You can use it as follows:
 *
 * @example
 * import {config} from '../configuration';
 * // ...
 * const CONFIG_KEY = "any_key_you_want_to_use";
 * config.set(CONFIG_KEY, "new_value");
 * config.get(CONFIG_KEY).then((value) => {
 *     console.log("Received value: " + value);
 * });
 */
export default class Config {
    /**
     * Creates the config class.
     *
     * @param ipcRenderer The renderer used to display the application.
     */
    constructor(ipcRenderer) {
        this.ipcRenderer = ipcRenderer;
    }

    /**
     * Use this function to set a key to the specified value.
     *
     * @param key The key to persist
     * @param value The value to persist
     */
    set(key, value){
        this.send("config:set", key, value);
    }

    /**
     * Use this function to read the specified key.
     *
     * @param key The key to read
     * @return A promise resolving with the read value
     */
    get(key) {
        return this.send("config:get", key);
    }

    /**
     * Listens once for the specified event and triggers the provided callback.
     *
     * @param event The event to listen for
     * @param callback The callback to trigger
     */
    once (event, callback) {
        this.ipcRenderer.once(event, callback);
    }

    /**
     * Sends the event with the specified arguments to the backend.
     *
     * @param event The name of the event to send
     * @param args The arguments to send
     * @return A promise resolved with the response of the event
     */
    send(event, ...args){
        return new Promise((resolve, reject) => {
            const id = generateId();

            this.once(event + ':response:' + id, function (evt, args) {
                // args[0] = error
                // args[1] = result

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