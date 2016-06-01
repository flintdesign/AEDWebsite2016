import React, { Component } from 'react';

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
    return (
      <div className={className}>
        <h3 onClick={this.handleClick}>Aerial or Ground Counts</h3>
        <table className="sidebar__stats-table">
          <tbody>
            <tr>
              <td>Definite</td>
              <td>57,312</td>
            </tr>
            <tr>
              <td>Probable</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Possible</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Speculative</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
