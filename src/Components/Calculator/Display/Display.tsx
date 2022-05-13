import React from 'react';
import Expression from './Expression/Expression';
import Result from './Result/Result';
import './Display.scss';


const Display = () => {
    return (
        <div className="display">
            <Expression />
            <Result />
        </div>
    );
};

export default Display;
