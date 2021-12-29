// document parts
const resultDisplay = document.querySelector("#result-display");
const equationDisplay = document.querySelector("#equation-display");
const calcButtons = document.querySelectorAll('.calc-button'); // all calculator buttons
const numButtons = document.querySelectorAll('.num-button');
const operButtons = document.querySelectorAll('.oper-button');
const equalsButton = document.querySelector('#equals-button');
const decButton = document.querySelector('#decimal-button');
const clearButton = document.querySelector('#clear-button');
const backspButton = document.querySelector('#backsp-button');
const undoButton = document.querySelector("#undo-button");
const memSaveButon = document.querySelector("#memsave-button");
const memRecallButton = document.querySelector("#memrecall-button");
const calcHistoryContainer = document.querySelector('#calculator-history-container');

const calcDisplayMaxChars = 12;
const maxHistoryDisplayItems = 10;
let currentEquationItem = {};

let calcOperator;
let calcLeftNum;
let calcInputOverwrite = true;   //allows display overwrite instead of append
let calcResultHistory = [];
let calcMemoryNum;

function setOperator(newOperator) {
    //if there's already an operator, get the result
    if (calcOperator) {
        calculateResult();
    }
    currentEquationItem.operator = newOperator;
    currentEquationItem.left = getDisplayNum();
    displayCurrentEquation();

    calcInputOverwrite = true;
}

function clear() {
    currentEquationItem = {};
    calcInputOverwrite = true;
    addDisplayDigit('0');
}

function getDisplayNum() {
    let currentNumDisplay = resultDisplay.textContent;

    // if last digit is a . add 0 to the end
    if (currentNumDisplay.indexOf('.') === currentNumDisplay.length - 1) {
        currentNumDisplay = currentNumDisplay + '0';
    }
    return Number(currentNumDisplay);
}

function addDisplayDigit(input) {
    let displayNum;

    // first check if we are overwriting or not
    if (calcInputOverwrite === true) {
        displayNum = "0";
        calcInputOverwrite = false;
    }
    else {
        displayNum = resultDisplay.textContent;
    }

    // needs to be number or decimal and limit to 12 chars
    if (/[1234567890.]/.test(input) && displayNum.toString().length < calcDisplayMaxChars) {

        if (displayNum == "0" && input != ".") {
            // if current number is zero, set directly to number
            displayNum = input;
        }
        else if (input === "." && displayNum.toString().indexOf('.') === -1) {
            // add decimal as long as there is not already one
            displayNum = displayNum + ".";
        }
        else if (input != ".") {
            // add number to the end
            displayNum = "" + displayNum + input;
        }
        resultDisplay.textContent = displayNum;
    }
};

function removeLastDisplayDigit() {
    let displayNum = resultDisplay.textContent;
    if (displayNum.length <= 1) {
        displayNum = "0";
    }
    else {
        displayNum = displayNum.slice(0, -1);
    }
    resultDisplay.textContent = displayNum;
}

function calculateResult() {
    if (currentEquationItem.left && currentEquationItem.operator) {
        currentEquationItem.right = getDisplayNum();
        currentEquationItem.result = operate(currentEquationItem.operator, currentEquationItem.left, currentEquationItem.right);
        calcResultHistory.push(currentEquationItem);

        resultDisplay.textContent = getMaxLengthValueString(currentEquationItem.result, calcDisplayMaxChars);
        currentEquationItem = {};   //reset current equation
        displayCurrentEquation();
        displayHistory();

        calcInputOverwrite = true;
    }
}

function undolastCalc() {
    
    if (currentEquationItem.left) {
        // if we have a current equation, display the left num and reset
        resultDisplay.textContent = currentEquationItem.left;
        currentEquationItem = {};

        calcInputOverwrite = false; // allow overwrite after undo since we might want to change the number
    }
    else if (calcResultHistory.length > 0) {
        // if we havent started a new equation, remove the last equation from the history, & set display to right
        let lastEquationItem = calcResultHistory.pop();
        resultDisplay.textContent = lastEquationItem.right
        currentEquationItem = {};
        currentEquationItem.left = lastEquationItem.left
        currentEquationItem.operator = lastEquationItem.operator;
        displayHistory();

        calcInputOverwrite = false; // allow overwrite after undo since we might want to change the number
    }
    else {
        resultDisplay.textContent = '0';
    }
    displayCurrentEquation();
}

function displayCurrentEquation() {
    equationDisplay.textContent = `${currentEquationItem.left ?? ''} ${currentEquationItem.operator ?? ''}`;
}


