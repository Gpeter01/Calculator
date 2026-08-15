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
}
setContainerSize();

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
let currentDisplayContent = '';
let evaluatedDisplayContent = '';
let currentMethod = '';
let clickCount = 0;
let errorCheck = 0;
let previousResults = [];

const operands = document.querySelector('.operands');
operands.addEventListener('mousedown', iterateNumber);

const special = document.querySelector('.special');
special.addEventListener('click', executeSpecialKey);

const calculatorOperations = document.querySelector('.calculator-operations');
calculatorOperations.addEventListener('click', iterateOperation);

const paraQuery = document.querySelector('.para-query');
const paraResult = document.querySelector('.para-result');

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
                    console.log(variables.firstNumber);
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
                } else if (lastCharacter === operationViableSigns[0] || lastCharacter === operationViableSigns[1] || lastCharacter === operationViableSigns[2] || lastCharacter === operationViableSigns[3]) {
                    if (previousResults.length === 0) {
                        variables.currentNumber += numbers[key];
                        variables.evaluatedValue = currentMethod(variables.firstNumber, variables.currentNumber);
                        getParaResult();
                        return;
                    } else {
                        variables.currentNumber += numbers[key];
                        const lastTerm = previousResults.length - 1;
                        variables.evaluatedValue = currentMethod(previousResults[lastTerm], variables.currentNumber);
                        getParaResult();
                        return;
                    }
                } else if ((variables.evaluatedValue === '') && (variables.currentNumber === '')) {
                    if (variables.firstNumber.length === 9) {
                        return;
                    }
                    variables.firstNumber += numbers[key];
                    return;
                } else if ((variables.firstNumber !== '') && (variables.currentNumber !== '')) {
                    if (previousResults.length === 0) {
                        if (variables.currentNumber.length === 9) {
                            return;
                        }
                        variables.currentNumber += numbers[key];
                        variables.evaluatedValue = currentMethod(variables.firstNumber, variables.currentNumber);
                        getParaResult();
                        return;
                    } else {
                        if (variables.currentNumber.length === 9) {
                            return;
                        }
                        variables.currentNumber += numbers[key];
                        const lastTerm = previousResults.length - 1;
                        variables.evaluatedValue = currentMethod(previousResults[lastTerm], variables.currentNumber);
                        getParaResult();
                        return;
                    }
                } else if (variables.evaluatedValue !== '' && variables.firstNumber !== '') {
                    if (variables.currentNumber.length === 9) {
                        return;
                    }
                    variables.currentNumber += numbers[key];
                    const lastTerm = previousResults.length - 1;
                    variables.evaluatedValue = currentMethod(previousResults[lastTerm], variables.currentNumber);
                    getParaResult();
                    return;
                }
            }
        }
    }
    getNumber();
    getDisplayContent();
    return;
}
function executeSpecialKey() {

}
function iterateOperation(event) {
    const target = event.target;
    const operations = ['division', 'multiplication', 'addition', 'subtraction', 'equal-to'];
    const operationMethods = {
        divide(a, b) { 
            if (Number(a) === 0) {
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
                console.log(content.displayContent);
                return;
            }
            return (Number(a) / Number(b)).toFixed(1);
        },
        multiply(a, b) {
            return (Number(a) * Number(b)).toFixed(1);
        },
        add(a, b) {
            return (Number(a) + Number(b)).toFixed(1);
        },
        subtract(a, b) {
            return (Number(a) - Number(b)).toFixed(1);
        }
    };
    const mainOperations = [
        operationMethods.divide,
        operationMethods.multiply,
        operationMethods.add,
        operationMethods.subtract
    ];
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
    } else {
        content.displayContent = evaluatedDisplayContent + variables.operationSign + variables.currentNumber;
        paraQuery.textContent = content.displayContent;
        return;
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