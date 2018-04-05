"use strict";

var s = $('#session');
var b = $('#break');
var st = $('#session-timer');
var m = $('#minutes');
var a = $('#alert');
var go = $('#go');
var body = $('body');
var pause = $('#pause');
var reset = $('#reset');
var resume = $('#resume');
var session;
var time = 0;
var countdown;
var blink;
var itIsBreakTime = false; //putting this here so it can pause during breaks without being reset
var audio = new Audio('http://www.orangefreesounds.com/wp-content/uploads/2017/10/Twin-bell-alarm-clock-ringing-short.mp3');

function addListeners() {
    // choosing session time
    s.on('change', function() {
        st.text((s.val()));
    });
    // choosing break time
    b.on('change', function() {});
    // running timer from button
    go.on('click', function() {
        // setting time value
        time = Number(s.val()) * 60;
        countdown = timer();
        session = setInterval(function() { countdown(); }, 1000);
        //unhide buttons
        go.addClass('hidden');
        pause.removeClass('hidden');
        // disable selectors
        b.prop('disabled', true)
        s.prop('disabled', true)
        // change background
        body.addClass('during-session');
    });
    pause.on('click', function() {
        clearInterval(session);
        // buttons
        resume.removeClass('hidden');
        reset.removeClass('hidden');
        pause.addClass('hidden');
        // blink time
        blink = setInterval(function() {
            st.toggleClass('blink');
        }, 500);
    });
    resume.on('click', function() {
        // time value still remains
        countdown = timer();
        session = setInterval(function() { countdown(); }, 1000);
        // buttons
        resume.addClass('hidden');
        pause.removeClass('hidden');
        reset.addClass('hidden');
        // stop blinking times
        clearInterval(blink);
        st.removeClass('blink');
    });
    reset.on('click', function() {
        clearInterval(session);
        st.text((s.val()));
        m.text(' minutes');
        // reset buttons
        go.removeClass('hidden');
        resume.addClass('hidden');
        pause.addClass('hidden');
        reset.addClass('hidden');
        // rehide alert
        a.addClass('hidden');
        // enable selectors
        b.prop('disabled', false)
        s.prop('disabled', false)
        // background
        body.removeClass('during-session');
        body.removeClass('during-break');
        body.removeClass('break-over');
        // stop blinking times
        clearInterval(blink);
        st.removeClass('blink');
        // reset if it was break
        itIsBreakTime = false;
    });
}

function timer() {
    var mins = Math.floor(time / 60);
    var seconds = (time - mins * 60).toString();
    m.text('');
    st.text(mins + ':' + verifyZeros(seconds));

    function runTimer() {
        time--;
        mins = Math.floor(time / 60);
        seconds = (time - mins * 60).toString();
        st.text(mins + ':' + verifyZeros(seconds));
        // when done
        if (time <= 0) {
            clearInterval(session); // stop the timer
            if (itIsBreakTime) {
                audio.play();
                // update alert
                a.removeClass('hidden');
                a.text("Break time's over!");
                // vibrate
                patternVibration();
                // hide pause
                pause.addClass('hidden');
                // show reset
                reset.removeClass('hidden');
                // change background
                body.removeClass('during-break');
                body.addClass('break-over');
                return;
            }
            itIsBreakTime = true;
            audio.play();
            // show alert
            a.removeClass('hidden');
            a.text("It's break time!");
            // vibrate
            patternVibration();
            // change background
            body.removeClass('during-session');
            body.addClass('during-break');
            // setting time for the break time
            time = Number(b.val()) * 60;
            // rerun timer with the new break time
            session = setInterval(function() { countdown(); }, 1000);
        }
    }
    return runTimer;
}

function verifyZeros(seconds) {
    // str => str
    // makes sure there is a there are leading zeros to the seconds
    if (seconds.length < 2) {
        return '0'.concat(seconds[0]);
    }
    return seconds;
}

function patternVibration() {
    // alternates between vibrate duration and break
    navigator.vibrate([100, 50, 100, 50, 1000, 500, 100, 50, 100, 50, 1000]);
}

$(document).ready(function() {
    addListeners();
});