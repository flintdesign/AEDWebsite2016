import React from 'react';

export default function Intro() {
  return (
    <div className={'intro'}>
      <h2 className={'intro__title'}>
        African Elephant Database
      </h2>
      <div className="intro__description">
        <p>
          lorem
        </p>
        <p>
          lorem
        </p>
      </div>
      <div className="intro__actions">
        <button className="intro__actions__button">
          Enter the database
        </button>
      </div>
      <div className="intro__logos">
        <div className="intro__logos__aesg">aesg</div>
        <div className="intro__logos__iucn">iucn</div>
        <div className="intro__logos__ssc">ssc</div>
      </div>
      <div className="intro__loader">loader</div>
    </div>
  );
}
