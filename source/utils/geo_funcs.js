import flattenDeep from 'lodash.flattendeep';
import { slugify } from './convenience_funcs';

export const getCoordData = (coords) => {
  const lats = [];
  const longs = [];
  const flattenedCoords = flattenDeep(coords);
  for (let i = 0; i < flattenedCoords.length; i++) {
    const coord = flattenedCoords[i];
    /* eslint no-unused-expressions: [0] */
    i % 2 === 0 ? longs.push(coord) : lats.push(coord);
  }

  const maxLat = Math.max.apply(Math, lats);
  const maxLong = Math.max.apply(Math, longs);

  const minLat = Math.min.apply(Math, lats);
  const minLong = Math.min.apply(Math, longs);

  const output = {
    maxLat: maxLat,
    minLat: minLat,
    maxLong: maxLong,
    minLong: minLong,
    center: [[0, 0], [0, 0]],
    bounds: [[
      minLat,
      minLong,
    ], [
      maxLat,
      maxLong,
    ]]
  };
  return output;
};

const regionToCenter = {
  'central-africa': [4.997345000000001, 19.900335],
  'eastern-africa': [5.700589999999998, 36.625985],
  'southern-africa': [-20.34073, 26.279310000000002],
  'west-africa': [14.638570000000001, -0.7698]
};

export const getLabelPosition = (datum) => regionToCenter[slugify(datum.name)];
