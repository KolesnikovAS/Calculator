import React, { useContext } from 'react';
import { Context, ContextType } from '../../CalculatorContainer';
import './Expression.scss';

const Expression :  React.FC = () => {
    const { expression } = useContext(Context) as ContextType;
    return (
        <p className="expression">{expression}</p>
    );
};

export default Expression;
