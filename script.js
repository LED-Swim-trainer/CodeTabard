const maxLaps = 24;
const maxSwimmers = 4;
let swimmerCount = 1;
let timers = {};
let maxTimes = {};

document.getElementById('start-all').addEventListener('click', startAllTimers);
document.getElementById('stop-all').addEventListener('click', stopAllTimers);
document.getElementById('resume-all').addEventListener('click', resumeAllTimers);
document.getElementById('add-swimmer').addEventListener('click', addSwimmer);
document.getElementById('remove-swimmer').addEventListener('click', removeSwimmer);

document.querySelectorAll('.add-lap').forEach(button => {
    button.addEventListener('click', addLap);
});

document.querySelectorAll('.remove-lap').forEach(button => {
    button.addEventListener('click', removeLap);
});

function startAllTimers() {
    calculateMaxTimes();
    for (let i = 1; i <= swimmerCount; i++) {
        startTimer(i, true); // Pass true to reset timer
    }
}

function stopAllTimers() {
    for (let i = 1; i <= swimmerCount; i++) {
        stopTimer(i);
    }
}

function resumeAllTimers() {
    for (let i = 1; i <= swimmerCount; i++) {
        startTimer(i, false); // Pass false to resume timer
    }
}

function startTimer(swimmerId, reset = false) {
    if (!timers[swimmerId]) {
        timers[swimmerId] = { startTime: performance.now(), elapsedMilliseconds: 0, timerId: null };
    }
    if (reset) {
        timers[swimmerId].elapsedMilliseconds = 0;
        timers[swimmerId].startTime = performance.now();
    } else {
        timers[swimmerId].startTime = performance.now() - timers[swimmerId].elapsedMilliseconds;
    }
    updateLCD(swimmerId);
}

function stopTimer(swimmerId) {
    if (timers[swimmerId]) {
        cancelAnimationFrame(timers[swimmerId].timerId);
    }
}

function updateLCD(swimmerId) {
    const now = performance.now();
    const timer = timers[swimmerId];
    timer.elapsedMilliseconds = now - timer.startTime;

    let totalSeconds = Math.floor(timer.elapsedMilliseconds / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = Math.floor(timer.elapsedMilliseconds % 1000);

    document.querySelector(`#swimmer-${swimmerId} .lcd-number`).textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;

    if (timer.elapsedMilliseconds >= maxTimes[swimmerId] * 1000) {
        stopTimer(swimmerId);
    } else {
        timer.timerId = requestAnimationFrame(() => updateLCD(swimmerId));
    }
}

function addLap(event) {
    const lapsContainer = event.target.closest('.container').querySelector('.laps-container');
    if (lapsContainer.children.length < maxLaps) {
        const lap = document.createElement('div');
        lap.className = 'lap';
        lap.innerHTML = `
            <span>Lap ${lapsContainer.children.length + 1}</span>
            <input type="text" placeholder="Time in seconds">
        `;
        lapsContainer.appendChild(lap);
    }
}

function removeLap(event) {
    const lapsContainer = event.target.closest('.container').querySelector('.laps-container');
    if (lapsContainer.children.length > 0) {
        lapsContainer.removeChild(lapsContainer.lastChild);
    }
}

function addSwimmer() {
    if (swimmerCount < maxSwimmers) {
        swimmerCount++;
        const swimmersContainer = document.getElementById('swimmers');
        const newContainer = document.createElement('div');
        newContainer.className = 'container';
        newContainer.id = `swimmer-${swimmerCount}`;
        newContainer.innerHTML = `
            <h1 class="swimmer-title">Swimmer ${swimmerCount} Timer</h1>
            <div class="controls">
                <button class="add-lap">Add Lap</button>
                <button class="remove-lap">Remove Lap</button>
            </div>
            <div class="timer">
                <div class="lcd-number">00:00:000</div>
            </div>
            <div class="laps-container"></div>
        `;
        newContainer.querySelector('.add-lap').addEventListener('click', addLap);
        newContainer.querySelector('.remove-lap').addEventListener('click', removeLap);
        swimmersContainer.appendChild(newContainer);
    }
}

function removeSwimmer() {
    if (swimmerCount > 1) {
        const swimmersContainer = document.getElementById('swimmers');
        swimmersContainer.removeChild(swimmersContainer.lastChild);
        swimmerCount--;
    }
}

function calculateMaxTimes() {
    maxTimes = {};
    for (let i = 1; i <= swimmerCount; i++) {
        maxTimes[i] = getTotalLapTime(i);
    }
}

function getTotalLapTime(swimmerId) {
    let totalTime = 0;
    const lapsContainer = document.querySelector(`#swimmer-${swimmerId} .laps-container`);
    const laps = Array.from(lapsContainer.children);
    laps.forEach(lap => {
        const input = lap.querySelector('input');
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            totalTime += value;
        }
    });
    return totalTime;
}
