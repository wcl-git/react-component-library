import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routes';

// 以下代码 ICE 自动生成, 请勿修改
const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

ReactDOM.render(<AppRouter />, ICE_CONTAINER);
