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
    "/",
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

let equation = "0";
let currentState = "0";
let prevState = "0";
let lastKey = null;
const functionKeys = ["/", "x", "-", "+", "Enter"];
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
  numberDisplay.innerText = currentState;

  screen.append(numberDisplay);
  return screen;
};

const setupButtonsContainer = () => {
  const buttons = document.createElement("div");
  buttons.setAttribute("id", "keys-container");
  return buttons;
};

const isValidKey = (value) => {
  if (diceKeys.includes(value)) {
    if (diceKeys.includes(lastKey)) {
      return false;
    }

    if (!isNaN(lastKey) && currentState !== "0") {
      return false;
    }
  }

  if (functionKeys.includes(value)) {
    if (lastKey === null || functionKeys.includes(lastKey)) {
      return false;
    }
  }

  if (!isNaN(value)) {
    if (diceKeys.includes(lastKey)) {
      return false;
    }
  }

  return true;
};

const handleDisplay = (value) => {
  if (!isValidKey(value)) return;

  // if we're stating a clean equation at 0...
  if (value === "AC") {
    prevState = "0";
    currentState = "0";
    lastKey = null;
    // if del === revert to previous state
  } else if (value === "del") {
    currentState = prevState;
    if (currentState === "0") {
      lastKey = null;
    }
  } else {
    if (lastKey === null) {
      if (diceKeys.includes(value)) {
        if (lastKey === null || isNaN(lastKey)) {
          lastKey = value;
          value = `1${value}`;
        }
      } else {
        lastKey = value;
      }

      prevState = currentState;
      currentState = value;
    } else {
      if (diceKeys.includes(value)) {
        if (lastKey === null || isNaN(lastKey)) {
          lastKey = value;
          value = `1${value}`;
        }
      } else {
        lastKey = value;
      }
      prevState = currentState;
      currentState += value;
    }
  }

  // console.log("🖥️ console 2 => lastKey: ", lastKey);
  // console.log("🖥️ console 2 => prevState: ", prevState);
  // console.log("🖥️ console 2 => currentState: ", currentState);

  let displayNumber = document.querySelector("#number-display");

  displayNumber.innerText = currentState;
};

const handleLogic = (event) => {
  // const value = event.target.value;
  // let displayNumber = document.querySelector("#number-display");
  // displayValue.prevState = displayValue.currentState;
  // displayValue.currentState = displayValue.currentState.concat(value);
  // displayNumber.innerText = displayValue.currentState;
  // console.log("🖥️  displayValue : ", displayValue);
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
  } else if (["/", "x", "-", "+"].includes(key)) {
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
  if (key !== "Enter") {
    button.innerText = key;
  }

  button.addEventListener("click", (event) => {
    handleDisplay(event.target.value);
    handleLogic(event.target.value);
  });

  return button;
};

const addCalculatorKeys = (keys, buttonsContainer) => {
  keys.forEach((key) => {
    const button = createKey(key);
    buttonsContainer.append(button);
  });
};
