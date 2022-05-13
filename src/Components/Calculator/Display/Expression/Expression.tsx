import React, { useContext } from 'react';
import { Context } from '../../CalculatorContainer';
import './Expression.scss';

const Expression = () => {
    const { expression } = useContext(Context);
    return (
        <p className="expression">{expression}</p>
    );
};

export default Expression;
