// ========================================
// TAP RUSH - GAME LOGIC
// ========================================

// Game variables
let score = 0;
let timeLeft = 10;
let gameRunning = false;
let timer;

// Get saved best score from the browser
let bestScore = localStorage.getItem("tapRushBest") || 0;


// ========================================
// GET HTML ELEMENTS
// ========================================

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const bestDisplay = document.getElementById("best");

const tapButton = document.getElementById("tapButton");
const startButton = document.getElementById("startButton");
const shareButton = document.getElementById("shareButton");

const message = document.getElementById("message");


// ========================================
// INITIAL SETUP
// ========================================

// Show saved best score
bestDisplay.textContent = bestScore;

// Disable TAP button before game starts
tapButton.disabled = true;


// ========================================
// BUTTON EVENTS
// ========================================

// Start Game
startButton.addEventListener("click", startGame);

// TAP
tapButton.addEventListener("click", tap);

// Share Score
shareButton.addEventListener("click", shareScore);


// ========================================
// TAP FUNCTION
// ========================================

function tap() {

    // Don't allow tapping when game isn't running
    if (!gameRunning) {
        return;
    }

    // Increase score
    score++;

    // Update score
    scoreDisplay.textContent = score;
}


// ========================================
// START GAME
// ========================================

function startGame() {

    // Reset game
    score = 0;
    timeLeft = 10;
    gameRunning = true;

    // Reset screen
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    // Clear previous message
    message.textContent = "";

    // Hide share button
    shareButton.style.display = "none";

    // Enable TAP button
    tapButton.disabled = false;

    // Disable Start button
    startButton.disabled = true;


    // ========================================
    // COUNTDOWN
    // ========================================

    timer = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent = timeLeft;

        // End game at zero
        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);
}


// ========================================
// END GAME
// ========================================

function endGame() {

    // Stop game
    gameRunning = false;

    // Stop countdown
    clearInterval(timer);

    // Disable TAP button
    tapButton.disabled = true;

    // Enable Start button
    startButton.disabled = false;


    // ========================================
    // CHECK BEST SCORE
    // ========================================

    if (score > bestScore) {

        // Save new record
        bestScore = score;

        localStorage.setItem(
            "tapRushBest",
            bestScore
        );

        // Update Best Score
        bestDisplay.textContent = bestScore;

        // Show new record
        message.textContent =
            `🎉 NEW RECORD! ${score} taps!`;

    } else {

        // Normal game over
        message.textContent =
            `Game Over! You scored ${score} taps. Best: ${bestScore}`;

    }


    // Show Share button
    shareButton.style.display = "block";
}


// ========================================
// SHARE SCORE
// ========================================

async function shareScore() {

    const shareText =
        `🔥 I scored ${score} taps on Tap Rush! Can you beat me?`;

    const shareUrl = window.location.href;


    // ========================================
    // OPTION 1: NATIVE PHONE SHARING
    // ========================================

    if (navigator.share) {

        try {

            await navigator.share({

                title: "Tap Rush",

                text: shareText,

                url: shareUrl

            });

            return;

        } catch (error) {

            // User cancelled the share menu
            if (error.name === "AbortError") {
                return;
            }

            console.log(
                "Native sharing failed:",
                error
            );
        }
    }


    // ========================================
    // OPTION 2: CLIPBOARD
    // ========================================

    try {

        if (navigator.clipboard) {

            await navigator.clipboard.writeText(
                `${shareText}\n${shareUrl}`
            );

            alert("Share message copied!");

            return;
        }

    } catch (error) {

        console.log(
            "Clipboard failed:",
            error
        );
    }


    // ========================================
    // OPTION 3: MANUAL COPY
    // ========================================

    const textToShare =
        `${shareText}\n${shareUrl}`;

    prompt(
        "Copy this message and share it with your friends:",
        textToShare
    );
}