# LexiDict Flow Diagram

```mermaid
flowchart TD
  A["Open App"] --> B["View Onboarding"]
  B --> C["Go to Search Screen"]
  C --> D["Enter a Word"]
  D --> E["Validate Input"]
  E -->|invalid| F["Show Validation Message"]
  F --> D
  E -->|valid| G["Request Dictionary Data"]
  G --> H["Show Loading State"]
  H --> I["Receive Definition Result"]
  I -->|found| J["Render Word Details"]
  I -->|not found| K["Show Animated Not-Found State"]
  J --> L["Choose Pronunciation Audio"]
  L --> M["Tap Speaker Icon"]
  M --> N["Play / Pause / Resume / Stop Audio"]
  J --> O["Save Search to History"]
  O --> P["Open History Later"]
  P --> C
```

## Flow Summary

1. The app opens with onboarding.
2. The user lands on the search screen.
3. A word is entered and validated.
4. Invalid input stays on the search screen with a clear message.
5. Valid input triggers the dictionary lookup.
6. The app shows loading while the request is being processed.
7. A found word leads to definitions, examples, and pronunciation options.
8. A missing word leads to the animated not-found state.
9. The chosen word is stored in history for future access.

