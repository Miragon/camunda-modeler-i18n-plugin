'use strict';

module.exports = function (electronApp, menuState) {
    return [
        {
            label: 'Deutsch',
            enabled: () => menuState.bpmn,
            action: function () {
                electronApp.emit('menu:action', 'language.changed', 'de');
            }
        },
        {
            label: 'English',
            enabled: () => menuState.bpmn,
            action: function () {
                electronApp.emit('menu:action', 'language.changed', 'en');
            }
        }
    ];
};