import React from 'react';
import { Link } from 'react-router';

const Index = React.createClass({
  render: function() {
    return (
      <div className="ui container content index-container">
      <div className="ui three column grid" style={{width: GlobalConfig.gameWidth}}>
      {
        window.PuzzleImages.map(function(img, i) {
          return (
            <div className="column" key={i}>
              <div className="ui card">
                <Link className="image" to={'/game/' + img[0]}>
                  <img src={ 'image/game/' + img[0] } />
                </Link>
                <div className="content">
                  <div className="meta">{img[1]}</div>
                </div>
              </div>
            </div>
          )
        })
      }
      </div>
      </div>
    );
  }
});

export default Index;