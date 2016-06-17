import React, { PropTypes } from 'react';

export default function ContinentalRegional(props) {
  const { data } = props;

  return (
    <h1>{data.continent}</h1>
  );
}

ContinentalRegional.propTypes = {
  data: PropTypes.object
};
