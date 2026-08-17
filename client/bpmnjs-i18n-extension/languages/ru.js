import bpmnJs from './ru/bpmn-js';
import dmnJs from './ru/dmn-js';
import propertiesPanel from './ru/properties-panel';
import other from './ru/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
