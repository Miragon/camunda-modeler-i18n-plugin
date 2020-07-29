/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/configuration/Config.js":
/*!****************************************!*\
  !*** ./client/configuration/Config.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Config; });
/* harmony import */ var _utils_generate_id__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/generate-id */ "./client/utils/generate-id.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * This class allows reading from and writing to the Camunda Modeler
 * configuration. It is located in the {APP_DIRECTORY}/config.js file.
 *
 * You can use it as follows:
 *
 * @example
 * import {config} from '../configuration';
 * // ...
 * const CONFIG_KEY = "any_key_you_want_to_use";
 * config.set(CONFIG_KEY, "new_value");
 * config.get(CONFIG_KEY).then((value) => {
 *     console.log("Received value: " + value);
 * });
 */
class Config {
    /**
     * Creates the config class.
     *
     * @param ipcRenderer The renderer used to display the application.
     */
    constructor(ipcRenderer) {
        this.ipcRenderer = ipcRenderer;
    }

    /**
     * Use this function to set a key to the specified value.
     *
     * @param key The key to persist
     * @param value The value to persist
     */
    set(key, value){
        this.send("config:set", key, value);
    }

    /**
     * Use this function to read the specified key.
     *
     * @param key The key to read
     * @return A promise resolving with the read value
     */
    get(key) {
        return this.send("config:get", key);
    }

    /**
     * Listens once for the specified event and triggers the provided callback.
     *
     * @param event The event to listen for
     * @param callback The callback to trigger
     */
    once (event, callback) {
        this.ipcRenderer.once(event, callback);
    }

    /**
     * Sends the event with the specified arguments to the backend.
     *
     * @param event The name of the event to send
     * @param args The arguments to send
     * @return A promise resolved with the response of the event
     */
    send(event, ...args){
        return new Promise((resolve, reject) => {
            const id = Object(_utils_generate_id__WEBPACK_IMPORTED_MODULE_0__["default"])();

            this.once(event + ':response:' + id, function (evt, args) {
                // args[0] = error
                // args[1] = result

                if (args[0] !== null) {
                    reject(args[0]);
                }

                // promises can only resolve with one argument
                return resolve(args[1]);
            });

            this.ipcRenderer.send(event, id, args);
        });
    }
}

/***/ }),

/***/ "./client/configuration/index.js":
/*!***************************************!*\
  !*** ./client/configuration/index.js ***!
  \***************************************/
/*! exports provided: config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
/* harmony import */ var _Config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Config */ "./client/configuration/Config.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Instantiates and exports the config class.
 */
const {
    ipcRenderer
} = window.getAppPreload();

const config = new _Config__WEBPACK_IMPORTED_MODULE_0__["default"](ipcRenderer);


/***/ }),

/***/ "./client/i18n-extension/index.js":
/*!****************************************!*\
  !*** ./client/i18n-extension/index.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./translate */ "./client/i18n-extension/translate.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Creates the plugin structure and tells the modeler, how to initialize it.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  __init__: [ 'translate' ],
  translate: [ 'type', _translate__WEBPACK_IMPORTED_MODULE_0__["default"] ]
});


/***/ }),

/***/ "./client/i18n-extension/languages/de.js":
/*!***********************************************!*\
  !*** ./client/i18n-extension/languages/de.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _de_bpmn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./de/bpmn-js */ "./client/i18n-extension/languages/de/bpmn-js.js");
/* harmony import */ var _de_dmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./de/dmn-js */ "./client/i18n-extension/languages/de/dmn-js.js");
/* harmony import */ var _de_properties_panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./de/properties-panel */ "./client/i18n-extension/languages/de/properties-panel.js");
/* harmony import */ var _de_other__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./de/other */ "./client/i18n-extension/languages/de/other.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * Joins and exports the translated strings.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    ..._de_bpmn_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    ..._de_dmn_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    ..._de_properties_panel__WEBPACK_IMPORTED_MODULE_2__["default"],
    ..._de_other__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./client/i18n-extension/languages/de/bpmn-js.js":
/*!*******************************************************!*\
  !*** ./client/i18n-extension/languages/de/bpmn-js.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the strings used in the bpmn-js module.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Append {type}': '{type} anfügen',
    'Add Lane above': 'Lane darüber einfügen',
    'Divide into two Lanes': 'In zwei Lanes aufteilen',
    'Divide into three Lanes': 'In drei Lanes aufteilen',
    'Add Lane below': 'Lane darunter einfügen',
    'Append ReceiveTask': 'Receive-Task anfügen',
    'Append MessageIntermediateCatchEvent': 'Message-Intermediate-Catch-Event anfügen',
    'Append TimerIntermediateCatchEvent': 'Timer-Intermediate-Catch-Event anfügen',
    'Append ConditionIntermediateCatchEvent': 'Condition-Intermediate-Catch-Event anfügen',
    'Append SignalIntermediateCatchEvent': 'Signal-Intermediate-Catch-Event anfügen',
    'Append compensation activity': 'Compensation-Aktivität anfügen',
    'Append EndEvent': 'End-Event anfügen',
    'Append Gateway': 'Gateway anfügen',
    'Append Task': 'Task anfügen',
    'Append Intermediate/Boundary Event': 'Intermediate/Boundary-Event anfügen',
    'Change type': 'Typ ändern',
    'Connect using Association': 'Mit Assoziation verbinden',
    'Connect using Sequence/MessageFlow or Association': 'Mit Sequenz-/Nachrichtenfluss oder Assoziation verbinden',
    'Connect using DataInputAssociation': 'Mit DataInputAssociation verbinden',
    'Remove': 'Entfernen',
    'no shape type specified': 'Kein Formtyp angegeben',
    'out of bounds release': 'Außerhalb der Grenzen losgelassen',
    'more than {count} child lanes': 'mehr als {count} Kind-Lanes',
    'element required': 'Element benötigt',
    'no parent for {element} in {parent}': 'Kein Elternelement für {element} in {parent}',
    'Create {type}': '{type} erzeugen',
    'Activate the hand tool': 'Hand-Tool aktivieren',
    'Activate the lasso tool': 'Lasso-Tool aktivieren',
    'Activate the create/remove space tool': 'Space-hinzufügen/entfernen-Tool aktivieren',
    'Activate the global connect tool': 'Globales Verbindungstool aktivieren',
    'Create StartEvent': 'Start-Event erzeugen',
    'Create Intermediate/Boundary Event': 'Intermediate/Boundary-Event erzeugen',
    'Create EndEvent': 'End-Event erzeugen',
    'Create Gateway': 'Gateway erzeugen',
    'Create Task': 'Task erzeugen',
    'Create DataObjectReference': 'Data-Object-Reference erzeugen',
    'Create DataStoreReference': 'Data-Store-Reference erzeugen',
    'Create expanded SubProcess': 'Subprozess erzeugen',
    'Create Pool/Participant': 'Pool/Participant erzeugen',
    'Create Group': 'Gruppe erzeugen',
    'Parallel Multi Instance': 'Parallele Multiinstanz',
    'Sequential Multi Instance': 'Sequenzielle Multiinstanz',
    'Loop': 'Schleife',
    'Ad-hoc': 'Ad-hoc',
    'element {element} referenced by {referenced}#{property} not yet drawn': 'Element {element}, referenziert durch {referenced}#{property}, wurde noch nicht gezeichnet',
    'unknown di {di} for element {semantic}': 'Unbekannter DI {di} für Element {semantic}',
    'missing {semantic}#attachedToRef': '{semantic}#attachedToRef fehlt',
    '{semantic}#{side} Ref not specified': '{semantic}#{side} Ref nicht angegeben',
    'already rendered {element}': '{element} wurde bereits gerendert',
    'failed to import {element}': 'Import von {element} fehlgeschlagen',
    'multiple DI elements defined for {element}': 'Mehrere DI-Elemente für {element} definiert',
    'no bpmnElement referenced in {element}': 'Kein bpmnElement in {element} referenziert',
    'diagram not part of bpmn:Definitions': 'Das Diagramm ist nicht Teil von bpmn:Definitions',
    'no diagram to display': 'Kein Diagramm zum Anzeigen',
    'no process or collaboration to display': 'Kein Prozess oder Collaboration zum Anzeigen',
    'correcting missing bpmnElement on {plane} to {rootElement}': 'Korrigiere fehlendes bpmnElement auf {plane} zu {rootElement}',
    'unsupported bpmnElement for {plane}: {rootElement}': 'Nicht unterstütztes bpmnElement für {plane}: {rootElement}',
    'unrecognized flowElement {element} in context {context}': 'FlowElement {element} im Context {context} nicht erkannt',
    'HELLO {you}!': 'HALLO {you}!'
});

/***/ }),

