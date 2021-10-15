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

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;

    this.init();
  }

  init() {
    this.getTimeComponentsOnTick(0);
  }
  start() {
    if (this.isActive) {
      return;
    }
    const startTime = Date.now();
    this.isActive = true;
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      this.getTimeComponentsOnTick(deltaTime);
    }, 1000);
  }

  stop() {
    if (!this.isActive) {
      return;
    }
    clearInterval(this.intervalId);
    this.getTimeComponentsOnTick(0);
    this.isActive = false;
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
timerRefs.stopBtn.addEventListener('click', timer.stop.bind(timer));

function updateClockface({ hours, mins, secs }) {
  timerRefs.clockface.textContent = `${hours}:${mins}:${secs}`;
}
