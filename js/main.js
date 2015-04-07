
// application data:
var lastAngle = -1, // last measurement
    rotation = 0;   // compass rotation

/**
 * Function handles new orientation data received from the device.
 *
 * @param {Event} eventData deviceorientation event containing orientation data
 */
function onDeviceOrientation(eventData) {
    'use strict';
    // check if the angle has changed from the previous measurement
    if (!isNaN(eventData.alpha) && eventData.alpha !== lastAngle) {
        var angle = eventData.alpha,
            deltaAngle,
            text = '';

        // find direction from given angle
        if (angle < 68 || angle > 292) {
            text += 'NORTH';
        } else if (angle > 112 && angle < 248) {
            text += 'SOUTH';
        }
        if (angle > 22 && angle < 158) {
            text += 'EAST';
        } else if (angle > 202 && angle < 338) {
            text += 'WEST';
        }

        // check angle change and calculate the rotation of the compass
        deltaAngle = lastAngle - angle;
        if (Math.abs(deltaAngle) > 180) {
            if (deltaAngle > 0) {
                rotation -= ((360 - lastAngle) + angle);
            } else {
                rotation += (lastAngle + (360 - angle));
            }
        } else {
            rotation += deltaAngle;
        }

        // save current measurement
        lastAngle = angle;

        // update the direction and angle labels
        document.getElementById('direction').innerHTML = text;
        document.getElementById('angle').innerHTML =
            Math.round(angle) + '<sup>o</sup>';
        // rotate the compass image
        document.getElementById('rotation').style['-webkit-transform'] =
            'rotate(' + rotation + 'deg)';
    }
}

/**
 * Function for binding device orientation changes to handler.
 */
function startSensor() {
    'use strict';
    // bind device orientation changes to handler function
    window.addEventListener('deviceorientation', onDeviceOrientation, false);
}

/**
 * Function binding UI events.
 */
function bindEvents() {
    'use strict';
    window.addEventListener('tizenhwkey', function onTizenHWKey(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (err) {
                console.error('Error: ', err);
            }

        }
    });
}

/**
 * Function for initializing the application.
 */
function init() {
    'use strict';
    // bind UI events
    bindEvents();
    // begin reading compass
    startSensor();
}

// initialize application when the document is ready
window.addEventListener('DOMContentLoaded', init);
