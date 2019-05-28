import React, { Component } from 'react';
import { Grid, Icon } from '@alifd/next';
import './index.scss';

const { Row, Col } = Grid;

class Bread extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { content = [], extra, align } = this.props;
    const breadContent = content.map((item, index, arr) => {
      return (
        <div className="breadcrumbitembox" key={index}>
          <div className={index < arr.length - 1 ? 'breadcrumbitem' : 'breadcrumbitemlast'}>{item}</div>
          {index < arr.length - 1 ? <div>{this.props.separator ? this.props.separator : <Icon type="arrow-right" size="xs" />}</div> : null}
        </div>
      );
    }, this);
    return (
      <Row className="row-box">
        <Col span="10">
          <div className="breadcrumbbox">
            {breadContent}
          </div>
        </Col>
        <Col span="14" >
          <div align={align || 'right'}>
            {extra}
          </div>
        </Col>
      </Row>
    );
  }
}

Bread.propTypes = {

};

Bread.displayName = 'Bread';

export default Bread;
