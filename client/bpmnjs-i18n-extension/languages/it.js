import bpmnJs from './it/bpmn-js';
import dmnJs from './it/dmn-js';
import propertiesPanel from './it/properties-panel';
import other from './it/other';

export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
