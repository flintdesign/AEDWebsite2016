import flattenDeep from 'lodash.flattendeep';

export const getCoordData = (coords) => {
  const lats = [];
  const longs = [];
  let maxVariance = 0;
  let indexOfMaxVariance = 0;
  // Iterate through the coords property of the geoJSON to find
  // the structure with the greatest East-West variance.
  // Some geoJSON objs can contain a deeply nested array of coordinates
  // if, for example, it's a country that contains several islands off its coast.
  // The structure with the greatest E-W variance is most likely to be the one
  // on the mainland (i.e., the one we want to label). Previously, we just used
  // the structure with the most points, but this resulted in at least
  // one false positive where a small coastal island had more points than
  // the large continental region.
  for (let i = 0; i < coords.length; i++) {
    const localLats = [];
    const points = flattenDeep(coords[i]);
    // Once we've completely flattened the nested array,
    // the latitudes are all the even indices in the
    // resulting array.
    for (let j = 0; j < points.length; j++) {
      if (j % 2 === 0) { localLats.push(points[j]); }
    }
    const max = Math.max.apply(Math, localLats);
    const min = Math.min.apply(Math, localLats);
    const localVariance = Math.abs(max - min);
    if (localVariance > maxVariance) {
      maxVariance = localVariance;
      indexOfMaxVariance = i;
    }
  }

  // We've decided on the final geoJSON structure. Now
  // we iterate through it to find the relevant data.
  const finalStructure = coords[indexOfMaxVariance][0];
  for (let k = 0; k < finalStructure.length; k++) {
    lats.push(finalStructure[k][1]); longs.push(finalStructure[k][0]);
  }

  const maxLat = Math.max.apply(Math, lats);
  const maxLong = Math.max.apply(Math, longs);

  const minLat = Math.min.apply(Math, lats);
  const minLong = Math.min.apply(Math, longs);

  return {
    maxLat: maxLat,
    minLat: minLat,
    maxLong: maxLong,
    minLong: minLong,
    center: [
      (minLat + ((maxLat - minLat) / 2)),
      (minLong + ((maxLong - minLong) / 2))
    ],
    bounds: [[
      minLat,
      minLong,
    ], [
      maxLat,
      maxLong,
    ]]
  };
};

