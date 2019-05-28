## 使用说明

new 一个实例，掉用 openReader 这个方法，返回一个promise， then 方法里获取对应的身份证信息：
userName 姓名，sex 性别，nation 民族，birthDate 出生日期，address 家庭住址，idCode 身份证号，issuingAuthority 签发机关，Photo 头像（src） 

```react里面使用
import ReadIDCard from '@components/ReadIDCard';

<span onClick={this.testRead}>读身份证</span>

// js
testRead = () => {
  const reader = new ReadIDCard();
  reader.openReader().then((data) => {
    这里data 就是身份证信息
  })
}
  

```

读卡原始信息：

```
name张*亮name|sex男sex|nation汉nation|birthDate19910120birthDate|address杭州市上城区西湖大道２５９号４０６室address|IDCode330******101200350IDCode|issuingAuthority杭州市公安局上城分局issuingAuthority|beginPeriodOfValidity201***13beginPeriodOfValidity|endPeriodOfValidity20***13endPeriodOfValidity
```