/***/ "./client/i18n-extension/languages/de/dmn-js.js":
/*!******************************************************!*\
  !*** ./client/i18n-extension/languages/de/dmn-js.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the translated strings used in the dmn-js component.
 * However, notice that these strings are currently not working. We are
 * still investigating how to apply them.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Activate the lasso tool': 'Lasso-Tool aktivieren',
    'Add Cell Description': 'Zellenbeschreibung hinzufügen',
    'Add Input': 'Input hinzufügen',
    'Add Input Column Left': 'Input-Spalte links hinzufügen',
    'Add Input Column Right': 'Input-Spalte rechts hinzufügen',
    'Add Output': 'Output hinzufügen',
    'Add Output Column Left': 'Output-Spalte links hinzufügen',
    'Add Output Column Right': 'Output-Spalte rechts hinzufügen',
    'Add Predefined Values': 'Vordefinierte Werte hinzufügen',
    'Add Rule Above': 'Regel darüber hinzufügen',
    'Add Rule Below': 'Regel darunter hinzufügen',
    'Add Values': 'Werte hinzufügen',
    'And': 'Und',
    'Annotations': 'Annotationen',
    'Append {type}': '{type} anfügen',
    'cellInput': 'Zellen-Input',
    'Change Cell Expression Language': 'Expression-Language für Zelle ändern',
    'Change type': 'Typ ändern',
    'Clear predefined values.': 'Vordefinierte Werte löschen',
    'Copy Input Column': 'Input-Spalte kopieren',
    'Copy Output Column': 'Output-Spalte kopieren',
    'Copy Rule': 'Regel kopieren',
    'Create Decision': 'Decision erstellen',
    'Create Input Data': 'Input-Daten erstellen',
    'Create Knowledge Model': 'Knowledge-Model erstellen',
    'Create Knowledge Source': 'Knowledge-Source erstellen',
    'Cut Input Column': 'Input-Spalte ausschneiden',
    'Cut Output Column': 'Output-Spalte ausschneiden',
    'Cut Rule': 'Regel ausschneiden',
    'Edit String': 'String bearbeiten',
    'Expression': 'Expression',
    'Expression Language': 'Expression-Language',
    'Input': 'Input',
    'Input Expression': 'Input-Expression',
    'Input Label': 'Input-Label',
    'Input Type': 'Input-Type',
    'Input Values': 'Input-Werte',
    'Input Variable': 'Input-Variable',
    'No values': 'Keine Werte',
    'Output Label': 'Output-Label',
    'Output Name': 'Output-Name',
    'Output Type': 'Output-Type',
    'Output Values': 'Output-Werte',
    'Paste Input Column Left': 'Input-Spalte links einfügen',
    'Paste Input Column Right': 'Input-Spalte rechts einfügen',
    'Paste Output Column Left': 'Output-Spalte links einfügen',
    'Paste Output Column Right': 'Output-Spalte rechts einfügen',
    'Paste Rule Above': 'Regel darüber einfügen',
    'Paste Rule Below': 'Regel darunter einfügen',
    'Predefined Values': 'Vordefinierte Werte',
    'Remove': 'Entfernen',
    'Remove Cell Description': 'Zellenbeschreibung entfernen',
    'Remove Input Column': 'Input-Spalte entfernen',
    'Remove Output Column': 'Output-Spalte entfernen',
    'Remove Rule': 'Regel entfernen',
    'Set Value': 'Wert setzen',
    'Strings must be in double quotes.': 'Strings müssen von doppelten Anführungszeichen umschlossen werden',
    'Type': 'Typ',
});

/***/ }),

/***/ "./client/i18n-extension/languages/de/other.js":
/*!*****************************************************!*\
  !*** ./client/i18n-extension/languages/de/other.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains translations that were used in other components.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Open minimap': 'Minimap öffnen',
    'This maps to the process definition key.': 'Angabe wird zum Prozess-Definition-Key gemappt.',
    'Key': 'Key',
    'Intermediate Throw Event': 'Intermediate-Throw-Event',
    'End Event': 'End-Event',
    'Message Start Event': 'Message-Start-Event',
    'Timer Start Event': 'Timer-Start-Event',
    'Conditional Start Event': 'Conditional-Start-Event',
    'Signal Start Event': 'Signal-Start-Event',
    'Expand (not reversible)': 'Aufklappen (kann nicht rückgängig gemacht werden)',
    'ID': 'ID',
    'Start Event': 'Start-Event',
    'Message End Event': 'Message-End-Event',
    'Escalation End Event': 'Escalation-End-Event',
    'Error End Event': 'Error-End-Event',
    'Compensation End Event': 'Compensation-End-Event',
    'Signal End Event': 'Signal-End-Event',
    'Terminate End Event': 'Terminate-End-Event',
    'Transaction': 'Transaktion',
    'Event Sub Process': 'Event-Subprozess',
    'Sub Process (collapsed)': 'Subprozess (eingeklappt)',
    'Close minimap': 'Minimap schließen',
    'Message Intermediate Catch Event': 'Message-Intermediate-Catch-Event',
    'Message Intermediate Throw Event': 'Message-Intermediate-Throw-Event',
    'Timer Intermediate Catch Event': 'Timer-Intermediate-Catch-Event',
    'Escalation Intermediate Throw Event': 'Escalation-Intermediate-Throw-Event',
    'Conditional Intermediate Catch Event': 'Conditional-Intermediate-Catch-Event',
    'Link Intermediate Catch Event': 'Link-Intermediate-Catch-Event',
    'Link Intermediate Throw Event': 'Link-Intermediate-Throw-Event',
    'Compensation Intermediate Throw Event': 'Compensation-Intermediate-Throw-Event',
    'Signal Intermediate Catch Event': 'Signal-Intermediate-Catch-Event',
    'Signal Intermediate Throw Event': 'Signal-Intermediate-Throw-Event',
    'Parallel Gateway': 'Paralleles Gateway',
    'Inclusive Gateway': 'Inklusives Gateway',
    'Complex Gateway': 'Komplexes Gateway',
    'Event based Gateway': 'Eventbasiertes Gateway',
    'Exclusive Gateway': 'Exklusives Gateway',
    'Send Task': 'Send-Task',
    'Receive Task': 'Receive-Task',
    'User Task': 'User-Task',
    'Manual Task': 'Manueller Task',
    'Business Rule Task': 'Business-Rule-Task',
    'Service Task': 'Services-Task',
    'Script Task': 'Skript-Task',
    'Call Activity': 'Call-Activity',
    'Sub Process (expanded)': 'Subprozess (ausgeklappt)',
    'Sub Process': 'Subprozess',
    'Task': 'Task',
    'This maps to the task definition key.': 'Angabe wird zum Task-Definition-Key gemappt.',
    'Collapsed Pool': 'Zusammengeklappter Pool',
    'Expanded Pool': 'Ausgeklappter Pool',
    'flow elements must be children of pools/participants': 'Flow-Elemente müssen innerhalb von Pools/Participants platziert werden',
    'The follow up date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)': 'Das Wiedervorlagedatum als EL-Expression (z.B. ${someDate}) oder als ISO-Datum (z.B. 2015-06-26T09:54:00)',
    'Message Boundary Event': 'Message-Boundary-Event',
    'Timer Boundary Event': 'Timer-Boundary-Event',
    'Escalation Boundary Event': 'Escalation-Boundary-Event',
    'Conditional Boundary Event': 'Conditional-Boundary-Event',
    'Error Boundary Event': 'Error-Boundary-Event',
    'Cancel Boundary Event': 'Cancel-Boundary-Event',
    'Signal Boundary Event': 'Signal-Boundary-Event',
    'Compensation Boundary Event': 'Compensation-Boundary-Event',
    'Message Boundary Event (non-interrupting)': 'Message-Boundary-Event (nicht unterbrechend)',
    'Timer Boundary Event (non-interrupting)': 'Timer-Boundary-Event (nicht unterbrechend)',
    'Escalation Boundary Event (non-interrupting)': 'Escalation-Boundary-Event (nicht unterbrechend)',
    'Conditional Boundary Event (non-interrupting)': 'Conditional-Boundary-Event (nicht unterbrechend)',
    'Signal Boundary Event (non-interrupting)': 'Signal-Boundary-Event (nicht unterbrechend)',
    'Connect using Information/Knowledge/Authority Requirement or Association': 'Mit Information/Knowledge/Authority Requirement oder Assoziation verbinden',
    'Empty': 'Leer',
    'Literal Expression': 'Literaler Ausdruck',
    'This maps to the decision definition key.': 'Angabe wird zum Decision-Definition-Key gemappt.',
    'Decision Table': 'Decision-Table',
    'Output': 'Output',
    'Annotation': 'Annotation',
    'Output Expression': 'Output-Expression',
    'Data Type': 'Datentyp'
});

/***/ }),

