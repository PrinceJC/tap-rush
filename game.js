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
// COMBO VARIABLES
// ========================================

let combo = 0;
let comboTimer = null;

const COMBO_TIMEOUT = 1000;


// ========================================
// AUDIO
// ========================================

let audioContext = null;


// ========================================
// TODAY'S CHALLENGE DATE
// ========================================

const today =
    new Date().toISOString().split("T")[0];


// ========================================
// PERSONAL BEST
// ========================================

let bestScore =
    Number(
        localStorage.getItem(
            "tapRushBest"
        )
    ) || 0;


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
    document.getElementById(
        "leaderboardList"
    );

const challengeDate =
    document.getElementById(
        "challengeDate"
    );

const comboDisplay =
    document.getElementById(
        "comboDisplay"
    );


// ========================================
// INITIAL DISPLAY
// ========================================

bestDisplay.textContent =
    bestScore;


if (challengeDate) {

    const date =
        new Date(
            today + "T00:00:00"
        );

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


if (comboDisplay) {

    comboDisplay.textContent =
        "🔥 COMBO x0";
}


// ========================================
// BUTTON EVENTS
// ========================================

startButton.addEventListener(
    "click",
    startGame
);

tapButton.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        tap();
    }
);

shareButton.addEventListener(
    "click",
    shareScore
);


// ========================================
// AUDIO INITIALIZATION
// ========================================

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }
}


// ========================================
// NORMAL TAP SOUND
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
            420,
            audioContext.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            650,
            audioContext.currentTime + 0.06
        );


        gain.gain.setValueAtTime(
            0.05,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.07
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.07
        );

    } catch (error) {

        console.error(
            "Tap sound error:",
            error
        );
    }
}


// ========================================
// TONE HELPER
// ========================================

function playTone(
    frequency,
    duration,
    delay = 0
) {

    if (!audioContext) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    const startTime =
        audioContext.currentTime +
        delay;


    oscillator.type =
        "sine";


    oscillator.frequency.setValueAtTime(
        frequency,
        startTime
    );


    gain.gain.setValueAtTime(
        0.08,
        startTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start(
        startTime
    );


    oscillator.stop(
        startTime + duration
    );
}


// ========================================
// COMBO MILESTONE SOUNDS
// ========================================

function playComboSound(
    comboLevel
) {

    try {

        initAudio();

        if (!audioContext) {
            return;
        }


        // X5

        if (comboLevel === 5) {

            playTone(700, 0.15);

            playTone(
                1000,
                0.18,
                0.12
            );
        }


        // X10

        if (comboLevel === 10) {

            playTone(700, 0.12);

            playTone(
                900,
                0.12,
                0.12
            );

            playTone(
                1200,
                0.18,
                0.24
            );
        }


        // X20

        if (comboLevel === 20) {

            playTone(600, 0.12);

            playTone(
                800,
                0.12,
                0.12
            );

            playTone(
                1000,
                0.12,
                0.24
            );

            playTone(
                1400,
                0.25,
                0.36
            );
        }


        // X50

        if (comboLevel === 50) {

            playTone(650, 0.10);

            playTone(
                850,
                0.10,
                0.10
            );

            playTone(
                1050,
                0.10,
                0.20
            );

            playTone(
                1300,
                0.18,
                0.30
            );
        }


        // X80

        if (comboLevel === 80) {

            playTone(700, 0.10);

            playTone(
                900,
                0.10,
                0.10
            );

            playTone(
                1100,
                0.10,
                0.20
            );

            playTone(
                1350,
                0.10,
                0.30
            );

            playTone(
                1550,
                0.20,
                0.40
            );
        }


        // X100

        if (comboLevel === 100) {

            playTone(700, 0.12);

            playTone(
                900,
                0.12,
                0.12
            );

            playTone(
                1100,
                0.12,
                0.24
            );

            playTone(
                1400,
                0.18,
                0.36
            );
        }


        // X150

        if (comboLevel === 150) {

            playTone(700, 0.10);

            playTone(
                900,
                0.10,
                0.10
            );

            playTone(
                1100,
                0.10,
                0.20
            );

            playTone(
                1300,
                0.10,
                0.30
            );

            playTone(
                1600,
                0.25,
                0.40
            );
        }


        // X200

        if (comboLevel === 200) {

            playTone(600, 0.10);

            playTone(
                800,
                0.10,
                0.10
            );

            playTone(
                1000,
                0.10,
                0.20
            );

            playTone(
                1200,
                0.10,
                0.30
            );

            playTone(
                1500,
                0.12,
                0.40
            );

            playTone(
                1800,
                0.30,
                0.52
            );
        }

    } catch (error) {

        console.error(
            "Combo sound error:",
            error
        );
    }
}


// ========================================
// COMBO CELEBRATION
// ========================================

function comboCelebration(
    comboLevel
) {

    // X5

    if (comboLevel === 5) {

        if (comboDisplay) {

            comboDisplay.classList.add(
                "combo-celebrate-small"
            );


            setTimeout(() => {

                comboDisplay.classList.remove(
                    "combo-celebrate-small"
                );

            }, 400);
        }
    }


    // X10

    if (comboLevel === 10) {

        document.body.classList.add(
            "combo-shake-small"
        );

        createComboParticles(8);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake-small"
            );

        }, 350);
    }


    // X20

    if (comboLevel === 20) {

        document.body.classList.add(
            "combo-shake"
        );

        createComboParticles(15);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake"
            );

        }, 500);
    }


    // X50

    if (comboLevel === 50) {

        document.body.classList.add(
            "combo-shake-big"
        );

        createComboParticles(22);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake-big"
            );

        }, 600);
    }


    // X80

    if (comboLevel === 80) {

        document.body.classList.add(
            "combo-shake-big"
        );

        createComboParticles(26);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake-big"
            );

        }, 650);
    }


    // X100

    if (comboLevel === 100) {

        document.body.classList.add(
            "combo-shake-big"
        );

        createComboParticles(30);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake-big"
            );

        }, 700);
    }


    // X150

    if (comboLevel === 150) {

        document.body.classList.add(
            "combo-shake-epic"
        );

        createComboParticles(45);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake-epic"
            );

        }, 900);
    }


    // X200

    if (comboLevel === 200) {

        document.body.classList.add(
            "combo-shake-ultimate"
        );

        createComboParticles(70);


        setTimeout(() => {

            document.body.classList.remove(
                "combo-shake-ultimate"
            );

        }, 1200);
    }
}


