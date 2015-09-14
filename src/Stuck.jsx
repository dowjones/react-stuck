/* global window */

var React = require('react'),
  ReactDOM = require('react-dom'),
  PureRenderMixin = require('react-addons-pure-render-mixin'),
  throttle = require('lodash/function/throttle'),
  offset = require('dom-helpers/query/offset'),
  on = require('dom-helpers/events/on'),
  off = require('dom-helpers/events/off');

module.exports = React.createClass({
  displayName: 'Stuck',

  propTypes: {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    height: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
    top: React.PropTypes.number
  },

  mixins: [PureRenderMixin],

  getDefaultProps: function () {
    return {
      top: 0,
      style: {}
    };
  },

  getInitialState: function () {
    this._offsets = {};
    return {
      className: 'stuck-top'
    };
  },

  componentDidMount: function () {
    this._throttledUpdateOffsets = this._getThrottledUpdateOffsets();
    on(window, 'scroll', this._updateClass);
    on(window, 'scroll', this._throttledUpdateOffsets);
    this.componentWillReceiveProps(this.props);
  },

  componentWillReceiveProps: function (nextProps) {
    this._updateOffsets(nextProps);
    this._updateClass();
  },

  componentWillUnmount: function () {
    off(window, 'scroll', this._updateClass);
    off(window, 'scroll', this._throttledUpdateOffsets);
  },

  _getThrottledUpdateOffsets: function () {
    function update() {
      this._updateOffsets(this.props);
    }
    return throttle(update.bind(this), 500);
  },

  _updateOffsets: function (nextProps) {
    var containerNode = ReactDOM.findDOMNode(this),
      stuckNode = ReactDOM.findDOMNode(this.refs.stuck),
      top = offset(containerNode).top,
      bottom = top + nextProps.height - stuckNode.offsetHeight;

    this._offsets = {
      top: top - nextProps.top,
      bottom: bottom - nextProps.top
    };
  },

  _updateClass: function () {
    var pageYOffset = window.pageYOffset, c;
    if (pageYOffset <= this._offsets.top) c = 'stuck-top';
    else if (pageYOffset >= this._offsets.bottom) c = 'stuck-bottom';
    else if (pageYOffset > this._offsets.top) c = 'stuck';
    this.setState({className: c});
  },

  _getStyleByClass: function (className) {
    switch (className) {
      case 'stuck':
        return {
          position: 'fixed',
          top: this.props.top
        };
      case 'stuck-bottom':
        return {
          position: 'absolute',
          top: this._offsets.bottom + this.props.top
        };
      default:
        return {
          // need 'inline-block' to accurately calculate
          // the height (with margins) of the `props.children`
          display: 'inline-block'
        };
    }
  },

  render: function () {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div ref="stuck"
            style={this._getStyleByClass(this.state.className)}
            className={this.state.className}>
          {this.props.children}
        </div>
      </div>
    );
  }
});
