/**
** Author: 吴春雷
** Update: 2018-06-28
** Description: tip冒泡提示框   因为飞冰提示框不符合视觉等方面的要求所以花点时间自己进行了二次封装
*/
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Balloon } from '@alifd/next';
import './index.scss';

export default class Tip extends Component {
  static displayName = 'Tip';
  // static propTypes = {
  //   force: PropTypes.bool, // 是否强制出冒泡提示
  // }

  constructor(props) {
    super(props);
    this.state = {
      need: false,
    };

    this.title = this.props.title;
    // React.Children.count
  }

  getColContent() {
    return <div className={this.state.need ? 'ell-box has-ell' : 'ell-box'} ref={ele => this.myTip = ele}><ins>{this.props.children || this.props.title}</ins><span>{this.props.children || this.props.title}</span></div>;
  }

  render() {
    return (this.props.force || this.state.need) && this.props.title !== null && typeof this.props.title !== 'undefined' ? <Balloon.Tooltip trigger={this.getColContent()}>{this.props.title}</Balloon.Tooltip> : this.getColContent();
  }

  componentDidMount() {
    if (typeof this.props.onRef === 'function') {
      this.props.onRef(this);
    }
    this.computed();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.title) {
      setTimeout(() => this.computed(), 500);
    }
  }

  computed() {
    if (this.props.force) {
      return false;
    }
    if (!this.myTip) { return false; }
    const w = this.myTip.offsetWidth;
    const iw = this.myTip.querySelector('ins').offsetWidth;
    this.setState({ need: iw > w });
  }

  componentWillUnmount() {
    this.myTip = null;
  }
}
