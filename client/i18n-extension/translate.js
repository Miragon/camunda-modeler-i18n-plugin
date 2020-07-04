import {config} from '../configuration'
import de from "./languages/de.js"
import en from "./languages/en.js"

export default function Translator(eventBus) {

  const languages = {}
  languages["de"] = de;
  languages["en"] = en;
  let currentLanguage = de;

  const value = config.get("editor_language");
  value.then((language) => {
    currentLanguage = languages[language];
    eventBus.fire('i18n.changed');
  })

  eventBus.on('editorActions.init', function (event) {
    const editorActions = event.editorActions;
    editorActions.register('language.changed', function (language) {
      currentLanguage = languages[language];
      config.set("editor_language", language);
      eventBus.fire('i18n.changed');
    });
  });

  return (template, type) => {

    //TODO Handling für bessere übersetzung

    return currentLanguage[template] || template;
  }
}

Translator.$inject = ['eventBus'];