/***/ "./client/i18n-extension/languages/de/properties-panel.js":
/*!****************************************************************!*\
  !*** ./client/i18n-extension/languages/de/properties-panel.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the translations used by the bpmn-js-properties-panel component.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Activity Ref': 'Activity-Referenz',
    'Add Constraint': 'Constraint hinzufügen',
    'Add Entry': 'Eintrag hinzufügen',
    'Add Property': 'Property hinzufügen',
    'Add Value': 'Wert hinzufügen',
    'All': 'Alle',
    'Assignee': 'Bearbeiter',
    'assignment': 'Aufgabe',
    'Asynchronous After': 'Asynchronous After', // TODO
    'Asynchronous Before': 'Asynchronous Before', // TODO
    'Asynchronous Continuations': 'Asynchronous Continuations', // TODO
    'Binding': 'Binding',
    'Business Key': 'Business-Key',
    'Business Key Expression': 'Business-Key-Expression',
    'CallActivity Type': 'Call-Activity-Typ',
    'Called Element': 'Aufgerufenes Element',
    'Candidate Groups': 'Mögliche Bearbeiter-Gruppen',
    'Candidate Starter Configuration': 'Candidate Starter Configuration', // TODO
    'Candidate Starter Groups': 'Candidate Starter Groups', // TODO
    'Candidate Starter Users': 'Candidate Starter Users', // TODO
    'Candidate Users': 'Mögliche Bearbeiter',
    'Case Ref': 'Case-Referenz',
    'Category Value': 'Kategorie-Wert',
    'Class': 'Klasse',
    'Collection': 'Collection',
    'complete': 'abschließen', // TODO
    'Completion Condition': 'Abschlussbedingung',
    'Condition': 'Bedingung',
    'Condition Type': 'Bedingungstyp',
    'Config': 'Konfiguration',
    'Configure Connector': 'Connector konfigurieren',
    'Connector': 'Connector',
    'Connector Id': 'Connector-ID',
    'create': 'erstellen',
    'Custom Fields': 'Benutzerdefinierte Felder',
    'Custom Fields for scope: ': 'Benutzerdefinierte Felder für Scope', // TODO
    'Cycle': 'Zyklus',
    'Date': 'Datum',
    'Decision Ref': 'Decision-Referenz',
    'Default Value': 'Standard-Wert',
    'Delegate Expression': 'Delegate-Expression',
    'Delegate Variable Mapping': 'Delegate-Variablenmapping',
    'delete': 'löschen',
    'deployment': 'Deployment',
    'Details': 'Details',
    'DMN': 'DMN',
    'Documentation': 'Dokumentation',
    'Due Date': 'Fälligkeitsdatum',
    'Duration': 'Dauer',
    'Element Documentation': 'Elementdokumentation',
    'Element must have an unique id.': 'Element benötigt eine eindeutige ID',
    'Element Template': 'Element-Template',
    'Element Variable': 'Element-Variable',
    'end': 'beenden', // TODO
    'Error': 'Fehler',
    'Error Code': 'Fehler-Code',
    'Error Code Variable': 'Fehler-Code-Variable',
    'Error Message': 'Fehlermeldung',
    'Error Message Variable': 'Fehlermeldung-Variable',
    'Error Name': 'Fehlername',
    'Escalation': 'Eskalation',
    'Escalation Code': 'Eskalationscode',
    'Escalation Code Variable': 'Eskalationscode-Variable',
    'Escalation Name': 'Eskalationsname',
    'Event Type': 'Eventtyp',
    'Exclusive': 'Exklusiv',
    'Executable': 'Ausführbar',
    'Execution Listener': 'Execution-Listener',
    'Expression': 'Expression',
    'Extensions': 'Erweiterungen',
    'External': 'Extern',
    'External Resource': 'Externe Ressource',
    'External Task Configuration': 'Externe Task-Konfiguration',
    'Field Injection': 'Feld-Injection',
    'Field Injections': 'Feld-Injections',
    'Fields': 'Felder',
    'Follow Up Date': 'Wiedervorlagedatum',
    'Form Field': 'Formularfeld',
    'Form Fields': 'Formularfelder',
    'Form Key': 'Formular-Key',
    'Forms': 'Formulare',
    'General': 'Allgemein',
    'History Configuration': 'History-Konfiguration',
    'History Time To Live': 'History-Aufbewahrungszeitraum',
    'Id': 'ID',
    'ID (process variable name)': 'ID (Prozessvariablen-Name)',
    'Id must be a valid QName.': 'ID muss ein gültiger QName sein',
    'Id must not contain prefix.': 'ID darf kein Prefix enthalten',
    'Id must not contain spaces.': 'ID darf keine Leerzeichen enthalten',
    'Implementation': 'Implementierung',
    'Initiator': 'Auslöser', // TODO
    'Inline Script': 'Inline-Skript',
    'In Mapping': 'In-Mapping',
    'Input/Output': 'Input/Output',
    'Input Parameter': 'Input-Parameter',
    'Input Parameters': 'Input-Parameter',
    'Java Class': 'Java-Klasse',
    'Job Configuration': 'Job-Konfiguration',
    'Job Priority': 'Job-Priorität',
    'Label': 'Label',
    'latest': 'Neueste', // TODO
    'Link Name': 'Link-Name',
    'List': 'Liste',
    'Listener Id': 'Listener-ID',
    'Listeners': 'Listener',
    'Listener Type': 'Listener-Typ',
    'Local': 'Lokal',
    'Loop Cardinality': 'Schleifen-Kardinalität',
    'Map': 'Map', // TODO
    'Map Decision Result': 'Decision-Ergebnis mappen', // TODO
    'Mapping must have a target': 'Mapping benötigt ein Ziel',
    'Mapping must have a value': 'Mapping benötigt einen Wert',
    'Mapping must have a {value}': 'Mapping benötigt ein {value}',
    'Message': 'Nachricht',
    'Message Name': 'Nachrichtenname',
    'Multi Instance ': 'Mehrfachinstanz ',
    'Multi Instance': 'Mehrfachinstanz',
    'Must configure Connector': 'Muss Connector konfigurieren',
    'Must have max length {length}': 'Darf nicht länger sein als {length}',
    'Must have min length {length}': 'Darf nicht kürzer sein als {length}',
    'Must match pattern {pattern}': 'Muss dem Pattern {pattern} entsprechen',
    'Must not be empty': 'Darf nicht leer sein',
    'Must provide a value': 'Muss einen Wert enthalten',
    'Must provide a value for timeout task listener': 'Muss einen Wert für den Timeout-Task-Listener enthalten',
    'Must provide either loop cardinality or collection': 'Muss entweder Schleifen-Kardinalität oder Collection enthalten',
    'Name': 'Name',
    'Name must not contain spaces': 'Name darf keine Leerzeichen enthalten',
    'Out Mapping': 'Out-Mapping',
    'Output Parameter': 'Output-Parameter',
    'Output Parameters': 'Output-Parameter',
    'Parameter must have a name': 'Parameter muss einen Namen haben',
    'Parameters': 'Parameter',
    'Priority': 'Priorität',
    'Process Documentation': 'Prozessdokumentation',
    'Process Id': 'Prozess-ID',
    'Process Name': 'Prozessname',
    'Properties': 'Eigenschaften',
    'Resource': 'Ressource',
    'Result Variable': 'Ergebnisvariable',
    'Retry Time Cycle': 'Retry-Zyklus',
    'Script': 'Skript',
    'Script Format': 'Skriptformat',
    'Script Type': 'Skripttyp',
    'Signal': 'Signal',
    'Signal Name': 'Signalname',
    'Source': 'Quelle',
    'Source Expression': 'Quellen-Expression',
    'Specify more than one group as a comma separated list.': 'Geben Sie mehr als eine Gruppe kommagetrennt an.',
    'Specify more than one user as a comma separated list.': 'Geben Sie mehr als einen Nutzer kommagetrennt an.',
    'Specify more than one variable change event as a comma separated list.': 'Geben Sie mehr als ein Variablen-Change-Event kommagetrennt an.',
    'start': 'starten', // TODO
    'Startable': 'Startbar',
    'String': 'String',
    'take': 'nehmen', // TODO
    'Target': 'Ziel',
    'Target must not contain whitespace': 'Ziel darf keine Leerzeichen enthalten',
    'Tasklist Configuration': 'Tasklisten-Konfiguration',
    'Task Listener': 'Task-Listener',
    'Task Priority': 'Task-Priorität',
    'Tenant Id': 'Tenant-ID',
    'Text': 'Text',
    'The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)': 'Das Fälligkeitsdatum als EL-Expression (z.B. ${someDate}) oder als ISO-Datum (z.B. 2015-06-26T09:54:00)',
    'timeout': 'Zeitüberschreitung', // TODO
    'Timer Definition': 'Timer-Definition',
    'Timer Definition Type': 'Timer-Definition-Typ',
    'Topic': 'Topic', // TODO
    'Type': 'Typ',
    'update': 'aktualisieren', // TODO
    'Validation': 'Validierung',
    'Value': 'Wert',
    'Values': 'Werte',
    'Variable Event': 'Variablen-Event',
    'Variable Name': 'Variablenname',
    'Variables': 'Variablen',
    'version': 'Version',
    'Version': 'Version',
    'versionTag': 'Version-Tag',
    'Version Tag': 'Version-Tag',
    'Wait for Completion': 'Auf Abschluss warten',
    '[unknown template: {templateId}]': '[Unbekanntes Template: {templateId}]',
    '{label} must not contain whitespace': '{label} darf keine Leerzeichen enthalten'
});

/***/ }),

/***/ "./client/i18n-extension/languages/en.js":
/*!***********************************************!*\
  !*** ./client/i18n-extension/languages/en.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _en_bpmn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./en/bpmn-js */ "./client/i18n-extension/languages/en/bpmn-js.js");
/* harmony import */ var _en_dmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./en/dmn-js */ "./client/i18n-extension/languages/en/dmn-js.js");
/* harmony import */ var _en_properties_panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./en/properties-panel */ "./client/i18n-extension/languages/en/properties-panel.js");
/* harmony import */ var _en_other__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./en/other */ "./client/i18n-extension/languages/en/other.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * Joins and exports the translated strings.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    ..._en_bpmn_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    ..._en_dmn_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    ..._en_properties_panel__WEBPACK_IMPORTED_MODULE_2__["default"],
    ..._en_other__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./client/i18n-extension/languages/en/bpmn-js.js":
/*!*******************************************************!*\
  !*** ./client/i18n-extension/languages/en/bpmn-js.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the strings used in the bpmn-js module.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Append {type}': 'Append {type}',
    'Add Lane above': 'Add Lane above',
    'Divide into two Lanes': 'Divide into two Lanes',
    'Divide into three Lanes': 'Divide into three Lanes',
    'Add Lane below': 'Add Lane below',
    'Append ReceiveTask': 'Append ReceiveTask',
    'Append MessageIntermediateCatchEvent': 'Append MessageIntermediateCatchEvent',
    'Append TimerIntermediateCatchEvent': 'Append TimerIntermediateCatchEvent',
    'Append ConditionIntermediateCatchEvent': 'Append ConditionIntermediateCatchEvent',
    'Append SignalIntermediateCatchEvent': 'Append SignalIntermediateCatchEvent',
    'Append compensation activity': 'Append compensation activity',
    'Append EndEvent': 'Append EndEvent',
    'Append Gateway': 'Append Gateway',
    'Append Task': 'Append Task',
    'Append Intermediate/Boundary Event': 'Append Intermediate/Boundary Event',
    'Change type': 'Change type',
    'Connect using Association': 'Connect using Association',
    'Connect using Sequence/MessageFlow or Association': 'Connect using Sequence/MessageFlow or Association',
    'Connect using DataInputAssociation': 'Connect using DataInputAssociation',
    'Remove': 'Remove',
    'no shape type specified': 'no shape type specified',
    'out of bounds release': 'out of bounds release',
    'more than {count} child lanes': 'more than {count} child lanes',
    'element required': 'element required',
    'no parent for {element} in {parent}': 'no parent for {element} in {parent}',
    'Create {type}': 'Create {type}',
    'Activate the hand tool': 'Activate the hand tool',
    'Activate the lasso tool': 'Activate the lasso tool',
    'Activate the create/remove space tool': 'Activate the create/remove space tool',
    'Activate the global connect tool': 'Activate the global connect tool',
    'Create StartEvent': 'Create StartEvent',
    'Create Intermediate/Boundary Event': 'Create Intermediate/Boundary Event',
    'Create EndEvent': 'Create EndEvent',
    'Create Gateway': 'Create Gateway',
    'Create Task': 'Create Task',
    'Create DataObjectReference': 'Create DataObjectReference',
    'Create DataStoreReference': 'Create DataStoreReference',
    'Create expanded SubProcess': 'Create expanded SubProcess',
    'Create Pool/Participant': 'Create Pool/Participant',
    'Create Group': 'Create Group',
    'Parallel Multi Instance': 'Parallel Multi Instance',
    'Sequential Multi Instance': 'Sequential Multi Instance',
    'Loop': 'Loop',
    'Ad-hoc': 'Ad-hoc',
    'element {element} referenced by {referenced}#{property} not yet drawn': 'element {element} referenced by {referenced}#{property} not yet drawn',
    'unknown di {di} for element {semantic}': 'unknown di {di} for element {semantic}',
    'missing {semantic}#attachedToRef': 'missing {semantic}#attachedToRef',
    '{semantic}#{side} Ref not specified': '{semantic}#{side} Ref not specified',
    'already rendered {element}': 'already rendered {element}',
    'failed to import {element}': 'failed to import {element}',
    'multiple DI elements defined for {element}': 'multiple DI elements defined for {element}',
    'no bpmnElement referenced in {element}': 'no bpmnElement referenced in {element}',
    'diagram not part of bpmn:Definitions': 'diagram not part of bpmn:Definitions',
    'no diagram to display': 'no diagram to display',
    'no process or collaboration to display': 'no process or collaboration to display',
    'correcting missing bpmnElement on {plane} to {rootElement}': 'correcting missing bpmnElement on {plane} to {rootElement}',
    'unsupported bpmnElement for {plane}: {rootElement}': 'unsupported bpmnElement for {plane}: {rootElement}',
    'unrecognized flowElement {element} in context {context}': 'unrecognized flowElement {element} in context {context}',
    'HELLO {you}!': 'HALLO {you}!'
});

/***/ }),

