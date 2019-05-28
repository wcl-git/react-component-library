import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Input, Icon } from '@alifd/next';
import moment from 'moment';
import './index.scss';

export default class SeewDatepicker extends Component {
  static propTypes = {
    showDatePanel: PropTypes.bool,
    hasClear: PropTypes.bool,
    isStart: PropTypes.bool,
  }

  static defaultProps = {
    showDatePanel: true, // 是否显示日期面板
    hasClear: false,
    isStart: true, // 时间禁止
  };

  constructor(props) {
    super(props);
    const initValue = props.value || props.defaultValue;
    this.open = false;
    this.isInputDate = false; // 判断是否是手动输入的日期
    // 判断是否显示时分秒的不同格式
    if (props.showTime) {
      this.format = props.showTime.formater ? `${props.showTime.formater[0]} ${props.showTime.formater[1]}` : 'YYYY-MM-DD HH:mm:ss';
    } else {
      this.format = props.format ? props.format : 'YYYY-MM-DD';
    }
    this.disabledValue = null;
    this.state = {
      value: initValue ? this.formatDateFuc(initValue) : new Date(), // 为datepicker 准备
      inputValue: initValue ? this.formatDateFuc(initValue) : '',
      errorStyle: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
        inputValue: nextProps.value ? this.formatDateFuc(nextProps.value) : '',
      });
    }
  }

  // 日期统一格式化
  formatDateFuc = (value, string = this.format) => {
    return moment(value).format(string);
  }

  // 输入框change 事件
  inputChange = (val) => {
    // 手动输入
    this.isInputDate = true;
    this.setState({
      inputValue: val,
    });
  }

  // 格式化输出事件
  formatInputDate = () => {
    // 格式化输入日期
    const { value, inputValue } = this.state;
    // 输入格式切割成数字组成字符串
    const arr = inputValue.split(' ');
    let str = '';
    str = arr[0] ? `${str}${arr[0].split('-').join('')}` : str;
    str = arr[1] ? `${str}${arr[1].split(':').join('')}` : str;

    if (str.length >= 9) {
      const key = str.split('');
      key.splice(8, 0, ' ');
      str = key.join('');
    }

    const newInputValue = str;
    // 是否为日期类型
    const condition = this.formatDateFuc(newInputValue, this.format);

    // 年份不能超过四位数
    const year = condition !== 'Invalid date' && condition.split('-')[0].length;
    const switchGate = condition !== 'Invalid date' && year < 5 && inputValue.length !== 7;
    if (!this.whetherProhibit(newInputValue)) {
      this.setState({
        inputValue: this.formatDateFuc(value, this.format),
      });
    } else {
      this.setState({
        inputValue: switchGate ? condition : inputValue,
        value: switchGate ? condition : value,
        errorStyle: !switchGate && inputValue,
      });
    }
    // 激活日期控件change事件
    if (typeof this.props.onChange === 'function') {
      let arg1 = null;
      let arg2 = null;
      if (!this.whetherProhibit(newInputValue)) {
        arg1 = new Date(value);
        arg2 = this.formatDateFuc(value, this.format);
      } else if (switchGate) {
        arg1 = new Date(condition);
        arg2 = condition;
      }
      // 调用props change
      if (switchGate) {
        this.props.onChange(arg1, arg2);
      }
    }
  }

  // onPressEnter  回车事件
  onPressEnter = () => {
    this.formatInputDate();
    // 暴露 onPressEnter 事件
    if (typeof this.props.onPressEnter === 'function') {
      this.props.onPressEnter();
    }
  }
  // 失去焦点事件
  onBlur = () => {
    if (this.isInputDate) {
      this.setState({
        errorStyle: !this.state.inputValue ? false : this.state.errorStyle,
      }, () => {
        this.formatInputDate();
      });
      this.isInputDate = false;
      if (typeof this.props.onChange === 'function') {
        // 空值失去焦点，触发change 事件，解决formbinder
        if (!this.state.inputValue) {
          this.props.onChange(null, null);
        }
      }
    }

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur();
    }
  }

  // 禁用不可选日期
  disabledDate = (calendarDate) => {
    const { disabledDate } = this.props;
    this.disabledValue = calendarDate;
    return disabledDate && disabledDate instanceof Function && disabledDate(calendarDate);
  }

  // 判断日期是否禁止
  whetherProhibit = (value) => {
    const { isStart, disabledDate } = this.props;
    let key = true;
    if (this.disabledValue) {
      const init = this.formatDateFuc(this.disabledValue.timestamp, 'YYYY-MM-DD');
      if (isStart && disabledDate && disabledDate instanceof Function) {
        key = moment(this.formatDateFuc(value, 'YYYY-MM-DD')).isAfter(init) || moment(this.formatDateFuc(value, 'YYYY-MM-DD')).isSame(init);
      }
      if (!isStart && disabledDate && disabledDate instanceof Function) {
        key = moment(this.formatDateFuc(value, 'YYYY-MM-DD')).isBefore(init) || moment(this.formatDateFuc(value, 'YYYY-MM-DD')).isSame(init);
      }
    }
    return key;
  }

  // 单个日期键盘处理
  handleKeyboard = (day, str = this.format) => {
    const { value } = this.state;

    if (!this.whetherProhibit(day)) {
      return;
    }

    const formatDay = this.formatDateFuc(day, str);
    this.setState({
      value: formatDay !== 'Invalid date' ? formatDay : value,
      inputValue: formatDay !== 'Invalid date' ? formatDay : value,
      datepickerOpen: false,
    });
  }

  // 鼠标键盘
  handleKeyDown = (evt) => {
    evt.stopPropagation();
    const { value } = this.state;
    const target = evt.currentTarget;
    // 如果日期panel关闭,只触发向下按钮
    if (!this.open) {
      // 按向下按钮展开日期控件
      const dom = target.querySelector('.enhance-datepicker .next-date-picker');
      if (evt.keyCode === 40) {
        dom.click();
      }
      return;
    }

    if (evt.keyCode === 37) {
      const day = new Date(value).setDate(new Date(value).getDate() - 1);
      this.handleKeyboard(day);
    }
    if (evt.keyCode === 38) {
      const day = new Date(value).setDate(new Date(value).getDate() - 7);
      this.handleKeyboard(day);
    }
    if (evt.keyCode === 39) {
      const day = new Date(value).setDate(new Date(value).getDate() + 1);
      this.handleKeyboard(day);
    }
    if (evt.keyCode === 40) {
      const day = new Date(value).setDate(new Date(value).getDate() + 7);
      this.handleKeyboard(day);
    }
    // enter事件关闭日期面板
    if (evt.keyCode === 13) {
      // const dom = target.querySelector('.enhance-datepicker .next-date-picker');
      // dom.click();
      document.body.click();
    }
  }

  // 打来日期面板回调
  onOpenChange = (open) => {
    this.open = open;
    if (open) {
      this.setState({
        datepickerOpen: true,
      });
    } else if (!this.state.inputValue && (this.formatDateFuc(this.state.value) === this.formatDateFuc(new Date()))) {
      const dateValue = this.formatDateFuc(this.state.value);
      this.setState({ inputValue: dateValue, value: dateValue });
      if (this.props.onChange) {
        this.props.onChange(dateValue);
      }
    }

    if (typeof this.props.onOpenChange === 'function') {
      this.props.onOpenChange(open);
    }
  }

  // 面板change 事件
  onChange = (val) => {
    this.state.value = val;
    this.state.inputValue = val;
    this.setState({
      value: val,
      inputValue: val, // this.formatDateFuc(val),
      errorStyle: false, // 去掉输入时错误提示的样式
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(val);
    }
  }
  // 清空按钮
  clearValue = (evt) => {
    evt.stopPropagation();
    this.setState({
      value: new Date(),
      inputValue: '',
    });
  }

  render() {
    const { inputValue, errorStyle, datepickerOpen } = this.state;
    const { isStart, showDatePanel, className, ...args } = this.props;
    // const { disabled, hasClear } = this.props;
    const value = this.formatDateFuc(this.state.value);

    return (
      <div
        className={`enhance-datepicker ${className} ${datepickerOpen ? 'enhance-open' : ''}`}
        onKeyDown={this.handleKeyDown}
        onClick={(evt) => {
          const target = evt.currentTarget;
          const dom = target.querySelector('.enhance-datepicker .next-date-picker');
          const input = target.querySelector('.enhance-datepicker .enhance-input input');
          input.focus();
          if ((this.props.showDatePanel && evt.target.className.indexOf('next-icon-calendar') !== -1) || (document.activeElement.nodeName === 'INPUT' && evt.target.className.indexOf('next-date-picker') > -1)) {
            setTimeout(() => {
              dom.querySelector('input').click();
            }, 10);
          }
        }}
      >
        <Input
          placeholder="请输入日期"
          {...args}
          hasClear={false}
          value={inputValue}
          onChange={this.inputChange}
          onPressEnter={this.onPressEnter}
          onBlur={this.onBlur}
          className={`enhance-input ${errorStyle ? 'error-border' : ''}`}
        />
        <div className="date-icon">
          <Icon type="calendar" />
          {/* inputValue && !disabled && hasClear
            ? <Icon type="delete-filling"  onClick={this.clearValue} />
            : <Icon type="calendar" />
          */}
        </div>
        <DatePicker
          {...args}
          value={value}
          disabledDate={this.disabledDate}
          popupAlign="bl tl"
          onVisibleChange={this.onOpenChange}
          onChange={this.onChange}
          className="own-datePicker"
          popupClassName="own-datePicker-popup"
        />
      </div>
    );
  }
}
