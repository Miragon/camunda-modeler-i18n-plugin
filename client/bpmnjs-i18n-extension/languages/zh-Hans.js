import bpmnJs from './zh-Hans/bpmn-js';
import dmnJs from './zh-Hans/dmn-js';
import propertiesPanel from './zh-Hans/properties-panel';
import other from './zh-Hans/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
