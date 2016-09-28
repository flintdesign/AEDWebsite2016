import React, { PropTypes, Component } from 'react';
// import { titleize } from '../utils/convenience_funcs';
import { formatNumber } from '../utils/format_utils';
// import baffle from 'baffle';

class TotalCount extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: 'Total Count'
    };
  }

  // componentDidUpdate() {
  //   const baf = baffle(this.refs.total_count, {
  //     characters: '1234567890',
  //     speed: 70
  //   });
  //   baf.start();
  // }

  render() {
    const { count, canInput, summary, atStratumOrZone, confidence } = this.props;
    return (
      <div>
        {canInput &&
          <div className="total-count">
            <div className="total-count__count" ref="total_count">
              {count}
              <span className="total-count__plus-minus">
                {confidence &&
                  <span>
                    &nbsp;&plusmn;&nbsp;
                    {confidence.indexOf(',') !== -1 &&
                      `${confidence}`
                    }
                    {confidence.indexOf(',') === -1 &&
                      `${formatNumber(confidence)}`
                    }
                  </span>
                }
              </span>
              <small>Estimates from Surveys</small>
            </div>
            {summary && summary[0] && !atStratumOrZone &&
              <div className="total_count__container">
                <div className="total-count__guesses">
                  {formatNumber(summary[0].GUESS_MIN)} - {formatNumber(summary[0].GUESS_MAX)}
                </div>
                <small>Guesses</small>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

TotalCount.propTypes = {
  count: PropTypes.string.isRequired,
  confidence: PropTypes.string,
  entity: PropTypes.string.isRequired,
  canInput: PropTypes.bool,
  atStratumOrZone: PropTypes.bool,
  summary: PropTypes.array
};

export default TotalCount;
