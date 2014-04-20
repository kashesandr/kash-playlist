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

define(
    [
        'views/index/wrapper',
        'collections/songs',
        'utils/date'
    ],
    function(
        ViewIndex,
        CollectionPlaylists,
        DateUtils
        ){

        var Router = Backbone.Router.extend({

            currentDay: moment().format("YYYY-MM-DD")
            , dayCurrent: null
            , hourCurrent: null
            ,

            routes: {
                ''                  : 'defaultPage',
                '!date/:date'       : 'day', // :date = YYYY-MM-DD,
                '!date/:date/:hour' : 'hour' // :date = YYYY-MM-DD, :hour == 01 .. 24
            },

            initialize: function()
            {
                this.currentDay = moment().format("YYMMDD");
                this.currentHour = moment().format("HH");

                this._collectionsInit();
                this._viewsInit();
                this._eventsAdd();

            },

            defaultPage: function(){
                Backbone.history.navigate(
                    '#!date/' + this.currentDay + '/' + this.currentHour + ':00',
                    {trigger: true}
                );
            },

            day: function(day)
            {
                this.currentDay = day;
                this.currentHour = day.substr(4,2) == moment().format("DD") ? moment().format("HH") : 12;

                Backbone.history.navigate(
                    '#!date/' + this.currentDay + '/' + this.currentHour + ':00',
                    {trigger: true}
                );
            },

            hour: function( day, hour )
            {
                this.currentDay = day;
                this.currentHour = parseInt(hour.substr(0, 2));

                if (this.currentHour < 0)
                    this.currentHour = 0;
                if (this.currentHour > 24)
                    this.currentHour = 24;

                this.viewIndex.currentHour = this.currentHour;
                this.viewIndex.currentDay = day;

                this.loadPlaylists(day);
            },

            loadPlaylists: function(day){
                this.dayCurrent = day;
                this.collectionSongs.load( DateUtils.getDaysArray(day, [-2, 2]) );
            },

            viewsRender: function(){
                this.viewIndex.render();
            },

            _collectionsInit: function()
            {
                this.collectionSongs = new CollectionPlaylists();
            },

            _viewsInit: function()
            {
                this.viewIndex = new ViewIndex({
                    currentDay: this.currentDay,
                    currentHour: this.currentHour
                    , collectionSongs: this.collectionSongs
                });
            },

            _eventsAdd: function()
            {
                this.collectionSongs.on('dataLoaded', this.viewsRender, this);
            }

        });

        return {
            initialize: function(){ new Router; Backbone.history.start(); }
        }

    }
);