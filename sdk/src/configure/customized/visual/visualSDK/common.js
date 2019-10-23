function parseEvent(obj) {
    var path = obj.link
    var index = obj.index
    var eleObj = parserDom(path)
    if (eleObj.length === 0) {
        return
    }
    var baseEle = eleObj[0]
    var eleList = document.querySelectorAll(baseEle.link)
    var allEleList = []
    for (var i = 0; i < eleList.length; i++) {
        if (domParentList(eleList[i]) === path) {
            allEleList.push(eleList[i])
        }
    }
    eleList = []
    obj.ele = allEleList[index]
    return {
        allEleList: allEleList,
        obj: obj,
        index: index
    }
}

function parserDom(path) {
    var eleList = []
    if (path.indexOf("<") < 0) {
        return eleList
    }
    var pathObj = path.split("<")
    for (var i = 0; i < pathObj.length; i++) {
        var link = pathObj[i].split("#")
        eleList.push({
            link: link[0]
        })
        if (link.length > 1) {
            eleList.push({
                link: '#' + link[1]
            })
        }
    }
    return eleList
}

function isParent(obj, parentObj) {
    while (obj != undefined && obj != null && obj.tagName && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}

function domParentList(ele) {
    var list = []
    var parent = ele
    var num = 0
    while (parent != null) {

        var tagName = parent.tagName
        if (!tagName) {
             parent = parent.parentNode
            continue;
        }
        tagName = tagName.toLowerCase()
        var parentID = parent.id ? ('#' + parent.id) : ''
        if (parent.classList && parent.classList.length > 0) {
            var classList = ''
            for (var i = 0; i < parent.classList.length; i++) {
                if (parent.classList[i].indexOf('ARK') < 0) {
                    classList += '.' + parent.classList[i]
                }
            }
            list.push(tagName + parentID + classList)

        } else {
            list.push(tagName + parentID)
        }

        parent = parent.parentNode

    }
    return list.join('<')
}
export { parseEvent, parserDom, domParentList, isParent }