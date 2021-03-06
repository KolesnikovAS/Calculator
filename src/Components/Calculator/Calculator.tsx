import React from 'react';
import ButtonsArea from './ButtonsArea/ButtonsArea';
import Display from './Display/Display';
import './Calculator.scss';

const Calculator : React.FC = () => {
    return (
        <div className="calculator_body">
            <Display />
            <ButtonsArea />
        </div>
    );
};

export default Calculator;
