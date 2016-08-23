import React, { PropTypes, Component } from 'react';
import { titleize } from '../utils/convenience_funcs';
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
    const { count, entity, canInput } = this.props;
    return (
      <div>
        {canInput &&
          <div className="total-count">
            <div ref="total_count">{count}
              <span className="total-count__plus-minus">&plusmn;</span>
            </div>
            <small>Estimated Elephants in {titleize(entity)}</small>
          </div>
        }
      </div>
    );
  }
}

TotalCount.propTypes = {
  count: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  canInput: PropTypes.bool
};

export default TotalCount;
