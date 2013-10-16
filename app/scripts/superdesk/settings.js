define(['angular'], function(angular) {
    'use strict';

    angular.module('superdesk.settings', []).
        /**
         * Settings service to store plugin/controller specific settings such as 
         * items per page or displayed fields.
         *
         * Usage:
         * var listSettings = settings.initialize('users:list', default);
         * listSettings.test = 5;
         * listSettings.save();
         *
         * Params:
         * @param {string} key - main key for accessing plugin/controller settings
         * @param {Object} defaultSettings - default settings
         */
        service('settings', ['storage', function(storage) {
            var SettingsContainer = function(key, defaultSettings) {
                this._key = key + ':settings';
                var settings = _.extend({}, defaultSettings);
                for (var i in settings) {
                    this[i] = settings[i];
                }
            };
            SettingsContainer.prototype.save = function() {
                var settings = {};
                for (var i in this) {
                    if (this.hasOwnProperty(i)) {
                        settings[i] = this[i];
                    }
                }
                storage.setItem(this._key, settings, true);
            };
            SettingsContainer.prototype.load = function() {
                var settings = storage.getItem(this._key);
                if (settings !== null) {
                    for (var i in settings) {
                        this[i] = settings[i];
                    }
                } else {
                    this.save();
                }
            };

            return new function() {
                this.initialize = function(pluginName, defaultSettings) {
                    var instance = new SettingsContainer(pluginName, defaultSettings);
                    instance.load();
                    return instance;
                }
            };

        }]);
});