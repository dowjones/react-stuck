var stub = require('sinon').stub,
  proxyquire = require('proxyquire'),
  React = require('react'),
  ReactDOM = require('react-dom'),
  TestUtils = require('react-addons-test-utils'),
  Stuck;

describe('Stuck', function () {
  var stuckComponent, offset, on, off;

  beforeEach(function () {
    offset = stub();
    on = stub();
    off = stub();

    Stuck = proxyquire('../src/Stuck.jsx', {
      'dom-helpers/query/offset': offset,
      'dom-helpers/events/on': on,
      'dom-helpers/events/off': off
    });

    offset.returns({top: 0, bottom: 100});
    window.pageYOffset = 0;

    stuckComponent = (
      <Stuck height={100}>
        <div style={{height: 10}}>container</div>
      </Stuck>
    );
  });

  it('add and clean-up scroll events', function () {
    var node = document.createElement('DIV');
    ReactDOM.render(stuckComponent, node);
    ReactDOM.unmountComponentAtNode(node);
    on.firstCall.args[2].should.equal(off.firstCall.args[2]);
  });

  it('should be in stuck-top by default', function () {
    checkClass(0, 'stuck-top');
  });

  it('should be in stuck when browser top reaches node', function () {
    checkClass(1, 'stuck');
  });

  it('should be in stuck-bottom when browser top reaches node', function () {
    var cnt, stuck, stuckNode;

    window.pageYOffset = 95;
    cnt = TestUtils.renderIntoDocument(stuckComponent);
    stuck = TestUtils.findRenderedDOMComponentWithClass(cnt, 'stuck');
    stuckNode = ReactDOM.findDOMNode(stuck);

    stuckNode.offsetHeight = 10;
    cnt.setProps({height: 99});

    stuckNode.className.should.match('stuck-bottom');
  });

  function checkClass(pageYOffset, cname) {
    var cnt, stuck;
    window.pageYOffset = pageYOffset;
    cnt = TestUtils.renderIntoDocument(stuckComponent);
    stuck = TestUtils.findRenderedDOMComponentWithClass(cnt, cname);
    ReactDOM.findDOMNode(stuck).className.should.match(cname);
  }
});
