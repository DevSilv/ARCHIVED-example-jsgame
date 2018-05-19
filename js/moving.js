// returns "object".
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

    // for the explanation why there is below own implementation
    //  of "x" and "y", see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Browser_compatibility
    // 
    // there are "offset*" instead of "getBoundingClientRect().*"
    //  (offsetHeight and so on), because the latter does not work
    //  as expected for some reason (in Firefox? At least I have
    //  tested "getBoundingClientRect().top" as not working).
    return {
        get "id" () {
            return id;
        }, // get
        get "element" () {
            return element;
        }, // get
        get "height" () {
            return element.offsetHeight ||
                parseInt(element.style.height);
        }, // get
        set "height" (height) {
            element.style.height = height + "px";
        }, // set
        get "width" () {
            return element.offsetWidth ||
                parseInt(element.style.width);
        }, // get
        set "width" (width) {
            element.style.width = width + "px";
        }, // set
        get "top" () {
            return element.offsetTop ||
                parseInt(element.style.top);
        }, // get
        set "top" (top) {
            element.style.top = top + "px";
        }, // set
        get "bottom" () {
            return element.offsetTop +
                element.offsetHeight ||
                parseInt(element.style.top) +
                parseInt(element.style.height);
        }, // get
        get "left" ()  {
            return element.offsetLeft ||
                parseInt(element.style.left);
        }, // get
        set "left" (left) {
            element.style.left = left + "px";
        }, // set
        get "right" () {
            return element.offsetLeft +
                element.offsetWidth ||
                parseInt(element.style.left) +
                parseInt(element.style.width);
        }, // get
        // get "y" () {
        //     return this.top + Math.floor(this.height / 2);
        // }, // get
        // get "x" () {
        //     return this.left + Math.floor(this.width / 2);
        // }, // get
        "verticalUnitInterval": verticalUnitInterval,
        "horizontalUnitInterval": horizontalUnitInterval,
        "verticalDirection": verticalDirection,
        "horizontalDirection": horizontalDirection,
        "bounceVertically": function() {
            this.verticalDirection = -this.verticalDirection;
        }, // function
        "bounceHorizontally": function() {
            this.horizontalDirection = -this.horizontalDirection;
        }, // function
        "moveVertically": function() {
            this.top = this.top + this.verticalDirection;
        }, // function
        "moveHorizontally": function() {
            this.left = this.left + this.horizontalDirection;
        }, // function
        "isNearVertically": function(moving) {
            return this.top <= moving.bottom &&
                this.bottom >= moving.top;
        }, // function
        "isNearHorizontally": function(moving) {
            return this.left <= moving.right &&
                this.right >= moving.left;
        }, // function
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
        }, // function
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
        }, // function
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
        // }, // function
        // "getDistanceBetween": function(moving) {
        //     return (Math.sqrt(
        //         Math.pow(this.x() - moving.getX(), 2) +
        //         Math.pow(this.y() - moving.getY(), 2)
        //     ) - (this.getAverageCircleRadius(moving) +
        //         moving.getAverageCircleRadius(this)));
        // }, // function
        "overlaps": function(moving) {
            return (this.top > moving.top &&
                    this.top < moving.bottom &&
                    this.left > moving.left &&
                    this.left < moving.right) ||
                (this.top > moving.top &&
                    this.top < moving.bottom &&
                    this.right < moving.right &&
                    this.right > moving.left) ||
                (this.bottom > moving.top &&
                    this.bottom < moving.bottom &&
                    this.left > moving.left &&
                    this.left < moving.right) ||
                (this.bottom > moving.top &&
                    this.bottom < moving.bottom &&
                    this.right < moving.right &&
                    this.right > moving.left);
        }, // function
        "click": function(f) {
            element.addEventListener("click", f);
        }, // function
        "act": function() {
            // minimum value is 1px.
            let style = element.style;
            let newWidth = parseInt(style.width) - xFactor;
            let newHeight = parseInt(style.height) - xFactor;
            if (newHeight > 0) {
                style.height = newHeight + "px";
            } // if
            if (newWidth > 0) {
                style.width = newWidth + "px";
            } // if
        } // function
    }; // return
} // function