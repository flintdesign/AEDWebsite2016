import { GeoJson } from 'react-leaflet';
import { geoJson } from 'leaflet';
import { bindLabel } from 'leaflet.label';

export default class GeoJsonWithLabel extends GeoJson {
  componentWillMount() {
    super.componentWillMount();
    const { label, data, labelOpts, ...props } = this.props;
    /* eslint no-unused-vars: [0] */
    this.leafletElement = geoJson(data, props).bindLabel(label, labelOpts);
  }
}
