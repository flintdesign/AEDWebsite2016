import React, { PropTypes } from 'react';

export default function TotalCount(props) {
  const { count } = props;
  return (
    <div className="total-count">
      <div>{count}<span className="total-count__plus-minus">&plusmn;</span></div>
      <small>Estimated Elephants in Africa</small>
    </div>
  );
}

TotalCount.propTypes = {
  count: PropTypes.string.isRequired
};
