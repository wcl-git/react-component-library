import React from 'react';

// import { Table } from '@alifd/next';
// import { DragTable } from './lib/lib';

export default class Demo extends React.Component {
  click = () => {
    console.log('sdfdfdsf');
  }
  render() {
    return (
      <div onClick={this.click}>111</div>
    );
  }
}
