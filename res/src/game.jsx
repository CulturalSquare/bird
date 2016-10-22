import React from 'react';
import { Link } from 'react-router';

import OnFireMixin from './mixins/onFireMixin.jsx';
import TipShowMixin from './mixins/tipShowMixin.jsx';
import RequestsMixin from './mixins/xhrRequestsMixin.jsx';

const Game = React.createClass({
  __ONFIRE__: 'Game',
  mixins: [RequestsMixin, OnFireMixin, TipShowMixin],  // 引入 mixin
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
  },
  render: function() {
    return (
      <div>
        成功、失败:{this.props.params.img}
        <Link to='/'>返回首页</Link>
      </div>
    );
  }
});

export default Game;