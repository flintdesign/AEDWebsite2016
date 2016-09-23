import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { toggleSearch, receiveAutocompleteData } from '../../actions';
import { connect } from 'react-redux';
import {
  SEARCH_PLACEHOLDER,
  SIDEBAR_CLOSED,
  SIDEBAR_OPEN
} from '../../constants';
import { slugify, titleize } from '../../utils/convenience_funcs';
import Bloodhound from 'bloodhound-js';
import { fetchSearchData } from '../../api';
// import assign from 'lodash.assign';
import find from 'lodash.find';
import ReactTooltip from 'react-tooltip';

const getPathForResult = ({ result, year, data }) => {
  let path = '';
  let slug;
  let region;
  let country;
  const countries = data.filter(d => d.geographicType === 'country');
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
      path = `/${year}/${slugify(result.parent.name)}/${slug}`;
      break;
    case 'input_zone':
      country = result.parent_country.name;
      region = find(countries, c => c.name === country).parent.name;
      slug = slugify(name);
      path = `/${year}/${slugify(region)}/${slugify(country)}/${slug}`;
      break;
    default:
      break;
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
      label = `${type} in ${result.parent.name}`;
      break;
    case 'population':
      label = 'Population';
      break;
    case 'input_zone':
      label = `Input Zone in ${result.parent_country.name}`;
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
  const countries = data.filter(d => d.geographicType === 'country');
  let region;
  switch (geographicType) {
    case 'country':
      region = slugify(result.parent.name);
      break;
    case 'region':
      region = slugify(name);
      break;
    case 'input_zone':
      region = find(countries, c => c.name === result.parent_country.name).parent.name;
      region = slugify(region);
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
  data: PropTypes.array.isRequired,
  result: PropTypes.object.isRequired,
  endSearch: PropTypes.func.isRequired,
};

const Results = (props) => {
  const { results } = props;
  return (
    <div className="search__results">
      {results.map(r => (
        <Result key={`result_${r.name}`} result={r} {...props} />
      ))}
    </div>
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
      results: [],
    };
    fetchSearchData((d) => {
      props.dispatch(receiveAutocompleteData(d));
    });
  }

  componentWillReceiveProps(props) {
    if (!props.searchActive && this.state.results.length) {
      this.setState({ results: [] });
    }
    if (this.props.showIntro && !props.showIntro) {
      ReactTooltip.show(findDOMNode(this.refs.searchTrigger));
      setTimeout(() => {
        ReactTooltip.hide(findDOMNode(this.refs.searchTrigger));
      }, 10000);
    }
  }

  getSearchData() {
    if (this.state.searchDataFetched) { return; }
    fetchSearchData((data) => {
      const filterd = data.filter(d => d.geographicType !== 'population');
      this.setState({ searchData: filterd }, this.initSearchEngine.bind(this));
    });
  }

  initSearchEngine() {
    this.searchEngine = new Bloodhound({
      // local: Object.keys(this.state.searchData),
      local: this.state.searchData.map(s => s.name),
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
      results: results.map(key => find(this.state.searchData, s => s.name === key))
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
            data-tip
            data-for="searchSidebar"
            ref="searchTrigger"
          />
          {this.props.sidebarState === SIDEBAR_CLOSED
            && !this.props.searchActive &&
            <ReactTooltip
              id="searchSidebar"
              place="bottom"
              type="dark"
              effect="solid"
            >
              <span>
                Click spyglass to open search.<br />
                Click arrow to open sidebar.
              </span>
            </ReactTooltip>
          }
          {this.props.sidebarState === SIDEBAR_OPEN
            && !this.props.searchActive &&
            <ReactTooltip
              id="searchSidebar"
              place="left"
              type="dark"
              effect="solid"
            >
              <span>
                Click to open search bar.
              </span>
            </ReactTooltip>
          }
          {this.results()}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object,
  searchActive: PropTypes.bool.isRequired,
  sidebarState: PropTypes.number.isRequired,
  showIntro: PropTypes.bool.isRequired
};

export default connect(state => state.search)(Search);
