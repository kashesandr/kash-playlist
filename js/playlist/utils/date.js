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
        'config'
    ],
    function(Config){

        var DateUtils = function(){};

        _.extend(DateUtils, {

            /**
             * get sorted array of dateStrings
             * @param dateString
             * @param range
             * @returns {Array}
             */
            getDaysArray: function(dateString, range){
                var date = moment(dateString, Config.FORMAT_DATE).subtract('days', 1+Math.abs(range[0]))
                    , result = []
                    , i = 0;
                for ( i = 0; i < (Math.abs(range[0])+range[1]+1) ; i ++ ) {
                    result.push( date.add('days', 1).format(Config.FORMAT_DATE) );
                }
                return result;
            },

            /**
             * get hours array with centerHour in the array's center
             * @param howManyHours
             * @param centerHour
             * @returns {Array}
             */
            getHoursArray: function( howManyHours, centerHour ){
                var half = Math.floor(howManyHours/2)
                    , result = []
                    , firstIndex = centerHour-half
                    , lastIndex = centerHour+half+1
                    ;
                if (firstIndex < 0) {
                    firstIndex = 0;
                    lastIndex = howManyHours;
                } else if (lastIndex >= 24 ) {
                    lastIndex = 24;
                    firstIndex = 24 - howManyHours;
                }

                for ( var i = firstIndex; i < lastIndex; i ++ ) {
                    if (i >= 0)
                        result.push(i.zeroLeftPadding(2) + ":00" );
                }
                return result;
            }

        });

        return DateUtils;
    }
);