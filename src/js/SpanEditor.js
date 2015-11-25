var jQuery = require('jquery');
require('jquery-ui');
require('../../thirdparty/jquery.comiseo.daterangepicker');

function SpanEditor() {
    var that = this;
	// var dates = jQuery( '#span-configure-from, #span-configure-to' ) . datepicker( {
 //        showAnim: 'clip',
 //        changeMonth: true,
 //        numberOfMonths: 3,
 //        showCurrentAtPos: 1,
 //        onSelect: function( selectedDate ) {
 //            var option = this.id == 'span-configure-from' ? 'minDate' : 'maxDate',
 //                instance = jQuery( this ).data( 'datepicker' ),
 //                date = jQuery.datepicker.parseDate(
 //                    instance.settings.dateFormat || jQuery.datepicker._defaults.dateFormat,
 //                    selectedDate,
 //                    instance.settings );
 //            dates.not( this ).datepicker( 'option', option, date );
 //            if(option == 'minDate') that.start = date;
 //            else if(option == 'maxDate') that.end = date;
 //        }
 //    } );

    var dates = jQuery("#span-configure-input").daterangepicker({
        numberOfMonths: 3,
        onChange: function() {
            that.start = getRange().start;
            that.end = getRange().end;
            that.onSpanConfiguredListener(that.start, that.end)
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