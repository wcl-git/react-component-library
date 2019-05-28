import React from 'react';
import './LeftRgithLayout.scss';

const LeftRgithLayout = props => (
  <div className={`left-rgith-layout ${props.fixside}`}>
    {LeftRgithLayout.LeftPart(props.children)}
    {LeftRgithLayout.RightPart(props.children)}
  </div>
);

LeftRgithLayout.LeftPart = item => (
  <div className="left-part" style={{ width: (item[0].props.width ? item[0].props.width : '100%') }}>
    {item[0].props.children}
  </div>
);

LeftRgithLayout.RightPart = item => (
  <div className="right-part" style={{ width: (item[1].props.width ? item[1].props.width : '100%') }}>
    {item[1].props.children}
  </div>
);

export default LeftRgithLayout;
