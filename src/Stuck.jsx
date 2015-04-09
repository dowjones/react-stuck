/* global window */
/** @jsx React.DOM */

var React = require('react/addons'),
  PureRenderMixin = React.addons.PureRenderMixin,
  throttle = require('lodash/function/throttle'),
  offset = require('dom-helpers/query/offset'),
  on = require('dom-helpers/events/on'),
  off = require('dom-helpers/events/off'),
  Stuck;

module.exports = Stuck = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    top: React.PropTypes.number,
    height: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      top: 0
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

  componentWillUnmount: function () {
    off(window, 'scroll', this._updateClass);
    off(window, 'scroll', this._throttledUpdateOffsets);
  },

  componentWillReceiveProps: function (nextProps) {
    this._updateOffsets(nextProps);
    this._updateClass();
  },

  render: function () {
    return (
      <div className={this.props.className}>
        <div ref='stuck'
            style={this._getStyleByClass(this.state.className)}
            className={this.state.className}>
          {this.props.children}
        </div>
      </div>
    );
  },

  _getThrottledUpdateOffsets: function () {
    function update() { this._updateOffsets(this.props); }
    return throttle(update.bind(this), 500);
  },

  _updateOffsets: function (nextProps) {
    var containerNode = React.findDOMNode(this),
      stuckNode = React.findDOMNode(this.refs.stuck),
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
  }
});
