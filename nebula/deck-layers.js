
// Assume that deck is in the global scope
const _global = typeof window === 'undefined' ? global : window;
const deck = _global.deck;

if (deck === undefined) {
  throw new Error('deck.gl is not in global scope');
}

const {PolygonLayer, CompositeLayer, GeoJsonLayer, ScatterplotLayer, IconLayer, TextLayer} = deck;

export {PolygonLayer, CompositeLayer, GeoJsonLayer, ScatterplotLayer, IconLayer, TextLayer};
