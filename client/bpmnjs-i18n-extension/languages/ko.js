import bpmnJs from './ko/bpmn-js';
import dmnJs from './ko/dmn-js';
import propertiesPanel from './ko/properties-panel';
import other from './ko/other';

export default {
    ...bpmnJs,
    ...dmnJs,
    ...propertiesPanel,
    ...other
};
