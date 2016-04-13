'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils  from 'react-addons-test-utils';
import jsdomify from 'jsdomify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.setState({ clicked: true });
  }

  render() {
    return (
      <div>
        <h4>test unit</h4>
        <button onClick={this.onChange} clickIn={this.state.clicked}>click</button>
      </div>
    );
  }
};

describe('test react', function () {

  beforeEach(function () {
    jsdomify.create();
    jest.unmock(App);
  });

  after(function () {
    jsdomify.destroy();
  });

  describe('test', function () {
    it('something', function () {
      const app = ReactTestUtils.createRenderer();
      app.render(<App />);

      const appRender = ReactTestUtils.renderIntoDocument(<App />);
      const appNode = ReactDOM.findDOMNode(app);
      
      ReactTestUtils.Simulate.click(
        ReactTestUtils.findRenderedDOMComponentWithTag(appNode, 'button')
      );

      const appOutput = app.getRenderOutput();

      expect(appOutput.props.children[1].props.clickIn).toEqual(true);
    });
  });

  // describe('testing app component', function () {
  //   it('should return true', function () {
  //     const app = ReactTestUtils.createRenderer();
  //     app.render(<App />);

  //     ReactTestUtils.Simulate.click(
  //       ReactTestUtils.findRenderedDOMComponentWithTag(app, 'button')
  //     );

  //     const appOutput = app.getRenderOutput();

  //     console.log(appOutput);
  //     expect(appOutput.props.clickIn).to.equal(true);
  //   });
  // });

});