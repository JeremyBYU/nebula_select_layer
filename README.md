Custom layers for pydeck
========================

This repo creates a bundle for a nebula.js selection layer.

To get started with this example repo, install the dependencies:

```bash
yarn
python3 -m venv env
. env/bin/activate
pip install -r pydeck_example/requirements.txt
```

Then execute the following to a pydeck script and serve the JavaScript bundle:

```bash
python pydeck_example/selection_example.py
python -m http-server
```

Navigate to http://localhost:8080/selection_layer.html in your browser, which should render the visualization.
