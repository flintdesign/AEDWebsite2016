import React, { PropTypes } from 'react';

export default function Placeholder(props) {
  const { showIntro } = props;
  let introClass = `intro ${showIntro ? 'shown' : 'dismissed'}`;
  if (showIntro === undefined) {
    introClass = 'intro shown placeholder';
  }
  return (
    <div className={introClass}>
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
                <h2>COMING SOON</h2>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Placeholder.propTypes = {
  handleIntroClick: PropTypes.func,
  showIntro: PropTypes.bool
};
