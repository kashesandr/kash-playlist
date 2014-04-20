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
        'enum/response-code'
    ],
    function( EnumResponseCode )
    {
        return Backbone.Collection.extend(
            {
                initialize: function()
                {

                },

                parse: function(data, options)
                {
                    var xhr = options.xhr;
                    if (xhr && xhr.status == EnumResponseCode.NO_CONTENT) {
                        this.trigger(EnumResponseCode.NO_CONTENT);
                    } else {
                        this.isLoaded = true;
                        return data;
                    }
                    return null;
                },

                load: function()
                {
                    this.fetch({
                        success : this._loadedSuccess,
                        error   : this._loadedError
                    });
                },

                _loadedSuccess: function( self, response, options )
                {
                    var xhr = options.xhr;
                    if ( xhr && xhr.status == EnumResponseCode.OK ) {
                        self.trigger(EnumResponseCode.OK);
                    }
                },

                _loadedError: function( self, response, options )
                {
                    if ( options.xhr && ((options.xhr.status == EnumResponseCode.BAD_REQUEST) || (options.xhr.status == EnumResponseCode.NOT_FOUND)) ) {
                        self.trigger('error');
                    }
                }
            }
        );
    }
);