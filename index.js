class AutoTyper {
  constructor(input) {
    this.value = '';
    this.step = 0;
    this.word = 0;
    this.isMulti = Array.isArray(input.typeValue);
    this.typeValueStore = input.typeValue;
    this.typeValue = this.isMulti ? input.typeValue[this.word] : input.typeValue;
    this.element = input.element;
    this.clearDelay = input.clearDelay || 500;
    this.typeDelay = input.typeDelay || 200;
    this.overrideDelay = 0;
    this.typing = false;
    this.interval = null;
    this.timeout = null;
    this.mouseOverFunc.bind(this);
    this.start.bind(this);
    this.render.bind(this);
    this.clearTypeInterval.bind(this);
    this.clearInputTimeout.bind(this);
    const func = this.mouseOverFunc.bind(this);
    this.element.addEventListener('mouseover', function() { func() });
    this.element.addEventListener('keydown', function(e) {
      func(e.target.value);
    });
    console.log(input.startDelay)
    if (input.startDelay) {
      const startFunc = this.start.bind(this);
      setTimeout(function() { startFunc() }, input.startDelay);
    }
    else {
      this.start();
    }
  }

  mouseOverFunc(value=null) {
    if (this.typing) {
      if (value) {
        this.value = value.replace(this.value, '');
        this.element.value = this.value;
        this.clearTypeInterval();
        this.clearInputTimeout();
      }
      this.typing = false;
    }
  }

  intervalFunc() {
    this.render();
    const func = this.intervalFunc.bind(this);
    let delay = this.typeDelay;
    if (this.step % 3 === 1) {
      delay = delay + (delay *.5);
    } else if (this.step % 5 === 1) {
      delay = Math.ceil(delay * .8);
    } else if (this.step % 6 === 1 || this.step % 7 === 1 || this.step % 8 === 1) {
      delay = Math.ceil(delay * .5);
    }
    delay += this.overrideDelay;
    if (this.overrideDelay) this.overrideDelay = 0;
    if (this.typing) this.interval = setTimeout(function() {func()}, delay)
  }

  timeoutFunc() {
    this.element.value = '';
    this.value = '';
  }

  start() {
    this.typing = true;
    if (this.timeout) this.clearInputTimeout();
    this.value = '';
    this.step = 0;
    this.word = 0;
    this.render(true);
    const func = this.intervalFunc.bind(this);
    this.interval = setTimeout(function() { func() }, this.typeDelay);
  }

  render(initial=false) {

    if (this.typeValue !== this.typeValueStore[this.word]) {
      this.value = '';
      this.typeValue = this.typeValueStore[this.word];
      this.element.value = this.value;
    }

    if (initial || (!this.typing && this.value !== '')) {
      this.value = '';
      this.element.value = this.value;
      if (!this.typing) {
        this.step = 0;
        this.clearTypeInterval();
      }
    } else if (this.step < this.typeValue.length) {
      this.value += this.typeValue[this.step];
      this.element.value = this.value;
      this.step++;
    } else if (this.isMulti && this.word < this.typeValueStore.length - 1) {
      this.word++;
      this.step = 0;
      this.overrideDelay = 250;
    } else {
      this.step = 0;
      this.word = 0;
      this.typing = false;
      this.value = '';
      const func = this.timeoutFunc.bind(this);
      this.timeout = setTimeout(function() {
        func();
      }, this.clearDelay);
      this.clearTypeInterval();
    }
  }

  clearInputTimeout() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  clearTypeInterval() {
    clearTimeout(this.interval);
    this.interval = null;
  }
}
