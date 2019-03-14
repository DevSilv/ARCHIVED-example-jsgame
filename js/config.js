game.config.applyConfig = function() {
    const movingsCount = document.getElementsByClassName("movings-count")[0].value;
    const movingHeight = document.getElementsByClassName("moving-height")[0].value;
    const movingWidth = document.getElementsByClassName("moving-width")[0].value;
    const movingRadius = document.getElementsByClassName("moving-radius")[0].value;
    const verticalUnitMoveSize = document.getElementsByClassName("vertical-interval")[0].value;
    const horizontalUnitMoveSize = document.getElementsByClassName("horizontal-interval")[0].value;
    const XFactor = document.getElementsByClassName("x-factor")[0].value;

    // validation?

    this.parameters = {
        movingsCount,
        movingHeight,
        movingWidth,
        movingRadius,
        verticalUnitMoveSize,
        horizontalUnitMoveSize,
        XFactor
    };
};