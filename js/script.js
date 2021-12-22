// document parts
const pDisplay = document.querySelector("#calculator-display-container > p");
const numButtons = document.querySelectorAll('.num-button');
const operButtons = document.querySelectorAll('.oper-button');
const equalsButton = document.querySelector('#equals-button');
const decButton = document.querySelector('#decimal-button');
const clearButton = document.querySelector('#clear-button');

let operator;
let leftNum;
let allowDisplayOverwrite = true;


// if equals or operator pressed while operator is stored, result is stored value (operator) display value

// display value allow overwrite

// when operator is pressed, store display number & operator, & set display value to overwrite
function setOperator(newOperator) {
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

function getResult() {
    if (operator && leftNum) {
        let rightNum = getDisplayNum();
        let result = operate(operator, leftNum, rightNum);
        console.log(`Operator: ${operator}\nLeft: ${leftNum}\nRight: ${rightNum}\nResult: ${result}`);
        pDisplay.textContent = result;
        allowDisplayOverwrite = true;

        operator = null;
        leftNum = null;
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

// number buttons
numButtons.forEach(button => button.addEventListener('click', () => {
    addDisplayDigit(button.textContent);
}));

// decimal button
decButton.addEventListener('click', () => {
    addDisplayDigit('.');
});

// operator buttons
operButtons.forEach(button => button.addEventListener('click', () => {
    // if there's already an operator, operate
    if (operator) {
        getResult();
    }
    setOperator(button.getAttribute('data-oper'));
}));

// equals buton
equalsButton.addEventListener('click', () => {
    if (operator) {
        getResult();
    }
});

clearButton.addEventListener('click', clear);

/* handle key press events */

// get keypress event