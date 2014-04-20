/**
 kash-playlist - is a simple js application which allows you to see the audio playlist based on txt files custom format
 Copyright (C) 2014 Kasheverov Aleksandr

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

require.config({
    urlArgs: 'noCache=' + (new Date()).getTime(),
    paths: {
        'underscore'    : 'libs/underscore-min'
        , 'backbone'    : 'libs/backbone-min'
        , 'router'      : 'routers/router'
        , 'json2'       : 'libs/json2'
        , 'handlebars'  : 'libs/handlebars-v1.3.0'
        , 'moment'      : 'libs/moment-with-langs.min'
    },
    shim: {
        'router' : {
            deps : ['backbone']
        },
        'backbone' : {
            exports: 'Backbone',
            deps: ['underscore', 'handlebars', 'json2']
        },
        'date-utils' :{
            deps: ['moment']
        }

    }
});

require(
    [
        'underscore',
        'json2',
        'handlebars',
        'moment',
        'backbone',
        'router'
    ],
    function( _, json2, handlebars, moment, backbone, MainAppRouter )
    {
        moment().lang('ru');
        Number.prototype.zeroLeftPadding = function(size) {
            var s = String(this);
            if(typeof(size) !== "number"){size = 2;}
            while (s.length < size) {s = "0" + s;}
            return s;
        };
        MainAppRouter.initialize();
    }
);

