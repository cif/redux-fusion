'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _recompose = require('recompose');

var _rxjs = require('rxjs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (propStream$, StreamedComponent) {
  var ComponentFromStream = function (_Component) {
    _inherits(ComponentFromStream, _Component);

    function ComponentFromStream() {
      _classCallCheck(this, ComponentFromStream);

      return _possibleConstructorReturn(this, (ComponentFromStream.__proto__ || Object.getPrototypeOf(ComponentFromStream)).apply(this, arguments));
    }

    _createClass(ComponentFromStream, [{
      key: 'render',
      value: function render() {
        if (!this.context.store) {
          throw new Error('fuse() error: Missing Redux store in context.\n           Did you forget to <Provide> it?');
        }
        var store$ = _rxjs.Observable.from(this.context.store);
        return (0, _react.createElement)((0, _recompose.mapPropsStream)(propStream$(store$))(StreamedComponent));
      }
    }]);

    return ComponentFromStream;
  }(_react.Component);

  ComponentFromStream.contextTypes = {
    store: function store(props, propName, componentName) {
      // custom validation via Observable.from
      try {
        _rxjs.Observable.from(props[propName]);
      } catch (e) {
        return;
        'fuse() error: context.store must implement observable';
      }
      return null;
    }
  };

  return ComponentFromStream;
};