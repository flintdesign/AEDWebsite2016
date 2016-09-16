/* eslint max-len: [0] */
import React from 'react';
import ReferencesMarkup from 'html!markdown!./../../data/references.md';

export default function References() {
  return (
    <div className="references">
      <div className="references__inner">
        <div className="references__header">
          <a className="references__header__logo" href="/" />
          <h1>References</h1>
        </div>
        <div className="references__nav">
          <ul>
            <li><a href="#a">A</a></li>
            <li><a href="#b">B</a></li>
            <li><a href="#c">C</a></li>
            <li><a href="#d">D</a></li>
            <li><a href="#e">E</a></li>
            <li><a href="#f">F</a></li>
            <li><a href="#g">G</a></li>
            <li><a href="#h">H</a></li>
            <li><a href="#i">I</a></li>
            <li><a href="#j">J</a></li>
            <li><a href="#k">K</a></li>
            <li><a href="#l">L</a></li>
            <li><a href="#m">M</a></li>
            <li><a href="#n">N</a></li>
            <li><a href="#o">O</a></li>
            <li><a href="#p">P</a></li>
            <li><a href="#r">R</a></li>
            <li><a href="#s">S</a></li>
            <li><a href="#t">T</a></li>
            <li><a href="#u">U</a></li>
            <li><a href="#v">V</a></li>
            <li><a href="#w">W</a></li>
            <li><a href="#y-z">Y-Z</a></li>
          </ul>
        </div>
        <div className="references__content" dangerouslySetInnerHTML={ { __html: ReferencesMarkup } } />
      </div>
    </div>
  );
}
