const timer = document.querySelector('.time');
const startBtn = document.querySelector('.start');
const pauseBtn = document.querySelector('.pause');
const resetBtn = document.querySelector('.reset');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const sessionType = document.querySelector('.session-type');
const sessionCount = document.querySelector('.session-count');
const alertSound = document.getElementById('alert-sound');

let countdown;
let isPaused = false;
let isWorking = true;
let timeInSeconds = workTimeInput.value * 60;
let completedSessions = 0;
const THRESHOLD_PERCENTAGE_1 = 0.3;
const THRESHOLD_PERCENTAGE_2 = 0.1;
const BLUE_COLOR = ' #0c1792';
const RED_COLOR = '#FF0000';


function updateBackgroundColor(remainingTimePercentage) {
    if (remainingTimePercentage <= THRESHOLD_PERCENTAGE_2) {
        document.body.style.backgroundColor = RED_COLOR;
    } else if (remainingTimePercentage <= 0.3) {
        document.body.style.backgroundColor = BLUE_COLOR;
    } else {
        document.body.style.backgroundColor = '#0c1792'; // blue
    }
}


function startTimer() {
    countdown = setInterval(() => {
        timeInSeconds--;
        // updateTimer();
        const remainingTimePercentage = timeInSeconds / (isWorking ? workTimeInput.value : breakTimeInput.value) / 60;
        updateTimer();
        updateBackgroundColor(remainingTimePercentage);
        if (timeInSeconds === 0) {
            playAlertSound();
            clearInterval(countdown);
            if (isWorking) {
                completedSessions++;
                sessionCount.textContent = `Completed Sessions: ${completedSessions}`;
            }
            isWorking = !isWorking;
            updateSessionType();
            timeInSeconds = (isWorking ? workTimeInput.value : breakTimeInput.value) * 60;
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdown);
    isPaused = true;
}

function resetTimer() {
    clearInterval(countdown);
    isPaused = false;
    isWorking = true;
    timeInSeconds = workTimeInput.value * 60;
    completedSessions = 0;
    sessionType.textContent = '';
    sessionCount.textContent = '';
    updateTimer();
}

function updateTimer() {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    timer.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateSessionType() {
    sessionType.textContent = isWorking ? 'Work Session' :  'Break Session';
}

function playAlertSound() {
    alertSound.currentTime = 0;
    alertSound.play();
}

startBtn.addEventListener('click', () => {
    if (isPaused) {
        startTimer();
        isPaused = false;
    } else {
        updateSessionType();
        startTimer();
    }
});

pauseBtn.addEventListener('click', pauseTimer);

resetBtn.addEventListener('click', resetTimer);

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    workTimeInput.disabled = true;
    breakTimeInput.disabled = true;
    timeInSeconds = workTimeInput.value * 60;
    updateTimer();
    resetTimer();
});

updateTimer();