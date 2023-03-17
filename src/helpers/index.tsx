export function customEasing(
  x: number,
  inputThreshold = 0.2,
  firstOutputRatio = 0.7
) {
  const secondInputRatio = 1 - inputThreshold

  if (x < -1 || x > 1) {
    throw new Error("Input value must be between -1 and 1.")
  }

  const inputSign = x >= 0 ? 1 : -1
  const inputValue = Math.abs(x)

  let output
  if (inputValue <= inputThreshold) {
    // The first 90% of the output happens in the first 30% of the input.
    output = (firstOutputRatio * inputValue) / inputThreshold
  } else {
    // The last 10% of the output happens in the remaining 70% of the input.
    output =
      firstOutputRatio +
      ((1 - firstOutputRatio) * (inputValue - inputThreshold)) /
        secondInputRatio
  }

  // Scale the output to the desired range (-0.1 to 0.1) and apply the sign.
  return inputSign * output * 0.12
}
