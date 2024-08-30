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

const displayValue = {
  currentState: "0",
  prevState: "0",
  lastKeyPress: "null",
};

const initializeAppContainer = () => {
  const app = document.querySelector(".app");
  app.setAttribute("id", "app-calculator");
};

const setupDisplayScreen = () => {
  const screen = document.createElement("div");
  screen.setAttribute("id", "display-screen");

  const numberDisplay = document.createElement("p");
  numberDisplay.setAttribute("id", "number-display");
  numberDisplay.innerText = displayValue.currentState;

  screen.append(numberDisplay);
  return screen;
};

const setupButtonsContainer = () => {
  const buttons = document.createElement("div");
  buttons.setAttribute("id", "keys-container");
  return buttons;
};

const handleDisplay = (event) => {
  let value = event.target.value;

  if (["dx", "d4", "d6", "d8", "d10", "d12", "d20"].includes(value)) {
    if (isNaN(displayValue.lastKeyPress)) {
      value = `1${value}`;
    }
    console.log("🖥️  value: ", value);
  }

  if (value === "AC") {
    displayValue.prevState = "0";
    displayValue.currentState = "0";
    displayValue.lastKeyPress = "null";
  } else if (value === "del") {
    displayValue.currentState = displayValue.prevState;
  } else {
    displayValue.prevState = displayValue.currentState;
    if (displayValue.currentState !== "0") {
      displayValue.currentState = displayValue.currentState.concat(value);
    } else {
      displayValue.currentState = value;
    }
    displayValue.lastKeyPress = value;
  }

  console.log("value ===> ", value);
  let displayNumber = document.querySelector("#number-display");

  displayNumber.innerText = displayValue.currentState;
  console.log("🖥️  displayValue : ", displayValue);
};

console.log("listening");

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
  if (key.startsWith("d") && key !== "del") {
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
    handleDisplay(event);
    handleLogic(event);
  });

  return button;
};

const addCalculatorKeys = (keys, buttonsContainer) => {
  keys.forEach((key) => {
    const button = createKey(key);
    buttonsContainer.append(button);
  });
};