/***/ "./client/i18n-extension/languages/en/dmn-js.js":
/*!******************************************************!*\
  !*** ./client/i18n-extension/languages/en/dmn-js.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the translated strings used in the dmn-js component.
 * However, notice that these strings are currently not working. We are
 * still investigating how to apply them.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Activate the lasso tool': 'Activate the lasso tool',
    'Add Cell Description': 'Add Cell Description',
    'Add Input': 'Add Input',
    'Add Input Column Left': 'Add Input Column Left',
    'Add Input Column Right': 'Add Input Column Right',
    'Add Output': 'Add Output',
    'Add Output Column Left': 'Add Output Column Left',
    'Add Output Column Right': 'Add Output Column Right',
    'Add Predefined Values': 'Add Predefined Values',
    'Add Rule Above': 'Add Rule Above',
    'Add Rule Below': 'Add Rule Below',
    'Add Values': 'Add Values',
    'And': 'And',
    'Annotations': 'Annotations',
    'Append {type}': 'Append {type}',
    'cellInput': 'cellInput',
    'Change Cell Expression Language': 'Change Cell Expression Language',
    'Change type': 'Change type',
    'Clear predefined values.': 'Clear predefined values.',
    'Copy Input Column': 'Copy Input Column',
    'Copy Output Column': 'Copy Output Column',
    'Copy Rule': 'Copy Rule',
    'Create Decision': 'Create Decision',
    'Create Input Data': 'Create Input Data',
    'Create Knowledge Model': 'Create Knowledge Model',
    'Create Knowledge Source': 'Create Knowledge Source',
    'Cut Input Column': 'Cut Input Column',
    'Cut Output Column': 'Cut Output Column',
    'Cut Rule': 'Cut Rule',
    'Edit String': 'Edit String',
    'Expression': 'Expression',
    'Expression Language': 'Expression Language',
    'Input': 'Input',
    'Input Expression': 'Input Expression',
    'Input Label': 'Input Label',
    'Input Type': 'Input Type',
    'Input Values': 'Input Values',
    'Input Variable': 'Input Variable',
    'No values': 'No values',
    'Output Label': 'Output Label',
    'Output Name': 'Output Name',
    'Output Type': 'Output Type',
    'Output Values': 'Output Values',
    'Paste Input Column Left': 'Paste Input Column Left',
    'Paste Input Column Right': 'Paste Input Column Right',
    'Paste Output Column Left': 'Paste Output Column Left',
    'Paste Output Column Right': 'Paste Output Column Right',
    'Paste Rule Above': 'Paste Rule Above',
    'Paste Rule Below': 'Paste Rule Below',
    'Predefined Values': 'Predefined Values',
    'Remove': 'Remove',
    'Remove Cell Description': 'Remove Cell Description',
    'Remove Input Column': 'Remove Input Column',
    'Remove Output Column': 'Remove Output Column',
    'Remove Rule': 'Remove Rule',
    'Set Value': 'Set Value',
    'Strings must be in double quotes.': 'Strings must be in double quotes.',
    'Type': 'Type',
});

/***/ }),

/***/ "./client/i18n-extension/languages/en/other.js":
/*!*****************************************************!*\
  !*** ./client/i18n-extension/languages/en/other.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains translations that were used in other components.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Open minimap': 'Open minimap',
    'This maps to the process definition key.': 'This maps to the process definition key.',
    'Key': 'Key',
    'Intermediate Throw Event': 'Intermediate Throw Event',
    'End Event': 'End Event',
    'Message Start Event': 'Message Start Event',
    'Timer Start Event': 'Timer Start Event',
    'Conditional Start Event': 'Conditional Start Event',
    'Signal Start Event': 'Signal Start Event',
    'Expand (not reversible)': 'Expand (not reversible)',
    'ID': 'ID',
    'Start Event': 'Start Event',
    'Message End Event': 'Message End Event',
    'Escalation End Event': 'Escalation End Event',
    'Error End Event': 'Error End Event',
    'Compensation End Event': 'Compensation End Event',
    'Signal End Event': 'Signal End Event',
    'Terminate End Event': 'Terminate End Event',
    'Transaction': 'Transaction',
    'Event Sub Process': 'Event Sub Process',
    'Sub Process (collapsed)': 'Sub Process (collapsed)',
    'Close minimap': 'Close minimap',
    'Message Intermediate Catch Event': 'Message Intermediate Catch Event',
    'Message Intermediate Throw Event': 'Message Intermediate Throw Event',
    'Timer Intermediate Catch Event': 'Timer Intermediate Catch Event',
    'Escalation Intermediate Throw Event': 'Escalation Intermediate Throw Event',
    'Conditional Intermediate Catch Event': 'Conditional Intermediate Catch Event',
    'Link Intermediate Catch Event': 'Link Intermediate Catch Event',
    'Link Intermediate Throw Event': 'Link Intermediate Throw Event',
    'Compensation Intermediate Throw Event': 'Compensation Intermediate Throw Event',
    'Signal Intermediate Catch Event': 'Signal Intermediate Catch Event',
    'Signal Intermediate Throw Event': 'Signal Intermediate Throw Event',
    'Parallel Gateway': 'Parallel Gateway',
    'Inclusive Gateway': 'Inclusive Gateway',
    'Complex Gateway': 'Complex Gateway',
    'Event based Gateway': 'Event based Gateway',
    'Exclusive Gateway': 'Exclusive Gateway',
    'Send Task': 'Send Task',
    'Receive Task': 'Receive Task',
    'User Task': 'User Task',
    'Manual Task': 'Manual Task',
    'Business Rule Task': 'Business Rule Task',
    'Service Task': 'Service Task',
    'Script Task': 'Script Task',
    'Call Activity': 'Call Activity',
    'Sub Process (expanded)': 'Sub Process (expanded)',
    'Sub Process': 'Sub Process',
    'Task': 'Task',
    'This maps to the task definition key.': 'This maps to the task definition key.',
    'Collapsed Pool': 'Collapsed Pool',
    'Expanded Pool': 'Expanded Pool',
    'flow elements must be children of pools/participants': 'flow elements must be children of pools/participants',
    'The follow up date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)': 'The follow up date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)',
    'Message Boundary Event': 'Message Boundary Event',
    'Timer Boundary Event': 'Timer Boundary Event',
    'Escalation Boundary Event': 'Escalation Boundary Event',
    'Conditional Boundary Event': 'Conditional Boundary Event',
    'Error Boundary Event': 'Error Boundary Event',
    'Cancel Boundary Event': 'Cancel Boundary Event',
    'Signal Boundary Event': 'Signal Boundary Event',
    'Compensation Boundary Event': 'Compensation Boundary Event',
    'Message Boundary Event (non-interrupting)': 'Message Boundary Event (non-interrupting)',
    'Timer Boundary Event (non-interrupting)': 'Timer Boundary Event (non-interrupting)',
    'Escalation Boundary Event (non-interrupting)': 'Escalation Boundary Event (non-interrupting)',
    'Conditional Boundary Event (non-interrupting)': 'Conditional Boundary Event (non-interrupting)',
    'Signal Boundary Event (non-interrupting)': 'Signal Boundary Event (non-interrupting)',
    'Connect using Information/Knowledge/Authority Requirement or Association': 'Connect using Information/Knowledge/Authority Requirement or Association',
    'Empty': 'Empty',
    'Literal Expression': 'Literal Expression',
    'This maps to the decision definition key.': 'This maps to the decision definition key.',
    'Decision Table': 'Decision Table',
    'Output': 'Output',
    'Annotation': 'Annotation',
    'Output Expression': 'Output Expression',
    'Data Type': 'Data Type'
});

/***/ }),

