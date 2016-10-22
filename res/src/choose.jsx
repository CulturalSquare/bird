import React from 'react';
import { Link } from 'react-router';

import OnFireMixin from './mixins/onFireMixin.jsx';
import TipShowMixin from './mixins/tipShowMixin.jsx';
import RequestsMixin from './mixins/xhrRequestsMixin.jsx';

const Choose = React.createClass({
  __ONFIRE__: 'Choose',
  mixins: [RequestsMixin, OnFireMixin, TipShowMixin],  // 引入 mixin
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
  },
  render: function() {
    return (
      <div>
        <Link to='/game/1.jpg'>开始玩游戏！</Link>
      </div>
    );
  }
});

export default Choose;