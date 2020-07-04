'use strict';

module.exports = function(electronApp, menuState) {





    return [{
        label: 'Deutsch',
        enabled: function() {
            return true;
        },
        action: function() {
            // will be forwarded to bpmn-js eventually
            electronApp.emit('menu:action', 'language.changed', 'de');
        }
    },
        {
            label: 'English',
            enabled: function() {
                return true;
            },
            action: function() {
                // will be forwarded to bpmn-js eventually
                electronApp.emit('menu:action', 'language.changed', 'en');
            }
        }
    ];
};