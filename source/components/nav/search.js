import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { toggleSearch, receiveAutocompleteData } from '../../actions';
import { connect } from 'react-redux';
import { SEARCH_PLACEHOLDER } from '../../constants';
import { slugify, titleize } from '../../utils/convenience_funcs';
import Bloodhound from 'bloodhound-js';
import { fetchSearchData } from '../../api';
import assign from 'lodash.assign';

const getPathForResult = ({ result, year, data }) => {
  let path = '';
  let slug;
  const { name, geographicType } = result;
  switch (geographicType) {
    case 'continent':
      path = `/${year}`;
      break;
    case 'region':
      slug = slugify(name);
      path = `/${year}/${slug}`;
      break;
    case 'country':
      slug = slugify(name);
      path = `/${year}/${slugify(result.parent)}/${slug}`;
      break;
    case 'stratum': {
      const region = slugify(data[result.parent].parent);
      const country = slugify(result.parent);
      const stratumYear = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
      slug = slugify(name.split('(')[0]).slice(0, -1);
      path = `/${stratumYear}/${region}/${country}/${slug}`;
      break;
    }
    default:
  }
  return path;
};

function createParentTitle(result, data) {
  const { geographicType } = result;
  const type = titleize(geographicType);
  let label = '';
  switch (geographicType) {
    case 'region':
      label = `${type} in Africa`;
      break;
    case 'country':
      label = `${type} in ${result.parent}`;
      break;
    case 'stratum':
      label = `${type} in ${data[result.parent].parent}`;
      break;
    default:
  }
  return label;
}

const Result = (props) => {
  const { result, endSearch, year, data } = props;
  const { name, geographicType } = result;
  let region;
  switch (geographicType) {
    case 'stratum':
      region = slugify(data[result.parent].parent);
      break;
    case 'country':
      region = slugify(result.parent);
      break;
    case 'region':
      region = slugify(name);
      break;
    default:
  }
  const regionColorClass = `color--region-${region}`;
  const regionHoverClass = `hover--region-${region}`;
  return (
    <Link
      className={`search__result-item ${!!region ? regionHoverClass : ''}`}
      key={`result-${name}`}
      onClick={endSearch}
      to={getPathForResult({
        result,
        year,
        data
      })}
    >
      <strong className={!!region ? regionColorClass : ''}>{name}</strong>
      <div className="search__result__parent-label">{createParentTitle(result, data)}</div>
    </Link>
  );
};

Result.propTypes = {
  year: PropTypes.string,
  data: PropTypes.object.isRequired,
  result: PropTypes.object.isRequired,
  endSearch: PropTypes.func.isRequired,
};

const Results = (props) => {
  const { results } = props;
  return (
    <div className="search__results">{results.map(r => (
      <Result key={`result_${r.name}`} result={r} {...props} />
    ))}</div>
  );
};

Results.propTypes = {
  results: PropTypes.array.isRequired,
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

  componentWillReceiveProps(props) {
    if (!props.searchActive && this.state.results.length) {
      this.setState({ results: [] });
    }
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
    this.searchEngine.search(query, this.updateResults.bind(this));
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
    const containerClassName = `search__container ${focusedName}`;
    return (
      <div className={containerClassName}>
        <div className={inputClassName}>
          {this.input()}
          <span
            className="icon__magnifying-glass"
          />
          <span
            onClick={() => {
              this.getSearchData();
              this.props.dispatch(toggleSearch());
            }}
            className="search__trigger"
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
