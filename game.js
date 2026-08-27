// ========================================
// TAP RUSH
// ========================================


// ========================================
// SUPABASE CONNECTION
// ========================================

const SUPABASE_URL =
    "https://ihjmbcljsppcabnprvcl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Kl_qSSKNGYVlGMwRR7PiZA_RstX8Ug9";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// GAME VARIABLES
// ========================================

let score = 0;
let timeLeft = 20;
let gameRunning = false;
let timer = null;


// ========================================
// TODAY'S CHALLENGE DATE
// ========================================

const today =
    new Date().toISOString().split("T")[0];


// ========================================
// PERSONAL BEST
// ========================================

let bestScore =
    Number(localStorage.getItem("tapRushBest")) || 0;


// ========================================
// SAVED PLAYER NAME
// ========================================

let savedPlayerName =
    localStorage.getItem("tapRushPlayerName") || "";


// ========================================
// AUDIO
// ========================================

let audioContext = null;


// ========================================
// HTML ELEMENTS
// ========================================

const scoreDisplay =
    document.getElementById("score");

const timeDisplay =
    document.getElementById("time");

const bestDisplay =
    document.getElementById("best");

const startButton =
    document.getElementById("startButton");

const tapButton =
    document.getElementById("tapButton");

const shareButton =
    document.getElementById("shareButton");

const message =
    document.getElementById("message");

const leaderboardList =
    document.getElementById("leaderboardList");

const challengeDate =
    document.getElementById("challengeDate");


// ========================================
// INITIAL DISPLAY
// ========================================

bestDisplay.textContent =
    bestScore;


if (challengeDate) {

    const date =
        new Date(today + "T00:00:00");

    challengeDate.textContent =
        date.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
}


// ========================================
// BUTTON EVENTS
// ========================================

startButton.addEventListener(
    "click",
    startGame
);

tapButton.addEventListener(
    "click",
    tap
);

shareButton.addEventListener(
    "click",
    shareScore
);


// ========================================
// START GAME
// ========================================

function startGame() {

    score = 0;

    timeLeft = 20;

    gameRunning = true;


    scoreDisplay.textContent =
        score;

    timeDisplay.textContent =
        timeLeft;


    message.textContent = "";


    startButton.disabled = true;

    tapButton.disabled = false;

    shareButton.style.display =
        "none";


    // Prepare audio after user interaction
    initAudio();


    timer = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent =
            timeLeft;


        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);
}


// ========================================
// TAP
// ========================================

function tap() {

    if (!gameRunning) {
        return;
    }


    score++;


    scoreDisplay.textContent =
        score;


    // Visual tap effect
    createTapEffect();


    // Tap sound
    playTapSound();
}


// ========================================
// INITIALIZE AUDIO
// ========================================

function initAudio() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        if (!audioContext) {

            audioContext =
                new AudioContext();

        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }

    } catch (error) {

        console.error(
            "Audio initialization error:",
            error
        );

    }
}


// ========================================
// TAP SOUND
// ========================================

function playTapSound() {

    try {

        initAudio();


        if (!audioContext) {
            return;
        }


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            700,
            audioContext.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            350,
            audioContext.currentTime + 0.08
        );


        gain.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.08
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            audioContext.destination
        );


        oscillator.start();


        oscillator.stop(
            audioContext.currentTime + 0.08
        );

    } catch (error) {

        console.error(
            "Tap sound error:",
            error
        );

    }
}


// ========================================
// TAP +1 EFFECT
// ========================================

function createTapEffect() {

    const effect =
        document.createElement(
            "div"
        );


    effect.textContent =
        "+1";


    effect.className =
        "tap-effect";


    effect.style.left =
        `${Math.random() * 60 + 20}%`;


    effect.style.top =
        `${Math.random() * 30 + 30}%`;


    const gameArea =
        document.querySelector(
            ".game-area"
        );


    if (!gameArea) {
        return;
    }


    gameArea.appendChild(
        effect
    );


    setTimeout(() => {

        effect.remove();

    }, 700);
}

// ========================================
// GAME OVER SOUND
// ========================================

