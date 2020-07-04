import de from "./languages/de.js"

export default function Translator(eventBus, I18N) {

  var currentLanguage = de;

  console.log(eventBus);
  eventBus.on("language.changed", () =>{
    console.log("test")
    eventBus.fire('i18n.changed');
  });

   return (template, type) => {
    return currentLanguage[template] || template;
  }
}

Translator.$inject = ['eventBus'];