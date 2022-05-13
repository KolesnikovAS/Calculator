import React, { useContext } from 'react';
import { Context, ContextType } from '../../CalculatorContainer';
import './Button.scss';

type props = {
    value: string,
};

const Button : React.FC<props> = ({value}) => {
    const { handleClick } = useContext(Context) as ContextType;
    return (
        <button onClick={() => handleClick(value)} className="button">{value}</button>
    );
};

export default Button;
