DatePicker  支持键盘的日期控件

该控件是基于飞冰 datePicker 封装。和飞冰 datePicker API 一致，
只是增加了 showDatePanel  这个属性，
showDatePanel 是一个 boolan 值，true 表示日期面板显示， false 表示只有输入框，没有日期选择面板。
另外，还针对原飞冰 disabledDate  这个属性，增加了一个 isStart, 是一个 boolan 值，true表示禁止的日期是 向前禁止， false 表示向后禁止

增加 onPressEnter、onBlur 事件回调