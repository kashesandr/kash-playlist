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
        'views/base',
        'text!views/index/templates/wrapper.hbs',
        'config',
        'utils/date'
    ],
    function( base, templateText, Config, DateUtils )
    {
        return base.extend(
            {
                el : "#playlist",

                initialize: function( options )
                {
                    this.templateText = templateText;
                    base.prototype.initialize.apply(this, arguments);

                    this.currentDay = options.currentDay;
                    this.currentHour = options.currentHour;

                    this.collectionSongs = options.collectionSongs;

                    this._eventsAdd();
                },

                _eventsAdd: function()
                {

                },

                getTemplateData: function(){
                    var daysLoaded = _.unique(this.collectionSongs.pluck('dayString')),
                        daysSnapshots = this.getDaysSnapshots(this.currentDay, [-2, 2])
                            .map(function(day, i){
                                return {
                                    href: '#!date/' + day,
                                    dayString: day.toString().substr(4,2),
                                    className: this.getDayClassName(i, daysLoaded, day)
                                }
                            }.bind(this)),
                        hours = DateUtils.getHoursArray(9, this.currentHour)
                            .map(function(hour){
                                return {
                                    href: '#!date/' + this.currentDay + '/' + hour,
                                    hourString: hour,
                                    className: parseInt(hour.substr(0, 2)) == this.currentHour ? 'active' : ''
                                }
                            }.bind(this)),
                        songs = this.collectionSongs.getHourSongs(this.currentDay.substr(4,2), this.currentHour)
                            .map(function(song){
                                return {
                                    time: song.get('date').format("HH:mm:ss"),
                                    singer: song.get('singer'),
                                    songName: song.get('name'),
                                    className: ''
                                }
                            }.bind(this));
                    if ( daysLoaded.filter(function(day){ return day === this.currentDay}.bind(this)).length === 0) {
                        return { error: true };
                    }
                    return {
                        days: daysSnapshots,
                        hours: hours,
                        songs: songs
                    };
                },

                getDaysSnapshots: function( centerDay, daysRange ){
                    var snapshots = [];
                    for (var i = daysRange[0]; i !== 1+daysRange[1]; i ++) {
                        if (i < 0 )
                            snapshots.push(moment(_.clone(centerDay), Config.FORMAT_DATE).subtract('days' , Math.abs(i)).format(Config.FORMAT_DATE));
                        if (i == 0)
                            snapshots.push(centerDay);
                        if (i > 0)
                            snapshots.push(moment(_.clone(centerDay), Config.FORMAT_DATE).add('days' , i).format(Config.FORMAT_DATE))
                    }
                    return snapshots;
                },

                getDayClassName: function(i, daysLoaded, day){
                    var cssClass = '';
                    switch (i) {
                        case 0:
                            cssClass = 'prev-prev';
                            break;
                        case 1:
                            cssClass = 'prev';
                            break;
                        case 2:
                            cssClass = 'current';
                            break;
                        case 3:
                            cssClass = 'next';
                            break;
                        case 4:
                            cssClass = 'next-next';
                            break;
                    }
                    if (daysLoaded.filter(function(dayLoaded){ return dayLoaded === day}).length === 0)
                        cssClass += ' disabled';
                    return cssClass;
                }

            }
        );
    }
);