/***/ "./client/i18n-extension/languages/en/properties-panel.js":
/*!****************************************************************!*\
  !*** ./client/i18n-extension/languages/en/properties-panel.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the translations used by the bpmn-js-properties-panel component.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Activity Ref': 'Activity Ref',
    'Add Constraint': 'Add Constraint',
    'Add Entry': 'Add Entry',
    'Add Property': 'Add Property',
    'Add Value': 'Add Value',
    'All': 'All',
    'Assignee': 'Assignee',
    'assignment': 'assignment',
    'Asynchronous After': 'Asynchronous After',
    'Asynchronous Before': 'Asynchronous Before',
    'Asynchronous Continuations': 'Asynchronous Continuations',
    'Binding': 'Binding',
    'Business Key': 'Business Key',
    'Business Key Expression': 'Business Key Expression',
    'CallActivity Type': 'CallActivity Type',
    'Called Element': 'Called Element',
    'Candidate Groups': 'Candidate Groups',
    'Candidate Starter Configuration': 'Candidate Starter Configuration',
    'Candidate Starter Groups': 'Candidate Starter Groups',
    'Candidate Starter Users': 'Candidate Starter Users',
    'Candidate Users': 'Candidate Users',
    'Case Ref': 'Case Ref',
    'Category Value': 'Category Value',
    'Class': 'Class',
    'Collection': 'Collection',
    'complete': 'complete',
    'Completion Condition': 'Completion Condition',
    'Condition': 'Condition',
    'Condition Type': 'Condition Type',
    'Config': 'Config',
    'Configure Connector': 'Configure Connector',
    'Connector': 'Connector',
    'Connector Id': 'Connector Id',
    'create': 'create',
    'Custom Fields': 'Custom Fields',
    'Custom Fields for scope: ': 'Custom Fields for scope: ',
    'Cycle': 'Cycle',
    'Date': 'Date',
    'Decision Ref': 'Decision Ref',
    'Default Value': 'Default Value',
    'Delegate Expression': 'Delegate Expression',
    'Delegate Variable Mapping': 'Delegate Variable Mapping',
    'delete': 'delete',
    'deployment': 'deployment',
    'Details': 'Details',
    'DMN': 'DMN',
    'Documentation': 'Documentation',
    'Due Date': 'Due Date',
    'Duration': 'Duration',
    'Element Documentation': 'Element Documentation',
    'Element must have an unique id.': 'Element must have an unique id.',
    'Element Template': 'Element Template',
    'Element Variable': 'Element Variable',
    'end': 'end',
    'Error': 'Error',
    'Error Code': 'Error Code',
    'Error Code Variable': 'Error Code Variable',
    'Error Message': 'Error Message',
    'Error Message Variable': 'Error Message Variable',
    'Error Name': 'Error Name',
    'Escalation': 'Escalation',
    'Escalation Code': 'Escalation Code',
    'Escalation Code Variable': 'Escalation Code Variable',
    'Escalation Name': 'Escalation Name',
    'Event Type': 'Event Type',
    'Exclusive': 'Exclusive',
    'Executable': 'Executable',
    'Execution Listener': 'Execution Listener',
    'Expression': 'Expression',
    'Extensions': 'Extensions',
    'External': 'External',
    'External Resource': 'External Resource',
    'External Task Configuration': 'External Task Configuration',
    'Field Injection': 'Field Injection',
    'Field Injections': 'Field Injections',
    'Fields': 'Fields',
    'Follow Up Date': 'Follow Up Date',
    'Form Field': 'Form Field',
    'Form Fields': 'Form Fields',
    'Form Key': 'Form Key',
    'Forms': 'Forms',
    'General': 'General',
    'History Configuration': 'History Configuration',
    'History Time To Live': 'History Time To Live',
    'Id': 'Id',
    'ID (process variable name)': 'ID (process variable name)',
    'Id must be a valid QName.': 'Id must be a valid QName.',
    'Id must not contain prefix.': 'Id must not contain prefix.',
    'Id must not contain spaces.': 'Id must not contain spaces.',
    'Implementation': 'Implementation',
    'Initiator': 'Initiator',
    'Inline Script': 'Inline Script',
    'In Mapping': 'In Mapping',
    'Input/Output': 'Input/Output',
    'Input Parameter': 'Input Parameter',
    'Input Parameters': 'Input Parameters',
    'Java Class': 'Java Class',
    'Job Configuration': 'Job Configuration',
    'Job Priority': 'Job Priority',
    'Label': 'Label',
    'latest': 'latest',
    'Link Name': 'Link Name',
    'List': 'List',
    'Listener Id': 'Listener Id',
    'Listeners': 'Listeners',
    'Listener Type': 'Listener Type',
    'Local': 'Local',
    'Loop Cardinality': 'Loop Cardinality',
    'Map': 'Map',
    'Map Decision Result': 'Map Decision Result',
    'Mapping must have a target': 'Mapping must have a target',
    'Mapping must have a value': 'Mapping must have a value',
    'Mapping must have a {value}': 'Mapping must have a {value}',
    'Message': 'Message',
    'Message Name': 'Message Name',
    'Multi Instance ': 'Multi Instance ',
    'Multi Instance': 'Multi Instance',
    'Must configure Connector': 'Must configure Connector',
    'Must have max length {length}': 'Must have max length {length}',
    'Must have min length {length}': 'Must have min length {length}',
    'Must match pattern {pattern}': 'Must match pattern {pattern}',
    'Must not be empty': 'Must not be empty',
    'Must provide a value': 'Must provide a value',
    'Must provide a value for timeout task listener': 'Must provide a value for timeout task listener',
    'Must provide either loop cardinality or collection': 'Must provide either loop cardinality or collection',
    'Name': 'Name',
    'Name must not contain spaces': 'Name must not contain spaces',
    'Out Mapping': 'Out Mapping',
    'Output Parameter': 'Output Parameter',
    'Output Parameters': 'Output Parameters',
    'Parameter must have a name': 'Parameter must have a name',
    'Parameters': 'Parameters',
    'Priority': 'Priority',
    'Process Documentation': 'Process Documentation',
    'Process Id': 'Process Id',
    'Process Name': 'Process Name',
    'Properties': 'Properties',
    'Resource': 'Resource',
    'Result Variable': 'Result Variable',
    'Retry Time Cycle': 'Retry Time Cycle',
    'Script': 'Script',
    'Script Format': 'Script Format',
    'Script Type': 'Script Type',
    'Signal': 'Signal',
    'Signal Name': 'Signal Name',
    'Source': 'Source',
    'Source Expression': 'Source Expression',
    'Specify more than one group as a comma separated list.': 'Specify more than one group as a comma separated list.',
    'Specify more than one user as a comma separated list.': 'Specify more than one user as a comma separated list.',
    'Specify more than one variable change event as a comma separated list.': 'Specify more than one variable change event as a comma separated list.',
    'start': 'start',
    'Startable': 'Startable',
    'String': 'String',
    'take': 'take',
    'Target': 'Target',
    'Target must not contain whitespace': 'Target must not contain whitespace',
    'Tasklist Configuration': 'Tasklist Configuration',
    'Task Listener': 'Task Listener',
    'Task Priority': 'Task Priority',
    'Tenant Id': 'Tenant Id',
    'Text': 'Text',
    'The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)': 'The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)',
    'timeout': 'timeout',
    'Timer Definition': 'Timer Definition',
    'Timer Definition Type': 'Timer Definition Type',
    'Topic': 'Topic',
    'Type': 'Type',
    'update': 'update',
    'Validation': 'Validation',
    'Value': 'Value',
    'Values': 'Values',
    'Variable Event': 'Variable Event',
    'Variable Name': 'Variable Name',
    'Variables': 'Variables',
    'version': 'version',
    'Version': 'Version',
    'versionTag': 'versionTag',
    'Version Tag': 'Version Tag',
    'Wait for Completion': 'Wait for Completion',
    '[unknown template: {templateId}]': '[unknown template: {templateId}]',
    '{label} must not contain whitespace': '{label} darf keine Leerzeichen enthalten'
});

/***/ }),

/***/ "./client/i18n-extension/languages/pt-br.js":
/*!**************************************************!*\
  !*** ./client/i18n-extension/languages/pt-br.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pt_br_bpmn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pt-br/bpmn-js */ "./client/i18n-extension/languages/pt-br/bpmn-js.js");
/* harmony import */ var _pt_br_dmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pt-br/dmn-js */ "./client/i18n-extension/languages/pt-br/dmn-js.js");
/* harmony import */ var _pt_br_properties_panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pt-br/properties-panel */ "./client/i18n-extension/languages/pt-br/properties-panel.js");
/* harmony import */ var _pt_br_other__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pt-br/other */ "./client/i18n-extension/languages/pt-br/other.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * Joins and exports the translated strings.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  ..._pt_br_bpmn_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  ..._pt_br_dmn_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  ..._pt_br_properties_panel__WEBPACK_IMPORTED_MODULE_2__["default"],
  ..._pt_br_other__WEBPACK_IMPORTED_MODULE_3__["default"]
});


/***/ }),

