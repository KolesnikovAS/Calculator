import React, { useContext } from 'react';
import { Context } from '../../CalculatorContainer';
import './Result.scss';

const Result = () => {
    const { result } = useContext(Context);
    return (
        <p className="result">{result}</p>
    );
};

export default Result;
