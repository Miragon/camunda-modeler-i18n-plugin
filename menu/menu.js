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

'use strict';

/**
 * This file creates the menu entry of this plugin.
 *
 * @param electronApp The app creating the menu, used to send events
 * @param menuState The state of the menu
 * @return The menu entries
 */
module.exports = function (electronApp, menuState) {
    return [
        {
            label: 'Deutsch', // The display name of the entry
            enabled: () => menuState.bpmn, // The entry should only be enabled inside the BPMN editor (DMN is not working currently)
            action: function () { // What to do when the entry is clicked
                // Notify the app (see client/i18n-extension/translate.js for the event listener)
                electronApp.emit('menu:action', 'language.changed', 'de');
            }
        },
        {
            label: 'English',
            enabled: () => menuState.bpmn,
            action: function () {
                electronApp.emit('menu:action', 'language.changed', 'en');
            }
        },
        {
            label: 'Português (Brasil)',
            enabled: () => menuState.bpmn,
            action: function () {
                electronApp.emit('menu:action', 'language.changed', 'pt_br');
            }
        }
    ];
};
