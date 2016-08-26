import React from 'react';
import RangeCategories from 'html!./../../data/glossary/range-categories.html';
import SurveyCategories from 'html!./../../data/glossary/survey-categories.html';
import SurveyReliability from 'html!./../../data/glossary/survey-reliability.html';
import CausesOfChange from 'html!./../../data/glossary/causes-of-change.html';

export default function Glossary() {
  return (
    <div>
      <div className="glossary">
        <div className="glossary-sidebar">
          <div className="glossary-sidebar__header">
            <h2 className="glossary-sidebar__header__title">
              Glossary of Terms
            </h2>
          </div>
          <div className="glossary-menu">
            <h4 className="glossary-menu__title">
              DATA TYPES &amp; CATEGORIZATION
            </h4>
            <ul className="glossary-menu__list">
              <li className="glossary-menu__list__item">
                <a href="#range-categories">
                  Range Categories
                </a>
              </li>
              <li className="glossary-menu__list__item">
                <a href="#survey-categories">
                  Survey Categories
                </a>
              </li>
              <li className="glossary-menu__list__item">
                <a href="#survey-reliability">
                  Survey Reliability
                </a>
              </li>
              <li className="glossary-menu__list__item">
                <a href="#causes-of-change">
                  Causes of Change
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="glossary-content">
          <div className="glossary-content__section" id="range-categories">
            <div dangerouslySetInnerHTML={ { __html: RangeCategories } } />
          </div>
          <div className="glossary-content__section" id="survey-categories">
            <div dangerouslySetInnerHTML={ { __html: SurveyCategories } } />
          </div>
          <div className="glossary-content__section" id="survey-reliability">
            <div dangerouslySetInnerHTML={ { __html: SurveyReliability } } />
          </div>
          <div className="glossary-content__section" id="causes-of-change">
            <div dangerouslySetInnerHTML={ { __html: CausesOfChange } } />
          </div>
        </div>
      </div>
    </div>
  );
}

