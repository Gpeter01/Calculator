'use strict'
function setContainerSize() {
    const nine = document.querySelector('.nine');
    const numberpad = document.querySelector('.number-pad');
    const styleOfNumberpad = getComputedStyle(numberpad);
    const styleOfNine = getComputedStyle(nine);
    const newStyle = (parseFloat(styleOfNine.width) * 3) + (parseFloat(styleOfNumberpad.gap) * 2);
    numberpad.style.width = `${newStyle}px`;
    const zero = document.querySelector('.zero');
    const point = document.querySelector('.point');
    const keyFeatureWidth = (newStyle - parseFloat(styleOfNumberpad.gap)) / 2;
    zero.style.width = `${keyFeatureWidth}px`;
    point.style.width = `${keyFeatureWidth}px`;

    const displayContainer = document.querySelector('.display-container');
    const calculatorContainer = document.querySelector('.calculator-container');
    const styleOfCalculatorContainer = getComputedStyle(calculatorContainer);
    displayContainer.style.width = styleOfCalculatorContainer.width;
    return;
}
setContainerSize();

// GLOBAL VARIABLES
const variables = {
    'firstNumber' : '',
    'operationSign' : '',
    'currentNumber' : '',
    'evaluatedValue' : '',
};
const content = {
    'displayContent' : '',
};
const operationViableSigns = ['÷', '\u00D7', '+', '-', '='];
let evaluatedDisplayContent = '';
let currentMethod = '';
let clickCount = 0;
let errorCheck = 0;
let previousResults = [];

const paraQuery = document.querySelector('.para-query');
const paraResult = document.querySelector('.para-result');


const operationMethods = {
    divide(a, b) { 
        if (b === '-') {
            b = -1;
        } else if (Number(a) === 0 || a === '-') {
            variables.firstNumber = '';
            variables.currentNumber = '';
            variables.evaluatedValue = '';
            variables.operationSign = '';
            evaluatedDisplayContent = '';
            clickCount = 0;
            content.displayContent = 'Math Error';
            paraQuery.textContent = content.displayContent;
            paraQuery.style.color = 'red';
            errorCheck++;
            return;
        }
        return (Number(a) / Number(b));
    },
    multiply(a, b) {
        if (b === '-') {
            b = -1;
        }
        if (a === '-') {
           a = -1;
        }
        return (Number(a) * Number(b));
    },
    add(a, b) {
        if (b === '-') {
            return Number(a);
        } else if (a === '-') {
            return '-' + Number(b);
        }
        return (Number(a) + Number(b));
    },
    subtract(a, b) {
        if (b === '-') {
            return Number(a);
        }
        if (a === '-') {
            return Number(a);
        }
        return (Number(a) - Number(b));
    }
};
const operations = ['division', 'multiplication', 'addition', 'subtraction', 'equal-to'];
const mainOperations = [
    operationMethods.divide,
    operationMethods.multiply,
    operationMethods.add,
    operationMethods.subtract
];

// EVENT LISTENERS
const operands = document.querySelector('.operands');
operands.addEventListener('click', iterateNumber);

const special = document.querySelector('.special');
special.addEventListener('click', executeSpecialKey);

const calculatorOperations = document.querySelector('.calculator-operations');
calculatorOperations.addEventListener('click', iterateOperation);


