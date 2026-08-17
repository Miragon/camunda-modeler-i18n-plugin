import bpmnJs from './de/bpmn-js';
import dmnJs from './de/dmn-js';
import propertiesPanel from './de/properties-panel';
import other from './de/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
