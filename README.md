Custom layers for pydeck
========================

This repo creates a bundle for a nebula.js selection layer. Hold the r-key to select.
This module also requires a **custom fork** of [pydeck](https://github.com/JeremyBYU/deck.gl/tree/unsafeDeckGL) that has the onSelect event and handler. This way you can get all the items selected.

# Build

Build the repo with

```
yarn
yarn build
```

This creates the file `dist/bundle.js` that has this custom pydeck extension. You need to import as shown in `pydeck_example/selection_example.py`. This requires a webserver that can serve the bundle. You then serve the bundle with: `python -m http.server`


Navigate to http://localhost:8080/selection_layer.html in your browser, which should render the visualization.
