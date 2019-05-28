import React from 'react';
import { Table } from '@alifd/next';
import PageTable from './components/PageTable';

class ownTable extends React.Component {
  translateObj = list => list.map(item => (<Table.Column {...item.props} />));

  render() {
    const { children } = this.props;
    return (
      <PageTable {...this.props}>
        {this.translateObj(children)}
      </PageTable>
    );
  }
}

export default ownTable;

