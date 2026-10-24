import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/vendor/react';
import Fill from 'camunda-modeler-plugin-helpers/components/Fill.js';
import Select from 'react-select';
import translateModule, { i18n, options, optionFor } from '../bpmnjs-i18n-extension';
import ConfigModal from './ConfigModal';
import { bpmnMiddleware, dmnMiddleware } from './editorMiddlewares';
import { defaultLanguage, loadLanguage, saveLanguage } from './languagePreference';

const defaultState = {
    currentLanguage: optionFor(defaultLanguage),
    modalOpen: false,
};

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
        const { config, subscribe } = this.props;

        // Subscribe synchronously: inside the `if (config)` below, a fresh
        // install never injected the translate module at all.
        subscribe('bpmn.modeler.configure', (event) => {
            const { middlewares } = event;
            middlewares.push(bpmnMiddleware(translateModule));
        });

        subscribe('dmn.modeler.configure', (event) => {
            const { middlewares } = event;
            middlewares.push(dmnMiddleware(translateModule));
        });

        loadLanguage(config)
            .then((locale) => {
                this.setState({ currentLanguage: optionFor(locale) });

                // Switch the shared translator so editors created afterwards
                // render in the stored language.
                i18n.setLanguage(locale);
            })
            .catch(console.error);
    }

    handleLanguageChanged(language) {
        saveLanguage(this.props.config, language.value).catch(console.error);
        i18n.setLanguage(language.value);
        this.setState({ currentLanguage: language, modalOpen: true });
    }

    handleClosed() {
        this.setState({ ...this.state, modalOpen: false });
    }

    render() {
        return (
            <Fragment>
                <Fill slot="tab-actions" group="9_language">
                    <Select
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                width: 125,
                                minHeight: 24,
                                marginRight: 10,
                                marginTop: 2,
                                '&>div:first-of-type': {
                                    padding: '0px 4px',
                                },
                                '&>div:last-child>div': {
                                    padding: '0px 8px',
                                },
                                '&>div>span': {
                                    display: 'none',
                                },
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 101,
                                marginTop: 0,
                            }),
                        }}
                        name="language_selection"
                        options={options}
                        onChange={this.handleLanguageChanged}
                        value={this.state.currentLanguage}
                    />
                </Fill>
                {this.state.modalOpen && <ConfigModal onClose={this.handleClosed} />}
            </Fragment>
        );
    }
}
