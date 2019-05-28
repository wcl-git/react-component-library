import React from 'react';

// import { Table } from '@alifd/next';
import { Table } from './lib/lib';

export default class Demo extends React.Component {
  state = {
    list: [
      { name: '牙膏', type: '生活用品' },
      { name: '西装', type: '生活用品1' },
      { name: '鞋子', type: '生活用品2' },
    ],
  }

  render() {
    return (
      <Table
        dataSource={this.state.list}
        cid="1550036419774"
      >
        <Table.Column title="名称" dataIndex="name" />
        <Table.Column title="类型" dataIndex="type" />
        <Table.Column title="操作" cell={() => <a href="#">查看</a>} />
      </Table>
    );
  }
}
