import React, { PropTypes, Component } from 'react';

export default class GlossaryToggleItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      toggled: false
    };
  }

  componentDidMount() {
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ toggled: !this.state.toggled });
  }

  render() {
    const { abbrv, headerTitle, content } = this.props;
    const className = `${this.state.toggled ? 'open' : 'closed'} glossary-toggle-list__item`;
    return (
      <li className={className}>
        <div className="glossary-toggle-list__item__header" onClick={this.handleClick}>
          <div className="glossary-toggle-list__item__header__abbrv">
            {abbrv}
          </div>
          <div className="glossary-toggle-list__item__header__title">
            {headerTitle}
          </div>
        </div>
        <div
          className="glossary-toggle-list__item__text"
          dangerouslySetInnerHTML={ { __html: content } }
        />
      </li>
    );
  }
}

GlossaryToggleItem.propTypes = {
  abbrv: PropTypes.string,
  headerTitle: PropTypes.string,
  content: PropTypes.string
};
