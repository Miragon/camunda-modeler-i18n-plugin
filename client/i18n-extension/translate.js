import de from "./languages/de.js"

export default function Translator(eventBus, I18N) {

  var currentLanguage = de;


  eventBus.on('editorActions.init', function(event) {
    var editorActions = event.editorActions;

    editorActions.register('language.changed', function() {
      console.log("language.changed")
    });
  });

   return (template, type) => {
    return currentLanguage[template] || template;
  }
}

Translator.$inject = ['eventBus'];