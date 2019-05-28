export default class ReadIDCard {
  constructor() {
    this.socket = null;
  }

  openReader() {
    return new Promise((res) => {
      const host = 'ws://127.0.0.1:6688';
      const list = {};

      if (!this.socket) {
        console.log('设备连接成功.');
        this.socket = new WebSocket(host);
      } else {
        this.closeSocket();
        this.socket = new WebSocket(host);
      }
      this.socket.onopen = () => this.socket.send('SDT_ReadCard##');
      this.socket.onerror = () => {
        console.log('请安装驱动.');
      };
      this.socket.onmessage = (msg) => {
        if (typeof msg.data === 'string') {
          const msgM = `${msg.data}`;
          // 获得身份信息
          if (msgM[0] === '0') {
            console.log('身份证阅读器异常,请联系管理员.');
          } else if (msgM[0] === '3') {
            console.log('请连接设备.');
          } else if (msgM[0] === '4') {
            console.log('请放身份证.');
          } else if (msgM[0] === '5') {
            console.log('读取身份证信息失败,请查身份证是否有效.');
          } else if (msgM[0] === '6') {
            console.log('读取身份证头像失败,请查身份证是否有效.');
          } else {
            // 获得身份信息
            list.userName = msgM.match(/name(\S*)name/)[1];
            list.sex = msgM.match(/sex(\S*)sex/)[1];
            list.nation = msgM.match(/nation(\S*)nation/)[1];
            list.birthDate = msgM.match(/birthDate(\S*)birthDate/)[1];
            list.address = msgM.match(/address(\S*)address/)[1];
            list.idCode = msgM.match(/IDCode(\S*)IDCode/)[1];
            list.issuingAuthority = msgM.match(/issuingAuthority(\S*)issuingAuthority/)[1];
            list.Photo = `data:image/png;base64,${msgM.match(/##(\S*)##/)[1]}`;
            // Promise执行
            res(list);
          }
        } else {
          console.log('连接异常,请检查是否成功安装东信EST-100G驱动.');
        }
      };
    });
  }

  // resultMsg(msg) {
  //   document.getElementById('text_result').value += `\r\n${msg}`;
  // }
  // 预留接口，勿删

  closeSocket() {
    if (this.socket != null) {
      this.socket.close();
      this.socket = null;
    }
  }
}
