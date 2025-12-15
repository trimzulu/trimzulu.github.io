const ROOT_CLASS_NAME = "digit-flipper";

function getDaysElapsed(startDate) {
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getYearsElapsed(startDate) {
  const today = new Date();
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();
  
  let years = today.getFullYear() - startYear;
  let months = today.getMonth() - startMonth;
  let days = today.getDate() - startDay;
  
  // Adjust if we haven't reached the anniversary month/day yet
  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }
  if (days < 0) {
    months--;
    // Get days in previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  // Convert to decimal years
  const totalMonths = years * 12 + months;
  const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const decimalYears = totalMonths / 12 + (days / daysInCurrentMonth) / 12;
  
  return parseFloat(decimalYears.toFixed(2));
}

class DigitFlipper {
  constructor(element, options = {
    number: 9,
    iterationCount: 9 })
  {
    this.options = Object.assign({}, options);
    if (!this.options.number) this.options.number = 9;
    if (!this.options.iterationCount) this.options.iterationCount = 9;
    if (this.options.number - this.options.iterationCount < 0) {
      this.options.iterationCount = this.options.number;
    }
    this.element = element;
    this.digitClassName = `${ROOT_CLASS_NAME}__digit`;
    this.topClassName = `${this.digitClassName}-top`;
    this.bottomClassName = `${this.digitClassName}-bottom`;
    this.flipTopClass = `${this.digitClassName}--flip-top`;
    this.flipBottomClass = `${this.digitClassName}--flip-bottom`;
    this.DOMNodes = [];
    this.flipDuration = 0.3;
    this._init();
    return this;
  }
  _init() {
    this._populateDOM();
  }
  // creates DOM elements for each digit and all of its "iterations"
  _populateDOM() {
    let i = this.options.number - this.options.iterationCount;
    for (i; i <= this.options.number; i++) {
      const digit = document.createElement("span"),
      digitTop = document.createElement("span"),
      digitBottom = document.createElement("span"),
      digitText = document.createTextNode(i);
      digit.className = this.digitClassName;
      digitTop.className = this.topClassName;
      digitBottom.className = this.bottomClassName;
      digitTop.appendChild(digitText);
      digitBottom.appendChild(digitText.cloneNode());
      digit.appendChild(digitTop);
      digit.appendChild(digitBottom);
      this.DOMNodes.push(digit);
      this.element.insertAdjacentElement("afterbegin", digit);
    }
  }
  // runs the animtion sequence for the digit
  flip() {
    this.DOMNodes.forEach((node, index) => {
      const nextNode = this.DOMNodes[index + 1];
      let delay = this.flipDuration * index * 1000;
      // The flipBottomClass turns the bottom half
      // down from it's inital state of 90deg
      // The flipTopClass turns the top half
      // down from it's inital state of 0deg
      const t1 = setTimeout(() => {
        node.classList.add(this.flipBottomClass);
        clearTimeout(t1);
        const t2 = setTimeout(() => {
          if (nextNode) node.classList.add(this.flipTopClass);
          clearTimeout(t2);
          const t3 = setTimeout(() => {
            node.style.zIndex = index + 1;
            clearTimeout(t3);
          }, this.flipDuration);
        }, this.flipDuration);
      }, delay);
    });
  }}
class FlipCounter {
  constructor(element, value) {
    if (typeof value !== "number") return;
    this.element = element;
    this.targetNumber = value;
    this.targetDigits = [];
    this.valueString = this.targetNumber.toString();
    this.numDigits = this.valueString.length;
    this.DOMNodes = [];
    this.flipperInstances = [];
    // separate the digits of the value arg
    for (let i = 0; i < this.numDigits; i++) {
      this.targetDigits.push(this.valueString[i]);
    }
    this.populateDOM();
    this.populateInstanceArray();
  }
  // creates wrapper elements for each digit
  populateDOM() {
    this.element.innerHTML = "";
    let i = 0;
    for (i; i < this.numDigits; i++) {
      const container = document.createElement("span");
      // Check if this is a decimal point
      if (this.targetDigits[i] === '.') {
        container.className = 'digit-decimal';
        container.textContent = '.';
      } else {
        container.className = ROOT_CLASS_NAME;
      }
      this.element.appendChild(container);
      this.DOMNodes.push(container);
    }
  }
  // instantiate a DigitFlipper object for each digit
  populateInstanceArray() {
    this.DOMNodes.forEach((digit, index) => {
      // Skip decimal points
      if (this.targetDigits[index] === '.') {
        this.flipperInstances.push(null);
      } else {
        this.flipperInstances.push(
          new DigitFlipper(digit, {
            number: this.targetDigits[index],
            iterationCount: 4 }));
      }
    });
  }
  // runs the animation, with a 200ms stagger
  play() {
    this.flipperInstances.forEach((instance, index) => {
      if (instance !== null) {
        let delay = index * 200;
        setTimeout(() => instance.flip(), delay);
      }
    });
  }}