// ========================================
// COMBO PARTICLES
// ========================================

function createComboParticles(
    amount
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "combo-particle";


        particle.textContent =
            [
                "🔥",
                "⚡",
                "💥",
                "✨"
            ][
                Math.floor(
                    Math.random() * 4
                )
            ];


        particle.style.left =
            `${
                50 +
                (
                    Math.random() * 30 -
                    15
                )
            }%`;


        particle.style.top =
            `${
                50 +
                (
                    Math.random() * 20 -
                    10
                )
            }%`;


        particle.style.setProperty(
            "--x",
            `${
                Math.random() * 400 -
                200
            }px`
        );


        particle.style.setProperty(
            "--y",
            `${
                Math.random() * 400 -
                200
            }px`
        );


        document.body.appendChild(
            particle
        );


        setTimeout(() => {

            particle.remove();

        }, 900);
    }
}


// ========================================
// START GAME
// ========================================

function startGame() {

    score = 0;

    timeLeft = 20;

    combo = 0;

    gameRunning = true;


    if (comboTimer) {

        clearTimeout(
            comboTimer
        );
    }


    scoreDisplay.textContent =
        score;

    scoreDisplay.classList.remove(
        "score-pop"
    );

    if (comboDisplay) {

        comboDisplay.textContent =
            "🔥 COMBO x0";

        comboDisplay.classList.remove(
            "combo-pop"
        );

        comboDisplay.classList.remove(
            "combo-milestone"
        );
    }


    message.textContent =
        "";


    startButton.disabled =
        true;

    tapButton.disabled =
        false;


    shareButton.style.display =
        "none";


    initAudio();


    timer =
    setInterval(() => {

        timeLeft--;

        timeDisplay.textContent =
            timeLeft;


        // ========================================
        // TIMER WARNING EFFECT
        // ========================================

        if (timeLeft <= 10) {

            timeDisplay.classList.add(
                "timer-warning"
            );

        }


        if (timeLeft <= 5) {

            timeDisplay.classList.remove(
                "timer-warning"
            );

            timeDisplay.classList.add(
                "timer-danger"
            );

        }


        // ========================================
        // COUNTDOWN EFFECT
        // ========================================

        if (
            timeLeft <= 3 &&
            timeLeft > 0
        ) {

            timeDisplay.classList.remove(
                "timer-countdown"
            );

            void timeDisplay.offsetWidth;

            timeDisplay.classList.add(
                "timer-countdown"
            );
        }


        // ========================================
        // GAME OVER
        // ========================================

        if (timeLeft <= 0) {

            timeDisplay.classList.remove(
                "timer-warning"
            );

            timeDisplay.classList.remove(
                "timer-danger"
            );

            timeDisplay.classList.remove(
                "timer-countdown"
            );


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


    // SCORE

    score++;


    scoreDisplay.textContent =
        score;
    scoreDisplay.classList.remove(
    "score-pop"
    );

    void scoreDisplay.offsetWidth;

    scoreDisplay.classList.add(
    "score-pop"
    );


    // COMBO

    combo++;


    if (comboDisplay) {

        comboDisplay.textContent =
            `🔥 COMBO x${combo}`;


        comboDisplay.classList.remove(
            "combo-pop"
        );


        void comboDisplay.offsetWidth;


        comboDisplay.classList.add(
            "combo-pop"
        );


        // MILESTONES

        if (
            combo === 5 ||
            combo === 10 ||
            combo === 20 ||
            combo === 50 ||
            combo === 80 ||
            combo === 100 ||
            combo === 150 ||
            combo === 200
        ) {

            comboDisplay.classList.remove(
                "combo-milestone"
            );


            void comboDisplay.offsetWidth;


            comboDisplay.classList.add(
                "combo-milestone"
            );


            playComboSound(
                combo
            );


            comboCelebration(
                combo
            );
        }
    }


    // RESET COMBO TIMER

    if (comboTimer) {

        clearTimeout(
            comboTimer
        );
    }


    comboTimer =
        setTimeout(() => {

            combo = 0;


            if (comboDisplay) {

                comboDisplay.textContent =
                    "🔥 COMBO x0";


                comboDisplay.classList.remove(
                    "combo-pop"
                );


                comboDisplay.classList.remove(
                    "combo-milestone"
                );
            }

        }, COMBO_TIMEOUT);


    // TAP EFFECT

    createTapEffect();


    // TAP SOUND

    playTapSound();
}


// ========================================
// TAP +1 EFFECT
// ========================================

function createTapEffect() {

    const effect =
        document.createElement(
            "div"
        );


    effect.className =
        "tap-effect";


    effect.textContent =
        "+1";


    const rect =
        tapButton.getBoundingClientRect();


    effect.style.left =
        `${
            rect.left +
            rect.width / 2
        }px`;


    effect.style.top =
        `${
            rect.top +
            rect.height / 2
        }px`;


    document.body.appendChild(
        effect
    );


    setTimeout(() => {

        effect.remove();

    }, 700);
}


// ========================================
// END GAME
// ========================================

async function endGame() {

    gameRunning = false;


    clearInterval(
        timer
    );


    if (comboTimer) {

        clearTimeout(
            comboTimer
        );
    }


    combo = 0;


    tapButton.disabled =
        true;


    startButton.disabled =
        false;


    // PERSONAL BEST

    if (score > bestScore) {

        bestScore =
            score;


        localStorage.setItem(
            "tapRushBest",
            bestScore
        );


        bestDisplay.textContent =
            bestScore;


        message.textContent =
            `🎉 NEW RECORD! ${score} taps!`;

    } else {

        message.textContent =
            `Game Over! ${score} taps.`;
    }


    shareButton.style.display =
        "block";


    // SAVE SCORE

    await submitScore();
}


// ========================================
// SUBMIT / UPDATE DAILY SCORE
// ========================================

async function submitScore() {

    // ========================================
    // GET SAVED NICKNAME
    // ========================================

    let playerName =
        localStorage.getItem(
            "tapRushPlayerName"
        );


    // ========================================
    // ASK ONLY ON FIRST GAME
    // ========================================

    if (!playerName) {

        playerName =
            prompt(
                "Enter your nickname for today's leaderboard:"
            );


        if (!playerName) {
            return;
        }


        playerName =
            playerName
                .trim()
                .substring(
                    0,
                    20
                );


        if (!playerName) {
            return;
        }


        // SAVE NICKNAME

        localStorage.setItem(
            "tapRushPlayerName",
            playerName
        );
    }


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

        if (
            score >
            existingPlayer.score
        ) {

            const {
                error: updateError
            } =
                await supabaseClient
                    .from("leaderboard")
                    .update({
                        score:
                            score
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
    // SHOW PLAYER RANK + SCORE
    // ========================================

    await showPlayerRank(
        playerName
    );
}


// ========================================
// LOAD TOP 10 LEADERBOARD
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


    if (
        !data ||
        data.length === 0
    ) {

        leaderboardList.innerHTML =
            "No scores today. Be the first!";


        return;
    }


    leaderboardList.innerHTML =
        "";


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
// SHOW PLAYER RANK + SCORE
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
                player.player_name
                    .toLowerCase() ===
                playerName
                    .toLowerCase()
        );


    if (
        playerIndex === -1
    ) {

        return;
    }


    const rank =
        playerIndex + 1;


    const playerScore =
        data[playerIndex].score;


    message.textContent =
        `🏆 You're #${rank} today with ${playerScore} taps!`;
}


// ========================================
// PROTECT LEADERBOARD DISPLAY
// ========================================

function escapeHTML(
    text
) {

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