import React from 'react';
import { Link } from 'react-router';

const Header = React.createClass({
  propTypes: {},
  render: function() {
    return (
      <div className="ui inverted vertical center aligned segment custom_menu">
        <div className="ui container">
          <div className="ui large secondary inverted pointing menu">
            <Link to="/" className="active item">首页</Link>
            <a href={GlobalConfig.website} className="item">{GlobalConfig.title}</a>
            <Link to="/about" className="item">关于 & 介绍</Link>
          </div>
        </div>
      </div>
    )
  }
});

export default Header;