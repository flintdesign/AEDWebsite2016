import React, { Component } from 'react';
import { Map, TileLayer, GeoJson } from 'react-leaflet';

export default class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      markerPosition: [0, 0],
      data: {}
    };
  }

  componentWillMount() {
    const self = this;
    fetch('/flat/map.json')
      .then(r => r.json())
      .then(d => self.setState({ data: d }));
  }

  handleClick(e) {
    window.location = e.target.options.href;
  }

  render() {
    return (
      <Map center={this.state.markerPosition} zoom={5}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <GeoJson
          href="http://google.com"
          data={this.state.data}
          onClick={this.handleClick}
        />
      </Map>
    );
  }
}
