import { useState } from "react";
import { Autocomplete } from "./autocomplete";
import "./styles.css";

const fetchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=10&format=json&origin=*`
    );
    const data = await response.json();

    return data[1];
  } catch (err) {
    throw new Error("Failed to fetch suggestions");
  }
};

const App = () => {
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "400px",
        margin: "auto",
      }}
    >
      <h1 style={{ color: "white" }}>Autocomplete search bar</h1>

      <Autocomplete
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        fetchSuggestions={fetchSuggestions}
        placeholder="Search Wikipedia..."
      />
    </div>
  );
};

export default App;
