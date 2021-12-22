// document parts
const pDisplay = document.querySelector("#calculator-display-container > p");
const numButtons = document.querySelectorAll('.num-button');
const operButtons = document.querySelectorAll('.oper-button');
const equalsButton = document.querySelector('#equals-button');
const decButton = document.querySelector('#decimal-button');
const clearButton = document.querySelector('#clear-button');

const calcDisplayMaxChars = 12;
let calcOperator;
let calcLeftNum;
let calcInputOverwrite = true;   //allows display overwrite instead of append
let calcResultHistory = [];

function setOperator(newOperator) {
    //if there's already an operator, get the result
    if (calcOperator) {
        calculateResult();
    }
    calcOperator = newOperator;
    calcLeftNum = getDisplayNum();
    calcInputOverwrite = true;
}

function clear() {
    calcOperator = null;
    calcLeftNum = null;
    calcInputOverwrite = true;
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
    if (calcInputOverwrite === true) {
        displayNum = "0";
        calcInputOverwrite = false;
    }
    else {
        displayNum = pDisplay.textContent;
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

function calculateResult() {
    if (calcOperator && calcLeftNum) {
        let rightNum = getDisplayNum();
        let result = operate(calcOperator, calcLeftNum, rightNum);
        let displayResult = getMaxLengthValueString(result, calcDisplayMaxChars);

        let historyElement = {leftNum: calcLeftNum, rightNum: rightNum, operator: calcOperator, result: result, displayResult: displayResult};
        calcResultHistory.push(historyElement);
        console.table(historyElement);

        pDisplay.textContent = displayResult;
        calcInputOverwrite = true;

        calcOperator = null;
        calcLeftNum = null;
    }
}

function updateCalcKeydown(e) {
    if (/^[1234567890.]$/.test(e.key)) {
        addDisplayDigit(e.key);
        console.log(e.key);
        e.preventDefault();
    }
    else if (/^[+\-\*\/]$/.test(e.key)) {
        setOperator(convertKeyToOperator(e.key));
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

// number/decimal buttons
numButtons.forEach(button => button.addEventListener('click', () => addDisplayDigit(button.textContent)));
decButton.addEventListener('click', () => addDisplayDigit('.'));

// operator buttons
operButtons.forEach(button => button.addEventListener('click', () => setOperator(button.getAttribute('data-oper'))));

// equals buton
equalsButton.addEventListener('click', calculateResult);

// clear button
clearButton.addEventListener('click', clear);

/* handle key press events */


window.addEventListener('keydown', updateCalcKeydown);