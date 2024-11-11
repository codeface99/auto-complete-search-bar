# Question: Autocomplete Search Bar using Wikipedia API

Implement a simple Autocomplete Search Bar that fetches suggestions from the Wikipedia API as the user types. The search bar should display relevant Wikipedia article titles based on user input.

### API Endpoint:

https://en.wikipedia.org/w/api.php?action=opensearch&search={query}&limit=10&format=json

### Requirements:

- Display a list of suggestions below the search bar based on user input.
- Fetch suggestions from the Wikipedia API using the provided endpoint.

### Bonus (Follow-up) Questions

- Keyboard Navigation:

  Enable arrow key navigation within the suggestions list. Allow selection with the Enter key to populate the search bar with the chosen suggestion.

- Debounce Implementation:

  Implement a debounce function to limit the number of API calls. Set the delay to 300 ms, triggering the API request only after the user pauses typing.
