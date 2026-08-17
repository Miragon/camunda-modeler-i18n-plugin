import bpmnJs from './fr/bpmn-js';
import dmnJs from './fr/dmn-js';
import propertiesPanel from './fr/properties-panel';
import other from './fr/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
