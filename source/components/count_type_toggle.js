import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default function CountTypeToggle(props) {
  const { location } = props;
  const countType = location.query.count_type;
  return (
    <ul className="count-type-toggle">
      <li className={countType === 'ADD' || countType === undefined ? 'active' : null}>
        <Link to={{ query: { count_type: 'ADD' } }}>ADD</Link>
      </li>
      <li className={countType === 'DPPS' ? 'active' : null}>
        <Link to={{ query: { count_type: 'DPPS' } }}>DPPS</Link>
      </li>
    </ul>
  );
}

CountTypeToggle.propTypes = {
  location: PropTypes.object
};
