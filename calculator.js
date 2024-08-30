document.addEventListener("DOMContentLoaded", () => {
  initializeAppContainer();
  const screen = setupDisplayScreen();
  const buttons = setupButtonsContainer();

  const keys = [
    "d%",
    "dx",
    "del",
    "AC",
    "d4",
    "d6",
    "d8",
    "÷",
    "d10",
    "d12",
    "d20",
    "x",
    "7",
    "8",
    "9",
    "-",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "Enter",
    "0",
    "(",
    ")",
  ];
  addCalculatorKeys(keys, buttons);

  const app = document.querySelector(".app");
  app.append(screen, buttons);
});

class ListNode {
  constructor(data) {
    this.data = data; // will gold the current key
    this.next = null; // will hold latest state of calculator
    this.prev = null; // will hold previous state of calculator
  }
}

const state = {
  equation: null,
  currentState: "0",
  prevState: "0",
  lastKey: null,
};
const operationKeys = ["÷", "x", "-", "+", "Enter"];
const diceKeys = ["d%", "dx", "d4", "d6", "d8", "d10", "d12", "d20"];

const initializeAppContainer = () => {
  const app = document.querySelector(".app");
  app.setAttribute("id", "app-calculator");
};

const setupDisplayScreen = () => {
  const screen = document.createElement("div");
  screen.setAttribute("id", "display-screen");

  const numberDisplay = document.createElement("p");
  numberDisplay.setAttribute("id", "number-display");
  numberDisplay.innerText = state.currentState;

  screen.append(numberDisplay);
  return screen;
};

const setupButtonsContainer = () => {
  const buttons = document.createElement("div");
  buttons.setAttribute("id", "keys-container");
  return buttons;
};

const isValid = (value) => {
  // if current value is a dice
  if (diceKeys.includes(value)) {
    // dice cant follow dice
    if (diceKeys.includes(state.lastKey)) {
      return false;
    }
  }

  // if current value is a function
  if (operationKeys.includes(value)) {
    // function key cant start from 0 or follow function key
    if (state.currentState === "0" || operationKeys.includes(state.lastKey)) {
      return false;
    }
  }

  // if number
  if (!isNaN(value)) {
    // number cant follow dice key
    if (diceKeys.includes(state.lastKey)) {
      return false;
    }
  }
  return true;
};

const resetCalc = () => {
  state.prevState = "0";
  state.currentState = "0";
  state.lastKey = null;
};

const deletePrev = () => {
  state.currentState = state.prevState;
  if (state.currentState === "0") {
    state.lastKey = null;
  }
};

const rollDice = (diceNotation) => {
  let total = 0;
  const [multiplierStr, diceSizeStr] = diceNotation.split("d");
  const multiplier = Number(multiplierStr);
  const diceSize = Number(diceSizeStr);

  for (let i = 0; i < multiplier; i++) {
    total += Math.floor(Math.random() * diceSize) + 1;
  }

  return total;
};

const handleDisplay = (value) => {
  if (!isValid(value)) return;

  if (value === "AC") {
    resetCalc();
  } else if (value === "del") {
    deletePrev();
  } else {
    if (
      diceKeys.includes(value) &&
      (isNaN(state.lastKey) || state.lastKey === null)
    ) {
      state.lastKey = value;
      value = `1${value}`;
    } else {
      state.lastKey = value;
    }
    state.prevState = state.currentState;
    if (state.lastKey === null || state.currentState === "0") {
      state.currentState = value;
    } else {
      state.currentState += value;
    }
  }

  let displayNumber = document.querySelector("#number-display");
  displayNumber.innerText = state.currentState;
};

const handleLogic = () => {
  let equation = state.currentState;
  equation = equation.replace(/x/g, "*");
  equation = equation.replace(/÷/g, "/");
  equation = equation.replace(/(\d*)d(\d+)/g, (match) => rollDice(match));

  let displayNumber = document.querySelector("#number-display");
  displayNumber.innerText = eval(equation);
  resetCalc()
};

const createKey = (key) => {
  const button = document.createElement("button");
  button.classList.add("calculator-keys", `key-${key}`);
  button.setAttribute("value", key);

  // Apply specific classes based on the key type
  if (diceKeys.includes(key)) {
    button.classList.add("dice-keys");
  } else if (key === "del" || key === "AC") {
    button.classList.add("red-keys");
  } else if (["÷", "x", "-", "+"].includes(key)) {
    button.classList.add("function-keys");
  } else if (["(", ")"].includes(key)) {
    button.classList.add("parenthesis-keys");
  } else if (!isNaN(key)) {
    button.classList.add("number-keys");
  } else if (key === "Enter") {
    button.classList.add("enter-key");
    button.style.gridRow = "span 2"; // Span two rows for the Enter key

    const img = document.createElement("img");
    img.setAttribute("alt", "d20");
    img.setAttribute("id", "dice");
    img.setAttribute("src", "./assets/images/dice.png");
    button.append(img); // Add the dice image to the Enter key
  }

  // Set the button text if it's not the Enter key
  if (key === "Enter") {
    button.addEventListener("click", (event) => {
      handleLogic();
    });
  } else {
    button.innerText = key;
    button.addEventListener("click", (event) => {
      handleDisplay(event.target.value);
    });
  }

  return button;
};

const addCalculatorKeys = (keys, buttonsContainer) => {
  keys.forEach((key) => {
    const button = createKey(key);
    buttonsContainer.append(button);
  });
};