/***/ "./client/i18n-extension/languages/pt-br/bpmn-js.js":
/*!**********************************************************!*\
  !*** ./client/i18n-extension/languages/pt-br/bpmn-js.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the strings used in the bpmn-js module.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Append {type}': 'Adicionar {type}',
    'Add Lane above': 'Adicionar Raia acima',
    'Divide into two Lanes': 'Dividir em duas Raias',
    'Divide into three Lanes': 'Dividir em três Raias',
    'Add Lane below': 'Adicionar Raia abaixo',
    'Append ReceiveTask': 'Adicionar Atividade de Recebimento',
    'Append MessageIntermediateCatchEvent': 'Adicionar Evento Intermediário de Captura de Mensagem',
    'Append TimerIntermediateCatchEvent': 'Adicionar Evento Intermediário de Captura de Tempo',
    'Append ConditionIntermediateCatchEvent': 'Adicionar Evento Intermediário de Captura de Condição',
    'Append SignalIntermediateCatchEvent': 'Adicionar Evento Intermediário de Captura de Sinal',
    'Append compensation activity': 'Adicionar atividade de compensação',
    'Append EndEvent': 'Adicionar Evento Final',
    'Append Gateway': 'Adicionar Gateway',
    'Append Task': 'Adicionar Atividade',
    'Append Intermediate/Boundary Event': 'Adicionar Evento Intermediário ou de Borda',
    'Change type': 'Mudar tipo',
    'Connect using Association': 'Conectar usando Associação',
    'Connect using Sequence/MessageFlow or Association': 'Conectar usando Sequência/Fluxo de Mensagem, ou Associação',
    'Connect using DataInputAssociation': 'Conectar usando Associacao de Entrada de Dados',
    'Remove': 'Remover',
    'no shape type specified': 'nenhum tipo de forma especificado',
    'out of bounds release': 'solto fora da região delimitada',
    'more than {count} child lanes': 'mais que {count} raias filhas',
    'element required': 'elemento necessário',
    'no parent for {element} in {parent}': 'sem elemento pai para {element} em {parent}',
    'Create {type}': 'Criar {type}',
    'Activate the hand tool': 'Ativar ferramenta mão',
    'Activate the lasso tool': 'Ativar ferramenta laço',
    'Activate the create/remove space tool': 'Ativar ferramenta para criar/remover espaço',
    'Activate the global connect tool': 'Ativar ferramenta de conexão global',
    'Create StartEvent': 'Criar Evento de Início',
    'Create Intermediate/Boundary Event': 'Criar Evento Intermediário ou de Borda',
    'Create EndEvent': 'Criar Evento Final',
    'Create Gateway': 'Criar Gateway',
    'Create Task': 'Criar Atividade',
    'Create DataObjectReference': 'Criar Referência à Objeto de Dados',
    'Create DataStoreReference': 'Criar Referência à Armazenamento de Dados',
    'Create expanded SubProcess': 'Criar SubProcesso expandido',
    'Create Pool/Participant': 'Criar Piscina/Participante',
    'Create Group': 'Criar Grupo',
    'Parallel Multi Instance': 'Múltiplas Instâncias em Paralelo',
    'Sequential Multi Instance': 'Múltiplas Instâncias em Sequência',
    'Loop': 'Loop',
    'Ad-hoc': 'Ad-hoc',
    'element {element} referenced by {referenced}#{property} not yet drawn': 'elemento {element} referenciado por {referenced}#{property} ainda não renderizado',
    'unknown di {di} for element {semantic}': 'di desconhecido {di} para elemento {semantic}',
    'missing {semantic}#attachedToRef': 'faltando {semantic}#attachedToRef',
    '{semantic}#{side} Ref not specified': '{semantic}#{side} Ref não especificada',
    'already rendered {element}': 'já renderizado {element}',
    'failed to import {element}': 'falha ao importar {element}',
    'multiple DI elements defined for {element}': 'múltiplos elementos DI definidos para {element}',
    'no bpmnElement referenced in {element}': 'nenhum bpmnElement referenciado em {element}',
    'diagram not part of bpmn:Definitions': 'diagrama não faz parte de bpmn:Definitions',
    'no diagram to display': 'nenhum diagrama para exibir',
    'no process or collaboration to display': 'nenhum processo ou colaboração para exibir',
    'correcting missing bpmnElement on {plane} to {rootElement}': 'corrigindo bpmnElement faltando no {plane} para {rootElement}',
    'unsupported bpmnElement for {plane}: {rootElement}': 'bpmnElement não suportado para {plane}: {rootElement}',
    'unrecognized flowElement {element} in context {context}': 'flowElement não reconhecido {element} no contexto {context}',
    'HELLO {you}!': 'OLÁ {you}!'
});


/***/ }),

/***/ "./client/i18n-extension/languages/pt-br/dmn-js.js":
/*!*********************************************************!*\
  !*** ./client/i18n-extension/languages/pt-br/dmn-js.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the translated strings used in the dmn-js component.
 * However, notice that these strings are currently not working. We are
 * still investigating how to apply them.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Activate the lasso tool': 'Ativar ferramenta laço',
    'Add Cell Description': 'Adicionar Descrição da Célula',
    'Add Input': 'Adicionar Entrada',
    'Add Input Column Left': 'Adicionar Coluna de Entrada à Esquerda',
    'Add Input Column Right': 'Adicionar Coluna de Entrada à Direita',
    'Add Output': 'Adicionar Saída',
    'Add Output Column Left': 'Adicionar Coluna de Saída à Esquerda',
    'Add Output Column Right': 'Adicionar Coluna de Saída à Direita',
    'Add Predefined Values': 'Adicionar Valores Pré-Definidos',
    'Add Rule Above': 'Adicionar Regra Acima',
    'Add Rule Below': 'Adicionar Regra Abaixo',
    'Add Values': 'Adicionar Valores',
    'And': 'E',
    'Annotations': 'Anotações',
    'Append {type}': 'Adicionar {type}',
    'cellInput': 'célula de Entrada',
    'Change Cell Expression Language': 'Mudar Lingugem de Expressão da Célula',
    'Change type': 'Mudar tipo',
    'Clear predefined values.': 'Limpar valores pré-definidos.',
    'Copy Input Column': 'Copiar Coluna de Entrada',
    'Copy Output Column': 'Copiar Coluna de Saída',
    'Copy Rule': 'Copiar Regra',
    'Create Decision': 'Criar Decisão',
    'Create Input Data': 'Criar Dado de Entrada',
    'Create Knowledge Model': 'Criar Modelo de Conhecimento',
    'Create Knowledge Source': 'Criar Origem de Conhecimento',
    'Cut Input Column': 'Recortar Coluna de Entrada',
    'Cut Output Column': 'Recortar Coluna de Saída',
    'Cut Rule': 'Recortar Regra',
    'Edit String': 'Editar String',
    'Expression': 'Expressão',
    'Expression Language': 'Linguagem de Expressão',
    'Input': 'Entrada',
    'Input Expression': 'Expressão de Entrada',
    'Input Label': 'Rótulo de Entrada',
    'Input Type': 'Tipo de Entrada',
    'Input Values': 'Valores de Entrada',
    'Input Variable': 'Variável de Entrada',
    'No values': 'Sem valores',
    'Output Label': 'Rótulo de Saída',
    'Output Name': 'Nome de Saída',
    'Output Type': 'Tipo de Saída',
    'Output Values': 'Valores de Saída',
    'Paste Input Column Left': 'Colar Coluna de Entrada à Esquerda',
    'Paste Input Column Right': 'Colar Coluna de Entrada à Direita',
    'Paste Output Column Left': 'Colar Coluna de Saída à Esquerda',
    'Paste Output Column Right': 'Colar Coluna de Saída à Direita',
    'Paste Rule Above': 'Colar Regra Acima',
    'Paste Rule Below': 'Colar Regra Abaixo',
    'Predefined Values': 'Valores Pré-Definidos',
    'Remove': 'Remover',
    'Remove Cell Description': 'Remover Descrição da Célula',
    'Remove Input Column': 'Remover Coluna de Entrada',
    'Remove Output Column': 'Remover Coluna de Saída',
    'Remove Rule': 'Remover Regra',
    'Set Value': 'Definir Valor',
    'Strings must be in double quotes.': 'Strings devem estar em aspas duplas.',
    'Type': 'Tipo',
});


/***/ }),

/***/ "./client/i18n-extension/languages/pt-br/other.js":
/*!********************************************************!*\
  !*** ./client/i18n-extension/languages/pt-br/other.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains translations that were used in other components.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Open minimap': 'Abrir mini-mapa',
    'This maps to the process definition key.': 'Aponta para a chave de definição do processo.',
    'Key': 'Chave',
    'Intermediate Throw Event': 'Evento Intermediário de Lançamento',
    'End Event': 'Evento Final',
    'Message Start Event': 'Evento de Início de Mensagem',
    'Timer Start Event': 'Evento de Início de Tempo',
    'Conditional Start Event': 'Evento de Início Condicional',
    'Signal Start Event': 'Evento de Início de Sinal',
    'Expand (not reversible)': 'Expandir (não reversível)',
    'ID': 'ID',
    'Start Event': 'Evento de Início',
    'Message End Event': 'Evento Final de Mensagem',
    'Escalation End Event': 'Evento Final de Escalação',
    'Error End Event': 'Evento Final de Erro',
    'Compensation End Event': 'Evento Final de Compensação',
    'Signal End Event': 'Evento Final de Sinal',
    'Terminate End Event': 'Evento Final de Terminação',
    'Transaction': 'Transação',
    'Event Sub Process': 'Evento de SubProcesso',
    'Sub Process (collapsed)': 'SubProcesso (colapsado)',
    'Close minimap': 'Fechar mini-mapa',
    'Message Intermediate Catch Event': 'Evento Intermediário de Captura de Mensagem',
    'Message Intermediate Throw Event': 'Evento Intermediário de Lançamento de Mensagem',
    'Timer Intermediate Catch Event': 'Evento Intermediário de Captura de Tempo',
    'Escalation Intermediate Throw Event': 'Evento Intermediário de Lançamento de Escalação',
    'Conditional Intermediate Catch Event': 'Evento Intermediário de Captura de Condição',
    'Link Intermediate Catch Event': 'Evento Intermediário de Captura de Link',
    'Link Intermediate Throw Event': 'Evento Intermediário de Lançamento de Línk',
    'Compensation Intermediate Throw Event': 'Evento Intermediário de Lançamento de Compensação',
    'Signal Intermediate Catch Event': 'Evento Intermediário de Captura de Sinal',
    'Signal Intermediate Throw Event': 'Evento Intermediário de Lançamento de Sinal',
    'Parallel Gateway': 'Gateway Paralelo',
    'Inclusive Gateway': 'Gateway Inclusivo',
    'Complex Gateway': 'Gateway Complexo',
    'Event based Gateway': 'Gateway de Evento',
    'Exclusive Gateway': 'Gateway Exclusivo',
    'Send Task': 'Atividade de Envio de Mensagem',
    'Receive Task': 'Atividade de Recebimento de Mensagem',
    'User Task': 'Atividade de Usuário',
    'Manual Task': 'Atividade Manual',
    'Business Rule Task': 'Atividade de Regra de Negócios',
    'Service Task': 'Atividade de Serviço',
    'Script Task': 'Atividade de Script',
    'Call Activity': 'Atividade de Chamada',
    'Sub Process (expanded)': 'Sub Processo (expandido)',
    'Sub Process': 'Sub Processo',
    'Task': 'Atividade',
    'This maps to the task definition key.': 'Aponta para a chave de definição da atividade.',
    'Collapsed Pool': 'Piscina Colapsada',
    'Expanded Pool': 'Piscina Expandida',
    'flow elements must be children of pools/participants': 'elementos do fluxo devem ser filhos de piscina/participante',
    'The follow up date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)': 'A data de acompanhamento é uma expressão EL (por exemplo: ${someDate} ou uma data ISO (por exemplo: 2015-06-26T09:54:00)',
    'Message Boundary Event': 'Evento de Borda de Mensagem',
    'Timer Boundary Event': 'Evento de Borda de Tempo',
    'Escalation Boundary Event': 'Evento de Borda de Escalação',
    'Conditional Boundary Event': 'Evento de Borda Condicional',
    'Error Boundary Event': 'Evento de Borda de Erro',
    'Cancel Boundary Event': 'Evento de Borda de Cancelamento',
    'Signal Boundary Event': 'Evento de Borda de Sinal',
    'Compensation Boundary Event': 'Evento de Borda de Compensação',
    'Message Boundary Event (non-interrupting)': 'Evento de Borda de Mensagem (sem interrupção)',
    'Timer Boundary Event (non-interrupting)': 'Evento de Borda de Tempo (sem interrupção)',
    'Escalation Boundary Event (non-interrupting)': 'Evento de Borda de Escalação (sem interrupção)',
    'Conditional Boundary Event (non-interrupting)': 'Evento de Borda Condicional (sem interrupção)',
    'Signal Boundary Event (non-interrupting)': 'Evento de Borda de Sinal (sem interrupção)',
    'Connect using Information/Knowledge/Authority Requirement or Association': 'Conecte usando Requerimento de Informação/Conhecimento/Autoridade ou Associação',
    'Empty': 'Vazio',
    'Literal Expression': 'Expressão Literal',
    'This maps to the decision definition key.': 'Aponta para a chave de definicão da decisão.',
    'Decision Table': 'Tabela de Decisão',
    'Output': 'Saída',
    'Annotation': 'Anotação',
    'Output Expression': 'Expressão de Saída',
    'Data Type': 'Tipo de Dado'
});


/***/ }),

