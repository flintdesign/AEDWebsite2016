import React, { PropTypes, Component } from 'react';

export default class ToggleTable extends Component {
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

    return (
      <div className={className}>
        <h3 onClick={this.handleClick}>{titleMarkup}</h3>
        <table className="sidebar__stats-table">
          <tbody>
            {rowMarkup}
          </tbody>
        </table>
      </div>
    );
  }
}

ToggleTable.propTypes = {
  titleMarkup: PropTypes.object.isRequired,
  rowMarkup: PropTypes.array.isRequired
};
