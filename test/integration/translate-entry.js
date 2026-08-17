/**
 * Wires the real translate module into a real editor, the way the plugin does
 * through `bpmn.modeler.configure`, and reports what the UI ends up showing.
 */

import BpmnModeler from 'camunda-bpmn-js/lib/camunda-cloud/Modeler';
import { CamundaCloudModeler as DmnModeler } from 'camunda-dmn-js';

import translateModule from '../../client/bpmnjs-i18n-extension/index.js';

import DIAGRAM from './fixtures/harvest.bpmn';
import DECISION from './fixtures/harvest.dmn';

function container() {
    const element = document.createElement('div');

    element.style.width = '1400px';
    element.style.height = '900px';
    document.body.appendChild(element);

    return element;
}

window.__inspect = async language => {
    translateModule.translateModule.prototype.currentLanguage = () => language;

    const bpmn = new BpmnModeler({
        container: container(),
        additionalModules: [ translateModule ]
    });

    await bpmn.importXML(DIAGRAM);

    const translate = bpmn.get('translate');
    const paletteLabels = [ ...document.querySelectorAll('.djs-palette [title]') ]
        .map(entry => entry.getAttribute('title'));

    const dmn = new DmnModeler({
        container: container(),
        drd: { additionalModules: [ translateModule ] },
        decisionTable: { additionalModules: [ translateModule ] },
        literalExpression: { additionalModules: [ translateModule ] }
    });

    await dmn.importXML(DECISION);

    const decisionTable = dmn.getViews().find(view => view.type === 'decisionTable');

    if (decisionTable) {
        await dmn.open(decisionTable);
    }

    return {
        // Straight through the injected service, i.e. what every bpmn-js
        // component gets when it asks for a translation.
        service: {
            handTool: translate('Activate hand tool'),
            interpolated: translate('{label} must not be empty.', { label: 'X' })
        },
        paletteLabels,
        dmnText: document.body.textContent
    };
};
