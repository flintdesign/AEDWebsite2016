import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { titleize } from '../utils/convenience_funcs';
import compact from 'lodash.compact';

const PATH_PARTS = ['year', 'region', 'country', 'stratum'];

const BreadCrumbLink = ({ label, path }) => <Link to={path}>{label}</Link>;
BreadCrumbLink.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

const BreadCrumbNav = (props) => {
  const params = compact(PATH_PARTS.map(k => props.params[k]));
  const crumbs = params.map((p, i) => (
    <BreadCrumbLink
      key={`breadcrumb${i}`}
      path={`/${params.slice(0, i + 1).join('/')}`}
      label={titleize(p)}
    />
  ));
  return <div>{crumbs}</div>;
};

BreadCrumbNav.propTypes = {
  params: PropTypes.object
};

export default BreadCrumbNav;
