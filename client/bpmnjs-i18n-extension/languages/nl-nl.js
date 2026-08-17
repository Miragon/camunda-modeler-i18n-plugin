import bpmnJs from './nl-nl/bpmn-js';
import dmnJs from './nl-nl/dmn-js';
import propertiesPanel from './nl-nl/properties-panel';
import other from './nl-nl/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
