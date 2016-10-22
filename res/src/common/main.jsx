import React from 'react';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Index from '../index.jsx';

const MainComponent = React.createClass({
  // random bg
  getBgImgUrl: function() {
    return 'url(' + GlobalConfig.background + ')';
  },
  render: function() {
    let index = true;
    if (this.props.children) {
      index = false
    }
    let children = this.props.children || <Index />;
    return (
      <div className="ui main main-content" id="main_content" style={{backgroundImage: this.getBgImgUrl()}}>
        { index && <Header />}
        { children }
         { index && <Footer />}
      </div>
    );
  }
});

export default MainComponent;