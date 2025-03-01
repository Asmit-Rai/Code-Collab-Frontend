import React, { useState, useEffect } from "react";
import "./Compiler.css";

const Compiler = ({ copiedCode, code }) => {
  const [input, setInput] = useState(localStorage.getItem("input") || copiedCode || "");
  const [languageId, setLanguageId] = useState(localStorage.getItem("language_Id") || 2);
  const [userInput, setUserInput] = useState(localStorage.getItem("user_input") || "");

  useEffect(() => {
    setInput(localStorage.getItem("input") || copiedCode || "");
    setUserInput(localStorage.getItem("user_input") || "");
    setLanguageId(localStorage.getItem("language_Id") || 2);
  }, [copiedCode]);

  useEffect(() => {
    if (code !== input) {
      setInput(code);
    }
  }, [code, input]);

  const handleUserInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    localStorage.setItem("user_input", newValue);
  };

  const handleLanguageChange = (e) => {
    const newLanguageId = e.target.value;
    setLanguageId(newLanguageId);
    localStorage.setItem("language_Id", newLanguageId);
  };


  const submitCode = async (e) => {
    e.preventDefault();
    const outputElement = document.getElementById("output");
    outputElement.innerText = "Creating Submission...";

    try {
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "8086616a45mshb1a1acbf1e95a2dp1eaf0djsnaa765b1fb185", 
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: input,
          stdin: userInput,
          language_id: languageId,
        }),
      });

      const jsonResponse = await response.json();

      let result = { status: { description: "Queue" } };
      while (result.status.description !== "Accepted" && !result.stderr && !result.compile_output) {
        if (jsonResponse.token) {
          const resultResponse = await fetch(
            `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`,
            {
              headers: {
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                "x-rapidapi-key": "8086616a45mshb1a1acbf1e95a2dp1eaf0djsnaa765b1fb185", 
                "content-type": "application/json",
              },
            }
          );
          result = await resultResponse.json();
        }
      }

      if (result.stdout) {
        const decodedOutput = atob(result.stdout);
        outputElement.innerText = `Results:\n${decodedOutput}\nExecution Time: ${result.time} Secs\nMemory used: ${result.memory} bytes`;
      } else {
        outputElement.innerText = "No output available";
      }
    } catch (error) {
      outputElement.innerText = "Error submitting code!";
    }
  };

  return (
    <div className="container-fluid row">
      <div className="col-md-6">
        <div className="text-center mb-2">
          <button className="btn btn-danger" onClick={submitCode}>
            Run Code
          </button>
        </div>
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          className="form-control mb-2"
          value={languageId}
          onChange={handleLanguageChange}
        >
          <option value="54">C++</option>
          <option value="50">C</option>
          <option value="62">Java</option>
          <option value="71">Python</option>
        </select>
        <div className="form-group">
          <label htmlFor="userInput">User Input (stdin):</label>
          <textarea
            id="userInput"
            className="form-control"
            rows="2"
            value={userInput}
            onChange={handleUserInputChange}
            placeholder="Enter input for your program..."
          ></textarea>
        </div>
      </div>

      <div className="col-md-6">
        <textarea id="output" className="form-control" rows="5" readOnly></textarea>
      </div>
    </div>
  );
};

export default Compiler;
