import './sass/main.scss';

//надоедалка
const bootstrap = require('bootstrap');

const refs = {
  modal: document.querySelector('#subscription-modal'),
  subscribeBtn: document.querySelector('button[data-subscribe]'),
  number: document.querySelector('.number'),
  times: document.querySelector('.times'),
};

const DELAY = 3000;
let counter = 3;
const ZERO = 0;
let hasSubscribed = false;

const modal = new bootstrap.Modal('#subscription-modal');

openModal();

refs.modal.addEventListener('hide.bs.modal', openModal);

refs.subscribeBtn.addEventListener('click', onSubscribeBtn);

function openModal() {
  if (counter === ZERO || hasSubscribed) {
    return;
  }
  setTimeout(() => {
    modal.show();
    counter -= 1;
    refs.number.textContent = counter;
    counter === 2
      ? (refs.times.textContent = 'раза')
      : (refs.times.textContent = 'раз');
  }, DELAY);
}

function onSubscribeBtn() {
  hasSubscribed = true;
  modal.hide();
}

//Timer

const timerRefs = {
  startBtn: document.querySelector('button[data-action-start]'),
  stopBtn: document.querySelector('button[data-action-stop]'),
  clockface: document.querySelector('.js-clockface'),
};

const RUN = 'Запустить';
const PROCCED = 'Продолжить';
const STOP = 'Остановить';
const RESET = 'Сбросить';

class Timer {
  constructor({ onTick }) {
    this.isRunning = false;
    this.value = 0;
    this.startTime = 0;

    this.intervalId = null;
    this.onTick = onTick;

    this.init();
  }

  init() {
    this.getTimeComponentsOnTick(this.value);
    timerRefs.startBtn.textContent = RUN;
    timerRefs.stopBtn.disabled = true;
  }
  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    timerRefs.stopBtn.textContent = STOP;
    //'- this.value' - for continue after stop
    this.startTime = Date.now() - this.value;
    this.intervalId = setInterval(() => {
      this.value = Date.now() - this.startTime;
      this.getTimeComponentsOnTick(this.value);
    }, 1000);
    timerRefs.startBtn.disabled = true;
    timerRefs.stopBtn.disabled = false;
  }
  stop() {
    if (!this.isRunning) {
      return;
    }
    clearInterval(this.intervalId);
    timerRefs.startBtn.textContent = PROCCED;
    timerRefs.startBtn.disabled = false;
    this.isRunning = false;
  }

  clear() {
    this.value = 0;
    this.init();
  }
  stopOrClear() {
    if (timerRefs.stopBtn.textContent === STOP) {
      this.stop();
      timerRefs.stopBtn.textContent = RESET;
    } else {
      this.clear();
      timerRefs.stopBtn.textContent = STOP;
    }
  }
  getTimeComponents(time) {
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { hours, mins, secs };
  }
  getTimeComponentsOnTick(timeComponents) {
    const time = this.getTimeComponents(timeComponents);
    this.onTick(time);
  }
  pad(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTick: updateClockface,
});

timerRefs.startBtn.addEventListener('click', timer.start.bind(timer));
timerRefs.stopBtn.addEventListener('click', timer.stopOrClear.bind(timer));

function updateClockface({ hours, mins, secs }) {
  timerRefs.clockface.textContent = `${hours}:${mins}:${secs}`;
}
