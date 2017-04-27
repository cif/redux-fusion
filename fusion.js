'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

var _rxjs = require('rxjs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (propStream$) {
  return function (StreamedComponent) {
    var ComponentFromStream = function (_React$Component) {
      _inherits(ComponentFromStream, _React$Component);

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
          var store = this.context.store;

          return (0, _react.createElement)((0, _recompose.mapPropsStream)(propStream$(_rxjs.Observable.from(store), store.dispatch))(StreamedComponent));
        }
      }]);

      return ComponentFromStream;
    }(_react2.default.Component);

    ComponentFromStream.contextTypes = {
      store: function store(props, propName) {
        // custom validation via Observable.from
        try {
          _rxjs.Observable.from(props[propName]);
        } catch (e) {
          return;
          'fuse() error: context.store must implement observable'; // eslint-disable-line
        }
        return null;
      }
    };

    return ComponentFromStream;
  };
};