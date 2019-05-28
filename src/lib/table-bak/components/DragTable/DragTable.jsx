/**
 **@Author: 谭生虎 TanShenghu tanshenghu@163.com
 **@Update: 2019-01-15
 **@Description: table表格支持列的左右拖动
 */
import React from 'react';
import classnames from 'classnames';
import { Table } from '@alifd/next';
import '@alifd/next/lib/table/index.scss';
import './index.scss';

const G = window;
const Doc = G.document;
const minWidth = 30;
const noop = () => { };

class DragTable extends React.Component {
  static displayName = 'DragTable';

  constructor(props) {
    super(props);

    const conf = JSON.parse(G.localStorage.getItem('table_move_config'));
    this.state = {
      widths: conf && conf[this.props.cid] ? conf[this.props.cid] : [],
      showMoveData: {},
    };
    this.setup = false;
    this.moveBarWidth = 0;
    this.currentItem = {};
    this.lockels = [];
  }

  render() {
    let children = this.props.children;
    const params = Object.assign({}, this.props);
    const { onMouseMove = noop, onMouseOut = noop } = this.props;
    const hasCid = params.cid;
    const showMoveData = this.state.showMoveData;
    params.className = classnames(params.className, { 'col-move-table': hasCid, 'col-move-sort-table': hasCid && params.onSort });
    delete params.children;
    this.lockels.length = 0;
    children = hasCid ? React.Children.map(children, (com, idx) => {
      return React.cloneElement(com, {
        title: com.props.lock ?
          <div className={`table-header-col-content moveTbl-row-${idx}`} ref={el => this.lockels.push({ el, conf: com.props })}>{com.props.title}</div>
          :
          <React.Fragment>
            <div className={classnames('table-header-col-content', `moveTbl-row-${idx}`, { 'move-hover': showMoveData.index === idx })}>
              {com.props.title}
            </div>
            {children.length - 1 > idx ? <a className="table-move-handler" onMouseDown={evt => this.handlerDown(evt, idx)} /> : null}
          </React.Fragment>,
        width: this.state.widths[idx], // com.props.width
      });
    }) : children;
    return (
      <Table
        {...params}
        onBlur={() => { }}
        onMouseMove={(evt) => {
          onMouseMove(evt);
          if (hasCid) {
            this.myTableMove(evt);
          }
        }}
        onMouseOut={(evt) => {
          onMouseOut(evt);
          if (hasCid) {
            this.myTableMove(evt);
          }
        }}
      >
        {children}
      </Table>
    );
  }

  componentDidMount() {
    this.listWidth();

    Doc.addEventListener('mousemove', this.docMove, false);
    Doc.addEventListener('mouseup', this.docDestructor, false);
    // 偶尔有一些锁列会用Tip, 给锁列加空度
    // this.computeLockCol();
  }

  // componentWillUnmount() {
  //   Doc.removeEventListener('mousemove', this.docMove);
  //   Doc.removeEventListener('mouseup', this.docDestructor);
  // }

  // 偶尔有一些锁列会用Tip, 给锁列加空度
  computeLockCol() {
    if (this.lockels.length) {
      this.lockels.forEach((item) => {
        const lockCol = findParent(item.el, '.next-table-lock-left');
        const headerBox = findParent(item.el, 'TABLE');
        if (lockCol) {
          const w = /\d$/.test(`${item.conf.width}`) ? `${item.conf.width}px` : item.conf.width;
          lockCol.style.width = headerBox.querySelector('colgroup col').style.width || w;
        }
      });
    }
  }

  listWidth() {
    const children = this.props.children;
    if (children && children.length && children.length !== this.state.widths.length) {
      const state = [];
      React.Children.map(children, (com) => {
        state.push(com.props.width);
      });
      this.setState({ widths: state });
    }
  }

  computeLeft(el) {
    let sum = el ? el.offsetLeft : 0;
    while (el && el.offsetParent) {
      sum += el.offsetParent.offsetLeft;
      el = el.offsetParent;
    }
    return sum;
  }

  findScroll(el) {
    let sum = el ? el.scrollLeft : 0;
    while (el && el.parentNode && el.parentNode.tagName !== 'HTML') {
      sum += el.parentNode.scrollLeft || 0;
      el = el.parentNode;
    }
    return sum;
  }

