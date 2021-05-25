/**
 import {config} from '../configuration';
 import de from "./languages/de.js";
 import en from "./languages/en.js";
 import pt_br from "./languages/pt-br.js";


 /* eslint-disable no-unused-vars*/
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
    {value: 'de', label: 'German'},
    {value: 'en', label: 'English'},
    {value: 'pt_br', label: 'Português (Brasil)'}
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
            <Fill slot="toolbar" group="9_language">
                <Select
                    styles={{
                        control: provided => ({
                            ...provided,
                            width: 100,
                            height: 20
                        }),
                        menu: provided => ({...provided, zIndex: 101})
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
