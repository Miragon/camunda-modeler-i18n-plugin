import bpmnJs from './bpmn-js.js';
import dmnJs from './dmn-js.js';
import camunda8Cloud from './camunda-8-cloud.js'; // Camunda 8 (cloud) properties
import camunda7Platform from './camunda-7-platform.js'; // Camunda 7 (platform) properties
import other from './other.js';

// Merged translation dictionary for this locale.
const dictionary: Record<string, string> = {
    ...bpmnJs,
    ...dmnJs,
    ...camunda8Cloud,
    ...camunda7Platform,
    ...other,
};

export default dictionary;
