game.moving.createMoving = function(state, individualState) {
    const element = document.createElement(state.parameters.moving.HTMLElementType);
    element.classList.add(...state.parameters.moving.CSSClasses);
    element.style.height = state.parameters.moving.height + "px";
    element.style.width = state.parameters.moving.width + "px";
    element.style.borderRadius = state.parameters.moving.radius + "px";
    element.style.backgroundColor =
        "hsl(" + state.parameters.moving.color.hue + "," +
        state.parameters.moving.color.saturation + "%," +
        state.parameters.moving.color.lightness + "%)";

    const moving = {
        get ID() {
            return individualState.ID;
        },
        get HTMLElement() {
            return element;
        },
        get height() {
            return element.offsetHeight || parseInt(element.style.height);
        },
        set height(height) {
            element.style.height = height + "px";
        },
        get width() {
            return element.offsetWidth || parseInt(element.style.width);
        },
        set width(width) {
            element.style.width = width + "px";
        },
        get top() {
            return element.offsetTop || parseInt(element.style.top);
        },
        set top(top) {
            element.style.top = top + "px";
        },
        get bottom() {
            return element.offsetTop + element.offsetHeight ||
                parseInt(element.style.top) + parseInt(element.style.height);
        },
        get left()  {
            return element.offsetLeft || parseInt(element.style.left);
        },
        set left(left) {
            element.style.left = left + "px";
        },
        get right() {
            return element.offsetLeft + element.offsetWidth ||
                parseInt(element.style.left) + parseInt(element.style.width);
        },
        verticalMoveUnitSize: state.parameters.moving.moveUnitSize.vertical,
        horizontalMoveUnitSize: state.parameters.moving.moveUnitSize.horizontal,
        verticalDirection: state.parameters.moving.direction.vertical,
        horizontalDirection: state.parameters.moving.direction.horizontal,
        revertVerticalDirection: function() {
            this.verticalDirection = -this.verticalDirection;
        },
        revertHorizontalDirection: function() {
            this.horizontalDirection = -this.horizontalDirection;
        },
        moveVertically: function() {
            this.top += this.verticalDirection;
        },
        moveHorizontally: function() {
            this.left += this.horizontalDirection;
        },
        isNearVertically: function(moving) {
            return this.top <= moving.bottom && this.bottom >= moving.top;
        },
        isNearHorizontally: function(moving) {
            return this.left <= moving.right && this.right >= moving.left;
        },
        getVerticalDistanceBetween: function(moving) {
            let distance = 0;
            if (this.bottom <= moving.top) {
                // "this" is above "moving"
                //  or at the same height
                distance = moving.top - this.bottom;
            } else if (this.top > moving.bottom) {
                // "this" is below "moving"
                distance = this.top - moving.bottom;
            } // else "distance" should be 0
            return distance;
        },
        getHorizontalDistanceBetween: function(moving) {
            let distance = 0;
            if (this.right <= moving.left) {
                // "this" is to the left of "moving"
                //  or at the same width
                distance = moving.left - this.right;
            } else if (this.left > moving.right) {
                // "this" is to the right of "moving"
                distance = this.left - moving.right;
            } // else "distance" should be 0
            return distance;
        },
        overlaps: function(moving) {
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
        },
        act: function() {
            const style = element.style;
            const newWidth = parseInt(style.width) - state.parameters.moving.xFactor;
            const newHeight = parseInt(style.height) - state.parameters.moving.xFactor;
            if (newHeight > state.parameters.moving.xFactor) {
                style.height = newHeight + "px";
            }
            if (newWidth > state.parameters.moving.xFactor) {
                style.width = newWidth + "px";
            }
        }
    };

    return moving;
};