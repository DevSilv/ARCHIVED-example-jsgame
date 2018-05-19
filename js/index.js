let isRunning = false;
let setIntervalId = 0;
let time = 0;

window.addEventListener("load", function() {
    "use strict";

    let gameField = document.getElementsByClassName("game-field")[0];
    let newGameButton =
        document.getElementsByClassName("new-game-button")[0];
    let playPauseButton =
        document.getElementsByClassName("play-pause-button")[0];
    let toggleParametersButton =
        document.getElementsByClassName("toggle-parameters-button")[0];
    let movings = [];
    // miliseconds. the higher value, the slower game run. the browser
    //  probably sets it as its minimum, if less than that.
    let intervalTime = 0;

    newGameButton.addEventListener("click", function() {
        movings = initGame(gameField, newGameButton, playPauseButton);
        playPauseButton.disabled = false;
        playPauseButton.childNodes[0].nodeValue = "Play";
        time = 0;
        document
            .getElementsByClassName("game-time")[0]
            .childNodes[0]
            .nodeValue = time;
    });

    playPauseButton.addEventListener("click", function() {
        if (isRunning === true) {
            // pause the game.
            isRunning = false;
            window.clearInterval(setIntervalId);
            playPauseButton.childNodes[0].nodeValue = "Resume";
            newGameButton.disabled = false;
            toggleParametersButton.disabled = false;
        } else {
            // resume or play the game the first time.
            let timerLabel =
                document
                .getElementsByClassName("game-time")[0]
                .childNodes[0];
            isRunning = true;
            setIntervalId = game(gameField, movings, intervalTime, timerLabel);
            playPauseButton.childNodes[0].nodeValue = "Pause";
            newGameButton.disabled = true;
            toggleParametersButton.disabled = true;
        }
    });

    let gameParametersContainer =
        document.getElementsByClassName("game-parameters-container")[0];
    let defaultGameParametersContainerDisplay =
        window.getComputedStyle(gameParametersContainer).display;
    toggleParametersButton.addEventListener("click", function() {
        if (gameParametersContainer.style.display === "none") {
            newGameButton.disabled = true;
            gameParametersContainer.style.display =
                defaultGameParametersContainerDisplay;
        } else {
            newGameButton.disabled = false;
            gameParametersContainer.style.display = "none";
        }
    });
    gameParametersContainer.style.display = "none";
});

document.addEventListener("touchstart", function() {

}, false);