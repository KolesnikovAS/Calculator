import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';

export type ContextType = {
    expression: string,
    result: string,
    handleClick: (key: string) => void,
};

export const Context = React.createContext<Partial<ContextType | null>>(null);

const CalculatorContainer : React.FC = () => {
    const [result, setResult] = useState<string>('0');
    const [expression, setExpression] = useState<string>('');

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [expression, result]);

    const handleClick : (key: string) => void = (key) => {
        inputKey(key);
    };

    const handleKeydown : (event : KeyboardEvent) => void = (event) => {
        if ((event.key).match(/[0-9%\/*\-+\(\)=]|Backspace|Enter/)) {
            event.preventDefault();
            inputKey(event.key);
        }
    };

    const calculate : (expression : string) => string = (expression) => {
        let value: string = expression;

        // for operation in scopes
        const calculateScopes : () => void = () => {
            // while expression include scopes
            while (value.match(/[()]/)) {
                const secondScopeIndex = value.indexOf(')');
                const firstScopeIndex = value.slice(0, secondScopeIndex).lastIndexOf('(');
                // get result of expression in scopes
                const result = calculate(value.slice(firstScopeIndex + 1, secondScopeIndex));
                // replace expression in scopes with result
                value = value.replace(value.slice(firstScopeIndex, secondScopeIndex + 1), result);
                console.log(value);
            }
        };
        // for high priority operation ( * or / )
        const calculateHighPriorityOperations : (operation : '*' | '/') => void = (operation) => {
            // while expression include operation * or /
            while (value.indexOf(operation) !== -1) {
                // split expression on digits
                const operands: string[] = value.split(/[\/*\-+]/);
                // get index of first operator * or /
                const operatorIndex: number = value.match(/[\/*\-+]/g)!.indexOf(operation);
                // get result of operation with two close digits
                let result: number | null = null;
                if (operation === '*') result = +operands[operatorIndex] * +operands[operatorIndex + 1];
                else if (operation === '/') result = +operands[operatorIndex] / +operands[operatorIndex + 1];
                // replace operation with two close digits with result
                value = value.replace(operands[operatorIndex] + operation + operands[operatorIndex + 1], result!.toString());
            }
        };

        // for low priority operation ( + or - )
        const calculateLowPriorityOperations : () => void = () => {
            // while expression include operation - or + and expression is not digit
            while (value.match(/[+-]/) && !(+value)) {
                // first operands is negative ?
                if (value[0] === '-') {
                    // split expression on digits
                    const operands: string[] = value.slice(1).split(/[+-]/);
                    // get first operator
                    const operator: string = value.slice(1).match(/[+-]/g)![0];
                    // get result of operation with two first digits
                    let result: number | null = null;
                    if (operator === '+') result = 0 - +operands[0] + +operands[1];
                    else if (operator === '-') result = 0 - +operands[0] - +operands[1];
                    // replace operation with two first digits with result
                    value = value.replace(value[0] + operands[0] + operator + operands[1], result!.toString());
                } else {
                    // split expression on digits
                    const operands: string[] = value.split(/[+-]/);
                    // get first operator
                    const operator: string = value.match(/[+-]/g)![0];
                    // get result of operation with two first digits
                    let result: number | null = null;
                    if (operator === '+') result = +operands[0] + +operands[1];
                    else if (operator === '-') result = +operands[0] - +operands[1];
                    // replace operation with two first digits with result
                    value = value.replace(operands[0] + operator + operands[1], result!.toString());
                }
            }
        };
        calculateScopes();
        calculateHighPriorityOperations('*');
        calculateHighPriorityOperations('/');
        calculateLowPriorityOperations();
        return value;
    };

    const inputKey = (key: string) => {
        switch (key) {
            case '=':
            case 'Enter':
                if (expression.length === 0) break;
                try {
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
                const lastOperatorIndex : number = operators[operators.length - 1].index!;
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
