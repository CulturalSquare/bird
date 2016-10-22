import React from 'react';
import { Link } from 'react-router';

import DateUtils from './utils/dateUtils.jsx';
import ArrayUtils from './utils/arrayUtils.jsx';
import PosUtils from './utils/posUtils.jsx';
import pys from 'pys';

const Game = React.createClass({
  timer: null,
  // 随机出来的地图
  gameImgs: ['', '', '', '', '', '', '', '', ''], // 图片剪裁之后的base64
  gameMap: [0, 1, 2, 3, 4, 5, 7, 8, 9],
  // 正确答案
  answer: [0, 1, 2, 3, 4, 5, 7, 8, 9],
  postions: [], // 不同位置图片的位置，仅仅用于判断卡片重叠
  leftTops:[],
  currDrag: -1, // 当前滑动的序号
  dragPos: [0, 0], // 当前滑动的位置
  getInitialState: function() {
    return {
      seconds: window.GlobalConfig.time,
      status: 'gaming' // 游戏中的状态
    };
  },
  countDown: function() {
    let seconds = this.state.seconds;
    if (seconds <= 0) {
      this.setState({status: 'fail'}); // 失败
      return ;
    }
    this.setState({seconds: --this.state.seconds});
    this.timer = window.setTimeout(this.countDown, 1000);
  },

  componentWillMount: function() {
    console.log('componentWillMount');
    // 随机生成拼图。
    do {
      this.gameMap = ArrayUtils.randomArray(9);
      // 对于小于 6 的随机需要重新随机。
    } while (ArrayUtils.arrayDiff(this.gameMap, this.answer) < 6);

  },
  onMoveEnd: function(i ,e) {
    // 通过移动来判定图片位置，以及gameMap的调整
    let index0 = $(e.target).attr('d');
    if (index0 === undefined) {
      index0 = this.currDrag;
    }
    else {
      index0 =parseInt(index0);
    }

    let d = $('.game_cell[d="' + index0 + '"]');
    let x = d.offset().left;
    let y = d.offset().top;
    // console.log(d.innerHeight)
    let center_x = x + d.width() / 2;
    let center_y = y + d.height() / 2;

    this.dragPos = [center_x, center_y];

    let which = PosUtils.inWhichRect(this.dragPos, this.postions);
    let currDragDom = $('.game_cell[d="' + this.currDrag + '"]');
    if (which === -1 || which === this.currDrag) {
      // 不需要交换，直接归位即可
      // which = this.currDrag;
      currDragDom.animate({
        left: this.leftTops[this.currDrag].x + 'px',
        top: this.leftTops[this.currDrag].y + 'px'
      }, 100, null, function() {
        currDragDom.css('z-index', 1);
      });
    }
    else {
      // 需要进行交换 this.currDrag <----> which
      let currDragPos = this.postions[this.currDrag];
      let whichDragPos = this.postions[which];
      // 两个点的距离差距
      let gap = {
        x: currDragPos.x1 - whichDragPos.x1,
        y: currDragPos.y1 - whichDragPos.y1
      };

      // 交换位置
      this.leftTops[which].x += gap.x;
      this.leftTops[which].y += gap.y;
      this.leftTops[this.currDrag].x -= gap.x;
      this.leftTops[this.currDrag].y -= gap.y;

      // 交换判定位置
      this.postions[which].x1 += gap.x;
      this.postions[which].x2 += gap.x;
      this.postions[which].y1 += gap.y;
      this.postions[which].y2 += gap.y;

      this.postions[this.currDrag].x1 -= gap.x;
      this.postions[this.currDrag].x2 -= gap.x;
      this.postions[this.currDrag].y1 -= gap.y;
      this.postions[this.currDrag].y2 -= gap.y;

      $('.game_cell[d="' + which + '"]').animate({
        left: this.leftTops[which].x + 'px',
        top: this.leftTops[which].y + 'px'
      }, 100, null, function() {
        currDragDom.css('z-index', 1);
      });

       $('.game_cell[d="' + this.currDrag + '"]').animate({
        left: this.leftTops[this.currDrag].x + 'px',
        top: this.leftTops[this.currDrag].y + 'px'
      }, 100, null, function() {
        currDragDom.css('z-index', 1);
      });
    }
    
    // 然后判断是否成功
    if (ArrayUtils.arrayDiff(this.gameMap, this.answer) === 0) {
      this.setState({status: 'success'}); // 成功
    }
  },
  onStart: function(i, e) {
    this.currDrag = parseInt($(e.target).attr('d'));

    let d = $('.game_cell[d="' + this.currDrag + '"]');
    d.css('z-index', 99999);
    
  },
  windowLoaded: function() {
    this.initGameBoard();
  },
  
  initGameBoard: function() {
    this.postions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.leftTops = [];
    let cells = $('.game_cell');

    cells.each(function(index0, e) {
      e = $(e);
      let offset = e.offset();
      index0 = parseInt(e.attr('d'));
      this.postions[index0] = {
        x1: offset.left, 
        x2: offset.left + e.width(), 
        y1: offset.top, 
        y2: offset.top + e.height()
      };
      // left top位置
      this.leftTops.push({x:0, y:0});
    }.bind(this));

    // counter down
    this.timer = window.setTimeout(this.countDown, 1000);

    cells.dragmove({
      onend: this.onMoveEnd,
      onstart: this.onStart,
    }); 
  },
  componentDidMount: function() {
    // 页面渲染之后，获取不同块的位置信息。
    window.onload = this.windowLoaded;
  },
  componentWillUnmount: function() {
    window.clearTimeout(this.timer);
  },
  renderSuccess: function() {
    return (<div>renderSuccess</div>);
  },
  renderFail: function() {
    return (<div>renderFail</div>);
  },
  renderGameBoard:function() {
    if (this.state.status === 'gaming') {
      return this.renderGaming()
    }
    else if (this.state.status === 'success') {
      return this.renderSuccess()
    }
    else if (this.state.status === 'fail') {
      return this.renderSuccess()
    }
    else {
      return (<div>error.</div>)
    }
  },
  renderGaming: function() {
    return (
      <div>
        <div className="ui inverted statistics">
          <div className="statistic">
            <div className="value">
              <i className="clock icon"></i> <span ref='counter'>{DateUtils.formatSec(this.state.seconds)}</span> 
            </div>
          </div>
          <Link to='/' className="ui animated fade button" tabIndex="0">
            <div className="visible content">重新开始游戏</div>
            <div className="hidden content">点击重新开始 </div>
          </Link>
        </div>
        <div className="ui three column grid game-container" 
            ref="GameContainer" 
            style={{
              position: 'relative', 
              height: GlobalConfig.imgHeight,
              width: GlobalConfig.imgWith,
              backgroundImage: 'url(image/game/1.jpg)'
            }}>
        {
          this.gameMap.map(function(index, i) {
            let x = i % 3 * 33.33;
            let y = parseInt(i / 3) * 33.33;
            return (
              <div d={index + ''} className="column game_cell" key={i} >
                <div d={index + ''} className="ui card imgPart" style={{
                        height:'100%',
                        background: 'url("image/game/' + this.props.params.img + '")',
                        backgroundPosition: x + '% ' + y + '%'
                      }}>
                  <a className="image">
                    <span d={index + ''} />
                  </a>
                </div>
              </div>
            )
          }.bind(this))
        }
        </div>
      </div>
    );
  },
  render: function() {
    return (
      <div className="ui container content index-container">
        {
          this.renderGameBoard()
        }
      </div>
    );
  }
});

export default Game;