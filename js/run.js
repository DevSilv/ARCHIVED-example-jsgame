game.run.run = function(state, movings, f, timeout) {
    const newState = state;
    state.sessionID = setInterval(() => f(movings), timeout);
    return newState;
};

game.run.pause = function(state, sessionID) {
    const newState = state;
    clearInterval(sessionID);
    newState.isPaused = true;
    return newState;
};

game.run.end = function(state, sessionID, cleanUp) {
    const newState = state;
    clearInterval(sessionID);
    cleanUp();
    newState.isWon = true;
    return newState;
};