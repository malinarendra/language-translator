import React, { useState } from "react";

import axios from 'axios'

import './App.css'

import Countries from "./language";

import copy from 'clipboard-copy';

const App = () => {

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const lang = Countries;
    const [load, setLoad] = useState(false)
    const [note, setNote] = useState(true)

    //input
    const changeInput = (e) => {
        setInput(e.target.value)
    }

    //from
    const changeFrom = (e) => {
        setFrom(e.target.value)
    }

    //to
    const changeTo = (e) => {
        setTo(e.target.value)
    }

    //function to translate text
    const translateText = async () => {
        try {
            const options = {
                method: 'POST',
                url: 'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': `${process.env.API_KEY}`,
                    'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
                },
                data: {
                    from: `${from}`,
                    to: `${to}`,
                    q: `${input}`
                }
            };

            const result = await axios.request(options)
            console.log(result)
            setLoad(false)
            setOutput(result.data[0])
        } catch (err) {
            if (err.message==="Request failed with status code 429") {
                alert("Sorry api limit exceeds!")
                window.location.reload()
            }
            else{
                alert("Please recheck selections!")
            }
        }
    }

    //fucntion to trigger translateText
    const getMyTranslation = () => {
        if (input === "") {
            alert("Please enter some text!")
        }
        else if (from === "") {
            alert("Please choose source language!")
        }
        else if (to === "") {
            alert("Please choose target language!")
        }
        else {
            setLoad(true)
            translateText()
        }
    }

    //function to cross change the languages
    const crossChange = () => {
        if (output === "") {
            setFrom(from)
            setTo(to)
            setInput(input)
            setOutput(output)
        } else {
            setFrom(to)
            setTo(from)
            setInput(output)
            setOutput(input)
        }
    }

    //function to copy input
    const copyInput = () => {
        copy(input);
    }

    //function to copy output
    const copyOutput = () => {
        copy(output)
    }

    //function to close note
    const closeNote = () => {
        setNote(false)
    }

    return (
        <>
            {note === true ? <div id="note">
                <p>Welcome to language translator. Now enjoy our app by translating text into <span id="hundread">100 languages</span> all over the world!<span id="cross" onClick={closeNote}>X</span></p>
            </div> : null}
            <div id="main">
                <div className="input">
                    <div className="hi">
                        <span className="space">From: </span><select onChange={changeFrom} value={from} className="select">
                            <option hidden value={""}>--select language--</option>
                            {Object.entries(lang).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text">
                        <textarea style={{ resize: "none" }} value={input} placeholder="Enter text" cols="30" rows="6" onChange={changeInput}></textarea>
                        {input !== "" ? <p className="copyText" onClick={copyInput} >copy</p> : null}
                    </div>
                </div>

                <div id="direction" onClick={crossChange}>
                    <h1>↕️</h1>
                </div>

                <div className="output">
                    <div className="hi">
                        <span className="space">To: </span><select onChange={changeTo} value={to} className="select">
                            <option hidden value={""}>--select language--</option>
                            {Object.entries(lang).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text">
                        <textarea style={{ resize: "none" }} value={load === true ? "Translating..." : output} placeholder="Translation" id="" cols="30" rows="6" contentEditable={false}>

                        </textarea>
                        {output !== "" ? <p className="copyText" onClick={copyOutput} >copy</p> : null}
                    </div>
                </div>
            </div>
            <div id="btn">
                <button onClick={getMyTranslation}>Translate</button>
            </div>
        </>
    )
}

export default App;