function playGameOverSound() {

    try {

        initAudio();

        if (!audioContext) {
            return;
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type =
            "sine";

        oscillator.frequency.setValueAtTime(
            350,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            180,
            audioContext.currentTime + 0.25
        );

        gain.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.25
        );

        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.25
        );

    } catch (error) {

        console.error(
            "Game over sound error:",
            error
        );

    }
}


// ========================================
// NEW RECORD SOUND
// ========================================

function playNewRecordSound() {

    try {

        initAudio();

        if (!audioContext) {
            return;
        }

        const now =
            audioContext.currentTime;


        // First note
        const oscillator1 =
            audioContext.createOscillator();

        const gain1 =
            audioContext.createGain();

        oscillator1.type =
            "sine";

        oscillator1.frequency.value =
            600;

        gain1.gain.setValueAtTime(
            0.08,
            now
        );

        gain1.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.12
        );

        oscillator1.connect(gain1);

        gain1.connect(
            audioContext.destination
        );

        oscillator1.start(now);

        oscillator1.stop(now + 0.12);


        // Second note
        const oscillator2 =
            audioContext.createOscillator();

        const gain2 =
            audioContext.createGain();

        oscillator2.type =
            "sine";

        oscillator2.frequency.value =
            900;

        gain2.gain.setValueAtTime(
            0.08,
            now + 0.12
        );

        gain2.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.30
        );

        oscillator2.connect(gain2);

        gain2.connect(
            audioContext.destination
        );

        oscillator2.start(
            now + 0.12
        );

        oscillator2.stop(
            now + 0.30
        );

    } catch (error) {

        console.error(
            "New record sound error:",
            error
        );

    }
}
// ========================================
// END GAME
// ========================================

async function endGame() {

    gameRunning = false;


    clearInterval(timer);


    tapButton.disabled = true;

    startButton.disabled = false;


    // ========================================
    // PERSONAL BEST
    // ========================================

    if (score > bestScore) {

    bestScore = score;

    localStorage.setItem(
        "tapRushBest",
        bestScore
    );

    bestDisplay.textContent =
        bestScore;

    message.textContent =
        `🎉 NEW RECORD! ${score} taps!`;

    initAudio();

    setTimeout(() => {
        playNewRecordSound();
    }, 50);

} else {

    message.textContent =
        `Game Over! ${score} taps.`;

    playGameOverSound();

}


    shareButton.style.display =
        "block";


    // ========================================
    // SAVE TODAY'S SCORE
    // ========================================

    await submitScore();
}


// ========================================
// SUBMIT / UPDATE DAILY SCORE
// ========================================

async function submitScore() {

    let playerName =
        localStorage.getItem(
            "tapRushPlayerName"
        );


    // ========================================
    // ASK FOR NAME ONLY FIRST TIME
    // ========================================

    if (!playerName) {

        playerName =
            prompt(
                "Enter your nickname for today's leaderboard:"
            );


        if (!playerName) {
            return;
        }


        // Clean nickname
        playerName =
            playerName
                .trim()
                .substring(0, 20);


        if (!playerName) {
            return;
        }


        // Save nickname
        localStorage.setItem(
            "tapRushPlayerName",
            playerName
        );

    }


    console.log(
        "Checking daily score for:",
        playerName,
        today
    );


    // ========================================
    // CHECK TODAY'S EXISTING SCORE
    // ========================================

    const {
        data: existingPlayer,
        error: findError
    } =
        await supabaseClient
            .from("leaderboard")
            .select(
                "id, player_name, score, challenge_date"
            )
            .eq(
                "player_name",
                playerName
            )
            .eq(
                "challenge_date",
                today
            )
            .maybeSingle();


    if (findError) {

        console.error(
            "Error checking player:",
            findError
        );


        alert(
            "Unable to check your daily score."
        );


        return;
    }


    // ========================================
    // EXISTING PLAYER TODAY
    // ========================================

    if (existingPlayer) {

        console.log(
            "Today's existing best:",
            existingPlayer.score
        );


        // Only update if new score is higher
        if (score > existingPlayer.score) {

            const {
                error: updateError
            } =
                await supabaseClient
                    .from("leaderboard")
                    .update({
                        score: score
                    })
                    .eq(
                        "id",
                        existingPlayer.id
                    );


            if (updateError) {

                console.error(
                    "Update error:",
                    updateError
                );


                alert(
                    "Unable to update your daily score."
                );


                return;
            }


            message.textContent =
                `🏆 New daily record! ${score} taps!`;

        } else {

            message.textContent =
                `Your score: ${score}. Today's best: ${existingPlayer.score}`;

        }

    }


    // ========================================
    // NEW PLAYER TODAY
    // ========================================

    else {

        const {
            error: insertError
        } =
            await supabaseClient
                .from("leaderboard")
                .insert([
                    {
                        player_name:
                            playerName,

                        score:
                            score,

                        challenge_date:
                            today
                    }
                ]);


        if (insertError) {

            console.error(
                "Insert error:",
                insertError
            );


            alert(
                "Unable to submit your daily score."
            );


            return;
        }


        message.textContent =
            `🎉 You're on today's leaderboard with ${score}!`;

    }


    // ========================================
    // REFRESH LEADERBOARD
    // ========================================

    await loadLeaderboard();


    // ========================================
    // SHOW PLAYER RANK
    // ========================================

    await showPlayerRank(
        playerName
    );
}


