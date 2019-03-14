for (let m of movings) {
    m.element.addEventListener("click", function() {
        // do not remove, when the game is not in the running state.
        if (parameters.state.isRunning === true) {
            m.element.remove();
            movings.forEach(mm => mm.act());
            if (movings.length === 0) {
                game.run.end(
                    parameters.state,
                    parameters.setIntervalID,
                    function() {
                        alert("Congratulations, you clicked them all out!");
                        playPauseButton.disabled = true;
                        newGameButton.disabled = false;
                        playPauseButton.childNodes[0].nodeValue = "Play";
                    }
                );
            }
        }
    });

    board.appendChild(m.element);
}