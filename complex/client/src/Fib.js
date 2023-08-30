import React, { useEffect, useState } from "react";
import { geIndexes, getValues, insertValue } from "./api/Requests";

function Fib() {
  const [state, setState] = useState({
    seenIndex: [],
    values: {},
    index: "",
  });

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchValues = async () => {
    try {
      const { data } = await getValues();
      setState({ ...state, values: data });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIndexes = async () => {
    try {
      const { data } = await geIndexes();
      setState({ ...state, seenIndex: data });
    } catch (error) {
      console.log(error);
    }
  };

  const renderedIndexes = state?.seenIndex
    .map(({ number }) => number)
    .join(", ");
  const renderedValues = () => {
    const entries = [];
    for (let key in state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {state?.values[key]}
        </div>
      );
    }
    return entries;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertValue({ index: state?.index });
      setState({ ...state, index: "" });
    } catch (error) {}
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index: </label>
        <input
          value={state.index}
          onChange={(e) => setState({ ...state, index: e.target.value })}
        />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen version 2:</h3>
      {renderedIndexes}
      <h3>Calculated Values version 2:</h3>
      {renderedValues()}
    </div>
  );
}

export default Fib;
