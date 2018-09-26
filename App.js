import React, { Component } from 'react';
import { Fragment } from 'react'
import headerImage from './img/gjon-mili-stroboscopic-09.jpg';
import theatre from './img/london-coliseum-view-from-t.jpg'
import Test from './TESTgooglemap.js'
import FindAddress from './FindAddress.js'
import './App.css';


let venueArrays= []
const addressField = document.getElementsByClassName('enter-address')

class App extends Component {
  state = {
    venueArray: [],
    addressFieldValue : [],
    mapCenter: {lat: 51.5074, lng: 0.1278},
    mapZoom: 8,
  }

  getVenueInfo(venues) {
    this.setState({venueArray: venues})
    // venues.map(venue => {
    //   let address = venue[0]
    //   let name = venue[1]
    //   let info = venue[2]
    //   venueArrays.push({address: address, name: name, info: info})
    // })


  }

  setStateVenues() {
    console.log(venueArrays)
    this.setState({venueArray: venueArrays})
  }

  displayVenues(){
    const listTheaters = this.state.venueArray.map((venue, index) =>{
      const address = venue[0]
      const name = venue[1]
      const info = venue[2]
      let image = venue[3]

      if (image === undefined) {
        image = theatre
      }

      return (
        <div id={name} key={'venue'+index} className='theatre-container' >
          <div className='image-container'>
            <img id='{theatre}' className='theatre-picture' src={theatre} />
          </div>
          <div className='theatre-info'>
            <p className="name">{name}</p>
            <hr />
            <p className="address">{address}</p>
          </div>
          <div  className='theatre-description'>
            <p dangerouslySetInnerHTML={{__html: info}} className="info"></p>
          </div>
        </div>
      )
    })
    return listTheaters
  }

  getAddress = (e) => {

      console.log(this.props)
    e.preventDefault()

    if (!addressField[0].value) {
      console.log('first enter an address')
      addressField[0].value = 'first enter an address'
    } else {
    console.log(addressField[0].value)

    this.newAddress(addressField[0].value)
    }
  }

  eraseText() {
    addressField[0].value = ''
  }

// -----------------------
// Taking the input field address and turning it to coordinates
// -----------------------

  newAddress = (address) => {
    const map= window.google.maps.Map
    let result= []
    const that = this

    if (address) {
      let geocoder = new window.google.maps.Geocoder();

      geocoder.geocode( { 'address': address, 'region': 'uk'}, function(results, status) {
        if (status === 'OK') {
          result.push([[results[0].geometry.location.lat(), results[0].geometry.location.lng()]])
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
        console.log(result[0][0])
        that.setState({
          mapCenter: {lat: result[0][0][0], lng: result[0][0][1]},
          mapZoom: 14
        })
      });
    }
  }


  render() {

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <h1 className="App-title"><span className='london'>London</span><span className='theatre'>Theatre</span></h1>
            <p className='intro'>Find theatres next to you</p>
              <div id='find-address'>
                <p>Enter address</p>
                <input className='enter-address' onFocus={this.eraseText}/>
                <button onClick={this.getAddress}>Find theatres</button>
              </div>
          </div>
        </header>
        <main>
         <div id='map' style={{height: 'calc(100vh / 2)', width:'75%'}}>
         <Test mapCenter={this.state.mapCenter} mapZoom={this.state.mapZoom} getVenueInfo={this.getVenueInfo.bind(this)} newDecodedAddress={this.state.newDecodedAddress}/>
         </div>
          <div className='theatres'>
            {this.displayVenues()}
      </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        </main>
      </div>
    );
  }
}

export default App;
