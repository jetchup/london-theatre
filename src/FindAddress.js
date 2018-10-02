import React, { Component } from 'react';


const addressField = document.getElementsByClassName('enter-address')

class FindAddress extends Component {

  state= {
    addressFieldValue : []
  }

  getAddress = (e) => {

      console.log(this.props)
    e.preventDefault()

    if (!addressField[0].value) {
      console.log('first enter an address')
      addressField[0].value = 'first enter an address'
    } else {
    console.log(addressField[0].value)
    console.log(this.state)
    //this.props.geocodeAddress(null, null, addressField[0].value)
    }
  }

  eraseText() {
    addressField[0].value = ''
  }

  getGeocoder(props) {
    console.log(props)
  }


  render() {
    return (
      <div></div>
    )
  }
}
export default FindAddress;
