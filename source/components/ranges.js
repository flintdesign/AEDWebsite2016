import React, { PropTypes, Component } from 'react';
import config from '../config';

class Ranges extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      known: 0,
      possible: 0,
      doubtful: 0,
      protected: 0
    };
  }

  handleClick() {
    // const rangeType = e.target.getAttribute('data-range-type');
    // const currentCount = this.state[rangeType];
    // If it hasn't been clicked, forward the handleClick
    // function to fetch. Otherwise, increment the count to tell
    // whether to show or hide.
    // if (currentCount === 0) {
    //   this.props.handleClick(e);
    // }
    // this.setState({
    //   [rangeType]: currentCount + 1
    // });
    // this.props.toggleRange(rangeType);
  }

  copyMap() {
    return {
      known: 'Known Range',
      possible: 'Possible Range',
      doubtful: 'Doubtful Range',
      protected: 'Protected Areas',
    };
  }

  render() {
    const props = this.props;
    const rangeMarkup = config.rangeTypes.map(r => {
      let className = 'range__item';
      className += this.props.ui[r] ? ' shown' : ' hidden';
      return (
        <li key={r} className={className} data-range-type={r} onClick={this.handleClick}>
          <span className="range__icon"></span>
          {this.copyMap()[r]}
        </li>
      );
    });

    let dropdownClass = 'ranges_dropdown';
    dropdownClass += props.ui.legendActive ? ' expanded' : ' contracted';
    return (
      <div className="ranges__container">
        <h3
          className={props.ui.legendActive ? 'expanded' : 'contracted'}
          onClick={props.handleLegendClick}
        >Map Legend</h3>
        <ul className={dropdownClass}>
          {rangeMarkup}
        </ul>
      </div>
    );
  }
}

Ranges.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleLegendClick: PropTypes.func.isRequired,
  toggleRange: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired
};

export default Ranges;
