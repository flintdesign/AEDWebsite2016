import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default function CountTypeToggle(props) {
  const { location, geographies, currentTitle } = props;
  const countType = location.query.count_type;
  const hideToggle = geographies.input_zones && currentTitle === 'totals';
  return (
    <div>
    {!hideToggle &&
      <ul className="count-type-toggle">
        <li
          className={countType === 'ADD' || countType === undefined ? 'active' : null}
        >
          <Link
            to={{
              pathname: location.pathname,
              query: { ...location.query, count_type: 'ADD' }
            }}
          >ADD</Link>
        </li>

        <li
          className={countType === 'DPPS' ? 'active' : null}
        >
          <Link
            to={{
              pathname: location.pathname,
              query: { ...location.query, count_type: 'DPPS' }
            }}
          >DPPS</Link>
        </li>
      </ul>
    }
    </div>
  );
}

CountTypeToggle.propTypes = {
  geographies: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired,
  location: PropTypes.object,
};
