type highPriorityOperation = (operands: string[], operatorIndex: number) => number;
type lowPriorityOperation = (operands: string[], firstSymbol: string) => number;
type calculatehighPriorityOperation = (expression: string, operation: '*' | '/') => string;
type operation = (expression: string) => string;

export const multiply: highPriorityOperation = (operands, operatorIndex) =>
    operands[operatorIndex + 1] ?
        parseFloat(operands[operatorIndex]) * parseFloat(operands[operatorIndex + 1]) :
        -parseFloat(operands[operatorIndex]) * parseFloat(operands[operatorIndex + 2]);

export const devide: highPriorityOperation = (operands, operatorIndex) =>
    operands[operatorIndex + 1] ?
        parseFloat(operands[operatorIndex]) / parseFloat(operands[operatorIndex + 1]) :
        -parseFloat(operands[operatorIndex]) / parseFloat(operands[operatorIndex + 2]);

export const subtract: lowPriorityOperation = (operands, firstSymbol) =>
    firstSymbol === '-' ?
        -parseFloat(operands[0]) - parseFloat(operands[1]) :
        parseFloat(operands[0]) - parseFloat(operands[1]);

export const sum: lowPriorityOperation = (operands, firstSymbol) =>
    firstSymbol === '-' ?
        -parseFloat(operands[0]) + parseFloat(operands[1]) :
        parseFloat(operands[0]) + parseFloat(operands[1]);

// for high priority operation ( * or / )
export const calculateHighPriorityOperations: calculatehighPriorityOperation = (expression, operation) => {
    // while expression include operation * or /
    while (expression.indexOf(operation) !== -1) {
        // split expression on digits
        const operands: string[] = expression.split(/[\/*\-+]/);
        // get index of first operator * or /
        const operatorIndex: number = expression.match(/[\/*\-+]/g)!.indexOf(operation);
        // get result of operation with two close digits
        const result: number = (operation === '*') ? multiply(operands, operatorIndex) : devide(operands, operatorIndex);
        // replace operation with two close digits with result
        operands[operatorIndex + 1] ?
            expression = expression.replace(`${operands[operatorIndex]}${operation}${operands[operatorIndex + 1]}`, result.toString()) :
            expression = expression.replace(`${operands[operatorIndex]}${operation}-${operands[operatorIndex + 2]}`, result.toString());
        expression = expression.replace('--', '+');
        expression = expression.replace('+-', '-');
    }
    return expression;
};

// for low priority operation ( + or - )
export const calculateLowPriorityOperations: operation = (expression) => {
    // while expression include operation - or + and expression is not digit
    while (expression.match(/[+-]/) && !(+expression)) {
        // first operands is negative ?
        if (expression[0] === '-') {
            // split expression on digits
            const operands: string[] = expression.slice(1).split(/[+-]/);
            // get first operator
            const operator: string = expression.slice(1).match(/[+-]/g)![0];
            // get result of operation with two first digits
            const result: number = (operator === '+') ? sum(operands, expression[0]) : subtract(operands, expression[0]);
            // replace operation with two first digits with result
            expression = expression.replace(expression[0] + operands[0] + operator + operands[1], result.toString());
        } else {
            // split expression on digits
            const operands: string[] = expression.split(/[+-]/);
            // get first operator
            const operator: string = expression.match(/[+-]/g)![0];
            // get result of operation with two first digits
            const result: number = (operator === '+') ? sum(operands, expression[0]) : subtract(operands, expression[0]);
            // replace operation with two first digits with result
            expression = expression.replace(operands[0] + operator + operands[1], result.toString());
        }
    }
    return expression;
};

export const calculateScopes: operation = (expression) => {
    const secondScopeIndex: number = expression.indexOf(')');
    const firstScopeIndex: number = expression.slice(0, secondScopeIndex).lastIndexOf('(');
    // get result of expression in scopes
    const result: string = calculate(expression.slice(firstScopeIndex + 1, secondScopeIndex));
    // replace expression in scopes with result
    expression = expression.replace(expression.slice(firstScopeIndex, secondScopeIndex + 1), result);
    return expression;
};

export const calculatePercent: operation = (expression) => {
    // get array of operators in expression
    const operators: RegExpMatchArray[] = (Array.from(expression.matchAll(/[%\/*\-+\(\)=]/g)));
    // get index of last operator
    const lastOperatorIndex: number = operators[operators.length - 1].index!;
    // get calculated last digit in %
    const lastDigit: number = parseFloat(calculate(expression.slice(0, lastOperatorIndex))) * (parseFloat(expression.slice(lastOperatorIndex + 1)) / 100);
    expression = expression.slice(0, lastOperatorIndex + 1) + lastDigit;
    expression = expression.replace('--', '+');
    expression = expression.replace('+-', '-');
    return expression;
};

export const calculateSqrt: operation = (expression) => Math.sqrt(parseFloat(calculate(expression))).toString();

export const calculate: operation = (expression) => {
    while (expression.match(/[()]/)) {
        expression = calculateScopes(expression);
    }
    expression = calculateHighPriorityOperations(expression, '*');
    expression = calculateHighPriorityOperations(expression, '/');
    expression = calculateLowPriorityOperations(expression);
    return expression;
};