  docMove = (evt) => {
    const { index: idx, target } = this.currentItem;
    if (this.setup && target) {
      const widths = this.state.widths;
      const lastVal = parseFloat(widths[idx]);

      // 防止一直往右侧托,倒置后边其它列宽度挤压
      if (this.currentItem.clientX < evt.clientX && parseFloat(widths[idx + 1]) <= minWidth) {
        return false;
      }

      widths[idx] = `${Math.max(((this.findScroll(target) + evt.clientX) - this.computeLeft(target.parentNode)) + this.moveBarWidth, minWidth)}px`;
      if (widths[idx + 1] && lastVal && this.state.widths.length - 1 !== idx) {
        widths[idx + 1] = `${Math.max(parseFloat(widths[idx + 1]) + ((parseFloat(widths[idx]) - lastVal) * -1), minWidth)}px`;
      }
      // lock 暂时不支持锁列托动操作
      // const lockCol = findParent(target, 'next-table-lock-');
      // if(lockCol && lockCol.className.indexOf('next-table-lock-')>-1){

      // }
      this.setState({ widths });
    }
  }

  myTableMove(evt) {
    const target = evt.target;
    const tbody = findParent(target, '.next-table-body');
    const thead = findParent(target, '.next-table-header');
    // 光标进入表头
    if (thead) {
      const oth = findParent(target, 'TH');
      if (oth && oth.nodeName === 'TH') {
        const targetEl = oth.querySelector('.table-header-col-content');
        this.tabMove(targetEl, evt, (/moveTbl-row-(\d+)/.exec(targetEl.className) || [])[1] * 1);
      }
    } else if (tbody) {
      this.setState({ showMoveData: {} });// 光标进入表身
    }
  }

  myTableMouseOut(evt) {
    const { className = '' } = evt.target;
    if (className.search(/table-header-col-content|next-table-header-node/) > -1) {
      this.setState({ showMoveData: {} });
    }
  }

  docDestructor = () => {
    this.setup = false;
    if (this.currentItem.target) {
      this.setDragData(this.currentItem.index);
      this.currentItem = {};
    }
  }

  handlerDown(evt, idx) {
    this.setup = true;
    this.currentItem.event = evt;
    this.currentItem.clientX = evt.clientX;
    this.currentItem.target = evt.target;
    this.currentItem.index = idx;
    this.moveBarWidth = this.moveBarWidth || parseFloat(G.getComputedStyle(Doc.querySelector('table p.table-move-handler')).width) + 2;
  }

  setDragData() {
    if (this.props.cid) {
      const conf = JSON.parse(G.localStorage.getItem('table_move_config') || '{}');
      conf[this.props.cid] = this.state.widths;
      G.localStorage.setItem('table_move_config', JSON.stringify(conf));
    }
  }

  tabMove(target, evt, idx) {
    // const target = evt.target;
    const otd = target.parentNode;
    // const l = otd.offsetLeft;
    const w = otd.offsetWidth;
    // const r = otd.offsetLeft + w;
    const x = evt.clientX;
    let scrollVal = 0;
    const moveTbl = findParent(target, '.col-move-table');
    if (moveTbl) {
      scrollVal = moveTbl.querySelector('.next-table-body').scrollLeft;
    }

    const isMouseLeft = w * 0.5 > (x + scrollVal) - offsetLeft(target);
    const showMoveData = this.state.showMoveData;
    showMoveData.isMouseLeft = isMouseLeft;
    showMoveData.index = isMouseLeft ? Math.max(idx - 1, 0) : idx;
    this.setState({ showMoveData });
  }
}

// const fns = { ...Table };

// console.log('fns', fns);

// Object.keys(fns).forEach((item) => {
//   DragTable[item] = Table[item];
// });


const findParent = function (el, cls) {
  const isTagName = /^[A-Z]+$/.test(cls);
  cls = cls.replace(/^\./, '');
  while (el && (el.nodeName !== 'BODY' && (isTagName ? el.nodeName !== cls : el.className.indexOf(cls) === -1))) {
    el = el.parentNode;
  }

  if (el.nodeName === 'BODY') {
    return null;
  } else if (!el || cls !== 'BODY') {
    return el;
  }
  return null;

  // return !el || cls !== 'BODY' && el.nodeName === 'BODY' ? null : el;
};

const offsetLeft = function (el) {
  let sum = 0;
  while (el) {
    sum += el.offsetLeft;
    el = el.offsetParent;
  }
  return sum;
};

export default DragTable;
