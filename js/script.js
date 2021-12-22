// document parts
const pDisplay = document.querySelector("#calculator-display-container > p");
const numButtons = document.querySelectorAll('.num-button');
const operButtons = document.querySelectorAll('.oper-button');
const equalsButton = document.querySelector('#equals-button');
const decButton = document.querySelector('#decimal-button');
const clearButton = document.querySelector('#clear-button');

let operator;
let leftNum;
let allowDisplayOverwrite = true;   //allows display overwrite instead of append


function setOperator(newOperator) {
    //if there's already an operator, get the result
    if (operator) {
        getResult();
    }
    operator = newOperator;
    leftNum = getDisplayNum();
    allowDisplayOverwrite = true;
}

function clear() {
    operator = null;
    leftNum = null;
    allowDisplayOverwrite = true;
    addDisplayDigit('0');
}

function getDisplayNum() {
    let currentNumDisplay = pDisplay.textContent;

    // if last digit is a . add 0 to the end
    if (currentNumDisplay.indexOf('.') === currentNumDisplay.length - 1) {
        currentNumDisplay = currentNumDisplay + '0';
    }
    return Number(currentNumDisplay);
}

function addDisplayDigit(input) {
    let displayNum;

    // first check if we are overwriting or not
    if (allowDisplayOverwrite === true) {
        displayNum = "0";
        allowDisplayOverwrite = false;
    }
    else {
        displayNum = pDisplay.textContent;
    }

    // needs to be number or decimal and limit to 12 chars
    if (/[1234567890.]/.test(input) && displayNum.toString().length < 12) {

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
        pDisplay.textContent = displayNum;
    }
};

function removeLastDisplayDigit() {
    let displayNum = pDisplay.textContent;
    if (displayNum.length <= 1) {
        displayNum = "0";
    }
    else {
        displayNum = displayNum.slice(0, -1);
    }
    pDisplay.textContent = displayNum;
}

function getResult() {
    if (operator && leftNum) {
        let rightNum = getDisplayNum();
        let result = operate(operator, leftNum, rightNum);
        //console.log(`Operator: ${operator}\nLeft: ${leftNum}\nRight: ${rightNum}\nResult: ${result}`);
        pDisplay.textContent = result;
        allowDisplayOverwrite = true;

        operator = null;
        leftNum = null;
    }
}

function convertKeyToOperator(key) {
    switch (key) {
        case "+":
            return "plus";
        case "-":
            return "minus";
        case "*":
            return "multiply";
        case "/":
            return "divide";
    }
}

/* Math */

function operate(thisOperator, a, b) {
    let result;
    switch (thisOperator) {
        case "plus":
            result = add(a, b);
            break;
        case "minus":
            result = subtract(a, b);
            break;
        case "multiply":
            result = multiply(a, b);
            break;
        case "divide":
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



/* handle button click events */

// number/decimal buttons
numButtons.forEach(button => button.addEventListener('click', () => addDisplayDigit(button.textContent)));
decButton.addEventListener('click', () => addDisplayDigit('.'));

// operator buttons
operButtons.forEach(button => button.addEventListener('click', () => setOperator(button.getAttribute('data-oper'))));

// equals buton
equalsButton.addEventListener('click', getResult);

// clear button
clearButton.addEventListener('click', clear);

/* handle key press events */
function updateCalcKeydown(e) {
    if (/[1234567890.]/.test(e.key)) {
        addDisplayDigit(e.key);
    }
    else if (/[+\-\*\/]/.test(e.key)) {
        setOperator(convertKeyToOperator(e.key));
    }
    else if (e.key == "=" || e.key == "Enter") {
        getResult();
    }
    else if (e.key == "Backspace") {
        removeLastDisplayDigit();
    }
    e.preventDefault();
}

window.addEventListener('keydown', updateCalcKeydown);