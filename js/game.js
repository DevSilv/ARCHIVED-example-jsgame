// returns "window.setInterval" function.
//  "gameField" is "HTMLElement".
//  "movings" is "array" of "moving" objects.
//  "intervalTime" is "integer" and in miliseconds.
function game(gameField, movingsRef, intervalTime, timerLabel) {
    "use strict";

    return window.setInterval(function() {
        ++time;

        let gameFieldComputedStyle =
            window.getComputedStyle(gameField);
        let gameFieldComputedHeight = parseInt(gameFieldComputedStyle.height);
        let gameFieldComputedWidth = parseInt(gameFieldComputedStyle.width);

        for (let m of movingsRef) {
            // is reversed "for" loop faster indeed?
            for (let i = m.verticalUnitInterval; i > 0; --i) {
                // eventually bounce off the board's boundary.
                if (m.top <= 0 || m.bottom >= gameFieldComputedHeight) {
                    m.bounceVertically();
                }
                // eventually bounce off other objects.
                for (let mm of movingsRef) {
                    // reject self.
                    if (m.id !== mm.id) {
                        if (m.getVerticalDistanceBetween(mm) === 0 &&
                            m.isNearHorizontally(mm)) {
                            m.bounceVertically();
                        }
                    }
                }
                // Move.
                m.moveVertically();
            }
            // is reversed "for" loop faster indeed?
            for (let i = m.horizontalUnitInterval; i > 0; --i) {
                // eventually bounce off the board's boundary.
                if (m.left <= 0 || m.right >= gameFieldComputedWidth) {
                    m.bounceHorizontally();
                }
                // eventually bounce off other objects.
                for (let mm of movingsRef) {
                    // reject self.
                    if (m.id !== mm.id) {
                        if (m.getHorizontalDistanceBetween(mm) === 0 &&
                            m.isNearVertically(mm)) {
                            m.bounceHorizontally();
                        }
                    }
                }
                // move.
                m.moveHorizontally();
            }
        }

        if (time % (1000 / intervalTime) === 0) {
            timerLabel.nodeValue = time / (1000 / intervalTime);
        }
    }, intervalTime);
}