function iterateNumber(event) {
    const target = event.target;
    const numbers = {
        'nine': '9',
        'eight': '8',
        'seven': '7',
        'six': '6',
        'five': '5',
        'four': '4',
        'three': '3',
        'two': '2',
        'one': '1',
        'zero': '0',
        'point': '.'
    }

    function getNumber() {
        for (const key in numbers) {

            function checkForRepitition(number) {
                if (number.length === 1) {
                    if (numbers[key] === numbers.zero) {
                        if (number.charAt(0) === numbers.zero) {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            }
            function checkPointError() {
                if (numbers[key] === numbers.point) {
                    let lastCharacter = content['displayContent'].charAt(content.displayContent.length - 1);
                    if (variables.evaluatedValue === '' && variables.currentNumber === '') {
                        if (variables.firstNumber === '') {
                            return 'yes';
                        } else {
                            for (let i = variables.firstNumber.length - 1; i >= 0; i--) {
                                if (variables['firstNumber'].charAt(i) === numbers.point) {
                                    return 'yes';
                                } 
                            }
                        }
                    } else if (variables.firstNumber !== '') {
                        if (variables.currentNumber === '') {
                            return 'yes';
                        } else {
                            for (let i = variables.currentNumber.length - 1; i >= 0; i--) {
                                if (variables['currentNumber'].charAt(i) === numbers.point) {
                                    return 'yes';
                                } 
                            }
                        }
                    }
                }
            }


            if (target.classList[0] === key) {
                if (errorCheck > 0) {
                    variables.evaluatedValue = '';
                    if (checkPointError() === 'yes') {
                        return;
                    }
                    variables.firstNumber = numbers[key];
                    paraQuery.style.color = 'black';
                    getParaResult();
                    errorCheck = 0;
                    return;
                }
                if (checkPointError() === 'yes') {
                    return;
                }
                const lastCharacter = content['displayContent'].charAt(content['displayContent'].length - 1);
                if (content['displayContent'] === '') {
                    variables.firstNumber += numbers[key];
                    return;
                } else if ((variables.operationSign === '') && (variables.currentNumber === '')) {
                    if (checkForRepitition(variables.firstNumber)) {
                        return;
                    }
                    if (variables.firstNumber.length === 9) {
                        return;
                    }
                    variables.firstNumber += numbers[key];
                    return;
                } else if ((variables.firstNumber !== '') && (variables.currentNumber !== '')) {
                    if (previousResults.length === 0) {
                        if (checkForRepitition(variables.currentNumber)) {
                            return;
                        }
                        if (variables.currentNumber.length === 9) {
                            return;
                        }
                        variables.currentNumber += numbers[key];
                        variables.evaluatedValue = currentMethod(variables.firstNumber, variables.currentNumber);
                        getParaResult();
                        return;
                    } else {
                        if (checkForRepitition(variables.currentNumber)) {
                            return;
                        }
                        if (variables.currentNumber.length === 9) {
                            return;
                        }
                        variables.currentNumber += numbers[key];
                        const lastTerm = previousResults.length - 1;
                        variables.evaluatedValue = currentMethod(previousResults[lastTerm], variables.currentNumber);
                        getParaResult();
                        return;
                    }
                } else if (variables.operationSign !== '' && variables.firstNumber !== '') {
                    if (checkForRepitition(variables.currentNumber)) {
                        return;
                    }
                    if (variables.currentNumber.length === 9) {
                        return;
                    }
                    if (previousResults.length === 0) {
                        variables.currentNumber += numbers[key];
                        variables.evaluatedValue = currentMethod(variables.firstNumber, variables.currentNumber);
                        getParaResult();
                        return;
                    } else {
                        if (checkForRepitition(variables.currentNumber)) {
                            return;
                        }
                        variables.currentNumber += numbers[key];
                        const lastTerm = previousResults.length - 1;
                        variables.evaluatedValue = currentMethod(previousResults[lastTerm], variables.currentNumber);
                        getParaResult();
                        return;
                    }
                    return;
                }
            }
        }
    }
    getNumber();
    getDisplayContent();
    return;
}
function executeSpecialKey(event) {
    const target = event.target;
    if (target.classList[0] === 'delete') {
        executeDelete();
        return;
    } else if (target.classList[0] === 'plus-or-minus') {
        getMinus();
        return;
    } else if (target.classList[0] === 'refresh') {
        refresh();
        return;
    }
}
function refresh() {
    variables.firstNumber = '';
    variables.currentNumber = '';
    variables.evaluatedValue = '';
    variables.operationSign = '';
    clickCount = 0;
    errorCheck = 0;
    previousResults = [];
    evaluatedDisplayContent = '';
    currentMethod = '';
    getParaResult();
    getDisplayContent();
    return;
}
function getMinus() {
    if (variables.firstNumber !== '' && variables.operationSign !== '') {
        let firstCharacter = variables['currentNumber'].charAt(0);
        if (firstCharacter === '-') {
            let placebo = variables['currentNumber'].slice(1);
            variables.currentNumber = placebo;
            getEvaluatedValue();
            getDisplayContent();
            return;
        } else {
            let placebo = '-' + variables.currentNumber;
            variables.currentNumber = placebo;
            getEvaluatedValue();
            getDisplayContent();
            return;
        }
    } else if (variables.currentNumber === '' && variables.evaluatedValue === '') {
        let firstCharacter = variables['firstNumber'].charAt(0);
        if (firstCharacter === '-') {
            let placebo = variables['firstNumber'].slice(1);
            variables.firstNumber = placebo;
            getEvaluatedValue();
            getDisplayContent();
            return;
        } else {
            let placebo = '-' + variables.firstNumber;
            variables.firstNumber = placebo;
            getEvaluatedValue();
            getDisplayContent();
            return;
        }
    }
}
function executeDelete() {
    const lastCharacter = content['displayContent'].charAt(content.displayContent.length - 1);
    if (content.displayContent === '') {
        return;
    } else if (variables.firstNumber !== '' && variables.currentNumber !== '') {
        let placebo = variables['currentNumber'].slice(0, variables.currentNumber.length - 1);
        variables.currentNumber = placebo;
        getDisplayContent();
        getEvaluatedValue();
        return;
    } else if (lastCharacter === operationViableSigns[0] || lastCharacter === operationViableSigns[1] || lastCharacter === operationViableSigns[2] || lastCharacter === operationViableSigns[3]) {
        variables.operationSign = '';
        currentMethod = '';
        getDisplayContent();
        return getDisplayContent();
    } else if (variables.currentNumber === '' && variables.evaluatedValue === '') {
        let placebo = variables['firstNumber'].slice(0, variables.firstNumber.length - 1);
        variables.firstNumber = placebo;
        getDisplayContent();
        return;
    }
}

function getEvaluatedValue() {
    if (previousResults.length === 0) {
        if (variables.currentNumber !== '') {
            variables.evaluatedValue = currentMethod(variables.firstNumber, variables.currentNumber);
        } else {
            variables.evaluatedValue = '';
        }
        getParaResult();
        return;
    } else {
        let lastTerm = previousResults.length - 1;
        if (variables.currentNumber === '') {
            variables.evaluatedValue = previousResults[lastTerm];
            getParaResult();
            return;
        }
        variables.evaluatedValue = currentMethod(previousResults[lastTerm], variables.currentNumber);
        getParaResult();
        return;
    }
}

function iterateOperation(event) {
    const target = event.target;
    function getEvaluatedDisplayContent() {
        const lastValue = content['displayContent'].charAt(content['displayContent'].length - 1);
        if ((lastValue === operationViableSigns[0] || lastValue === operationViableSigns[1] || lastValue === operationViableSigns[2] || lastValue === operationViableSigns[3]) && (variables.evaluatedValue !== '')) {
            evaluatedDisplayContent = content['displayContent'].slice(0, content.displayContent.length - 1);
            if (variables.currentNumber !== '') {
                previousResults.push(variables.evaluatedValue);
            }
            return;
        } else return;
    }

    function getOperation() {
        for (let i = 0; i <= 3; i++) {
            if (target.classList[0] === operations[i]) {
                currentMethod = mainOperations[i];
                variables.operationSign = operationViableSigns[i];
                return;
            }
        }
    }
    if (content.displayContent.length === 0) {
        return;
    }
    if (target.classList[0] === operations[4]) {
        getResult();
        return;
    }
    const lastCharacter = content['displayContent'].charAt(content['displayContent'].length - 1);
    if (clickCount > 0) {
        if (lastCharacter === operationViableSigns[0] || lastCharacter === operationViableSigns[1] || lastCharacter === operationViableSigns[2] || lastCharacter === operationViableSigns[3]) {
            getOperation();
            getDisplayContent();
            variables.currentNumber = '';
            clickCount++;
            return;
        } else {
            getOperation();
            content.displayContent += variables.operationSign;
            getEvaluatedDisplayContent();
            variables.currentNumber = '';
            getDisplayContent();
            clickCount++;
            return;
        }
    } else {
        if (paraQuery.style.color === 'red') {
            return;
        }
        if (errorCheck > 0) {
            variables.evaluatedValue = '';
            getParaResult();
            errorCheck = 0;
        }
        getOperation();
        getDisplayContent();
        variables.currentNumber = '';
        clickCount++;
        return;
    }
}
function getDisplayContent() {
    if (paraQuery.style.color === 'red') {
        return;
    }
    if (evaluatedDisplayContent === '') {
        content.displayContent = variables.firstNumber + variables.operationSign + variables.currentNumber;
        paraQuery.textContent = content.displayContent;
        return;
    } else if (content.displayContent === evaluatedDisplayContent) {
        let characterCount = evaluatedDisplayContent.length - 1;
        for (let i = characterCount; i >= 0; i--) {
           if (evaluatedDisplayContent.charAt(i) === operationViableSigns[0] || evaluatedDisplayContent.charAt(i) === operationViableSigns[1] || evaluatedDisplayContent.charAt(i) === operationViableSigns[2] || evaluatedDisplayContent.charAt(i) === operationViableSigns[3]) {
                const previousTerm = evaluatedDisplayContent.charAt(i - 1);
                if (previousTerm !== operationViableSigns[0] || previousTerm !== operationViableSigns[1] || previousTerm !== operationViableSigns[2] || previousTerm !== operationViableSigns[3]) {
                    variables.currentNumber = evaluatedDisplayContent.slice(i + 1);
                    variables.operationSign = evaluatedDisplayContent.charAt(i);
                    evaluatedDisplayContent = evaluatedDisplayContent.slice(0, i);
                    previousResults.pop();
                    if (evaluatedDisplayContent === variables.firstNumber) {
                        evaluatedDisplayContent = '';
                    }
                    getNewMethod();
                    getDisplayContent();
                    return;
                } else {
                    variables.currentNumber = evaluatedDisplayContent.slice(i);
                    variables.operationSign = evaluatedDisplayContent.charAt(i - 1);
                    evaluatedDisplayContent = evaluatedDisplayContent.slice(0, i - 1);
                    previousResults.pop();
                    if (evaluatedDisplayContent === variables.firstNumber) {
                        evaluatedDisplayContent = '';
                    }
                    getNewMethod();
                    getDisplayContent();
                    return;
                }
           }
        }
    } else if (evaluatedDisplayContent !== ''){
        content.displayContent = evaluatedDisplayContent + variables.operationSign + variables.currentNumber;
        paraQuery.textContent = content.displayContent;
        return;
    }
}
function getNewMethod() {
    for (let j = operationViableSigns.length - 2; j >= 0; j--) {
        if (variables.operationSign === operationViableSigns[j]) {
            currentMethod = mainOperations[j];
            return;
        }
    }
}
function getParaResult() {
    if (paraQuery.style.color === 'red') {
        return;
    }
    paraResult.innerHTML = `<i>${variables.evaluatedValue}</i>`;
    return;
}
 function getResult() {
    if (paraQuery.style.color === 'red') {
        return;
    }
    if (variables.evaluatedValue === '' && variables.currentNumber === '') {
        evaluatedDisplayContent = '';
        variables.evaluatedValue = content.displayContent;
        content.displayContent = variables.firstNumber.toString();
        paraResult.innerHTML = `<i>${variables.evaluatedValue}</i>`;
        paraQuery.textContent = content.displayContent;
        clickCount = 0;
        errorCheck++;
        return;
    } else if (variables.evaluatedValue !== '') {
        errorCheck++;
        evaluatedDisplayContent = '';
        paraResult.innerHTML = `<i>${content.displayContent}</i>`;
        content.displayContent = variables.evaluatedValue.toString();
        paraQuery.textContent = content.displayContent;
        variables.currentNumber = '';
        variables.firstNumber = variables.evaluatedValue;
        variables.evaluatedValue = '';
        variables.operationSign = '';
        previousResults = [];
        clickCount = 0;
        return;
    }
}