// ========================================
// LOAD TODAY'S LEADERBOARD
// ========================================

async function loadLeaderboard() {

    leaderboardList.innerHTML =
        "Loading today's leaderboard...";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("leaderboard")
            .select(
                "player_name, score, challenge_date"
            )
            .eq(
                "challenge_date",
                today
            )
            .order(
                "score",
                {
                    ascending: false
                }
            )
            .limit(10);


    if (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        leaderboardList.innerHTML =
            "Unable to load today's leaderboard.";


        return;
    }


    if (!data || data.length === 0) {

        leaderboardList.innerHTML =
            "No scores today. Be the first!";


        return;
    }


    leaderboardList.innerHTML =
        "";


    // ========================================
    // DISPLAY LEADERBOARD
    // ========================================

    data.forEach(
        (player, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "leaderboard-row";


            let rank;


            if (index === 0) {

                rank = "🥇";

            } else if (index === 1) {

                rank = "🥈";

            } else if (index === 2) {

                rank = "🥉";

            } else {

                rank =
                    `${index + 1}.`;

            }


            row.innerHTML = `
                <span>
                    ${rank}
                    ${escapeHTML(
                        player.player_name
                    )}
                </span>

                <strong>
                    ${player.score}
                </strong>
            `;


            leaderboardList.appendChild(
                row
            );

        }
    );
}


// ========================================
// SHOW PLAYER'S CURRENT RANK
// ========================================

async function showPlayerRank(
    playerName
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("leaderboard")
            .select(
                "player_name, score"
            )
            .eq(
                "challenge_date",
                today
            )
            .order(
                "score",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Rank error:",
            error
        );


        return;
    }


    if (!data) {
        return;
    }


    const playerIndex =
        data.findIndex(
            player =>
                player.player_name.toLowerCase() ===
                playerName.toLowerCase()
        );


    if (playerIndex === -1) {
        return;
    }


    const rank =
        playerIndex + 1;


   message.textContent =
    `🏆 You're #${rank} today with ${score} taps!`;
}


// ========================================
// PROTECT LEADERBOARD DISPLAY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;
}


// ========================================
// SHARE SCORE
// ========================================

async function shareScore() {

    const text =
        `🔥 I scored ${score} taps on Tap Rush! Can you beat me?`;


    const url =
        window.location.href;


    // ========================================
    // MOBILE NATIVE SHARE
    // ========================================

    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    "Tap Rush",

                text:
                    text,

                url:
                    url

            });


            return;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;
            }

        }
    }


    // ========================================
    // CLIPBOARD FALLBACK
    // ========================================

    try {

        await navigator.clipboard.writeText(
            `${text}\n${url}`
        );


        alert(
            "Share message copied!"
        );


    } catch (error) {

        prompt(
            "Copy this message:",
            `${text}\n${url}`
        );

    }
}


// ========================================
// LOAD LEADERBOARD ON PAGE LOAD
// ========================================

loadLeaderboard();