/***/ "./client/i18n-extension/languages/pt-br/properties-panel.js":
/*!*******************************************************************!*\
  !*** ./client/i18n-extension/languages/pt-br/properties-panel.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file contains the translations used by the bpmn-js-properties-panel component.
 */
/* harmony default export */ __webpack_exports__["default"] = ({
    'Activity Ref': 'Ref Atividade',
    'Add Constraint': 'Adicionar Restrição',
    'Add Entry': 'Adicionar Registro',
    'Add Property': 'Adicionar Propriedade',
    'Add Value': 'Adicionar Valor',
    'All': 'Tudo',
    'Assignee': 'Usuário Atribuído',
    'assignment': 'atribuição de usuário',
    'Asynchronous After': 'Assíncrono Após',
    'Asynchronous Before': 'Assíncrono Antes',
    'Asynchronous Continuations': 'Continuação Assíncrona',
    'Binding': 'Vínculo',
    'Business Key': 'Chave de Negócios',
    'Business Key Expression': 'Expressão da Chave de Negócios',
    'CallActivity Type': 'Tipo de Chamada de Atividade',
    'Called Element': 'Elemento Chamado',
    'Candidate Groups': 'Grupos Candidatos',
    'Candidate Starter Configuration': 'Configuração de Candidatos de Início',
    'Candidate Starter Groups': 'Grupos Candidatos de Início',
    'Candidate Starter Users': 'Usuários Candidatos de Início',
    'Candidate Users': 'Usuários Candidatos',
    'Case Ref': 'Ref Caso',
    'Category Value': 'Valor de Categoria',
    'Class': 'Classe',
    'Collection': 'Coleção',
    'complete': 'concluído',
    'Completion Condition': 'Condição de Conclusão',
    'Condition': 'Condição',
    'Condition Type': 'Tipo de Condição',
    'Config': 'Configuração',
    'Configure Connector': 'Configuração de Conector',
    'Connector': 'Conector',
    'Connector Id': 'Id Conector',
    'create': 'criar',
    'Custom Fields': 'Campos Customizados',
    'Custom Fields for scope: ': 'Campos Customizados para escopo: ',
    'Cycle': 'Ciclo',
    'Date': 'Data',
    'Decision Ref': 'Ref Decisão',
    'Default Value': 'Valor Padrão',
    'Delegate Expression': 'Expressão Delegada',
    'Delegate Variable Mapping': 'Mapeamento de Variáveis Delegadas',
    'delete': 'apagar',
    'deployment': 'implantação',
    'Details': 'Detalhes',
    'DMN': 'DMN',
    'Documentation': 'Documentação',
    'Due Date': 'Data de Vencimento',
    'Duration': 'Duração',
    'Element Documentation': 'Documentação do Elemento',
    'Element must have an unique id.': 'Elemento deve ter um id único.',
    'Element Template': 'Modelo de Elemento',
    'Element Variable': 'Variável de Elemento',
    'end': 'fim',
    'Error': 'Erro',
    'Error Code': 'Código do Erro',
    'Error Code Variable': 'Variável do Código de Erro',
    'Error Message': 'Mensagem de Erro',
    'Error Message Variable': 'Variável da Mensagem de Erro',
    'Error Name': 'Nome do Erro',
    'Escalation': 'Escalação',
    'Escalation Code': 'Código da Escalação',
    'Escalation Code Variable': 'Variável do Código de Escalação',
    'Escalation Name': 'Nome da Escalação',
    'Event Type': 'Tipo de Evento',
    'Exclusive': 'Exclusivo',
    'Executable': 'Executável',
    'Execution Listener': 'Listener de Execução',
    'Expression': 'Expressão',
    'Extensions': 'Extensões',
    'External': 'Externo',
    'External Resource': 'Recurso Externo',
    'External Task Configuration': 'Configuração de Tarefas Externas',
    'Field Injection': 'Injeção de Campo',
    'Field Injections': 'Injeção de Campos',
    'Fields': 'Campos',
    'Follow Up Date': 'Data de Acompanhamento',
    'Form Field': 'Campo de Formulário',
    'Form Fields': 'Campos de Formulário',
    'Form Key': 'Chave do Formulário',
    'Forms': 'Formulários',
    'General': 'Geral',
    'History Configuration': 'Configuração de Histórico',
    'History Time To Live': 'Tempo de Expiração do Histórico',
    'Id': 'Id',
    'ID (process variable name)': 'ID (nome da variável de processo)',
    'Id must be a valid QName.': 'Id deve ser um QName válido.',
    'Id must not contain prefix.': 'Id não deve conter prefixo.',
    'Id must not contain spaces.': 'Id não deve conter espaços.',
    'Implementation': 'Implementação',
    'Initiator': 'Iniciador',
    'Inline Script': 'Script Inline',
    'In Mapping': 'Mapeamento de Entrada',
    'Input/Output': 'Entrada/Saída',
    'Input Parameter': 'Parâmetro de Entrada',
    'Input Parameters': 'Parâmetros de Entrada',
    'Java Class': 'Classe Java',
    'Job Configuration': 'Configuração de Execução de Tarefa',
    'Job Priority': 'Prioridade de Execução de Tarefa',
    'Label': 'Rótulo',
    'latest': 'mais recente',
    'Link Name': 'Nome do Link',
    'List': 'Lista',
    'Listener Id': 'Id do Listener',
    'Listeners': 'Listeners',
    'Listener Type': 'Tipo do Listener',
    'Local': 'Local',
    'Loop Cardinality': 'Cardinalidade do Loop',
    'Map': 'Mapa',
    'Map Decision Result': 'Mapa de Resultado de Decisão',
    'Mapping must have a target': 'Mapeamento deve ter um destino',
    'Mapping must have a value': 'Mapeamento deve ter um valor',
    'Mapping must have a {value}': 'Mapeamento deve ter um {value}',
    'Message': 'Mensagem',
    'Message Name': 'Nome da Mensagem',
    'Multi Instance ': 'Múltiplas Instâncias ',
    'Multi Instance': 'Múltiplas Instâncias',
    'Must configure Connector': 'É necessário configurar o Conector',
    'Must have max length {length}': 'Deve ter tamanho máximo {length}',
    'Must have min length {length}': 'Deve ter tamanho mínimo {length}',
    'Must match pattern {pattern}': 'Deve ser match com padrão {pattern}',
    'Must not be empty': 'Não pode ser vazio',
    'Must provide a value': 'É necessário fornecer um valor',
    'Must provide a value for timeout task listener': 'É necessário fornecer um valor de timeout para o listener de atividade',
    'Must provide either loop cardinality or collection': 'É necessário fornecer a cardinalidade do loop ou coleção',
    'Name': 'Nome',
    'Name must not contain spaces': 'Nome não deve conter espaços',
    'Out Mapping': 'Mapeamento de Saída',
    'Output Parameter': 'Parâmetro de Saída',
    'Output Parameters': 'Parâmetros de Saída',
    'Parameter must have a name': 'Parâmetro deve ter um nome',
    'Parameters': 'Parâmetros',
    'Priority': 'Prioridade',
    'Process Documentation': 'Documentação do Processo',
    'Process Id': 'Id do Processo',
    'Process Name': 'Nome do Processo',
    'Properties': 'Propriedades',
    'Resource': 'Recurso',
    'Result Variable': 'Variável de Resultado',
    'Retry Time Cycle': 'Tempo para Tentar Novamente',
    'Script': 'Script',
    'Script Format': 'Formato do Script',
    'Script Type': 'Tipo do Script',
    'Signal': 'Sinal',
    'Signal Name': 'Nome do Sinal',
    'Source': 'Origem',
    'Source Expression': 'Expressão da Origem',
    'Specify more than one group as a comma separated list.': 'Especifique mais de um grupo numa lista separada por vírgulas.',
    'Specify more than one user as a comma separated list.': 'Especifique mais de um usuário numa lista separada por vírgulas.',
    'Specify more than one variable change event as a comma separated list.': 'Especifique mais de um evento de mudança de variável numa lista separada por vírgulas.',
    'start': 'início',
    'Startable': 'Iniciável',
    'String': 'String',
    'take': 'escolher',
    'Target': 'Destino',
    'Target must not contain whitespace': 'Destino não pode conter espaços',
    'Tasklist Configuration': 'Configuração de Lista de Tarefas',
    'Task Listener': 'Listener da Atividade',
    'Task Priority': 'Prioridade da Atividade',
    'Tenant Id': 'Id do Tenant',
    'Text': 'Texto',
    'The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)': 'A data de vencimento é uma expressão EL (por exemplo: ${someDate} ou uma data ISO (por exemplo: 2015-06-26T09:54:00)',
    'timeout': 'tempo de expiração',
    'Timer Definition': 'Definição de Tempo',
    'Timer Definition Type': 'Tipo de Definição de Tempo',
    'Topic': 'Tópico',
    'Type': 'Tipo',
    'update': 'atualizar',
    'Validation': 'Validação',
    'Value': 'Valor',
    'Values': 'Valores',
    'Variable Event': 'Evento Variável',
    'Variable Name': 'Nome Variável',
    'Variables': 'Variáveis',
    'version': 'versão',
    'Version': 'Versão',
    'versionTag': 'rótulo de versão',
    'Version Tag': 'Rótulo de Versão',
    'Wait for Completion': 'Esperar por Conclusão',
    '[unknown template: {templateId}]': '[modelo desconhecido: {templateId}]',
    '{label} must not contain whitespace': '{label} não deve conter espaços'
});


