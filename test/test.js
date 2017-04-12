var mockChecker =  require('../build/index.js');
var assert = require('assert');

function addMockTip(names) {
    var addTipFun = function addTipFun(names) {
        window.mockTipNames = window.mockTipNames || {};
        names.map(function (name) {
            if (!window.mockTipNames[name]) {
                window.mockTipNames[name] = true;
            }
        });
        var mockTipEl = document.querySelector('.mock-tip-wrap');
        if (!mockTipEl) {
            mockTipEl = document.createElement('div');
            mockTipEl.className = 'mock-tip-wrap';
            mockTipEl.style.cssText = ['position: fixed', 'left: 10%', 'top: 50px', 'width: 80%', 'height: auto', 'background-color: #fff0c3', 'color: #f00', 'transition: transform .5s ease-out', 'transform: scale(1)'].join(';');
            document.body.appendChild(mockTipEl);
        }
        mockTipEl.style.transform = 'scale(1)';
        var names = [];
        for (var i in window.mockTipNames) {
            names.push(i);
        }

        var textContent = '页面上存在mock数据，字段名为' + names.join('、') + ',发布上线前请删除mock数据。';
        mockTipEl.textContent = textContent;
        setTimeout(function () {
            mockTipEl.style.transform = 'scale(0)';
        }, 3000);
    };
    var namesParam = '';
    var nameLen = names.length;
    names.map(function (name, index) {
        namesParam = '"' + name + '"';
        if (index != nameLen - 1) {
            namesParam + ',';
        }
    });
    return '(' + addTipFun.toString() + ')([' + namesParam + '])';
}
describe('mock checker test', function() {
    it('has mock data checker', function() {
        var source = 'mockTest';
        var output = mockChecker(source);
        assert.notEqual(output, source);
    })
    it('no mock data checker', function() {
        var source = 'otherTest';
        var output = mockChecker(source);
        var result = 'otherTest';
        assert.equal(output, result);
    })
})