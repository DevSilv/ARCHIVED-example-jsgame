// Returns "object".
//  "id" is an arbitral integer (may also be 0 and less).
//  "height" is in pixels.
//  "width" is in pixels.
//  "radius" is in pixels.
//  "color" is a custom color object of format {r,g,b},
//      where r,g,b are integers from 0 to 255.
//  "verticalInterval" is in pixels.
//  "horizontalInterval" is in pixels.
//  "verticalDirection" is either 1 or -1.
//  "horizontalDirection" is either 1 or -1.
//  "xFactor" is an arbitral integer > 0.
function createMoving(
    id,
    height,
    width,
    radius,
    color,
    verticalUnitInterval,
    horizontalUnitInterval,
    verticalDirection,
    horizontalDirection,
    xFactor
) {
    "use strict";

    let element = document.createElement("div");
    element.classList.add("moving");
    element.style.height = height + "px";
    element.style.width = width + "px";
    element.style.borderRadius = radius + "px";
    element.style.backgroundColor = "hsl(" + color.h + "," + color.s + "%," + color.l + "%)";

    // For the explanation why there is below own implementation
    //  of "x" and "y", see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Browser_compatibility
    //      There are "offset*" instead of "getBoundingClientRect().*"
    //       (offsetHeight and so on), because the latter does not work
    //       as expected for some reason (in Firefox? At least I have
    //       tested "getBoundingClientRect().top" as not working).
    return {
        get "id" () {
            return id;
        },
        get "element" () {
            return element;
        },
        get "height" () {
            return element.offsetHeight;
        },
        set "height" (height) {
            element.style.height = height + "px";
        },
        get "width" () {
            return element.offsetWidth;
        },
        set "width" (width) {
            element.style.width = width + "px";
        },
        get "top" () {
            return element.offsetTop;
        },
        set "top" (top) {
            element.style.top = top + "px";
        },
        get "bottom" () {
            return element.offsetTop + element.offsetHeight;
        },
        get "left" ()  {
            return element.offsetLeft;
        },
        set "left" (left) {
            element.style.left = left + "px";
        },
        get "right" () {
            return element.offsetLeft + element.offsetWidth;
        },
        // get "y" () {
        //     return this.top + Math.floor(this.height / 2);
        // },
        // get "x" () {
        //     return this.left + Math.floor(this.width / 2);
        // },
        "verticalUnitInterval": verticalUnitInterval,
        "horizontalUnitInterval": horizontalUnitInterval,
        "verticalDirection": verticalDirection,
        "horizontalDirection": horizontalDirection,
        "bounceVertically": function() {
            this.verticalDirection = -this.verticalDirection;
        },
        "bounceHorizontally": function() {
            this.horizontalDirection = -this.horizontalDirection;
        },
        "moveVertically": function() {
            this.top = this.top + this.verticalDirection;
        },
        "moveHorizontally": function() {
            this.left = this.left + this.horizontalDirection;
        },
        "isNearVertically": function(moving) {
            return this.top <= moving.bottom &&
                this.bottom >= moving.top;
        },
        "isNearHorizontally": function(moving) {
            return this.left <= moving.right &&
                this.right >= moving.left;
        },
        "getVerticalDistanceBetween": function(moving) {
            let distance = 0;
            if (this.bottom <= moving.top) {
                // "this" is above "moving"
                //  or at the same height
                distance = moving.top - this.bottom;
            } else if (this.top >= moving.bottom) {
                // "this" is below "moving"
                distance = this.top - moving.bottom;
            } // else "distance" should be 0
            return distance;
        },
        "getHorizontalDistanceBetween": function(moving) {
            let distance = 0;
            if (this.right <= moving.left) {
                // "this" is to the left of "moving"
                //  or at the same width
                distance = moving.left - this.right;
            } else if (this.left >= moving.right) {
                // "this" is to the right of "moving"
                distance = this.left - moving.right;
            } // else "distance" should be 0
            return distance;
        },
        // "getAverageCircleRadius": function(moving) {
        //     let averageCircleRadius = 0;
        //     if ((this.getVerticalDistanceBetween(moving) >
        //             this.getHorizontalDistanceBetween(moving) &&
        //             this.height <= this.width) ||
        //         (this.getVerticalDistanceBetween(moving) <=
        //             this.getHorizontalDistanceBetween(moving) &&
        //             this.height > this.width)) {
        //         averageCircleRadius = Math.floor(
        //             Math.abs(this.width - this.height) / 4
        //         );
        //     } else if (this.getVerticalDistanceBetween(moving) <=
        //         this.getHorizontalDistanceBetween(moving) &&
        //         this.height <= this.width) {
        //         averageCircleRadius = this.width;
        //     } else {
        //         averageCircleRadius = this.height;
        //     }
        //     return averageCircleRadius;
        // },
        // "getDistanceBetween": function(moving) {
        //     return (Math.sqrt(
        //         Math.pow(this.x() - moving.getX(), 2) +
        //         Math.pow(this.y() - moving.getY(), 2)
        //     ) - (this.getAverageCircleRadius(moving) +
        //         moving.getAverageCircleRadius(this)));
        // },
        "click": function(f) {
            element.addEventListener("click", f);
        },
        "act": function() {
            // Minimum value is 1px.
            let style = element.style;
            let newWidth = parseInt(style.width) - xFactor;
            let newHeight = parseInt(style.height) - xFactor;
            if (newHeight > 0) {
                style.height = newHeight + "px";
            }
            if (newWidth > 0) {
                style.width = newWidth + "px";
            }
        }
    };
}