/**
 * 字段填充、字段校验规则模板
 *
 * check：数据合法检测方法列表，每个方法返回bool值，以用户为准，同名覆盖
 *
 */
export default {
  encryptType: {
    check: {
      value: ['isNumber']
    }
  }
}
