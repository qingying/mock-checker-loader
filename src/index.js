var esprima = require("esprima");
var estraverse = require("estraverse");

function addMockTip(names) {
    var addTipFun = function(names) {
        window.mockTipNames = window.mockTipNames || {};
        names.map(function(name) {
            if (!window.mockTipNames[name]) {
                window.mockTipNames[name] = true;
            }
        })
        var mockTipEl = document.querySelector('.mock-tip-wrap');
        if (!mockTipEl) {
            mockTipEl = document.createElement('div');
            mockTipEl.className = 'mock-tip-wrap';
            mockTipEl.style.cssText = [
                'position: fixed',
                'left: 10%',
                'top: 50px',
                'width: 80%',
                'height: auto',
                'background-color: #fff0c3',
                'color: #f00',
                'transition: transform .5s ease-out',
                'transform: scale(1)'
            ].join(';');
            document.body.appendChild(mockTipEl);
        }
        mockTipEl.style.transform = 'scale(1)';
        var names = [];
        for (var  i in window.mockTipNames) {
            names.push(i);
        }

        var textContent = '页面上存在mock数据，字段名为' + names.join('、') + ',发布上线前请删除mock数据。';
        mockTipEl.textContent = textContent;
        setTimeout(function() {
            mockTipEl.style.transform = 'scale(0)';
        }, 3000)
    }
    var namesParam = '';
    var nameLen = names.length;
    names.map(function(name, index) {
        namesParam = '"' + name + '"';
        if (index != nameLen -1) {
            namesParam + ','
        }
    })
    return '(' + addTipFun.toString() +')([' + namesParam + '])'
}

function getQueryParam(query = '?') {
    var str = query.split('?')[1];
    var list = str.split('&');
    var params = {};
    list.map(function(item) {
        var key = item.split('=')[0];
        var value = item.split('=')[1] || true;
        params[key] = value
    })
    return params;
}
module.exports = function(source) {
    var query = getQueryParam(this && this.query);
    var ast = esprima.parse(source, { sourceType: 'script', jsx: true });
    var nodeTypes = {};
    var mockTip = '';
    var names = [];
    estraverse.traverse(ast, {
        enter: function(node) {
            var type = node.type;
            // console.log(node)
            // if (!nodeTypes[type]) {
            //   nodeTypes[type] = true;
            //   console.log(node.type);
            // }
            var regExp;
            if (query.match) {
                regExp = new RegExp(query.match);
            } else {
                regExp = new RegExp('mock|Mock|MOCK');
            }
            if (type == 'Identifier') {
                if ((query.completeMatch && node.name == query.match) || (!query.completeMatch &&regExp.test(node.name))) {
                    names.push(node.name)
                }
            }
        }
    })
    console.log(names);
    if (names.length) {
        mockTip = addMockTip(names);
        // console.log(mockTip)
    }
    return source + mockTip;
}