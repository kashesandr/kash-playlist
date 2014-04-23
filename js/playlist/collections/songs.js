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
        'collections/base',
        'models/base',
        'config',
        'enum/response-code'
    ],
    function( base, Model, Config, EnumResponseCode )
    {
        return base.extend(
            {
                model: Model,
                loadCounter: 0,

                initialize: function(options)
                {
                    base.prototype.initialize.apply(this, arguments);
                    this.reset();

                    this.on('loadCounter', function(counter){
                        if (counter == 0)
                            this.trigger('dataLoaded');
                    }, this);

                    this.baseUrl = "/" + Config.PATH_PLAYLISTS + "/";
                    this.url = this.baseUrl;
                },

                parse: function(data){
                    return null;
                },

                getHourSongs: function(day, hour){
                    return this.filter(function(song){
                        return (song.get('date').format("HH") == hour)
                            && (song.get('date').format("DD") == day)
                    });
                },

                load: function( daysArray )
                {
                    this.loadCounter = daysArray.length;
                    daysArray.forEach(function(dayString){
                        if (this.isDayLoaded(dayString)) {
                            this.trigger('loadCounter', --this.loadCounter);
                            return;
                        }
                        this.url = this.baseUrl + dayString + "." + Config.EXTENSION_PLALIST;
                        this.fetch({
                            remove: false,
                            dataType: 'text',
                            success : function(self, data, options){
                                self._loadedSuccess(self, data, options, dayString)
                            },
                            error: this._loadedError
                        });
                    }.bind(this));
                },

                _loadedSuccess: function( self, data, options, day )
                {
                    var xhr = options.xhr;
                    if ( xhr && xhr.status == EnumResponseCode.OK ) {
                        self.trigger(EnumResponseCode.OK);
                    }

                    var lines = $.trim(data).split(/\r\n|\n/)
                        , headers = ['time', 'code', 'name', 'singer']
                        , i = 0
                        , j = 0
                        , lineArray = []
                        , date = null;

                    for ( i = 0; i < lines.length; i ++ ) {
                        var song = {};
                        lineArray = lines[i].split(',');
                        for ( j = 0; j < headers.length; j ++ ) {
                            song[headers[j]] = $.trim(lineArray[j]);
                        }
                        // need only songs!
                        if ( song.code.match(/(S|s)([0-9+])/) ){
                            date = moment(day + ' ' + song.time, Config.FORMAT_DATE + ' HH:mm:ss');
                            self.add({
                                code: song.code
                                , name: song.name
                                , singer: song.singer
                                , dayString: day
                                , date: date
                            });
                        }
                    }

                    self.trigger('loadCounter', --self.loadCounter);
                },

                _loadedError: function( self, data, options )
                {
                    base.prototype._loadedError.apply(this, arguments);
                    self.trigger('loadCounter', --self.loadCounter);
                },

                isDayLoaded: function(day){
                    return this.findWhere({dayString: day}) != undefined;
                }
            }
        );
    }
);