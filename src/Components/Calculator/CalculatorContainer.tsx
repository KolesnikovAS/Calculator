import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';

export type ContextType = {
    expression: string,
    result: string,
    handleClick: (key: string) => void,
};

export const Context = React.createContext<Partial<ContextType | null>>(null);

const CalculatorContainer: React.FC = () => {
    const [result, setResult] = useState<string>('0');
    const [expression, setExpression] = useState<string>('9-(9*-25)');

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [expression, result]);

    const handleClick: (key: string) => void = (key) => {
        inputKey(key);
    };

    const handleKeydown: (event: KeyboardEvent) => void = (event) => {
        if ((event.key).match(/[0-9%\/*\-+\(\)=]|Backspace|Enter/)) {
            event.preventDefault();
            inputKey(event.key);
        }
    };

    const calculate: (expression: string) => string = (expression) => {
        let combination: string = expression;

        // if combination include scopes
        if (combination.match(/[()]/)) {
            const secondScopeIndex = combination.indexOf(')');
            const firstScopeIndex = combination.slice(0, secondScopeIndex).lastIndexOf('(');
            // get result of combination in scopes
            const result = calculate(combination.slice(firstScopeIndex + 1, secondScopeIndex));
            // replace combination in scopes with result
            combination = combination.replace(combination.slice(firstScopeIndex, secondScopeIndex + 1), result);
        }

        // for high priority operation ( * or / )
        const calculateHighPriorityOperations: (operation: '*' | '/') => void = (operation) => {
            combination = combination.replace('--', '+');
            // while combination include operation * or /
            while (combination.indexOf(operation) !== -1) {
                // split combination on digits
                const operands: string[] = combination.split(/[\/*\-+]/);
                // get index of first operator * or /
                const operatorIndex: number = combination.match(/[\/*\-+]/g)!.indexOf(operation);
                // get result of operation with two close digits
                let result: string | null = null;
                if (!operands[operatorIndex + 1]) {
                    if (operation === '*') result = '-' + (+operands[operatorIndex] * +operands[operatorIndex + 2]);
                    else if (operation === '/') result = '-' + (+operands[operatorIndex] / +operands[operatorIndex + 2]);
                    combination = combination.replace(operands[operatorIndex] + operation + '-' + operands[operatorIndex + 2], result!);
                } else {
                    if (operation === '*') result = (+operands[operatorIndex] * +operands[operatorIndex + 1]).toString();
                    else if (operation === '/') result = (+operands[operatorIndex] / +operands[operatorIndex + 1]).toString();
                    combination = combination.replace(operands[operatorIndex] + operation + operands[operatorIndex + 1], result!);
                }
                // replace operation with two close digits with result
            }
        };

        // for low priority operation ( + or - )
        const calculateLowPriorityOperations: () => void = () => {
            // while combination include operation - or + and combination is not digit
            while (combination.match(/[+-]/) && !(+combination)) {
                // first operands is negative ?
                if (combination[0] === '-') {
                    // split combination on digits
                    const operands: string[] = combination.slice(1).split(/[+-]/);
                    // get first operator
                    const operator: string = combination.slice(1).match(/[+-]/g)![0];
                    // get result of operation with two first digits
                    let result: number | null = null;
                    if (operator === '+') result = 0 - +operands[0] + +operands[1];
                    else if (operator === '-') result = 0 - +operands[0] - +operands[1];
                    // replace operation with two first digits with result
                    combination = combination.replace(combination[0] + operands[0] + operator + operands[1], result!.toString());
                } else {
                    // split combination on digits
                    const operands: string[] = combination.split(/[+-]/);
                    // get first operator
                    const operator: string = combination.match(/[+-]/g)![0];
                    // get result of operation with two first digits
                    let result: number | null = null;
                    if (operator === '+') result = +operands[0] + +operands[1];
                    else if (operator === '-') result = +operands[0] - +operands[1];
                    // replace operation with two first digits with result
                    combination = combination.replace(operands[0] + operator + operands[1], result!.toString());
                }
            }
        };
        calculateHighPriorityOperations('*');
        calculateHighPriorityOperations('/');
        calculateLowPriorityOperations();
        return combination;
    };

    const inputKey: (key: string) => void = (key) => {
        switch (key) {
            case '=':
            case 'Enter':
                if (expression.length === 0) break;
                try {
                    // if count of "(" !== ")" throw Error
                    if (expression.match(/[()]/) && (expression.match(/[(]/g)!.length !== expression.match(/[)]/g)!.length)) {
                        throw Error;
                    }
                    setResult(calculate(expression));
                } catch {
                    setResult('Error');
                }
                setExpression('');
                break;
            case '%':
                if (!expression.match(/[%\/*\-+\(\)=]/g)) {
                    setResult('0');
                    setExpression('');
                    break;
                }
                // get array of operators in expression
                const operators: RegExpMatchArray[] = (Array.from(expression.matchAll(/[%\/*\-+\(\)=]/g)));
                // get index of last operator
                const lastOperatorIndex: number = operators[operators.length - 1].index!;
                // get calculated last digit in %
                const lastDigit: number = Number(calculate(expression.slice(0, lastOperatorIndex))) * (Number(expression.slice(lastOperatorIndex + 1)) / 100);
                setExpression(expression.slice(0, lastOperatorIndex + 1) + lastDigit);
                break;
            case 'C':
            case 'Backspace':
                (expression.length > 0) ? setExpression(expression.slice(0, -1)) : setResult('0');
                break;
            case '√':
                (expression.length === 0) ?
                    setResult(Math.sqrt(Number(calculate(result))).toString()) :
                    setResult(Math.sqrt(Number(calculate(expression))).toString());
                setExpression('');
                break;
            default:
                (expression.length === 0 && result !== 'Error' && result !== '0' && result !== 'NaN' && key.match(/[%\/*\-+\(\)=]/)) ?
                    setExpression(result + expression + key) :
                    setExpression(expression + key);
        }
    };
    return (
        <Context.Provider value={{ expression, result, handleClick }}>
            <Calculator />
        </Context.Provider>
    );
};

export default CalculatorContainer;
