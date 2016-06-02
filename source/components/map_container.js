import React from 'react';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';

export default function MapContainer() {
  const position = [0, 0];
  const polygonPositions = fetch('http://www.elephantdatabase.org/region/2/map.json', { mode: 'no-cors' })
    .then(r => console.log(r));
    // .then(r => r.json())
    // .then(d => console.log(d.features.coordinates[0]));

  return (
    <Map center={position} zoom={5}>
      <TileLayer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <Polygon positions={polygonPositions} />
      <Marker position={position}>
        <Popup>
          <span>A pretty CSS3 popup.<br />Easily customizable.</span>
        </Popup>
      </Marker>
    </Map>
  );
}
