import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/otherpage">Other Page</Link>
      </header>

      <Routes>
        <Route path="/" element={<Fib />}></Route>
        <Route path="/otherpage" element={<OtherPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
