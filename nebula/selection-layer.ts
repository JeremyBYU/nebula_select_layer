/* eslint-env browser */

// import { CompositeLayerProps, DefaultProps } from '@deck.gl/core/typed';
import { PolygonLayer, CompositeLayer } from './deck-layers';
import { DrawRectangleMode } from './draw-rectangle-mode'
import { ViewMode } from './view-mode'
import EditableGeoJsonLayer from './editable-geojson-layer';

export const SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
};

const MODE_MAP = {
  [SELECTION_TYPE.RECTANGLE]: DrawRectangleMode,
};

const MODE_CONFIG_MAP = {
  [SELECTION_TYPE.RECTANGLE]: { dragToDraw: true },
};

interface SelectionLayerProps<DataT> extends CompositeLayerProps<DataT> {
  layerIds: any[];
  onSelect: (info: any) => any;
  selectionType: string | null;
}

const defaultProps: DefaultProps<SelectionLayerProps<any>> = {
  selectionType: SELECTION_TYPE.RECTANGLE,
  layerIds: [],
  onSelect: () => {},
};

const EMPTY_DATA = {
  type: 'FeatureCollection',
  features: [],
};

const EXPANSION_KM = 50;
const LAYER_ID_GEOJSON = 'selection-geojson';
const LAYER_ID_BLOCKER = 'selection-blocker';

const PASS_THROUGH_PROPS = [
  'lineWidthScale',
  'lineWidthMinPixels',
  'lineWidthMaxPixels',
  'lineWidthUnits',
  'lineJointRounded',
  'lineCapRounded',
  'lineMiterLimit',
  'pointRadiusScale',
  'pointRadiusMinPixels',
  'pointRadiusMaxPixels',
  'lineDashJustified',
  'getLineColor',
  'getFillColor',
  'getRadius',
  'getLineWidth',
  'getLineDashArray',
  'getTentativeLineDashArray',
  'getTentativeLineColor',
  'getTentativeFillColor',
  'getTentativeLineWidth',
];


let hackyState = {mode: ViewMode}
export class SelectionLayer<DataT, ExtraPropsT> extends CompositeLayer<
  ExtraPropsT & Required<SelectionLayerProps<DataT>>
> {
  static layerName = 'SelectionLayer';
  static defaultProps = defaultProps;

  // hackyState = {mode: ViewMode}
  constructor(props) {
    super(props);
    addEventListener('keydown', (ev) => {
      if(ev.key == "r" && !ev.repeat)
      {
        // this is not working...
        if (this.state == undefined)
        {
          return;
        }
        this.setState(this.state) // doesn't matter, just need to trigger render
        // console.log("Keydown", this.state)
        hackyState.mode = DrawRectangleMode
      }
    })

    addEventListener('keyup', (ev) => {
      if(ev.key == "r" && !ev.repeat)
      {
        if (this.state == undefined)
        {
          return;
        }
        this.setState(this.state)
        // console.log("Keyup", this.state)
        hackyState.mode = ViewMode
      }
    })

  }

  _selectRectangleObjects(coordinates: any) {
    const { layerIds, onSelect } = this.props;
    const [x1, y1] = this.context.viewport.project(coordinates[0][0]);
    const [x2, y2] = this.context.viewport.project(coordinates[0][2]);
    const infos = {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      layerIds
    };
    const pickingInfos = this.context.deck.pickObjects(infos);
    console.log("Picked Data", pickingInfos, "Picking Infos", infos)
    onSelect({ pickingInfos });
    // for some bizarre reason, sometimes the selection does not get all the items highlighted
    // therefore, I simply run the query again a few milliseconds later
    setTimeout(() => {
      const { layerIds, onSelect } = this.props;
      const pickingInfos = this.context.deck.pickObjects(infos);
      console.log("2 - Picked Data", pickingInfos, "Picking Infos", infos)
      onSelect({ pickingInfos });
    }, 100)
  }

  renderLayers() {
    const mode =  hackyState.mode != undefined ? hackyState.mode : ViewMode
    // const mode = ViewMode || MODE_MAP[this.props.selectionType];
    const modeConfig = MODE_CONFIG_MAP[this.props.selectionType];

    const inheritedProps = {};
    PASS_THROUGH_PROPS.forEach((p) => {
      if (this.props[p] !== undefined) inheritedProps[p] = this.props[p];
    });

    const layers: any[] = [
      new EditableGeoJsonLayer(
        this.getSubLayerProps({
          id: LAYER_ID_GEOJSON,
          pickable: true,
          mode,
          modeConfig,
          selectedFeatureIndexes: [],
          data: EMPTY_DATA,
          onEdit: ({ updatedData, editType }) => {
            if (editType === 'addFeature') {
              const { coordinates } = updatedData.features[0].geometry;

              if (this.props.selectionType === SELECTION_TYPE.RECTANGLE) {
                this._selectRectangleObjects(coordinates);
              } else {
              }
            }
          },
          ...inheritedProps,
        })
      ),
    ];


    return layers;
  }

  shouldUpdateState({ changeFlags: { stateChanged, propsOrDataChanged } }: Record<string, any>) {
    return stateChanged || propsOrDataChanged;
  }
}