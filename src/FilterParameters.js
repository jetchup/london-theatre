import React, { Component } from 'react';
import { Fragment } from 'react';

class FilterParameters extends Component {
  state = {
    filterParameters: ''
  }

// -----------------------
// Taking the input field value to filter venues
// -----------------------

  getTheatre= () => {
    let input = document.getElementbyId('enter-address')
    input.setAttribute("onChange", this.printValue(input))
  }

  printValue(input) {
    console.log(input.value)
  }

  render() {
    this.getTheatre()
    console.log(this.props)
    return (
      <Fragment>
        {this.state.filterParameters}
      </Fragment>
    )
  }
}
export default FilterParameters;
