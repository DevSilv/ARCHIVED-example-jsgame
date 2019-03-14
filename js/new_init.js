game.init.init = function(state) {
    const newState = state;
    const movings = [];

    // add new properties for all movings.
    newState.parameters.moving.HTMLElementType = "div";
    newState.parameters.moving.CSSClasses = ["moving"];

    for (let i = 0; i < state.parameters.movings.count; ++i) {
        // construct new properties object for an individual moving.
        const individualState = {
            get ID() {
                return i;
            },
            get direction() {
                return {
                    get vertical() {
                        return Math.round(Math.random()) * 2 - 1;
                    },
                    get horizontal() {
                        return Math.round(Math.random()) * 2 - 1;
                    }
                }
            },
            get color() {
                return {
                    // the generated colors will be bright.
                    hue: Math.floor(Math.random() * 360),
                    saturation: Math.floor(Math.random() * 100),
                    lightness: Math.floor(Math.random() * 100 + 50)
                };
            }
        };

        movings.push(game.moving.createMoving(newState, individualState));
    };

    // validate if "top" and "left" do not
    //  overlap each other and the other,
    //  and then add them to "element".
    do {
        movings[i].top = Math.floor(
            Math.random() * (state.parameters.game.board.height - state.parameters.moving.height)
        );
        movings[i].left = Math.floor(
            Math.random() * (state.parameters.game.board.width - state.parameters.moving.width)
        );
    } while (movings.find(m => movings[i].overlaps(m)));

    return newState;
};