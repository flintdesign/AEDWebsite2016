import React from 'react';
import DarpMarkup from 'html!./../../data/about/darp.html';

export default function DARP() {
  return (
    <div className="darp">
      <div className="darp__inner">
        <div className="darp__header">
          <a className="darp__header__logo" href="/" />
          <h1>Data Access and Release Policy</h1>
        </div>
        <div className="darp__content" dangerouslySetInnerHTML={ { __html: DarpMarkup } } />
      </div>
    </div>
  );
}