function displayHistory() {
    calcHistoryContainer.textContent = "";
    let currentOpacity = 1;
    let opacityDelta = -0.08;

    for (let i = calcResultHistory.length - 1; i >= 0 && i > calcResultHistory.length - maxHistoryDisplayItems - 1; i--) {

        let historyItem = calcResultHistory[i];
        
        const historyItemContainer = document.createElement('div');
        historyItemContainer.classList.add('history-item');
        historyItemContainer.style.opacity = currentOpacity;
        currentOpacity = Math.min(Math.max(0, currentOpacity + opacityDelta), 1);

        const historyEquationContainer = document.createElement('div');
        historyEquationContainer.textContent = `${getMaxLengthValueString(historyItem.left, 8)} ${historyItem.operator} ${getMaxLengthValueString(historyItem.right, 8)} =`;

        const historyResultContainer = document.createElement('div');
        historyResultContainer.classList.add('history-item-result');
        historyResultContainer.textContent = `${getMaxLengthValueString(historyItem.result, 8)}`;

        historyItemContainer.appendChild(historyEquationContainer);
        historyItemContainer.appendChild(historyResultContainer);

        calcHistoryContainer.appendChild(historyItemContainer);
    }
}

function updateCalcKeydown(e) {
    if (/^[1234567890.]$/.test(e.key)) {
        addDisplayDigit(e.key);
        e.preventDefault();
    }
    else if (/^[+\-\*\/]$/.test(e.key)) {
        setOperator(e.key);
        e.preventDefault();
    }
    else if (e.key == "=" || e.key == "Enter") {
        calculateResult();
        e.preventDefault();
    }
    else if (e.key == "Backspace") {
        removeLastDisplayDigit();
        e.preventDefault();
    }
}

/* Math */

function operate(thisOperator, a, b) {
    let result;
    switch (thisOperator) {
        case "+":
            result = add(a, b);
            break;
        case "-":
            result = subtract(a, b);
            break;
        case "*":
            result = multiply(a, b);
            break;
        case "/":
            result = divide(a, b);
            break;

    }
    return result;
}

function add(a, b) {
    return a + b;
}

function divide(a, b) {
    return a / b;
}

function multiply(a, b) {
    return a * b;
}

function subtract(a, b) {
    return a - b;
}

function getMaxLengthValueString(value, max) {
    let newValueStr = "" + value;

    // if longer than the length, we might need to display scientific notation
    if (newValueStr.length > max) {
        newValueStr = value.toPrecision(max);

        if (newValueStr.length > max) {
            let expLocation = newValueStr.indexOf('e');
            let decimalLocation = newValueStr.indexOf('.');
            if (expLocation > -1) {
                // before the e should be the maximum length minus the number of digits in the exponent
                newValueStr = newValueStr.substring(0, max - (newValueStr.length - expLocation)) + newValueStr.substring(expLocation);
            } else if (decimalLocation > -1) {
                // if there's just a decimal, take the precision down by one to account
                newValueStr = value.toPrecision(max - 1);
            }
        }
    }
    return newValueStr;
}


/* handle button click events */

// set all buttons to show active on click
calcButtons.forEach(button => button.addEventListener('click', () => button.classList.add('calc-button-active')));

// remove active class when transition ends
calcButtons.forEach(button => button.addEventListener("transitionend", () => button.classList.remove('calc-button-active')));


// number/decimal buttons
numButtons.forEach(button => button.addEventListener('click', () => addDisplayDigit(button.textContent)));

decButton.addEventListener('click', () => addDisplayDigit('.'));

// operator buttons
operButtons.forEach(button => button.addEventListener('click', () => setOperator(button.getAttribute('data-key'))));

// equals buton
equalsButton.addEventListener('click', calculateResult);

// clear button
clearButton.addEventListener('click', clear);

backspButton.addEventListener('click', removeLastDisplayDigit);

// undo button
undoButton.addEventListener('click', undolastCalc);

// memory
memSaveButon.addEventListener('click', () => {
    let newMem = getDisplayNum()
    if (newMem) {
        calcMemoryNum = memNum;
    }
});

memRecallButton.addEventListener('click', () => {
    if (calcMemoryNum) {
        resultDisplay.textContent = calcMemoryNum;
    }
})

/* handle key press events */
window.addEventListener('keydown', (e) => {
    updateCalcKeydown(e);
    const keyButton = document.querySelector(`button[data-key='${e.key}']`);
    if (keyButton) keyButton.classList.add('calc-button-active');
});