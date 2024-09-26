const capitalizeString = function (string) {
  const spacerRegex = /[^-]+|-/g;
  const stringArray = string.match(spacerRegex);
  const newStringArray = stringArray.map((string) => {
    return(
      `${string.slice(0,1).toUpperCase()}${string.slice(1).toLowerCase()}`
    )
  });

  return newStringArray.join(' ');
}

const amountFormat = function (amount) {
  return `$${Number.parseFloat(amount).toFixed(2)}`;
}

const handleInputMove = function (event, inputsRefArr, endFunc) {
  if (event.keyCode === 13) {
    event.target.blur();

    const currentInputIndex = Number(event.target.dataset.index);

    if (currentInputIndex < inputsRefArr.length - 1) {
      inputsRefArr[currentInputIndex + 1].current.focus();
    } else {
      endFunc();
    }
  }
}


export { capitalizeString, amountFormat, handleInputMove }