import React, { PropTypes } from 'react';
import config from '../config';

export default function Ranges(props) {
  const copyMap = {
    known: 'Known Range',
    possible: 'Possible Range',
    doubtful: 'Doubful Range',
    protected: 'Protected Areas',
  };

  const rangeMarkup = config.rangeTypes.map(r =>
    <li key={r} className="range__item" data-range-type={r} onClick={props.handleClick}>
      <span className="range__icon"></span>
      {copyMap[r]}
    </li>
  );

  return (
    <div className="ranges__container">
      <h3
        className={props.legendActive ? 'expanded' : 'contracted'}
        onClick={props.handleLegendClick}
      >Map Legend</h3>
      <ul
        className={props.legendActive ? 'ranges_dropdown expanded' : 'ranges_dropdown contracted'}
      >
        {rangeMarkup}
      </ul>
    </div>
  );
}

Ranges.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleLegendClick: PropTypes.func.isRequired,
  legendActive: PropTypes.bool.isRequired
};

