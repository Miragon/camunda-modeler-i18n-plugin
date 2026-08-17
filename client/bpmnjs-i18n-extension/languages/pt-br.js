import bpmnJs from './pt-br/bpmn-js';
import dmnJs from './pt-br/dmn-js';
import propertiesPanel from './pt-br/properties-panel';
import other from './pt-br/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
