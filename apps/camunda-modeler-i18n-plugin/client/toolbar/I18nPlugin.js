import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/vendor/react';
import Fill from 'camunda-modeler-plugin-helpers/components/Fill.js';
import Select from 'react-select';
import { TranslateModule, i18n } from '@miragon/bpmn-modeler-i18n';
import EditorModuleInjector from '../editors/EditorModuleInjector';
import LanguageOptions from '../language/LanguageOptions';
import LanguagePreference from '../language/LanguagePreference';
import RestartModal from './RestartModal';

const selectStyles = {
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
};

export default class I18nPlugin extends PureComponent {
    constructor(props) {
        super(props);

        this.languageOptions = new LanguageOptions();
        this.languagePreference = new LanguagePreference(props.config);
        this.state = {
            currentLanguage: this.languageOptions.find(LanguagePreference.DEFAULT_LOCALE),
            restartPromptOpen: false,
        };

        this.handleLanguageChanged = this.handleLanguageChanged.bind(this);
        this.handleRestartPromptClosed = this.handleRestartPromptClosed.bind(this);
    }

    componentDidMount() {
        new EditorModuleInjector(TranslateModule).subscribeTo(this.props.subscribe);

        this.languagePreference
            .load()
            .then((locale) => {
                this.setState({ currentLanguage: this.languageOptions.find(locale) });
                i18n.setLanguage(locale);
            })
            .catch(console.error);
    }

    handleLanguageChanged(language) {
        this.languagePreference.save(language.value).catch(console.error);
        i18n.setLanguage(language.value);
        this.setState({ currentLanguage: language, restartPromptOpen: true });
    }

    handleRestartPromptClosed() {
        this.setState({ restartPromptOpen: false });
    }

    render() {
        return (
            <Fragment>
                <Fill slot="tab-actions" group="9_language">
                    <Select
                        styles={selectStyles}
                        name="language_selection"
                        options={this.languageOptions.all()}
                        onChange={this.handleLanguageChanged}
                        value={this.state.currentLanguage}
                    />
                </Fill>
                {this.state.restartPromptOpen && (
                    <RestartModal onClose={this.handleRestartPromptClosed} />
                )}
            </Fragment>
        );
    }
}
