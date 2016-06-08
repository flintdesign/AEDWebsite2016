import React, { Component } from 'react';
import { Map, TileLayer, Polygon } from 'react-leaflet';

export default class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      markerPosition: [0, 0],
      positions: [[]]
    };
  }

  componentWillMount() {
    const self = this;
    fetch('/flat/map.json')
      .then(r => r.json())
      .then(d => d.coordinates[0])
      .then(c => c.map(pairs => pairs.map(p => [p[1], p[0]])))
      .then(p => self.setState({ positions: p }));
  }

  handleClick() {
    console.log('clicked');
  }

  render() {
    return (
      <Map center={this.state.markerPosition} zoom={5}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={this.state.positions}
          onClick={this.handleClick}
        />
      </Map>
    );
  }
}
