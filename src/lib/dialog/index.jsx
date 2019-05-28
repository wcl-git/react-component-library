import React from 'react';
import { Dialog } from '@alifd/next';

import './index.scss';

export default class ownDialog extends React.Component {
  constructor(props) {
    super(props);
    this.distance = [0, 0];
    this.position = [0, 0]; // 实际顶点的位置

    this.state = {
    };
  }

  onMouseDown = (event, type) => {
    const target = event.target;
    const targetX = event.pageX;
    const targetY = event.pageY;

    const moveStatus = document.querySelector('.next-dialog');
    const moveStatusLeft = +moveStatus.style.left.slice(0, -2);
    const moveStatusTop = +moveStatus.style.top.slice(0, -2);

    this.distance = [Math.abs(targetX - moveStatusLeft - this.position[0]), Math.abs(targetY - moveStatusTop - this.position[1])];

    document.onmousemove = (element) => {
      element.preventDefault();
      const pageX = element.pageX;
      const pageY = element.pageY;

      switch (type) {
        case 'ondrag':
          moveStatus.style.transform = `translate(${pageX - moveStatusLeft - this.distance[0]}px,${pageY - moveStatusTop - this.distance[1]}px)`;
          this.position = [pageX - moveStatusLeft - this.distance[0], pageY - moveStatusTop - this.distance[1]];
          break;
        case 'changeWH':
          moveStatus.style.width = `${(pageX - moveStatusLeft - this.position[0]) + 10}px`;
          moveStatus.style.height = `${(pageY - moveStatusTop - this.position[1]) + 10}px`;
          break;
        default:
          break;
      }
    };

    target.onmouseup = () => {
      document.onmousemove = null;
      target.onmouseup = null;
    };
  }

  render() {
    const { visible } = this.props;
    if (!visible) {
      this.distance = [0, 0];
      this.position = [0, 0]; // 实际顶点的位置
    }
    return (
      <div>
        <Dialog
          {...this.props}
        >
          <a
            className="handle-bar"
            onMouseDown={event => this.onMouseDown(event, 'ondrag')}
          />
          <a
            className="handle-w-h"
            onMouseDown={event => this.onMouseDown(event, 'changeWH')}
          />
          {this.props.children}
        </Dialog>
      </div>
    );
  }
}
