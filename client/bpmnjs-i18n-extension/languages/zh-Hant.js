import bpmnJs from './zh-Hant/bpmn-js';
import dmnJs from './zh-Hant/dmn-js';
import propertiesPanel from './zh-Hant/properties-panel';
import other from './zh-Hant/other';

/**
 * Joins and exports the translated strings.
 */
export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
