import React from 'react';
import { Link } from 'react-router';

const Index = React.createClass({
  render: function() {
    return (
      <div>
        <Link to='choose'>选择拼图图片</Link>
      </div>
    );
  }
});

export default Index;