var EventEmitter = require('eventemitter2').EventEmitter2;
var util = require('util');
var jQuery = require('jquery');
require('jquery-ui');
require('../../thirdparty/jquery.comiseo.daterangepicker');

function SpanEditor() {
    EventEmitter.call(this);
    var that = this;
    var dates = jQuery("#span-configure-input").daterangepicker({
        numberOfMonths: 3,
        onChange: function() {
            that.start = getRange().start;
            that.end = getRange().end;
            that.emit('change', {
                start : that.start,
                end : that.end
            });
        }
    });

    function getRange () {
        return jQuery("#span-configure-input").daterangepicker("getRange")
    }

    this.play_mode = 'stop';
    jQuery('#mode-play-button').click(function() {
        if(that.play_mode == 'stop') {
            that.play_mode = 'play';
            jQuery(this).children('.fa').removeClass('fa-play');
            jQuery(this).children('.fa').addClass('fa-pause');
            that.onPlayClickedListener(that.getStart(), that.getEnd());
        }else if(that.play_mode == 'play') {
            that.play_mode = 'stop';
            jQuery(this).children('.fa').removeClass('fa-pause');
            jQuery(this).children('.fa').addClass('fa-play');
            that.onStopClickedListener();
        }
    });

    var today = new Date();
    that.end = new Date();
    var yesterday = new Date(that.end.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
    this.start = yesterday;
    // jQuery('#span-configure-to').val((today.getMonth()+1) +'/'+ today.getDate() +'/'+ (today.getYear()+1900));
    // jQuery('#span-configure-from').val((yesterday.getMonth()+1) +'/'+ yesterday.getDate() +'/'+ (yesterday.getYear()+1900));
}

util.inherits(SpanEditor, EventEmitter);

SpanEditor.prototype.getStart = function() {
    return this.start;
}

SpanEditor.prototype.getEnd = function() {
    return this.end;
}

SpanEditor.prototype.onSpanConfigured = function(cb) {
    var that = this;
    this.onSpanConfiguredListener = cb;
    // jQuery('#span-configure-button').click(function() {
    //     cb(that.start, that.end);
    // });
}

SpanEditor.prototype.onPlayClicked = function(cb) {
    this.onPlayClickedListener = cb;
}

SpanEditor.prototype.onStopClicked = function(cb) {
    this.onStopClickedListener = cb;
}


SpanEditor.prototype.onRealtimeClicked = function(cb) {
    jQuery('#mode-realtime-button').click(function(){
        jQuery(this).toggleClass('is-active');
        cb();
    });
}

module.exports = SpanEditor;