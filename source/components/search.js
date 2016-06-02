import React, { Component } from 'react';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.setFocus = this.setFocus.bind(this);
    this.setBlur = this.setBlur.bind(this);
    this.state = {
      focused: false
    };
  }

  setFocus() {
    this.setState({ focused: true });
    this.refs.searchInput.focus();
  }

  setBlur() {
    this.setState({ focused: false });
  }

  render() {
    const state = this.state;
    const focusedName = this.state.focused ? 'focused' : 'blurred';
    const inputClassName = `${focusedName} search__input`;
    const placeholder = state.focused ? 'Search populations by region, country, input zone' : '';
    return (
      <div>
        <input
          type="text"
          ref="searchInput"
          className={inputClassName}
          placeholder={placeholder}
          onFocus={this.setFocus}
          onBlur={this.setBlur}
        />
        <span onClick={this.setFocus} className="icon__magnifying-glass"></span>
      </div>
    );
  }
}

export default Search;