/***/ }),

/***/ "./client/i18n-extension/translate.js":
/*!********************************************!*\
  !*** ./client/i18n-extension/translate.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Translator; });
/* harmony import */ var _configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../configuration */ "./client/configuration/index.js");
/* harmony import */ var _languages_de_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./languages/de.js */ "./client/i18n-extension/languages/de.js");
/* harmony import */ var _languages_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./languages/en.js */ "./client/i18n-extension/languages/en.js");
/* harmony import */ var _languages_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./languages/pt-br.js */ "./client/i18n-extension/languages/pt-br.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * All available languages.
 */
const languages = {
    de: _languages_de_js__WEBPACK_IMPORTED_MODULE_1__["default"], en: _languages_en_js__WEBPACK_IMPORTED_MODULE_2__["default"], pt_br: _languages_pt_br_js__WEBPACK_IMPORTED_MODULE_3__["default"]
};

// The default language to use if none is specified in the configuration
const defaultLanguage = "en";

// The key in the configuration that specifies the language
const CONFIG_KEY = "editor_language";

// The events to listen to / send
const I18N_EVENT = "i18n.changed";
const MENU_EVENT = "language.changed";
const INIT_ACTION = "editorActions.init";
const SELECTION_EVENT = "selection.changed";

// Contains all missing translations discovered to prevent logging them
// multiple times.
const missing = [];

/**
 * This function initializes the translation plugin.
 *
 * @param eventBus The application's event bus
 * @return The translator function
 */
function Translator(eventBus) {
    let currentLanguage = languages[defaultLanguage];

    // Read the language from configuration
    _configuration__WEBPACK_IMPORTED_MODULE_0__["config"].get(CONFIG_KEY).then((language) => {

        // Check if the specified language exists
        if (languages[language] && language !== defaultLanguage) {

            // Set the language as current
            currentLanguage = languages[language];

            // Notify parts of the application that the language has changed. Triggers a re-rendering.
            eventBus.fire(I18N_EVENT);
            eventBus.fire(SELECTION_EVENT, {newSelection: []});
        }
    });

    // After the editor has initialized, register the menu listeners
    eventBus.on(INIT_ACTION, function (event) {
        const editorActions = event.editorActions;
        editorActions.register(MENU_EVENT, function (language) {

            // Persist the new language
            _configuration__WEBPACK_IMPORTED_MODULE_0__["config"].set(CONFIG_KEY, language);

            // Set the language as above
            currentLanguage = languages[language];
            eventBus.fire(I18N_EVENT);
            eventBus.fire(SELECTION_EVENT, {newSelection: []});
        });
    });

    // Return the translation function. It takes the template string and the parameters,
    // translates it and returns it.
    return (template, parameters) => {

        // If the requested string is not available in the current language
        if (!currentLanguage[template]) {
            // Check if it was already printed to the console
            if (missing.indexOf(template) === -1) {
                // Print the missing translation to the console ´
                console.log("Missing translation: " + template, parameters);
                missing.push(template);
            }
        }

        // Use the translated string or the original template string as fallback
        const translation = currentLanguage[template] || template;

        // Replace all parameters in the template string with the provided values
        return translation.replace(/{([^}]+)}/g, function (_, key) {
            return (parameters || {})[key] || '{' + key + '}';
        });
    };
};

// Specify what values should be injected into the function above
Translator.$inject = ['eventBus'];


/***/ }),

/***/ "./client/index.js":
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var _i18n_extension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./i18n-extension */ "./client/i18n-extension/index.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */





// Register plugin for the BPMN part
Object(camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__["registerBpmnJSPlugin"])(_i18n_extension__WEBPACK_IMPORTED_MODULE_1__["default"]);

// Register plugin for the DMN part
Object(camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__["registerDmnJSPlugin"])(_i18n_extension__WEBPACK_IMPORTED_MODULE_1__["default"], ['drd','decisionTable','literalExpression']);

/***/ }),

/***/ "./client/utils/generate-id.js":
/*!*************************************!*\
  !*** ./client/utils/generate-id.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return generateId; });
/* harmony import */ var ids__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ids */ "./node_modules/ids/dist/index.esm.js");
/**
 * Copyright 2020 FlowSquad GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * The ids to use.
 */
const ids = new ids__WEBPACK_IMPORTED_MODULE_0__["default"]([ 32, 36, 1 ]);

/**
 * Generates a new id.
 *
 * @return The new id
 */
function generateId() {
    return ids.next();
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/*! exports provided: registerClientPlugin, registerClientExtension, registerBpmnJSPlugin, registerBpmnJSModdleExtension, registerDmnJSModdleExtension, registerDmnJSPlugin, getModelerDirectory, getPluginsDirectory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerClientPlugin", function() { return registerClientPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerClientExtension", function() { return registerClientExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerBpmnJSPlugin", function() { return registerBpmnJSPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerBpmnJSModdleExtension", function() { return registerBpmnJSModdleExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerDmnJSModdleExtension", function() { return registerDmnJSModdleExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerDmnJSPlugin", function() { return registerDmnJSPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getModelerDirectory", function() { return getModelerDirectory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPluginsDirectory", function() { return getPluginsDirectory; });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a client plugin.
 *
 * @param {import('react').ComponentType} extension
 *
 * @example
 *
 * import MyExtensionComponent from './MyExtensionComponent';
 *
 * registerClientExtension(MyExtensionComponent);
 */
function registerClientExtension(component) {
  registerClientPlugin(component, 'client');
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerDmnJSModdleExtension(moddleDescriptor);
 */
function registerDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.modeler.${c}.additionalModules`)); 
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/ids/dist/index.esm.js":
/*!********************************************!*\
  !*** ./node_modules/ids/dist/index.esm.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hat_1 = createCommonjsModule(function (module) {
var hat = module.exports = function (bits, base) {
    if (!base) base = 16;
    if (bits === undefined) bits = 128;
    if (bits <= 0) return '0';
    
    var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
    for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
    }
    
    var rem = digits - Math.floor(digits);
    
    var res = '';
    
    for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
    }
    
    if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
    }
    
    var parsed = parseInt(res, base);
    if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base)
    }
    else return res;
};

hat.rack = function (bits, base, expandBy) {
    var fn = function (data) {
        var iters = 0;
        do {
            if (iters ++ > 10) {
                if (expandBy) bits += expandBy;
                else throw new Error('too many ID collisions, use more bits')
            }
            
            var id = hat(bits, base);
        } while (Object.hasOwnProperty.call(hats, id));
        
        hats[id] = data;
        return id;
    };
    var hats = fn.hats = {};
    
    fn.get = function (id) {
        return fn.hats[id];
    };
    
    fn.set = function (id, value) {
        fn.hats[id] = value;
        return fn;
    };
    
    fn.bits = bits || 128;
    fn.base = base || 16;
    return fn;
};
});

/**
 * Create a new id generator / cache instance.
 *
 * You may optionally provide a seed that is used internally.
 *
 * @param {Seed} seed
 */

function Ids(seed) {
  if (!(this instanceof Ids)) {
    return new Ids(seed);
  }

  seed = seed || [128, 36, 1];
  this._seed = seed.length ? hat_1.rack(seed[0], seed[1], seed[2]) : seed;
}
/**
 * Generate a next id.
 *
 * @param {Object} [element] element to bind the id to
 *
 * @return {String} id
 */

Ids.prototype.next = function (element) {
  return this._seed(element || true);
};
/**
 * Generate a next id with a given prefix.
 *
 * @param {Object} [element] element to bind the id to
 *
 * @return {String} id
 */


Ids.prototype.nextPrefixed = function (prefix, element) {
  var id;

  do {
    id = prefix + this.next(true);
  } while (this.assigned(id)); // claim {prefix}{random}


  this.claim(id, element); // return

  return id;
};
/**
 * Manually claim an existing id.
 *
 * @param {String} id
 * @param {String} [element] element the id is claimed by
 */


Ids.prototype.claim = function (id, element) {
  this._seed.set(id, element || true);
};
/**
 * Returns true if the given id has already been assigned.
 *
 * @param  {String} id
 * @return {Boolean}
 */


Ids.prototype.assigned = function (id) {
  return this._seed.get(id) || false;
};
/**
 * Unclaim an id.
 *
 * @param  {String} id the id to unclaim
 */


Ids.prototype.unclaim = function (id) {
  delete this._seed.hats[id];
};
/**
 * Clear all claimed ids.
 */


Ids.prototype.clear = function () {
  var hats = this._seed.hats,
      id;

  for (id in hats) {
    this.unclaim(id);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Ids);
//# sourceMappingURL=index.esm.js.map


/***/ })

/******/ });
//# sourceMappingURL=client.js.map