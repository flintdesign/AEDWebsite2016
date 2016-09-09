import React, { PropTypes, Component } from 'react';

export default class InputZoneToggleTable extends Component {
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
    const { titleMarkup, rowMarkup } = this.props;
    const className = `${this.state.toggled ? 'open' : 'closed'} sidebar__table-container`;
    this.handleClick = this.handleClick.bind(this);
    return (
      <div className={`${className} sidebar__table-container--input-zone`}>
        <h3 onClick={this.handleClick}>
          {titleMarkup}
        </h3>
        <table className="subgeography-totals subgeography-totals--input-zone">
          <tbody>
            {rowMarkup}
          </tbody>
        </table>
      </div>
    );
  }
}

InputZoneToggleTable.propTypes = {
  titleMarkup: PropTypes.object.isRequired,
  rowMarkup: PropTypes.array.isRequired
};
