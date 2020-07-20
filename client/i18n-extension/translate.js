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

import {config} from '../configuration';
import de from "./languages/de.js";
import en from "./languages/en.js";
import pt_br from "./languages/pt-br.js";

/**
 * All available languages.
 */
const languages = {
    de, en, pt_br
};

// The default language to use if none is specified in the configuration
const defaultLanguage = "en";

// The key in the configuration that specifies the language
const CONFIG_KEY = "editor_language";

// The events to listen to / send
const I18N_EVENT = "i18n.changed";
const MENU_EVENT = "language.changed";
const INIT_ACTION = "editorActions.init";
const SELECTION_EVENT = "selection.changed";

// Contains all missing translations discovered to prevent logging them
// multiple times.
const missing = [];

/**
 * This function initializes the translation plugin.
 *
 * @param eventBus The application's event bus
 * @return The translator function
 */
export default function Translator(eventBus) {
    let currentLanguage = languages[defaultLanguage];

    // Read the language from configuration
    config.get(CONFIG_KEY).then((language) => {

        // Check if the specified language exists
        if (languages[language] && language !== defaultLanguage) {

            // Set the language as current
            currentLanguage = languages[language];

            // Notify parts of the application that the language has changed. Triggers a re-rendering.
            eventBus.fire(I18N_EVENT);
            eventBus.fire(SELECTION_EVENT, {newSelection: []});
        }
    });

    // After the editor has initialized, register the menu listeners
    eventBus.on(INIT_ACTION, function (event) {
        const editorActions = event.editorActions;
        editorActions.register(MENU_EVENT, function (language) {

            // Persist the new language
            config.set(CONFIG_KEY, language);

            // Set the language as above
            currentLanguage = languages[language];
            eventBus.fire(I18N_EVENT);
            eventBus.fire(SELECTION_EVENT, {newSelection: []});
        });
    });

    // Return the translation function. It takes the template string and the parameters,
    // translates it and returns it.
    return (template, parameters) => {

        // If the requested string is not available in the current language
        if (!currentLanguage[template]) {
            // Check if it was already printed to the console
            if (missing.indexOf(template) === -1) {
                // Print the missing translation to the console ´
                console.log("Missing translation: " + template, parameters);
                missing.push(template);
            }
        }

        // Use the translated string or the original template string as fallback
        const translation = currentLanguage[template] || template;

        // Replace all parameters in the template string with the provided values
        return translation.replace(/{([^}]+)}/g, function (_, key) {
            return (parameters || {})[key] || '{' + key + '}';
        });
    };
};

// Specify what values should be injected into the function above
Translator.$inject = ['eventBus'];
