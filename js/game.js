// Returns "window.setInterval" function.
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
            // Is reversed "for" loop faster indeed?
            for (let i = m.verticalUnitInterval; i > 0; --i) {
                // Eventually bounce off the board's boundary.
                if (m.top <= 0 || m.bottom >= gameFieldComputedHeight) {
                    m.bounceVertically();
                }
                // Eventually bounce off other objects.
                for (let mm of movingsRef) {
                    // Reject self.
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
            // Is reversed "for" loop faster indeed?
            for (let i = m.horizontalUnitInterval; i > 0; --i) {
                // Eventually bounce off the board's boundary.
                if (m.left <= 0 || m.right >= gameFieldComputedWidth) {
                    m.bounceHorizontally();
                }
                // Eventually bounce off other objects.
                for (let mm of movingsRef) {
                    // Reject self.
                    if (m.id !== mm.id) {
                        if (m.getHorizontalDistanceBetween(mm) === 0 &&
                            m.isNearVertically(mm)) {
                            m.bounceHorizontally();
                        }
                    }
                }
                // Move.
                m.moveHorizontally();
            }
        }

        if (time % (1000 / intervalTime) === 0) {
            timerLabel.nodeValue = time / (1000 / intervalTime);
        }
    }, intervalTime);
}