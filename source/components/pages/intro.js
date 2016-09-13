import React, { PropTypes } from 'react';

export default function Intro(props) {
  const { handleIntroClick, showIntro } = props;
  const introClass = `intro ${showIntro ? 'shown' : 'dismissed'}`;
  return (
    <div className={introClass} onClick={handleIntroClick}>
      <div className={'intro-bg'}>
      </div>
      <div className={'intro__container'}>
        <div className={'row'}>
          <div className={'col-two-thirds'}>
          </div>
          <aside className={'col-one-third col-main'}>
            <div className={'intro__loader'}>
              <div className={'intro__inner'}>
                <h1 className={'intro__entity-name'}>
                  African<br />Elephant<br />Database
                </h1>
              </div>
            </div>
            <div className={'intro__loaded intro__inner'}>
              <div className={'intro__inner-content'}>
                <div className="intro__description">
                  <p>
                    Welcome to the African Elephant Database (AED), the most comprehensive
                    database on the status of any species of mammal in the wild. The
                    database is maintained by the African Elephant Specialist Group (AfESG),
                    and holds data on elephant numbers and distribution across the 37
                    countries where African elephants occur. It provides information on
                    changes in elephant numbers and shows where these changes have taken
                    place. The database has been developed over the past 25 years and
                    went online in 2012.
                  </p>
                  <p>
                    Conservation and management of elephant populations and their habitats
                    is critical and a goal towards which many individuals, organizations
                    and countries are working. Even if opinions differ as to how best
                    this can be achieved, it is widely agreed that decisions should be
                    informed by the most up-to-date and reliable information available on
                    the status of Africa’s elephants. The AfESG maintains the AED to meet
                    this need and provides comprehensive information for individual
                    countries, regions, and for Africa as a whole. The AED relies on the
                    contributions of countless survey biologists, experts and observers
                    across the continent. To learn more about the way the data is processed,
                    compiled and presented in tables and maps and the methods used for
                    establishing summaries at the national, regional and
                    continental level, visit our <a href="/about">About</a> section.
                  </p>
                  <small>
                    All materials on this site are Copyright (C) 1995-2016 IUCN - The International
                    Union for the Conservation of Nature. Use is permitted only under the
                    <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank"> Creative
                    Commons Attribution-NonCommercial-ShareAlike license.</a>
                  </small>
                </div>
                <div className="intro__actions">
                  <button className="intro__actions__button" onClick={handleIntroClick}>
                    Enter the database
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Intro.propTypes = {
  handleIntroClick: PropTypes.func.isRequired,
  showIntro: PropTypes.bool
};
