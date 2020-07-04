import de from "./languages/de.js"
import en from "./languages/en.js"

export default function Translator(eventBus, I18N) {
  var languages = {}
  languages["de"] = de;
  languages["en"] = en;
  var currentLanguage = de;

  eventBus.on('editorActions.init', function(event) {
    var editorActions = event.editorActions;

    editorActions.register('language.changed', function(language) {
      currentLanguage = languages[language];
      eventBus.fire('i18n.changed');
    });
  });

   return (template, type) => {
    return currentLanguage[template] || template;
  }
}

Translator.$inject = ['eventBus'];