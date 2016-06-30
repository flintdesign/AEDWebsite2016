import React, { PropTypes } from 'react';
import { titleize } from '../utils/convenience_funcs';

export default function TotalCount(props) {
  const { count, entity } = props;
  return (
    <div className="total-count">
      <div>{count}<span className="total-count__plus-minus">&plusmn;</span></div>
      <small>Estimated Elephants in {titleize(entity)}</small>
    </div>
  );
}

TotalCount.propTypes = {
  count: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired
};
