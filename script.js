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
}
const content = {
    get displayContent() {
        return variables.firstNumber + variables.operationSign + variables.currentNumber;
    }
}
let currentMethod = '';
let clickCount = 0;

const operands = document.querySelector('.operands');
operands.addEventListener('mousedown', iterateNumber);

const special = document.querySelector('.special');
special.addEventListener('click', executeSpecialKey);

const calculatorOperations = document.querySelector('.calculator-operations');
calculatorOperations.addEventListener('click', getOperation);

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
            if (target.classList[0] == key) {
                if (content.displayContent.length > 0) {
                    const lastCharacter = content['displayContent'].charAt(content['displayContent'].length - 1);
                    if (lastCharacter == ('÷' || '\u00D7' || '+' || '-')) {
                        variables.currentNumber += numbers[key];
                        return;
                    } else { 
                        variables.firstNumber += numbers[key];
                        return;
                    }
                } else {
                    variables.firstNumber += numbers[key];
                }
            }
        }
    }
    getNumber();
    const paraQuery = document.querySelector('.query');
    const paraResult = document.querySelector('.para-result');
    const styleOfParaQuery = getComputedStyle(paraQuery);
    if (styleOfParaQuery.opacity == 0) {
        paraQuery.style.opacity = 1;
        paraResult.style.opacity = 1;
    }
    content.displayContent;
    console.log(variables.firstNumber);
    console.log(content.displayContent);
    paraQuery.textContent = content.displayContent;
    return;
}
function executeSpecialKey() {

}
function getOperation() {

}