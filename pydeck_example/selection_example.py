import pydeck as pdk
from ipywidgets import HTML, Output

pdk.settings.custom_libraries = [
    {
        "libraryName": "SelectionLayerLibrary",
        "resourceUri": "http://localhost:8000/dist/bundle.js",
    }
]

UK_ACCIDENTS_DATA = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'

layer = pdk.Layer(
    'HexagonLayer',  # `type` positional argument is here
    UK_ACCIDENTS_DATA,
    id='accidents',
    get_position=['lng', 'lat'],
    auto_highlight=True,
    elevation_scale=50,
    pickable=True,
    elevation_range=[0, 3000],
    extruded=True,
    coverage=1)

selection = pdk.Layer(
    'SelectionLayer',  # `type` positional argument is here
    id='selection',
    on_select="(info) => deckHandleEvent('deck-on-select-event', info)",
    selection_type=pdk.types.String("rectangle"))

# Set the viewport location
view_state = pdk.ViewState(
    longitude=-1.415,
    latitude=52.2323,
    zoom=6,
    min_zoom=5,
    max_zoom=15,
    pitch=40.5,
    bearing=-27.36)

r = pdk.Deck(layers=[layer, selection], initial_view_state=view_state)
r.to_html("selection_example.html")