import {config} from '../configuration';
import de from "./languages/de.js";
import en from "./languages/en.js";

const languages = {
    de, en
};

const CONFIG_KEY = "editor_language";
const I18N_EVENT = "i18n.changed";
const MENU_EVENT = "language.changed";

const missing = [];

export default function Translator(eventBus) {
    let currentLanguage = en;

    config.get(CONFIG_KEY).then((language) => {
        currentLanguage = languages[language || "en"];
        eventBus.fire(I18N_EVENT);
    });

    eventBus.on('editorActions.init', function (event) {
        const editorActions = event.editorActions;
        editorActions.register(MENU_EVENT, function (language) {
            currentLanguage = languages[language];
            config.set(CONFIG_KEY, language);
            eventBus.fire(I18N_EVENT);
            eventBus.fire('selection.changed', {newSelection: []});
        });
    });

    return (template, parameters) => {
        if (!currentLanguage[template]) {
            if (missing.indexOf(template) === -1) {
                // Print missing translations to console out
                console.log("Missing translation: " + template, parameters);
                missing.push(template);
            }
        }

        const translation = currentLanguage[template] || template;
        return translation.replace(/{([^}]+)}/g, function (_, key) {
            return (parameters || {})[key] || '{' + key + '}';
        });
    };
};

Translator.$inject = ['eventBus'];