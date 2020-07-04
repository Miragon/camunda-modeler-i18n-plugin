import translations from "./languages/de.js"

export default function translate(template) {

  console.log(template);
  return translations[template] || template;
}