import React, { PropTypes } from 'react';

export default function ErrorPage() {
  return (
    <div className="error">
      <div className="error__content">
        <h1 className="error__number">404</h1>
        <h2 className="error__title">
          African Elephant Database
        </h2>
        <p>Page not found.</p>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  error: PropTypes.string
};
