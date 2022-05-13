import React, { useContext } from 'react';
import { Context } from '../../CalculatorContainer';
import './Button.scss';

type props = {
    value: string,
};

const Button = ({value}:props) => {
    const { handleClick } = useContext(Context);
    return (
        <button onClick={() => handleClick(value)} className="button">{value}</button>
    );
};

export default Button;
