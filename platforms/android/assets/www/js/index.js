/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        // from beacon example properties
        this.currentScreenID = null;
        this.beaconColorStyles = [
            'style-color-unknown style-color-unknown-text',
            'style-color-mint style-color-mint-text',
            'style-color-ice style-color-ice-text',
            'style-color-blueberry-dark style-color-blueberry-dark-text',
            'style-color-white style-color-white-text',
            'style-color-transparent style-color-transparent-text'];
        this.proximityNames = [
            'unknown',
            'immediate',
            'near',
            'far'];
        // -------------------------
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    // beacon example
    showScreen: function(screenId) {
        // Hide current screen if set.
        if (app.currentScreenId != null)
        {
            $('#' + app.currentScreenId).hide();
        }

        // Show new screen.
        app.currentScreenId = screenId;
        $('#' + app.currentScreenId).show();
        document.body.scrollTop = 0;
    },

    // beacon example
    formatDistance: function(meters) {
        if (!meters) { return 'Unknown'; }

        if (meters > 1)
        {
            return meters.toFixed(3) + ' m';
        }
        else
        {
            return (meters * 100).toFixed(3) + ' cm';
        }
    },

    // beacon example
    formatProximity: function(proximity) {
        if (!proximity) { return 'Unknown'; }

        // Eliminate bad values (just in case).
        proximity = Math.max(0, proximity);
        proximity = Math.min(3, proximity);

        // Return name for proximity.
        return this.proximityNames[proximity];
    },

    // beacon example
    beaconColorStyle: function(color) {
        if (!color)
        {
            color = 0;
        }

        // Eliminate bad values (just in case).
        color = Math.max(0, color);
        color = Math.min(5, color);

        // Return style class for color.
        return app.beaconColorStyles[color];
    }

};
