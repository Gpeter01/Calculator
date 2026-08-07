function setContainerSize() {
    const nine = document.querySelector('.nine');
    const numberpad = document.querySelector('.number-pad');
    const styleOfNumberpad = getComputedStyle(numberpad);
    const styleOfNine = getComputedStyle(nine);
    const newStyle = (parseFloat(styleOfNine.width) * 3) + (parseFloat(styleOfNumberpad.gap) * 2);
    numberpad.style.width = `${newStyle}px`;
}
setContainerSize();