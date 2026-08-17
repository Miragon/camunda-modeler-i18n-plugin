/**
 * Runs in a real browser and records every string the editors ask to translate.
 *
 * Most of our keys are palette, context-pad and create-menu labels that bpmn-js
 * builds at runtime, so static analysis cannot find them. This mirrors how
 * bpmn-js generates its own `docs/translations.json`.
 */

import BpmnModeler from 'camunda-bpmn-js/lib/camunda-cloud/Modeler';
import { CamundaCloudModeler as DmnModeler } from 'camunda-dmn-js';

import DIAGRAM from './fixtures/harvest.bpmn';
import DECISION from './fixtures/harvest.dmn';

const recorded = new Set();
const failures = [];

/** Replaces the translate service and records what passes through it. */
const recorder = {
    translate: [ 'value', (template, replacements) => {
        recorded.add(template);

        return String(template).replace(/{([^}]+)}/g, (_, key) =>
            (replacements || {})[key] ?? `{${key}}`);
    } ]
};

function guard(label, fn) {
    try {
        return fn();
    } catch (error) {
        failures.push(`${label}: ${error.message}`);
        return null;
    }
}

function container() {
    const element = document.createElement('div');

    element.style.width = '1400px';
    element.style.height = '900px';
    document.body.appendChild(element);

    return element;
}

/**
 * Opening a diagram triggers only a fraction of the labels, so every provider
 * that produces user-visible text is walked explicitly.
 */
function drainBpmn(modeler) {
    const injector = modeler.get('injector');
    const elementRegistry = modeler.get('elementRegistry');
    const root = modeler.get('canvas').getRootElement();

    guard('palette', () => modeler.get('palette')._update());

    const contextPad = injector.get('contextPad', false);
    const popupMenu = injector.get('popupMenu', false);
    const elements = elementRegistry.getAll().filter(e => e !== root);

    for (const element of elements) {
        guard(`contextPad:${element.id}`, () => contextPad?.getEntries(element));

        for (const provider of [ 'bpmn-replace', 'bpmn-append', 'bpmn-create' ]) {
            guard(`${provider}:${element.id}`, () => {
                popupMenu?.open(element, provider, { x: 0, y: 0 });
                popupMenu?.close();
            });
        }
    }

    guard('linting', () => injector.get('linting', false)?.lint?.());
}

function drainDmn(modeler) {
    for (const view of modeler.getViews()) {
        guard(`dmnView:${view.type}`, () => modeler.open(view));
    }
}

async function harvest() {
    const bpmn = new BpmnModeler({
        container: container(),
        additionalModules: [ recorder ]
    });

    await bpmn.importXML(DIAGRAM);
    drainBpmn(bpmn);

    const dmn = new DmnModeler({
        container: container(),
        drd: { additionalModules: [ recorder ] },
        decisionTable: { additionalModules: [ recorder ] },
        literalExpression: { additionalModules: [ recorder ] }
    });

    await dmn.importXML(DECISION);
    drainDmn(dmn);

    return { keys: [ ...recorded ].sort(), failures };
}

window.__harvest = () => harvest().then(
    result => ({ ok: true, ...result }),
    error => ({ ok: false, error: error.message, stack: error.stack })
);
