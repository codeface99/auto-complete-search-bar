import {
  FC,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useCallback,
} from "react";
import { debounce } from "./debounce";

type AutocompleteProps = {
  fetchSuggestions: (query: string) => Promise<string[]>;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
};

const Autocomplete: FC<AutocompleteProps> = ({
  value,
  onChange,
  fetchSuggestions: _fetchSuggestions,
  placeholder,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const results = await _fetchSuggestions(query);
        setSuggestions(results);
      } catch {
        setError("Failed to fetch suggestions");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionRefs = useRef<HTMLDivElement[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    onChange(nextValue);
    fetchSuggestions(nextValue);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      const nextHighlightedIndex = (highlightedIndex + 1) % suggestions.length;

      setHighlightedIndex(nextHighlightedIndex);

      suggestionRefs.current[nextHighlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    } else if (event.key === "ArrowUp") {
      const nextHighlightedIndex =
        highlightedIndex === 0 ? suggestions.length - 1 : highlightedIndex - 1;

      setHighlightedIndex(nextHighlightedIndex);

      suggestionRefs.current[nextHighlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      onChange(suggestions[highlightedIndex]);
      setSuggestions([]);
    }
  };

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
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ padding: "8px" }}
      />

      {loading && (
        <div style={{ backgroundColor: "white", padding: "8px" }}>
          Loading...
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "white", padding: "8px", color: "red" }}>
          {error}
        </div>
      )}

      {!loading && !error && suggestions?.length > 0 ? (
        <div
          style={{
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              ref={(el) => (suggestionRefs.current[index] = el!)}
              style={{
                padding: "8px",
                backgroundColor:
                  highlightedIndex === index ? "#f0f0f0" : "white",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => {
                onChange(suggestion);
                setSuggestions([]);
                setHighlightedIndex(0);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { Autocomplete };
