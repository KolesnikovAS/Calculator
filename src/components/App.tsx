import React from "react";
import { useState } from 'react';

import './styles.css';

const App = () => {
    const buttons = ["C", "\u221A", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "00", "0", ".", "="]
    const [result, changeResult] = useState<string>("0");
    const [string, changeString] = useState<string>("");
    const [activeButton, changeActiveButton] = useState<string>("")
    const onButton = (key : string) => {
        changeActiveButton(key)
        setTimeout(() => changeActiveButton(""), 100)
        calc(key);
    }
    const handler = (event: KeyboardEvent) => {
        if ((event.key).match(/[0-9%\/*\-+\(\)=]|Backspace|Enter/)) {
            event.preventDefault();
            calc(event.key);
            document.removeEventListener('keydown', handler);
        }
    }
    const checkResultLength = (string : string) => {
        return (string.length > 12) ? string.slice(0, 12) : string ;
    }
    document.addEventListener('keydown', handler);
    const calc = (key : string) => { 
        switch (key) {
            case (key === "=" || key === "Enter") ? key : false:
                if (string.length === 0) break;
                try {
                    changeResult(checkResultLength(eval(string).toString()));
                } catch {
                    changeResult("Error");
                }
                changeString("");
                break;
            case (key === "C" || key === "Backspace") ? key : false:
                if (string.length > 0) changeString(string.slice(0, -1));
                else changeResult("0");
                break;
            case "\u221A":
                (string.length === 0) ?
                    changeResult(checkResultLength(Math.sqrt(eval(result)).toString())) :
                    changeResult(checkResultLength(Math.sqrt(eval(string)).toString()));
                changeString("");
                break;
            default:
                (string.length === 0 && result !== "0" && result !== "NaN" && key.match(/[%\/*\-+\(\)=]/)) ?
                    changeString(result + string + key) :
                    changeString(string + key);
        }
    }
    return (
        <main>
            <section className="calc_body">
                <p className="input_values">{string}</p>
                <p className="result">{result}</p>
                <div className="buttons_field">
                    {buttons.map((item) =>
                        <button onClick={() => onButton(item)} key={item} 
                            className={`button ${activeButton === item && "active"}`}>{item}</button>)}
                </div>
            </section>
        </main>
    );
}


export default App;