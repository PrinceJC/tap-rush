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
let timeLeft = 10;
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

    timeLeft = 10;

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

    } else {

        message.textContent =
            `Game Over! ${score} taps.`;

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


    // Refresh leaderboard
    loadLeaderboard();
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


    leaderboardList.innerHTML = "";


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
                    ${escapeHTML(player.player_name)}
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