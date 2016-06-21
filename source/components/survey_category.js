import React, { PropTypes, Component } from 'react';
import { formatNumber, formatFloat } from '../utils/format_utils.js';

export default class SurveyCategory extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      toggled: false
    };
  }

  handleClick() {
    this.setState({ toggled: !this.state.toggled });
  }

  render() {
    const className = `${this.state.toggled ? 'open' : 'closed'} sidebar__table-container`;
    const {
      surveyType,
      estimate,
      guess_min,
      guess_max,
      range_assessed,
      range_area
    } = this.props;
    return (
      <div className={className}>
        <h3 onClick={this.handleClick}>{surveyType}</h3>
        <table className="sidebar__stats-table">
          <tbody>
            <tr>
              <td>Estimates from Surveys</td>
              <td>{estimate}</td>
            </tr>
            <tr>
              <td>Guesses</td>
              <td>{formatNumber(guess_min)} – {formatNumber(guess_max)}</td>
            </tr>
            <tr>
              <td>% Known &amp; Possible Range</td>
              <td>{formatFloat(range_assessed)}%</td>
            </tr>
            <tr>
              <td>Area (km<sup>2</sup>)</td>
              <td>{formatNumber(range_area)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

SurveyCategory.propTypes = {
  surveyType: PropTypes.string.isRequired,
  estimate: PropTypes.string.isRequired,
  guess_min: PropTypes.string.isRequired,
  guess_max: PropTypes.string.isRequired,
  range_assessed: PropTypes.string.isRequired,
  range_area: PropTypes.string.isRequired
};
