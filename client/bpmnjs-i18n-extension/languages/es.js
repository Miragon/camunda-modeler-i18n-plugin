import bpmnJs from './es/bpmn-js';
import dmnJs from './es/dmn-js';
import propertiesPanel from './es/properties-panel';
import other from './es/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
