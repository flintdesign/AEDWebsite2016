import React, { Component, PropTypes } from 'react';
import { toggleSearch } from '../actions';
import { connect } from 'react-redux';
import { SEARCH_PLACEHOLDER } from '../constants';

class Search extends Component {
  input() {
    let input = null;
    const placeholder = this.props.search ? SEARCH_PLACEHOLDER : '';
    if (this.props.search) {
      input = (
        <input
          type="text"
          ref="searchInput"
          placeholder={placeholder}
        />
      );
    }
    return input;
  }
  render() {
    const focusedName = this.props.search ? 'focused' : 'blurred';
    const inputClassName = `${focusedName} search__input`;
    return (
      <div className={inputClassName}>
      {this.input()}
      <span
        onClick={() => {
          this.props.dispatch(toggleSearch());
        }}
        className="icon__magnifying-glass"
      />
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(state => state.navigation)(Search);
