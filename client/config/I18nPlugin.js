/**
 * Copyright 2021 FlowSquad GmbH
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

import React, {Fragment, PureComponent} from 'camunda-modeler-plugin-helpers/react';
import {Fill} from 'camunda-modeler-plugin-helpers/components';
import Select from 'react-select';
import translate from "../bpmnjs-i18n-extension";
import ConfigModal from "./ConfigModal";

// The default language
const defaultLanguage = "en";

//config key
const configKey = "i18n";

const defaultState = {
    currentLanguage: defaultLanguage,
    modalOpen: false
};

const options = [
    {value: 'de', label: 'Deutsch'},
    {value: 'en', label: 'English'},
    {value: 'pt_br', label: 'Português (Brasil)'},
    {value: 'zh_Hans', label: '简体中文'},
    {value: 'zh_Hant', label: '繁体中文'},
    {value: 'ru', label: 'Русский'},
    {value: 'nl_nl', label: 'Nederlands (Netherlands)'}
]

/**
 * An example client extension plugin to enable auto saving functionality
 * into the Camunda Modeler
 */
export default class I18nPlugin extends PureComponent {
    constructor(props) {
        super(props);
        this.state = defaultState;

        this.handleLanguageChanged = this.handleLanguageChanged.bind(this);
        this.handleClosed = this.handleClosed.bind(this);
    }

    componentDidMount() {
        const {
            config,
            subscribe,
        } = this.props;

        // retrieve plugin related information from the application configuration
        config.getForPlugin(configKey, 'config')
            .then(config => {
                if (config) {
                    this.setState(config);

                    translate.translateModule.prototype.currentLanguage = function () {
                        return config.currentLanguage.value;
                    }

                    subscribe('bpmn.modeler.configure', (event) => {
                        const {
                            middlewares
                        } = event;
                        middlewares.push(this.addModule(translate));
                    });

                    subscribe('dmn.modeler.configure', (event) => {
                        const {
                            middlewares,
                        } = event;
                        middlewares.push(this.addDmdModule(translate));
                    });

                }
            });
    }

    /**
     * Returns a bpmn.modeler.configure middleware
     * that adds the specific module.
     *
     * @param {didi.Module} extensionModule
     *
     * @return {Function}
     */
    addModule(extensionModule) {

        return (config) => {

            const additionalModules = config.additionalModules || [];

            return {
                ...config,
                additionalModules: [
                    ...additionalModules,
                    extensionModule
                ]
            };
        };
    }

    /**
     * Returns a bpmn.modeler.configure middleware
     * that adds the specific module.
     *
     * @param {didi.Module} extensionModule
     *
     * @return {Function}
     */
    addDmdModule(extensionModule) {

        return (config) => {

            const additionalModules = config.additionalModules || [];

            return {
                ...config,
                drd: {
                    additionalModules: [
                        ...additionalModules,
                        extensionModule
                    ]
                },
                decisionTable: {
                    additionalModules: [
                        ...additionalModules,
                        extensionModule
                    ]
                },
                literalExpression: {
                    additionalModules: [
                        ...additionalModules,
                        extensionModule
                    ]
                }
            }
        };
    }

    handleLanguageChanged(language) {
        this.props.config.setForPlugin(configKey, 'config', {currentLanguage: language})
            .catch(console.error);
        this.setState({currentLanguage: language, modalOpen: true});
    }

    handleClosed() {
        this.setState({...this.state, modalOpen: false});
    }

    render() {
        return <Fragment>
            <Fill slot="tab-actions" group="9_language">
                <Select
                    styles={{
                        control: provided => ({
                            ...provided,
                            width: 125,
                            minHeight: 24,
                            marginRight: 10,
                            marginTop: 2,
                            "&>div:first-of-type": {
                                padding: "0px 4px"
                            },
                            "&>div:last-child>div": {
                                padding: "0px 8px",
                            },
                            "&>div>span": {
                                display: "none"
                            }
                        }),
                        menu: provided => ({
                            ...provided,
                            zIndex: 101,
                            marginTop: 0
                        })
                    }}
                    name="language_selection"
                    options={options}
                    onChange={this.handleLanguageChanged}
                    value={this.state.currentLanguage}
                />
            </Fill>
            {this.state.modalOpen && (
                <ConfigModal
                    onClose={this.handleClosed}
                />
            )}
        </Fragment>

    }
}
