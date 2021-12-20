let updateCurrentNum = function () {
    let currentNum;
    let pDisplay = document.querySelector("#calculator-display-container > p");
    return function(num) {
        if (!currentNum || currentNum === 0) {
            currentNum = num;
        } 
        else if (currentNum.toString().length < 12) {
            currentNum = Number("" + currentNum + num);
        }
        pDisplay.textContent = currentNum;
        return currentNum;
    }
}();

const numberButtons = document.querySelectorAll('.num-button');
console.log(numberButtons);
numberButtons.forEach(button => button.addEventListener('click', () => {
    updateCurrentNum(Number(button.textContent));
}));