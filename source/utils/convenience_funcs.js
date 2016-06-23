import flattenDeep from 'lodash.flattendeep';

export const getNextGeography = currentGeography => {
  const geographies = ['continent', 'region', 'country', 'inputZone', 'stratum'];
  return geographies[geographies.indexOf(currentGeography) + 1];
};

export const pluralize = word => {
  const wordMapping = {
    contient: 'continents',
    region: 'regions',
    country: 'countries',
    inputZone: 'inputZones',
    stratum: 'strata'
  };
  return wordMapping[word];
};

export const capitalize = word => `${word[0].toUpperCase()}${word.split('').splice(1).join('')}`;
export const titleize = str => str.split('-').map(word => capitalize(word)).join(' ');

export const flatten = ary => {
  ary.reduce((a, b) => a.concat(b));
  return ary;
};


const getMidpoint = (ary) => {
  const max = Math.max.apply(Math, ary);
  const min = Math.min.apply(Math, ary);
  const difference = (max - min) / 2;
  return min + difference;
};

export const getCenter = (coords) => {
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
  const iterable = coords[indexOfMaxVariance][0];
  for (let k = 0; k < iterable.length; k++) {
    lats.push(iterable[k][1]); longs.push(iterable[k][0]);
  }
  return [getMidpoint(lats), getMidpoint(longs)];
};

