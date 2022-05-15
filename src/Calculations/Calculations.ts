type operation = (operands: string[], operatorIndex: number) => string

export const multiply:operation = (operands,operatorIndex) =>
    (parseFloat(operands[operatorIndex]) * parseFloat(operands[operatorIndex + 1])).toString()
export const devide:operation = (operands,operatorIndex) =>
    (parseFloat(operands[operatorIndex]) / parseFloat(operands[operatorIndex + 1])).toString()