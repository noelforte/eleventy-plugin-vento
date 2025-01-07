---
'eleventy-plugin-vento': patch
---

Wrap all filters as regular synchronous functions to avoid ambiguity with sync and async handling. (fixes #96)

This change enforces explicit use of the `await` keyword to unwrap returned values from filters before chaining more or printing the result.

```diff
<!-- Single filters -->
- {{ "Hello, async!" |> someAsyncFilter }}
+ {{ "Hello, async!" |> await someAsyncFilter }}

<!-- Filter chains -->
- {{ "Hello, async!" |> someAsyncFilter |> someSyncFilter }}
+ {{ "Hello, async!" |> await someAsyncFilter |> someSyncFilter }}
```

See the [Vento docs on async chains](https://vento.js.org/syntax/pipes/#chain-pipes) for more information.
