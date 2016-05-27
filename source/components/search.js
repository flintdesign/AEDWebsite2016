import React, { Component } from 'react';

class Search extends Component {
  search() {
  }
  render() {
    return (
      <input
        type="text"
        className="search__input"
        placeholder="Search populations by region, country, or input zone"
      />
    );
  }
}

export default Search;
