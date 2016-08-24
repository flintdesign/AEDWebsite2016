import React from 'react';

export default function Intro() {
  return (
    <div className={'intro'}>
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
                Welcome to the African Elephant Database, the most comprehensive database on the
                status of any species of mammal in the wild.
                The database is maintained by the African Elephant Specialist Group (AfESG),
                and covers continental populations across 37 range states of the African Elephant.
                The database provides information on changes in elephant numbers and shows
                where these changes have taken place.
              </p>
              <p>
                The desire to conserve and manage elephants is widespread, and even if opinions
                differ as to how best this goal can be achieved,
                it is widely agreed that decisions should be informed by the most up-to-date and
                reliable information available on the numbers
                and distribution of Africa’s elephants. The AfESG and its AED occupy a unique and
                pivotal position with regard to this need.
                To learn more about its methods for establishing elephant numbers and how the data
                is represented, visit our About page.
              </p>
              <small>
                All materials on this site are Copyright (C) 1995-2016 IUCN - The International
                Union for the Conservation of Nature.
                Use is permitted only under the Creative Commons
                Attribution-NonCommercial-ShareAlike
                license - (http://creativecommons.org/licenses/by-nc-sa/3.0/).
              </small>
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
            <div className="intro__loader">
              <img src="/images/elephant-loader.gif" alt="Elephant walking" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
