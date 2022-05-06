import React from "react";
import { useState } from 'react';

import './styles.css';

const App = () => {
    const buttons = ["C", "\u221A", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "00", "0", ".", "="]
    let [result, changeResult] = useState("0");
    let [string, changeString] = useState("");
    document.addEventListener('keydown', event => {
        if ((event.key).match(/[0-9%\/*\-+\(\)=]|Backspace|Enter/)) {
            event.preventDefault();
            calc(event.key);
        }
    })
    const calc = (key) => {
        switch (key) {
            case (key === "=" || key === "Enter") ? key : false :
                try {
                    changeResult(eval(string).toString());
                } catch {
                    changeResult("Error");
                }
                changeString("");
                break;
            case (key === "C" || key === "Backspace") ? key : false :
                if (string.length > 0) changeString(string.slice(0, -1));
                else (result.length === 1 || result == "Error") ? changeResult("0") : changeResult(result.slice(0, -1));
                break;
            case "\u221A":
                changeResult(Math.sqrt(eval(string)).toString());
                changeString("");
                break;
            default:
                (string.length === 0 && result !== "0" && result !== "NaN") ? 
                    changeString(result + string + key) : 
                    changeString(string + key);
        }
    }
    return (
        <main>
            <section className="calc_body">
                <div className="input_values">{string}</div>
                <div className="result">{result}</div>
                <div className="buttons_field">
                    {buttons.map((item, index) => 
                        <button onClick={(e) => calc(e.target.innerHTML)} key={index} className="button">{item}</button>)}
                </div>
            </section>
        </main>
    );
}


export default App;