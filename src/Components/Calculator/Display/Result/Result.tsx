import React, { useContext } from 'react';
import { Context, ContextType } from '../../CalculatorContainer';
import './Result.scss';

const Result : React.FC = () => {
    const { result } = useContext(Context) as ContextType;
    return (
        <p className="result">{result}</p>
    );
};

export default Result;
