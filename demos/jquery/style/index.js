/**
 * [pageView description] 页面事件
 * @param  {[String]} pageName  [description] 页面标识,支持类型：String；最大长度255字符
 * @param  {[Object]} pageInfo    [description] 页面信息,支持类型：Object/Array；页面信息最多包含100条；Object类型内key以字母或$开头,包括大小写字母、数字、下划线和$，最大长度125字符，不支持乱码和中文；Object/Array中的value,支持类型：String；则最大长度255字符
 */
function pageView(pageName, pageInfo) {
    AnalysysAgent.pageView(pageName, pageInfo)
}
/**
 * [track description] 点击事件
 * @param  {[String]} eventName [description] 事件名称。支持类型:String。以字母或$开头,可以包含大小写字母/数字/下划线,不支持中文,不支持乱码,最大长度99字符。
 * @param  {[Object]} eventInfo [description] 事件属性,支持类型：Object/Array；事件属性最多包含100条；Object类型内key以字母或$开头,包括大小写字母、数字、下划线和$，最大长度125字符，不支持乱码和中文；Object/Array中的value,支持类型：String；则最大长度255字符
 */
function track(eventName, eventInfo) {
    AnalysysAgent.track(eventName, eventInfo);
}
/**
 * [registerSuperProperty description] 注册通用属性
 * @param  {[String]} uperPropertyName   [description] 属性名称 支持类型:String。以字母或$开头,可以包含大小写字母/数字/下划线,不支持中文,不支持乱码,最大长度99字符。
 * @param  {[String]} superPropertyValue [description] 事件属性,支持类型：String；则最大长度255字符
 */
function registerSuperProperty(superPropertyName, superPropertyValue) {
    AnalysysAgent.registerSuperProperty(superPropertyName, superPropertyValue);
}

/**
 * [registerSuperProperties description] 注册通用属性
 * @param  {[Object]} superProperties   [description] 属性集合 支持类型:Object。key以字母或$开头,可以包含大小写字母/数字/下划线,不支持中文,不支持乱码,最大长度99字符，value支持类型：String；则最大长度255字符。
 */
function registerSuperProperties(superProperties) {
    AnalysysAgent.registerSuperProperties(superProperties);
}
/**
 * [unregisterSuperProperty description] 删除单个通用属性
 * @param  {[Object]} superPropertyName [description] 属性名称 支持类型:String。以字母或$开头,可以包含大小写字母/数字/下划线,不支持中文,不支持乱码,最大长度99字符。
 */
function unRegisterSuperProperty(superPropertyName) {
    AnalysysAgent.unRegisterSuperProperty(superPropertyName);
}
/**
 * [clearSuperProperties description] 清除所有通用属性
 */
function clearSuperProperties() {
    AnalysysAgent.clearSuperProperties();
}
/**
 * [clearSuperProperties description] 获取单个通用属性
 */
function getSuperProperty(superPropertyName) {
    var superProperty = AnalysysAgent.getSuperProperty(superPropertyName);
    console.log('获取单个通用属性[' + superPropertyName + ']:', superProperty)
}
/**
 * [clearSuperProperties description] 获取所有通用属性
 */
function getSuperProperties() {
    var superProperties = AnalysysAgent.getSuperProperties();
    console.log('获取所有通用属性:', superProperties)
}
/**
 * [identify description] 用户ID设置
 * @param  {[String]} distinctId [description] 唯一身份标识,支持类型：String；长度大于0且小于255字符
 */
function identify(distinctId) {
    AnalysysAgent.identify(distinctId);
}
/**
 * [alias description]用户关联 新distinctID关联到原有originalID，originalID为原始id.
 * @param  {[String]} aliasId    [description] 支持类型：String；长度大于0，且小于255字符
 */
function alias(aliasId) {
    AnalysysAgent.alias(aliasId);
}
/**
 * [profileSet description] 设置用户属性
 * @param  {[String]} propertyName  [description] 支持类型：String;以字母或`$`开头,可包含大小写字母/数字/`_`/`$`,最大长度125字符,不支持乱码和中文
 * @param  {[String/Number/Boolean/Array]} propertyValue [description]支持类型：String/Number/Boolean/Array;若为字符串,则最大长度255字符;若为数组或集合,则最多包含100条,且key约束条件与属性名称一致,value最大长度255字符
 */
function profileSet(propertyName, propertyValue) {
    AnalysysAgent.profileSet(propertyName, propertyValue);
}
/**
 * [profileSetOnce description] 在首次设置时有效的属性
 * @param  {[String]} propertyName  [description] 支持类型：String;以字母或`$`开头,可包含大小写字母/数字/`_`/`$`,最大长度125字符,不支持乱码和中文
 * @param  {[String/Number/Boolean/Array]} propertyValue [description] 支持类型：String/Number/Boolean/Array;若为字符串,则最大长度255字符;若为数组或集合,则最多包含100条,且key约束条件与属性名称一致,value最大长度255字符
 */
function profileSetOnce(propertyName, propertyValue) {
    AnalysysAgent.profileSetOnce(propertyName, propertyValue);
}
/**
 * [profileIncrement description] 设置用户属性相对变化值
 * @param  {[String]} propertyName  [description] 属性名称 支持类型：String;以字母或`$`开头,可包含大小写字母/数字/`_`/`$`,最大长度125字符,不支持乱码和中文
 * @param  {[String/Number/Boolean/Array]} propertyValue [description] 属性值 支持类型：String/Number/Boolean/Array;若为字符串,则最大长度255字符;若为数组或集合,则最多包含100条,且key约束条件与属性名称一致,value最大长度255字符
 */
function profileIncrement(propertyName, propertyValue) {
    AnalysysAgent.profileIncrement(propertyName, propertyValue)
}
/**
 * [profileAppend description]设置单个列表类型的属性
 * @param  {[String]} propertyName  [description] 属性名称 支持类型：String;以字母或`$`开头,可包含大小写字母/数字/`_`/`$`,最大长度125字符,不支持乱码和中文
 * @param  {[String/Number/Boolean]} propertyValue [description] 属性值 支持类型：String/Number/Boolean;最大长度255字符;
 */
function profileAppend(propertyName, propertyValue) {
    AnalysysAgent.profileAppend(propertyName, propertyValue);
}
/**
 * [profileUnset description] 删除设置的属性
 * @param  {[String]} property [description] 属性名称 支持类型：String;以字母或`$`开头,可包含大小写字母/数字/`_`/`$`,最大长度125字符,不支持乱码和中文
 */
function profileUnset(property) {
    AnalysysAgent.profileUnset(property);
}
/**
 * [profileDelete description] 要清除已经设置的所有属性
 */
function profileDelete() {
    AnalysysAgent.profileDelete();
}
/**
 * [reset description] 清除本地设置
 */
function reset() {
    AnalysysAgent.reset();
}

/**
 * [historyPage description] 修改history记录跳转页面
 * @param  {[String]} page [description] 跳转页面地址
 */
function historyPage(page) {
    document.title = 'historyPage' //跳转后的页面title
    history.pushState(null, null, page)
}
/**
 * [historyPage description] 修改hash值跳转页面
 * @param  {[String]} page [description] 跳转页面地址
 */
function hashPage(page) {
    document.title = 'hashPage'
    location.href = page
}

/**
 * 获取预置属性
 */
function getPresetProperties() {
    var presetProperties = AnalysysAgent.getPresetProperties()
    console.log('获取预置属性:', presetProperties)
}

/**
 * 获取匿名ID
 */
function getDistinctId() {
    var distinctId = AnalysysAgent.getDistinctId()
    console.log("匿名ID：" + distinctId)
}