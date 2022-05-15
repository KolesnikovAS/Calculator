import React, { useState, useEffect } from 'react';
import { calculate, calculatePercent, calculateSqrt } from '../../Calculations/Calculations';
import Calculator from './Calculator';

export type ContextType = {
    expression: string,
    result: string,
    handleClick: (key: string) => void,
};

export const Context = React.createContext<ContextType | null>(null);

const CalculatorContainer: React.FC = () => {
    const [result, setResult] = useState<string>('0');
    const [expression, setExpression] = useState<string>('');

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [expression, result]);

    const handleClick = (key: string) : void => {
        inputKey(key);
    };

    const handleKeydown = (event: KeyboardEvent) : void => {
        if ((event.key).match(/[0-9%\/*\-+\(\)=]|Backspace|Enter/)) {
            event.preventDefault();
            inputKey(event.key);
        }
    };

    const inputKey = (key: string) : void => {
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
                setExpression(calculatePercent(expression));
                break;
            case 'C':
            case 'Backspace':
                (expression.length > 0) ? setExpression(expression.slice(0, -1)) : setResult('0');
                break;
            case '√':
                (expression.length === 0) ?
                    setResult(calculateSqrt(result)) :
                    setResult(calculateSqrt(expression));
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
