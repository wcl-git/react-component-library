/**
 * @Author: 吴春雷
 * @Update: 2018-10-17
 * @Description: 带分页列表的表格
 */
import React from 'react';
import { Pagination } from '@alifd/next';
// import utils from '@ali/own-front-utils';
import DragTable from '../DragTable';

export default class PageTable extends React.Component {
  static displayName = 'PageTable'
  constructor(props) {
    super(props);
    this.state = {
      current: 2,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

  }

  handleChange(current) {
    this.setState({
      current,
    });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <DragTable {...this.props}>
          {this.props.children}
        </DragTable>
        <Pagination current={this.state.current} onChange={this.handleChange} />
      </div>
    );
  }
}
