import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { toggleSearch, receiveAutocompleteData } from '../actions';
import { connect } from 'react-redux';
import { SEARCH_PLACEHOLDER } from '../constants';
import { slugify } from '../utils/convenience_funcs';
import Bloodhound from 'bloodhound-js';
import { fetchSearchData } from '../api';
import assign from 'lodash.assign';

const getPathForResult = ({ result, year, data }) => {
  let path;
  const name = result.name;
  if (result.geographicType === 'country') {
    const slug = slugify(name);
    path = `/${year}/${slugify(result.parent)}/${slug}`;
  } else if (result.geographicType === 'stratum') {
    const region = slugify(data[result.parent].parent);
    const country = slugify(result.parent);
    const stratumYear = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
    const slug = slugify(name.split('(')[0]).slice(0, -1);
    path = `/${stratumYear}/${region}/${country}/${slug}`;
  }
  return path;
};

const Results = (props) => {
  const { results, endSearch, year, data } = props;
  return (
    <div className="search__results">{results.map(r => (
      <Link
        className="search__result-item"
        key={`result-${r.name}`}
        onClick={endSearch}
        to={getPathForResult({
          result: r,
          year,
          data
        })}
      >
      {r.name}
      </Link>
  ))}</div>);
};

Results.propTypes = {
  year: PropTypes.string,
  data: PropTypes.object.isRequired,
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
      searchDataFetched: false,
      searchReady: false,
      searchData: null,
      results: []
    };
    fetchSearchData((d) => {
      props.dispatch(receiveAutocompleteData(d));
    });
  }

  getSearchData() {
    if (this.state.searchDataFetched) { return; }
    fetchSearchData((data) => {
      this.setState({ searchData: data }, this.initSearchEngine.bind(this));
    });
  }

  initSearchEngine() {
    this.searchEngine = new Bloodhound({
      local: Object.keys(this.state.searchData),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      datumTokenizer: Bloodhound.tokenizers.whitespace
    });
    const promise = this.searchEngine.initialize();
    promise.then(() => {
      this.setState({ searchReady: true });
      if (!!this.state.query && this.state.searching) {
        this.search(this.state.query);
      }
    });
  }

  input() {
    let input = null;
    const placeholder = this.props.searchActive ? SEARCH_PLACEHOLDER : '';
    if (this.props.searchActive) {
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

  search(query) {
    this.searchEngine.search(query, this.updateResults.bind(this), (e) => console.log(e));
  }

  updateResults(results) {
    this.setState({
      results: results.map(key => assign({}, { name: key }, this.state.searchData[key]))
    });
  }

  handleQueryChange({ target }) {
    this.setState({ query: target.value }, () => {
      if (this.state.searchReady) {
        this.search(this.state.query);
      }
    });
  }

  results() {
    const { results, searching, searchData } = this.state;
    const className = searching ? 'searching' : null;
    return (
      results.length && this.props.searchActive ?
        <Results
          {...this.props}
          data={searchData}
          results={results}
          className={className}
          endSearch={() => this.props.dispatch(toggleSearch(false))}
        /> : null);
  }

  render() {
    const focusedName = this.props.searchActive ? 'focused' : 'blurred';
    const inputClassName = `${focusedName} search__input`;
    return (
      <div className="search__container">
        <div className={inputClassName}>
          {this.input()}
          <span
            onClick={() => {
              this.getSearchData();
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
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object,
  searchActive: PropTypes.bool.isRequired
};

export default connect(state => state.search)(Search);
