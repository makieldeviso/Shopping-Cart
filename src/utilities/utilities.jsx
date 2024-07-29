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

export { capitalizeString, amountFormat }