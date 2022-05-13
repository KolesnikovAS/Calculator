import React from 'react';
import Button from './Button/Button';
import './ButtonsArea.scss';

const ButtonsArea = () => {
    const buttons: string[] = ['C', '√', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '00', '0', '.', '='];
    return (
        <div className="buttons_area">
            {buttons.map((item) => <Button key={item} value={item} />)}
        </div>
    );
};

export default ButtonsArea;
