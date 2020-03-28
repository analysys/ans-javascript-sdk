var rootNodeRE = /^(?:body|html)$/i;

var supportedClickTags = ["I", "SPAN", "EM", "svg"];
var camelize = function (str) {
    return str.replace(/-+(.)?/g, function (match, chr) {
        if (chr) {
            return chr.toUpperCase();
        } else {
            return '';
        }
    });
};
var elePostion = (function () {
    function elePostion() {}

    var isArray = function (obj) {
        var str = Object.prototype.toString.call(obj);
        return str === '[object Array]' || str === '[object Array Iterator]';
    };
    elePostion.bind = function (elem, type, callback, useCapture) {
        var eProp;
        if (useCapture == null) {
            useCapture = false;
        }
        if (elem == null) {
            return;
        }
        if (document.addEventListener != null) {
            elem.addEventListener(type, callback, useCapture);
        } else if (document.attachEvent != null) {
            eProp = type + callback;
            elem['e' + eProp] = callback;
            elem[eProp] = function () {
                var e;
                e = window.event;
                e.currentTarget = elem;
                e.target = e.srcElement;
                return elem['e' + eProp].call(elem, e);
            };
            elem.attachEvent("on" + type, elem[eProp]);
        } else {
            elem["on" + type] = callback;
        }
        return true;
    };

    elePostion.unbind = function (elem, type, callback, useCapture) {
        var eProp;
        if (elem == null) {
            return;
        }
        if (document.removeEventListener != null) {
            elem.removeEventListener(type, callback, useCapture);
        } else if (document.detachEvent != null) {
            eProp = type + callback;
            elem.detachEvent("on" + type, elem[eProp]);
            elem[eProp] = null;
            elem['e' + eProp] = null;
        } else {
            elem["on" + type] = null;
        }
        return true;
    };

    elePostion.bindOn = function (container, event, selector, callback, useCapture) {
        var elem, len1, q, ref1;
        if (useCapture == null) {
            useCapture = false;
        }
        switch (typeof selector) {
        case 'string':
            ref1 = container.querySelectorAll(selector);
            for (q = 0, len1 = ref1.length; q < len1; q++) {
                elem = ref1[q];
                elePostion.bindOnce(elem, event, callback, useCapture);
            }
            break;
        case 'function':
            if (callback !== null) {
                useCapture = callback;
            } else {
                useCapture = false;
            }
            callback = selector;
            elePostion.bindOnce(container, event, callback, useCapture);
        }
        return true;
    };

    elePostion.bindOnce = function (elem, event, callback, useCapture) {
        if (useCapture == null) {
            useCapture = false;
        }
        elePostion.unbind(elem, event, callback, useCapture);
        return elePostion.bind(elem, event, callback, useCapture);
    };

    elePostion.isLeaf = function (node) {
        var cnode, len1, q, ref1;
        if (!node.hasChildNodes() && node.tagName !== 'svg') {
            ref1 = node.childNodes;
            for (q = 0, len1 = ref1.length; q < len1; q++) {
                cnode = ref1[q];
                if (cnode.nodeType === 1) {
                    return false;
                }
            }
        }
        return true;
    };

    elePostion.isParentOfLeaf = function (node) {
        var cnode, len1, q, ref1;
        if (!node.hasChildNodes()) {
            return false;
        }
        if (node.tagName === 'svg') {
            return false;
        }
        ref1 = node.childNodes;
        for (q = 0, len1 = ref1.length; q < len1; q++) {
            cnode = ref1[q];
            if (!elePostion.isLeaf(cnode)) {
                return false;
            }
        }
        return true;
    };

    elePostion.lessThanSomeLevelDepth = function (node, threshold, depth) {
        var childNodes, len1, n, q, ref1;
        if (depth == null) {
            depth = 1;
        }
        childNodes = node.childNodes;
        if (childNodes.length > 0) {
            if (depth > threshold) {
                return false;
            }
            ref1 = node.childNodes;
            for (q = 0, len1 = ref1.length; q < len1; q++) {
                n = ref1[q];
                if (n.nodeType === Node.ELEMENT_NODE) {
                    if (!elePostion.lessThanSomeLevelDepth(n, threshold, depth + 1)) {
                        return false;
                    }
                }
            }
        }
        return depth <= threshold;
    };

    elePostion.parentOfLeafText = function (node) {
        var childNode, childTextContent, content, len1, q, ref1;
        content = "";
        if (!node.hasChildNodes() && !node.textContent) {
            return "";
        }
        ref1 = node.childNodes;
        for (q = 0, len1 = ref1.length; q < len1; q++) {
            childNode = ref1[q];
            if (childNode.nodeType === 3) {
                if (childNode.textContent != null) {
                    childTextContent = this.trim(childNode.textContent);
                } else if (childNode.data != null) {
                    childTextContent = this.trim(childNode.data);
                }
                if (childTextContent.length > 0) {
                    content += childTextContent + " ";
                }
            }
        }
        content = content.replace(/[\n \t]+/g, " ").trim();
        return this.processText(content);
    };

    elePostion.tree = function (node) {
        var cnode, tree;
        tree = [];
        cnode = new TaggingNode(node);
        while (cnode.name !== 'body' && cnode.name !== 'html') {
            tree.unshift(cnode);
            cnode = new TaggingNode(cnode.node.parentNode);
        }
        return tree;
    };

    elePostion.path = function (node) {
        var depth, len1, q, tn, tree;
        depth = "";
        tree = this.tree(node);
        for (q = 0, len1 = tree.length; q < len1; q++) {
            tn = tree[q];
            depth += tn.path();
        }
        return depth;
    };

    elePostion.nodePath = function (node) {
        var depth, len1, q, tn, tree;
        depth = "";
        tree = this.tree(node);
        for (q = 0, len1 = tree.length; q < len1; q++) {
            tn = tree[q];
            depth += tn.path();
        }
        return depth;
    };

    elePostion.getGrObj = function (node) {
        var grObj, pnode;
        pnode = node;
        if (this.hasAttr(node, 'data-growing-info')) {
            grObj = node.getAttribute('data-growing-info');
        }
        if (grObj) {
            return grObj;
        }
        while (pnode && pnode.tagName !== "BODY" && !this.isContainer(pnode) && (["TR"].indexOf(pnode.tagName) === -1 || !this.hasAttr(pnode, 'data-growing-info'))) {
            pnode = pnode.parentNode;
        }
        if (this.hasAttr(pnode, 'data-growing-info')) {
            return pnode.getAttribute('data-growing-info');
        }
    };

    elePostion.index = function (node) {
        var idx, xpath;
        if (this.hasAttr(node, 'data-growing-idx')) {
            return node.getAttribute('data-growing-idx');
        }
        idx = this.calculateExtendsIdx(node);
        xpath = this.nodePath(node);
        if (xpath && !idx && this.isInList(xpath)) {
            idx = this._calculateListIdx(node);
        }
        return idx;
    };

    elePostion.calculateExtendsIdx = function (node) {
        var pnode;
        pnode = node;
        while (pnode && pnode.tagName !== "BODY") {
            if (this.hasAttr(pnode, 'data-growing-idx')) {
                break;
            }
            pnode = pnode.parentNode;
        }
        if (pnode) {
            return pnode.getAttribute('data-growing-idx');
        }
    };

    elePostion._calculateListIdx = function (node) {
        var idx, len1, n, pnode, ppnode, q, ref1;
        pnode = node;
        while (pnode && pnode.tagName !== "BODY" && this.indexOf(listTags, pnode.tagName) === -1) {
            pnode = pnode.parentNode;
        }
        if (pnode) {
            ppnode = pnode.parentNode;
            idx = 1;
            ref1 = ppnode.childNodes;
            for (q = 0, len1 = ref1.length; q < len1; q++) {
                n = ref1[q];
                if (n.tagName !== pnode.tagName) {
                    continue;
                }
                if (this.hasAttr(n, 'data-growing-idx')) {
                    idx = parseInt(n.getAttribute('data-growing-idx'));
                }
                if (n === pnode) {
                    return idx;
                }
                idx += 1;
            }
        }
    };

    elePostion.isInList = function (xpath) {
        return xpath.split(/\.|\/|\#/).some(function (x) {
            return listTags.some(function (lt) {
                return lt.toLowerCase() === x.toLowerCase();
            });
        });
    };

    elePostion.href = function (target) {
        var elemHref, h, ref1, tagName;
        tagName = target.tagName;
        if (tagName === "IMG") {
            if (((ref1 = target.src) != null ? ref1.length : void 0) > 0 && target.src.indexOf("data:image") === -1) {
                h = target.src;
            }
        } else if (this.hasAttr(target, 'href')) {
            elemHref = target.getAttribute('href');
            if (elemHref && elemHref.indexOf('javascript') !== 0) {
                h = this.normalizePath(elemHref.slice(0, 320));
            }
        }
        return h;
    };

    elePostion.siblingList = function (node) {
        var dom, pnode;
        pnode = node;
        while (pnode && pnode.tagName !== "BODY" && ["TR", "LI", "DL"].indexOf(pnode.tagName) === -1) {
            pnode = pnode.parentNode;
        }
        if (pnode && pnode.tagName !== "BODY") {
            return (function () {
                var len1, q, ref1, results;
                ref1 = pnode.parentNode.children;
                results = [];
                for (q = 0, len1 = ref1.length; q < len1; q++) {
                    dom = ref1[q];
                    if (this.isVisible(dom)) {
                        results.push(dom);
                    }
                }
                return results;
            }).call(this);
        } else {
            return [];
        }
    };

    elePostion.similarPath = function (node) {
        var cnode, idSelected, selector;
        selector = "";
        idSelected = 0;
        cnode = new TaggingNode(node);
        while (cnode.name !== 'body') {
            if (cnode.id != null) {
                if (idSelected) {
                    selector = "" + (cnode.similarPath(true)) + selector;
                    return this.path(cnode.node.parentNode) + selector;
                } else {
                    idSelected = true;
                }
            }
            selector = "" + (cnode.similarPath()) + selector;
            cnode = new TaggingNode(cnode.node.parentNode);
        }
        return selector;
    };

    elePostion.hasClass = function (el, selector) {
        if (el == null) {
            return false;
        }
        return el.classList.contains(selector);
    };

    elePostion.addClass = function (el, klass) {
        if (el == null) {
            return false;
        }
        return el.classList.add(klass);
    };

    elePostion.removeClass = function (el, klass) {
        if (el == null) {
            return false;
        }
        return el.classList.remove(klass);
    };

    elePostion.toggleClass = function (el, klass) {
        if (this.hasClass(el, klass)) {
            return this.removeClass(el, klass);
        } else {
            return this.addClass(el, klass);
        }
    };

    elePostion.offset = function (elem) {
        var doc, docElem, offset, rect, win;
        if (!elem) {
            return;
        }
        rect = elem.getBoundingClientRect();
        if (rect.width || rect.height || elem.getClientRects().length) {
            doc = elem.ownerDocument;
            win = elem === elem.window ? elem : (elem.nodeType === 9 ? elem.defaultView : window);
            docElem = doc.documentElement;
            offset = {
                top: rect.top + win.pageYOffset - docElem.clientTop,
                left: rect.left + win.pageXOffset - docElem.clientLeft
            };
            return offset;
        }

    };

    elePostion.position = function (elem) {
        var obj, offset, offsetParent, parentOffset, scrollTop;
        offsetParent = elePostion.offsetParent(elem);
        offset = elePostion.offset(elem);
        if (!offset) {
            return null;
        }
        parentOffset = rootNodeRE.test(offsetParent.nodeName) ? {
            top: 0,
            left: 0
        } : elePostion.offset(offsetParent);

        parentOffset.top += parseFloat(elePostion.css(offsetParent, 'border-top-width') || 0);
        parentOffset.left += parseFloat(elePostion.css(offsetParent, 'border-left-width') || 0);
        scrollTop = offsetParent.scrollTop ? offsetParent.scrollTop : 0;

        return obj = {
            top: offset.top - parentOffset.top + scrollTop,
            left: offset.left - parentOffset.left
        };
    };

    elePostion.offsetParent = function (elem) {
        var parent;
        while (elem && !elem.offsetParent) {
            elem = elem.parentNode;
            if (elem === document.body) {
                break;
            }
        }
        if (!elem) return document.body
        parent = elem.offsetParent || document.body;
        while (parent && !rootNodeRE.test(parent.nodeName) && elePostion.css(parent, "position") === "static") {
            parent = parent.offsetParent;
        }
        return parent;
    };

    elePostion.width = function (elem) {
        var rect;
        if (!elem) {
            return;
        }
        if (elem === elem.window) {
            return elem.innerWidth;
        } else if (elem.nodeType === 9) {
            return elem.documentElement.scrollWidth;
        } else {
            rect = elem.getBoundingClientRect();
            return Math.round(rect.width);
        }
    };

    elePostion.stringCircleEventIfy = function (event) {
        var cloneEvent;
        cloneEvent = this.deepClone(event);
        return JSON.stringify(cloneEvent);
    };

    elePostion.include = function (array, item) {
        var inClude;
        inClude = indexOf.call(array, item) >= 0;
        return inClude;
    };

    elePostion.deepClone = function (data) {
        var d, k, len1, o, q, t, v;
        t = typeof data;
        if (this.isDom(data)) {
            return {};
        } else if (!data) {
            return null;
        } else if (isArray(data)) {
            o = [];
        } else if (t === 'object') {
            o = {};
        } else {
            return data;
        }
        if (t === 'array') {
            for (q = 0, len1 = data.length; q < len1; q++) {
                d = data[q];
                o.push(this.deepClone(d));
            }
            return o;
        } else if (t === 'object') {
            for (k in data) {
                v = data[k];
                o[k] = this.deepClone(v);
            }
            return o;
        }
    };

    elePostion.isDom = function (obj) {
        return obj && typeof obj.nodeName === 'string' && typeof obj === 'object';
    };

    elePostion.height = function (elem) {
        var rect;
        if (!elem) {
            return;
        }
        if (elem === elem.window) {
            return elem.innerHeight;
        } else if (elem.nodeType === 9) {
            return elem.documentElement.scrollHeight;
        } else {
            rect = elem.getBoundingClientRect();
            return Math.round(rect.height);
        }
    };

    elePostion.isHidden = function (node) {
        return node.style.display === "none";
    };

    elePostion.closest = function (el, fn) {
        while (el) {
            if (fn(el)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    };

    elePostion.getAccurateElementsByXpath = function (targetXpath, compareXpath, content, domIndex, href) {
        var arrayDoms, dom, doms, grXpathParser, len1, q, res;
        res = [];
        grXpathParser = new GrXpathParser(targetXpath);
        doms = grXpathParser.findElements();
        if (doms.length === 0) {
            return res;
        }
        arrayDoms = Array.prototype.slice.call(doms);
        for (q = 0, len1 = arrayDoms.length; q < len1; q++) {
            dom = arrayDoms[q];
            if (GrSameXpath.isSame(targetXpath, this.nodePath(dom))) {
                res.push(dom);
            }
        }
        return res;
    };

    elePostion.getClickElementByTag = function (tag) {
        var domIndex, doms;
        doms = elePostion.getElementsByXpath(tag.filter.xpath, tag.filter.content, tag.filter.index, tag.filter.href);
        domIndex = tag.attrs.domIndex || 0;
        return doms[domIndex] || doms[0];
    };

    elePostion.getElementsBySkeletonXpath = function (xpath, content, index, href, accurateMatch) {
        var len1, q, queryXpaths, res, x;
        if (accurateMatch == null) {
            accurateMatch = false;
        }
        res = [];
        if (xpath) {
            queryXpaths = xpath.split(',');
            for (q = 0, len1 = queryXpaths.length; q < len1; q++) {
                x = queryXpaths[q];
                res = res.concat(this._queryXpath(x, content, index, href, accurateMatch, 'skeleton'));
            }
        }
        return this.uniq(res);
    };

    elePostion.getElementsByXpath = function (xpath, content, index, href, accurateMatch) {
        var len1, q, queryXpaths, res, x;
        if (accurateMatch == null) {
            accurateMatch = false;
        }
        res = [];
        if (xpath) {
            queryXpaths = xpath.split(',');
            for (q = 0, len1 = queryXpaths.length; q < len1; q++) {
                x = queryXpaths[q];
                res = res.concat(this._queryXpath(x, content, index, href, accurateMatch));
            }
        }
        return this.uniq(res);
    };

    elePostion._queryXpath = function (xpath, content, index, href, accurateMatch, xpathMatchPattern) {
        var arrayDoms, dom, doms, grXpathParser;
        if (xpathMatchPattern == null) {
            xpathMatchPattern = 'full';
        }
        grXpathParser = new GrXpathParser(xpath);
        doms = grXpathParser.findElements();
        arrayDoms = Array.prototype.slice.call(doms);
        arrayDoms = arrayDoms.filter((function (_this) {
            return function (dom) {
                var creg, domContent, hreg, matched, tagName, tempHref, tempSrc;
                matched = true;
                href = _this.filterProtocol(href);
                if (content || href) {
                    if (accurateMatch) {
                        if (content) {
                            domContent = elePostion.content(dom);
                            if (!(domContent.length > 0 && domContent === content)) {
                                matched = false;
                            }
                        }
                        if (href) {
                            tagName = dom.tagName.toLowerCase();
                            if (tagName === "img") {
                                matched = matched && dom.src && dom.src.indexOf("data:image") === -1 && _this.filterProtocol(dom.src) === href;
                            } else {
                                tempHref = dom.hasAttribute('href') && _this.filterProtocol(elePostion.normalizePath(dom.getAttribute('href')));
                                matched = matched && tempHref && tempHref === href;
                            }
                        }
                    } else {
                        if (content) {
                            try {
                                creg = new RegExp(content.replace(/\*/g, ".*"));
                            } catch (error1) {
                                creg = new RegExp('');
                            }
                            domContent = elePostion.content(dom);
                            if (!((domContent != null ? domContent.length : void 0) > 0 && (domContent.indexOf(content) !== -1 || creg.test(domContent)))) {
                                matched = false;
                            }
                        }
                        if (href) {
                            try {
                                hreg = new RegExp(href.replace(/\*/g, ".*"));
                            } catch (error1) {
                                hreg = new RegExp('');
                            }
                            tagName = dom.tagName.toLowerCase();
                            if (tagName === "img") {
                                tempSrc = _this.filterProtocol(dom.src);
                                matched = matched && tempSrc && tempSrc.indexOf("data:image") === -1 && (tempSrc === href || hreg.test(tempSrc));
                            } else {
                                tempHref = dom.hasAttribute('href') && _this.filterProtocol(elePostion.normalizePath(dom.getAttribute('href')));
                                matched = matched && tempHref && (tempHref === href || hreg.test(tempHref));
                            }
                        }
                    }
                }
                if (xpathMatchPattern === 'skeleton') {
                    return matched && GrSameXpath.isSameWithSkeleton(xpath, _this.nodePath(dom));
                } else {
                    return matched && GrSameXpath.isSameWithRegular(xpath, _this.nodePath(dom));
                }
            };
        })(this));
        if (index && parseInt(index) !== 0) {
            arrayDoms = (function () {
                var len1, q, results;
                results = [];
                for (q = 0, len1 = arrayDoms.length; q < len1; q++) {
                    dom = arrayDoms[q];
                    if (parseInt(elePostion.index(dom)) === parseInt(index)) {
                        results.push(dom);
                    }
                }
                return results;
            })();
        }
        return (function () {
            var len1, q, results;
            results = [];
            for (q = 0, len1 = arrayDoms.length; q < len1; q++) {
                dom = arrayDoms[q];
                if (this.isVisible(dom)) {
                    results.push(dom);
                }
            }
            return results;
        }).call(this);
    };

    elePostion._xpathRemoveEmptyClassOrId = function (parsedXpath) {
        var res;
        res = parsedXpath.replace(/(\S)\#\./g, '$1\.').replace(/(\S)\#\s/g, '$1 ');
        res.replace(/\.(\s)/g, '$1').replace(/(\S)\.\s/, '$1 ');
        return res;
    };

    elePostion.content = function (dom) {
        var c, tagName;
        tagName = dom.tagName.toLowerCase();
        if (this.hasAttr(dom, 'title') && dom.getAttribute('title').length > 0) {
            c = this.processText(dom.getAttribute('title'));
        } else if (this.isLeaf(dom)) {
            c = this.calculateLeafContent(dom);
        } else if (this.indexOf(['a', 'button'], tagName) !== -1) {
            c = this.containerElemContent(dom);
        } else if (this.isParentOfLeaf(dom)) {
            c = this.parentOfLeafText(dom);
        }
        return c = c || "";
    };

    elePostion.isContainer = function (dom) {
        return this.hasAttr(dom, 'data-growing-container');
    };

    elePostion.onlyContainsChildren = function (node, validTagNames) {
        var child, len1, q, ref1;
        if (!node.children.length === 0) {
            return false;
        }
        ref1 = node.children;
        for (q = 0, len1 = ref1.length; q < len1; q++) {
            child = ref1[q];
            if (this.indexOf(validTagNames, child.tagName) === -1) {
                return false;
            }
        }
        return true;
    };

    elePostion.calculateLeafContent = function (dom) {
        var c, child, h, imageParts, imageUrl, len1, q, ref1, results, tagName, text;
        tagName = dom.tagName.toLowerCase();
        h = this.href(dom);
        if (tagName === "img") {
            if (dom.alt) {
                return c = dom.alt;
            } else if (h) {
                imageUrl = h.split("?")[0];
                imageParts = imageUrl.split("/");
                if (imageParts.length > 0) {
                    return c = imageParts[imageParts.length - 1];
                }
            }
        } else if (tagName === "input" && this.indexOf(['button', 'submit'], dom.type) !== -1) {
            return c = this.processText(dom.value);
        } else if (tagName === "svg") {
            ref1 = dom.childNodes;
            results = [];
            for (q = 0, len1 = ref1.length; q < len1; q++) {
                child = ref1[q];
                if (child.nodeType === 1) {
                    if (child.tagName === "use" && this.hasAttr(child, "xlink:href")) {
                        results.push(c = child.getAttribute("xlink:href"));
                    } else {
                        results.push(void 0);
                    }
                }
            }
            return results;
        } else {
            text = "";
            if (dom.textContent != null) {
                text = dom.textContent.replace(/[\n \t]+/g, " ").trim();
            } else if (dom.innerText != null) {
                text = dom.innerText.replace(/[\n \t]+/g, " ").trim();
            }
            if (text.length > 0) {
                if (text.length < 50) {
                    c = text;
                } else if (tagName === 'a') {
                    c = text.slice(0, 30);
                } else {
                    c = text.substr(0, 47)
                }

                return this.processText(c);
            }
        }
    };

    elePostion.containerElemContent = function (target) {
        var polt;
        if (this.hasAttr(target, 'title') && target.title.length > 0) {
            return this.processText(target.getAttribute('title'));
        } else if (target.tagName === 'BUTTON') {
            if (target.name.length > 0) {
                return target.name;
            } else if (this.onlyContainsChildren(target, supportedClickTags) && (target.textContent != null)) {
                polt = target.textContent.replace(/[\n \t]+/g, " ").trim();

                return this.processText(polt);
            }
        } else if (target.tagName === 'A') {
            if (this.onlyContainsChildren(target, supportedClickTags) && (target.textContent != null)) {
                polt = target.textContent.replace(/[\n \t]+/g, " ").trim();
                return this.processText(polt);
            } else if (this.hasAttr(target, 'href') && target.getAttribute('href').length > 0) {
                return target.getAttribute('href');
            }
        } else if (target.tagName === 'LABEL') {
            if (target.textContent != null) {
                polt = target.textContent.replace(/[\n \t]+/g, " ").trim();
                return this.processText(polt);
            }
        }
    };

    elePostion.hasAttr = function (tag, attrName) {
        if (tag.hasAttribute) {
            return tag.hasAttribute(attrName);
        } else {
            return !!tag[attrName];
        }
    };

    elePostion.isEmpty = function (obj) {
        var prop;
        if ((function () {
                var len1, q, results;
                results = [];
                for (q = 0, len1 = obj.length; q < len1; q++) {
                    prop = obj[q];
                    results.push(obj.hasOwnProperty(prop));
                }
                return results;
            })()) {
            return false;
        }
        return true;
    };

    elePostion.aElementsEqualbElements = function (objA, objB) {
        var key, value;
        if (typeof objA !== 'object' || typeof objB !== 'object') {
            return false;
        }
        if (objA === objB) {
            return true;
        }
        if ((objA == null) || (objB == null)) {
            return false;
        }
        for (key in objA) {
            if (!hasProp.call(objA, key)) continue;
            value = objA[key];
            if (!objB.hasOwnProperty(key)) {
                return false;
            }
            if (value !== objB[key]) {
                return false;
            }
        }
        for (key in objB) {
            if (!hasProp.call(objB, key)) continue;
            value = objB[key];
            if (!objA.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    elePostion.offsetLeft = function (element) {
        var actualLeft = element.offsetLeft;　　　　
        var current = element.offsetParent;　　　　
        while (current !== null) {　　　　　　
            actualLeft += current.offsetLeft;　　　　　　
            current = current.offsetParent;　　　　
        }　　　　
        if (document.compatMode == "BackCompat") {　　　　　　 var elementScrollLeft = document.body.scrollLeft;　　　　 } else {　　　　　　 var elementScrollLeft = document.documentElement.scrollLeft;　　　　 }　　　　
        return actualLeft //-elementScrollLeft;
    };
    elePostion.offsetTop = function (element) {
        var actualTop = element.offsetTop;　　　　
        var current = element.offsetParent;　　　　
        while (current !== null) {　　　　　　
            actualTop += current.offsetTop;　　　　　　
            current = current.offsetParent;　　　　
        }
        return actualTop
    };


    elePostion.title = function () {
        var parts, title;
        title = document.title;
        if (title.indexOf('|') !== -1) {
            parts = title.split('|');
            if (parts.length >= 3) {
                return this.trim(parts[0] + "|" + parts[1]);
            } else {
                return parts[0].trim();
            }
        } else if (title.indexOf('-') !== -1) {
            return this.trim(title.split('-')[0]);
        } else {
            return title;
        }
    };

    elePostion.indexOf = function (array, value) {
        var index, length, other;
        if (Array.prototype.indexOf != null) {
            return array.indexOf(value);
        } else {
            length = array.length;
            index = -1;
            while (++index < length) {
                other = array[index];
                if (other === value) {
                    return index;
                }
            }
            return -1;
        }
    };

    elePostion.host = function () {
        var len1, matches, q, r, rule, url;
        if (window.rules != null) {
            url = window.location.toString();
            for (q = 0, len1 = rules.length; q < len1; q++) {
                rule = rules[q];
                r = rule.split(",");
                url = url.replace(new RegExp(r[0]), r[1]);
            }
            matches = UrlParseRE.exec(url);
            return matches[10];
        } else {
            return window.location.host;
        }
    };

    elePostion.path = function () {
        var hash, len1, matches, path, q, r, ref1, rule, url;
        if (window.rules != null) {
            url = window.location.toString();
            for (q = 0, len1 = rules.length; q < len1; q++) {
                rule = rules[q];
                r = rule.split(",");
                url = url.replace(new RegExp(r[0]), r[1]);
            }
            matches = UrlParseRE.exec(url);
            path = matches[13];
            if (path == null) {
                path = "";
            }
        } else {
            path = window.location.pathname;
        }
        path = this.normalizePath(path);
        if (window.vds.hashtag) {
            hash = window.location.hash;
            if (hash.indexOf("?") !== -1) {
                path += hash.split('?')[0];
            } else {
                path += hash;
            }
        } else {
            path;
        }
        if ((ref1 = window.vds) != null ? ref1.pathCaseSensitive : void 0) {
            return path;
        } else {
            return path.toLowerCase();
        }
    };

    elePostion.query = function () {
        var len1, matches, q, query, r, ref1, rule, url;
        if (window.rules != null) {
            url = window.location.toString();
            for (q = 0, len1 = rules.length; q < len1; q++) {
                rule = rules[q];
                r = rule.split(",");
                url = url.replace(new RegExp(r[0]), r[1]);
            }
            matches = UrlParseRE.exec(url);
            query = matches[16];
            if (query == null) {
                query = "";
            }
        } else {
            query = window.location.search;
        }
        query = this.normalizeQuery(query);
        if (window.vds.hashtag && window.location.hash.indexOf('?') !== -1) {
            query = window.location.hash.split('?')[1];
        } else {
            query;
        }
        if ((ref1 = window.vds) != null ? ref1.pathCaseSensitive : void 0) {
            return query;
        } else {
            return query.toLowerCase();
        }
    };

    elePostion.normalizePath = function (path) {
        var fullPath, len;
        fullPath = this.trim(path);
        len = fullPath.length;
        if (len > 1 && fullPath[len - 1] === "/") {
            return fullPath.slice(0, len - 1);
        } else {
            return fullPath;
        }
    };

    elePostion.normalizeQuery = function (fullQuery) {
        var len;
        len = fullQuery.length;
        if (len > 1 && fullQuery[0] === '?') {
            return fullQuery.slice(1);
        } else {
            if (window.vds.hashtag && window.location.hash.indexOf('?') !== -1) {
                return window.location.hash.split('?')[1];
            } else {
                return fullQuery;
            }
        }
    };

    elePostion.css = function (element, property, value) {
        var computedStyle, css, key, len1, prop, props, q, results;
        if (!element) {
            return;
        }
        if (arguments.length < 3) {
            computedStyle = getComputedStyle(element, '');
            if (typeof property === 'string') {
                return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
            } else if (isArray(property)) {
                props = {};
                for (q = 0, len1 = property.length; q < len1; q++) {
                    prop = property[q];
                    props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
                }
                return props;
            }
        }
        css = '';
        if (typeof property === 'string') {
            if (!value && value !== 0) {
                return element.style[dasherize(property)] = "";
            } else {
                return element.style[dasherize(property)] = maybeAddPx(property, value);
            }
        } else {
            results = [];
            for (key in property) {
                if (!property[key] && property[key] !== 0) {
                    results.push(element.style[dasherize(key)] = "");
                } else {
                    results.push(element.style[dasherize(key)] = maybeAddPx(key, property[key]));
                }
            }
            return results;
        }
    };

    elePostion.hasBackgroundImage = function (elem) {
        var imageStyle;
        imageStyle = elePostion.css(elem, 'background-image');
        return imageStyle && imageStyle.length > 0 && imageStyle !== "none";
    };

    elePostion.cursorOffset = function (event) {
        var docElement, offset;
        offset = {
            top: 0,
            left: 0
        };
        if (event.pageX) {
            offset.left = event.pageX;
            offset.top = event.pageY;
        } else if (event.clientX) {
            docElement = document.documentElement || document.body;
            offset.left = event.clientX + docElement.scrollLeft;
            offset.top = event.clientY + docElement.scrollTop;
        }
        return offset;
    };

    elePostion.merge = function (obj1, obj2) {
        var attrname, obj3;
        obj3 = {};
        for (attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        for (attrname in obj3) {
            if (typeof obj3[attrname] === 'function') {
                delete obj3[attrname];
            }
        }
        return obj3;
    };

    elePostion.trim = function (str) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "");
    };

    elePostion.levelDomain = function (domain) {
        var array;
        array = domain.split(".");
        if (array.length === 2) {
            return "." + array.join(".");
        } else if (array.length >= 3 && array[array.length - 2] === "com") {
            return "." + array.slice(-3).join(".");
        } else {
            return "." + array.slice(-2).join(".");
        }
    };

    elePostion.isValidGrTrackingTag = function (elem) {
        return elem.type !== "password" && elem.hasAttribute('growing-track');
    };

    elePostion.isClickableInputTag = function (elem) {
        return elem.tagName === "INPUT" && ['button', 'submit'].indexOf(elem.type) !== -1;
    };

    elePostion.uniq = function (array) {
        var item, len1, q, result;
        result = [];
        if (array instanceof Array === false || array.length <= 1) {
            return array;
        }
        for (q = 0, len1 = array.length; q < len1; q++) {
            item = array[q];
            if (result.indexOf(item) === -1) {
                result.push(item);
            }
        }
        return result;
    };

    elePostion.clone = function (obj) {
        var flags, key, newInstance;
        if ((obj == null) || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        if (obj instanceof RegExp) {
            flags = '';
            if (obj.global != null) {
                flags += 'g';
            }
            if (obj.ignoreCase != null) {
                flags += 'i';
            }
            if (obj.multiline != null) {
                flags += 'm';
            }
            if (obj.sticky != null) {
                flags += 'y';
            }
            return new RegExp(obj.source, flags);
        }
        newInstance = {};
        for (key in obj) {
            newInstance[key] = obj[key];
        }
        return newInstance;
    };

    elePostion.skeletonXpath = function (xpath) {
        var nodes, res;
        nodes = xpath.split('/').splice(1);
        res = nodes.filter((function (_this) {
            return function (nodeString) {
                return !nodeString.match(/^[a-zA-Z]+((\.|\#)?\*)?$/);
            };
        })(this));
        return res.length === 0;
    };

    elePostion.filterSkeletonXpath = function (xpath) {
        var xpathArray;
        xpathArray = xpath.split(',');
        return xpathArray.filter((function (_this) {
            return function (nodeXpath) {
                return !elePostion.skeletonXpath(nodeXpath);
            };
        })(this)).join(',');
    };

    elePostion.getPercent = function (percent) {
        var p;
        p = Math.round(percent * 10000) / 100;
        if (p === 0) {
            p = '< 0.01';
        }
        return p;
    };

    elePostion.filterProtocol = function (url) {
        var index;
        if (!url) {
            return "";
        }
        index = url.indexOf("://");
        if (index === -1) {
            return url;
        }
        return url.substring(index + 3);
    };

    elePostion.isEmptyData = function (data, chartType) {
        if (!data || data.length === 0) {
            return true;
        }
        if (chartType === 'line') {
            if (data.length === 1 && data[0].data.length === 1) {
                if (data[0].data[0].x === void 0 && data[0].data[0].y === void 0) {
                    return true;
                }
            }
        }
        if (chartType === 'bar') {
            if (data.length === 1 && data[0].data.length === 1) {
                if (data[0].data[0].length === 0) {
                    return true;
                }
            }
        }
        return false;
    };

    elePostion.isVisible = function (dom) {
        if (this.css(dom, 'display') !== 'none' && this.css(dom, 'visibility') !== 'hidden' && this.isParentVisible(dom)) {
            if (dom.offsetParent) {
                return true;
            }
            if (this.css(dom, 'position') === 'fixed' || dom.tagName === 'svg') {
                return true;
            }
        }
        return false;
    };

    elePostion.isParentVisible = function (dom) {
        var pnode;
        pnode = dom.parentNode;
        while (pnode.tagName !== 'BODY') {
            if (this.css(pnode, 'display') === 'none' || this.css(pnode, 'height') === '0px' || this.css(pnode, 'width') === '0px') {
                return false;
            }
            pnode = pnode.parentNode;
        }
        return true;
    };

    elePostion.scrollTop = function () {
        return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    };

    elePostion.scrollLeft = function () {
        return document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    };

    elePostion.processText = function (text) {
        if (text && text.length > 50) {
            text = text.substr(0, 50) + '...'
        }
        return text;
    };
    elePostion.boxPosition = function (elem, blo) {
        var boxW = 420
        var boxH = 330
        var num = 4

        if (blo === 'debug') {
            boxW = 260
            boxH = 270
            num = 4
        }
        var top = this.offsetTop(elem)
        var left = this.offsetLeft(elem)
        var width = this.width(elem)
        var height = this.height(elem)
        var bodyW = this.width(document.body)
        var bodyH = this.height(document.body)
        var boxLeft = left
        var boxTop = top - boxH - num
        if (boxLeft + boxW > bodyW) {
            boxLeft = left - boxW + width
            if (boxLeft < 0) {
                boxLeft = left + width / 2 + num
            }

        }
        if (boxTop + boxH + num > bodyH) {
            boxTop = top - boxH - num
        }
        if (boxTop < 0) {
            boxTop = top + height + num
        }
        var elem_position = {
            top: boxTop,
            left: boxLeft,
        }
        return elem_position
    }

    return elePostion;

})();
export default elePostion