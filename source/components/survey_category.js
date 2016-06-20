import React, { PropTypes, Component } from 'react';
import { formatNumber, formatFloat } from '../utils/format_utils.js';

export default class AerialCounts extends Component {
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
    const { data } = this.props;
    return (
      <div className={className}>
        <h3 onClick={this.handleClick}>{data.SURVEYTYPE}</h3>
        <table className="sidebar__stats-table">
          <tbody>
            <tr>
              <td>Estimates from Surveys</td>
              <td>{data.ESTIMATE}</td>
            </tr>
            <tr>
              <td>Guesses</td>
              <td>{formatNumber(data.GUESS_MIN)} – {formatNumber(data.GUESS_MAX)}</td>
            </tr>
            <tr>
              <td>% Known &amp; Possible Range</td>
              <td>{formatFloat(data.CATEGORY_RANGE_ASSESSED)}%</td>
            </tr>
            <tr>
              <td>Area (km<sup>2</sup>)</td>
              <td>{formatNumber(data.range_area)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

AerialCounts.propTypes = {
  data: PropTypes.object.isRequired
};
