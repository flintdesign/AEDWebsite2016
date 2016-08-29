import React, { PropTypes } from 'react';

export default function Intro(props) {
  const { handleIntroClick, showIntro } = props;
  const introClass = `intro ${showIntro ? 'shown' : 'dismissed'}`;
  return (
    <div className={introClass}>
      <div className={'intro__container'}>
        <div className={'row'}>
          <div className={'col-one-third col-main'}>
            <h2 className={'intro__title'}>
              African<br />Elephant<br />Database
            </h2>
          </div>
          <div className={'col-one-third'}>
          </div>
          <div className={'col-one-third'}>
            <div className="intro__description">
              <p>
                Welcome to the African Elephant Database (AED), the most comprehensive database
                on the status of any species of mammal in the wild. The database is maintained
                by the African Elephant Specialist Group (AfESG), and holds data on elephant
                abundance and distribution across 37 countries where African elephants occur.
                It provides information on changes in elephant numbers and shows where these
                hanges have taken place. The database has been developed over 25 years and
                went online in 2012.
              </p>
              <p>
                The AED relies on the contributions of countless survey biologists and experts
                across the continent.
                To learn more about the way the data is processed, and presented in tables and
                maps and the methods used for establishing summaries at the national, regional
                and continental level, visit our <a href="/about">About</a> section.
              </p>
              <small>
                All materials on this site are Copyright (C) 1995-2016 IUCN - The International
                Union for the Conservation of Nature. Use is permitted only under the
                <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/"> Creative
                Commons Attribution-NonCommercial-ShareAlike license.</a>
              </small>
            </div>
            <div className="intro__actions">
              <button className="intro__actions__button" onClick={handleIntroClick}>
                Enter the database
              </button>
            </div>
            <div className="intro__loader">
              <img src="/images/elephant-loader.gif" alt="Elephant walking" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Intro.propTypes = {
  handleIntroClick: PropTypes.func.isRequired,
  showIntro: PropTypes.bool
};
