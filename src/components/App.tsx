import React, {useState, useEffect} from "react";

import './styles.css';

const App = () => {
    const buttons = ["C", "√", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "00", "0", ".", "="]
    const [result, setResult] = useState<string>("0");
    const [expression, setExpression] = useState<string>("");

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    },[expression])

    const handleClick = (key : string) => {
        calculate(key);
    }

    const handleKeydown = (event: KeyboardEvent) => {
        if ((event.key).match(/[0-9%\/*\-+\(\)=]|Backspace|Enter/)) {
            event.preventDefault();
            calculate(event.key);
        }
    }

    const calculate = (key : string) => { 
        switch (key) {
            case "=":
            case "Enter":
                if (expression.length === 0) break;
                try {
                    setResult((eval(expression).toString()));
                } catch {
                    setResult("Error");
                }
                setExpression("");
                break;
            case "%":
                // let value = 
                // let regexp = /[%\/*\-+\(\)=]/g;
                // console.log( regexp.exec(expression));
                break;
            case "C":
            case "Backspace":
                if (expression.length > 0) setExpression(expression.slice(0, -1));
                else setResult("0");
                break;
            case "√":
                (expression.length === 0) ?
                    setResult(Math.sqrt(eval(result)).toString()) :
                    setResult(Math.sqrt(eval(expression)).toString());
                setExpression("");
                break;
            default:
                (expression.length === 0 && result !== "Error" && result !== "0" && result !== "NaN" && key.match(/[%\/*\-+\(\)=]/)) ?
                    setExpression(result + expression + key) :
                    setExpression(expression + key);
        }
    }
    return (
        <main>
            <section className="calc_body">
                <p className="expression">{expression}</p>
                <p className="result">{result}</p>
                <div className="buttons_field">
                    {buttons.map((item) =>
                        <button onClick={() => handleClick(item)} key={item}>{item}</button>)}
                </div>
            </section>
        </main>
    );
}


export default App;