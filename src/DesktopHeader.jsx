import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import { Menu, MenuTrigger, MenuContent } from './Menu';
import Avatar from './Avatar';
import { LinkedLogo, Logo } from './Logo';

// i18n
import messages from './Header.messages';

// Assets
import { CaretIcon } from './Icons';

class DesktopHeader extends React.Component {
  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
    this.state = {showMenu: false};
  }

  renderMainMenu() {
    const { mainMenu } = this.props;

    // Nodes are accepted as a prop
    if (!Array.isArray(mainMenu)) {
      return mainMenu;
    }

    return mainMenu.map((menuItem) => {
      const {
        type,
        href,
        content,
        submenuContent,
      } = menuItem;

      if (type === 'item') {
        return (
          <a key={`${type}-${content}`} className="nav-link" href={href}>{content}</a>
        );
      }

      return (
        <Menu key={`${type}-${content}`} tag="div" className="nav-item" respondToPointerEvents>
          <MenuTrigger tag="a" className="nav-link d-inline-flex align-items-center" href={href}>
            {content} <CaretIcon role="img" aria-hidden focusable="false" />
          </MenuTrigger>
          <MenuContent className="pin-left pin-right shadow py-2">
            {submenuContent}
          </MenuContent>
        </Menu>
      );
    });
  }

  // Renders an optional App Menu for
  renderAppMenu() {
    const { appMenu } = this.props;
    const { content: appMenuContent, menuItems } = appMenu;
    return (
      <Menu transitionClassName="menu-dropdown" transitionTimeout={250}>
        <MenuTrigger tag="a" className="nav-link d-inline-flex align-items-center">
          {appMenuContent} <CaretIcon role="img" aria-hidden focusable="false" />
        </MenuTrigger>
        <MenuContent className="mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2">
          {menuItems.map(({ type, href, content }) => (
            <a className={`dropdown-${type}`} key={`${type}-${content}`} href={href}>{content}</a>
          ))}
        </MenuContent>
      </Menu>
    );
  }

  renderUserMenuItems() {
    return (
      <div className="col-auto right-ct"
        onMouseEnter={() => this.showMenu()}
        onMouseLeave={() => this.hideMenu()}
        >
        <img className="icon-down" src="http://local.overhang.io:8000/static/indigo/images/profiles/default_50.png" alt="" />
        <img className="icon-down" src="http://local.overhang.io:8000/static/indigo/images/down.png" alt="" />
        {
          this.state.showMenu
          ?
          <ul className="show-menu">
            <li><a href="#">Dashboard</a></li>
            <li><a href="profile.html">Profile</a></li>
            <li><a href="#">Account</a></li>
            <li><a href="#">Sign Out</a></li>
          </ul>
          :null
        }
      </div>
    );
  }

  renderLoggedOutItems() {
    return (
      <div className="col-auto right-ct">
        <a href="https://funix.edu.vn/dang-ky-tu-van/" className="btn btn-register">Đăng ký</a>
        <a href="/login" className="btn btn-login">Đăng nhập</a>
      </div>
    );
  }

  showMenu(){
    this.setState({showMenu: true});
  }

  hideMenu(){
    this.setState({showMenu: false});
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      intl,
      appMenu,
      avatar,
      username
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
    const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;

    return (
      <header className="is-login site-header">
        <div className="container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-auto logo">
                <a href="/">
                  <Logo src={logo} alt={logoAltText} />
                </a>
              </div>

              <nav className="col-auto menu">
                <ul className="navigation">
                    <li className="active"><a href="/">Courses</a></li>
                    <li><a href="/courses">Discover New</a></li>
                </ul>
              </nav>
              {loggedIn ? this.renderUserMenuItems() : this.renderLoggedOutItems()}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

DesktopHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  userMenu: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  loggedOutItems: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,

  // i18n
  intl: intlShape.isRequired,

  // appMenu
  appMenu: PropTypes.shape(
    {
      content: PropTypes.string,
      menuItems: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
          href: PropTypes.string,
          content: PropTypes.string,
        }),
      ),
    },
  ),
};

DesktopHeader.defaultProps = {
  mainMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
  appMenu: null,
};

export default injectIntl(DesktopHeader);
