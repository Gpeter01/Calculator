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