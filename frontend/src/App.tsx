import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [apiHealth, setApiHealth] = useState<string>("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/v1/health");
        const data = await response.json();
        setApiHealth(JSON.stringify(data));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setApiHealth(`Error: ${errorMessage}`);
      }
    };
    fetchHealth();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card"></div>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <p>API Health: {apiHealth}</p>
    </>
  );
}

export default App;
