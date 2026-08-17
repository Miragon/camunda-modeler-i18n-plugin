import translate from './translate';

/**
 * Creates the plugin structure and tells the modeler, how to initialize it.
 */
export default {
    translateModule: translate,
    __init__: ['translate'],
    translate: ['type', translate]
};
