import React, { PropTypes } from 'react';

export default function ContinentalRegional(props) {
  const { data } = props;
  const regions = data.regions && data.regions.map((r, i) => (<li key={i}>{r.region}</li>));

  return (
    <div>
      <h1>{data.continent}</h1>
      <ul>
        {regions}
      </ul>
    </div>
  );
}

ContinentalRegional.propTypes = {
  data: PropTypes.object
};
