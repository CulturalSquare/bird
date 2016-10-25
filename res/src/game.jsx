import React from 'react';
import { Link } from 'react-router';

import DateUtils from './utils/dateUtils.jsx';
import ArrayUtils from './utils/arrayUtils.jsx';
import PosUtils from './utils/posUtils.jsx';
import pys from 'pys';

const Game = React.createClass({
  timer: null,
  // 随机出来的地图
  gameMap: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  // 正确答案
  answer: [0, 1, 2, 3, 4, 5, 6, 7, 8],
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
    this.refs.counter.innerHTML = DateUtils.formatSec(--this.state.seconds);
    this.timer = window.setTimeout(this.countDown, 1000);
  },

  componentWillMount: function() {
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

       // 交换map （this.currDrag 《----》 which）
       for (var i = 0; i < this.gameMap.length; i ++) {
         if (this.gameMap[i] === this.currDrag) {
            this.gameMap[i] = which;
         }
         else if (this.gameMap[i] === which) {
            this.gameMap[i] = this.currDrag;
         }
       }
    }
    // 然后判断是否成功
    if (ArrayUtils.arrayDiff(this.gameMap, this.answer) === 0) {
      if (this.timer) window.clearTimeout(this.timer);
      // 去除border，演示动画

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
    this.windowLoaded();
  },
  componentWillUnmount: function() {
    if (this.timer) window.clearTimeout(this.timer);
  },
  renderSuccess: function() {
    return (
      <div className="ui ">
        <h1 className="ui header">恭喜你，成功了~</h1>
        <img className="ui centered large image" src={GlobalConfig.successImg} />
      </div>
    )
  },
  renderFail: function() {
    return (
      <div className="ui ">
        <h1 className="ui header">失败了也没关系~</h1>
        <img className="ui centered large image" src={GlobalConfig.failImg} />
      </div>
    )
  },
  renderGameBoard:function() {
    let board = null;
    if (this.state.status === 'gaming') {
      board = this.renderGaming()
    }
    else if (this.state.status === 'success') {
      board = this.renderSuccess()
    }
    else if (this.state.status === 'fail') {
      board = this.renderFail()
    }
    else {
      board = (
        <div className="ui ">
          <h1 className="ui header">你怎么会跑到这里来~</h1>
          <img className="ui centered large image" src={GlobalConfig.successImg} />
        </div>
      )
    }
    return (
      <div style={{marginTop: $('body').height() / 2 - GlobalConfig.imgHeight / 2 - 100}}>{board}</div>
    );
  },
  renderGaming: function() {
    return (
      <div className="ui three column grid game-container" 
          ref="GameContainer" 
          style={{
            position: 'relative', 
            height: GlobalConfig.imgHeight,
            width: GlobalConfig.imgWith,
          }}>
      {
        this.gameMap.map(function(index, i) {
          let x = index % 3 * 33.33 / 100;
          let y = parseInt(index / 3) * 33.33 / 100;
          return (
            <div d={index + ''} 
                className="column game_cell" 
                key={i} >
              <div d={index + ''} className="ui card imgPart" style={{
                      height: GlobalConfig.imgHeight / 3 + 'px',
                      background: 'url("image/game/' + this.props.params.img + '")',
                      backgroundPosition: (-x * GlobalConfig.imgWith) + 'px ' + (-y * GlobalConfig.imgHeight) + 'px'
                    }}>
              </div>
            </div>
          )
        }.bind(this))
      }
      </div>
    );
  },
  render: function() {
    return (
      <div className="ui container content index-container">
        <div>
          <div className="ui inverted statistics">
            <div className="statistic">
              <div className="value">
                <i className="clock icon"></i> 
                <span ref='counter'>{DateUtils.formatSec(GlobalConfig.time)}</span> 
              </div>
            </div>
            <Link to='/' className="ui animated fade button" tabIndex="0">
              <div className="visible content">重新开始游戏</div>
              <div className="hidden content">点击重新开始 </div>
            </Link>
          </div>
          {
            this.renderGameBoard()
          }
        </div>
      </div>
    );
  }
});

export default Game;