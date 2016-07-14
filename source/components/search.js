import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { toggleSearch, receiveAutocompleteData } from '../actions';
import { connect } from 'react-redux';
import { SEARCH_PLACEHOLDER } from '../constants';
import { slugify, regionById } from '../utils/convenience_funcs';
import filter from 'lodash.filter';
import Bloodhound from 'bloodhound-js';
import { fetchSearchData } from '../api';
const searchData = require('json!../data/search-data.json');
const data = searchData.countries.concat(searchData.regions);
const searchTokens = data.map(d => d.name);
const searchEngine = new Bloodhound({
  local: searchTokens,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.whitespace
});

const getPathForResult = ({ result, year }) => {
  let path = `${year}/`;
  const slug = slugify(result.name);
  if (!!result.continent_id) {
    // region result
    path += slug;
  } else if (!!result.region_id) {
    // country result
    path += `${regionById(result.region_id).className}/${slug}`;
  }
  return path;
};

const Results = withRouter((props) => {
  const { results, router, endSearch, year } = props;
  return (
    <div className="search__results">{results.map(r => (
      <div
        className="search__result-item"
        key={`result-${r.name}`}
        onClick={() => {
          router.push(getPathForResult({
            result: r,
            year
          }));
          endSearch();
        }}
      >
      {r.name}
      </div>
  ))}</div>);
});

Results.propTypes = {
  results: PropTypes.array.isRequired,
  endSearch: PropTypes.func.isRequired,
};

class Search extends Component {
  constructor(props) {
    super();
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      query: '',
      searching: false,
      searchReady: false,
      results: []
    };
    fetchSearchData((d) => {
      props.dispatch(receiveAutocompleteData(d));
    });
  }
  input() {
    let input = null;
    const placeholder = this.props.search ? SEARCH_PLACEHOLDER : '';
    if (this.props.search) {
      input = (
        <input
          type="text"
          ref="searchInput"
          autoFocus
          placeholder={placeholder}
          onChange={this.handleQueryChange}
        />
      );
    }
    return input;
  }
  componenDidMount() {
    const promise = searchEngine.initialize();
    promise.then(() => {
      this.setState({ searchReady: true });
    });
  }

  search(query) {
    searchEngine.search(query, this.updateResults.bind(this), (e) => console.log(e));
  }

  updateResults(results) {
    this.setState({ results: results.map(r => filter(data, { name: r })[0]) });
  }

  handleQueryChange({ target }) {
    this.setState({ query: target.value }, () => {
      this.search(this.state.query);
    });
  }

  results() {
    const { results, searching } = this.state;
    const className = searching ? 'searching' : null;
    return (
      results.length && this.props.navigation.search ?
      <Results
        {...this.props}
        results={results}
        className={className}
        endSearch={() => this.props.dispatch(toggleSearch(false))}
      /> : null);
  }

  render() {
    const focusedName = this.props.navigation.search ? 'focused' : 'blurred';
    const inputClassName = `${focusedName} search__input`;
    return (
      <div className="search__container">
        <div className={inputClassName}>
          {this.input()}
          <span
            onClick={() => {
              this.props.dispatch(toggleSearch());
            }}
            className="icon__magnifying-glass"
          />
          {this.results()}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object,
  navigation: PropTypes.object
};

export default connect(state => state)(Search);
