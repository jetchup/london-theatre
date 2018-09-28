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

  // -----------------------
  // Address via browser´s geolocation
  // -----------------------
  watchID() {
    const that = this
    navigator.geolocation.watchPosition(function(position) {
      that.toLondon(position.coords.latitude, position.coords.longitude)
      //that.setState({mapCenter: {lat: lat, lng: lng}})

    })
  }

  // Calculate distance to london, from https://stackoverflow.com/questions/30533351/filter-list-of-cities-with-latitude-and-longitude-on-given-distance-from-another
  toLondon(lat, lng) {
    const that = this

    var cities = [
    ['London', 51.5074, 0.1278],
    ['Your Location', lat, lng]
    ];

    var dist = calculateDistance(cities[0][1], cities[0][2], cities[1][1], cities[1][2], 'K');
    that.setState({mapCenter: {lat: lat, lng: lng}})
    if (dist > 20) {
      document.getElementById("modal").style.display = "block";
    }

    function calculateDistance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var radlon1 = Math.PI * lon1 / 180
        var radlon2 = Math.PI * lon2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist
    }
  }

  // -----------------------
  // This is the address you got from the user´s imput
  // -----------------------

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

  //--------------- Return to London after using coordinates too far away
  goLondon() {
    this.setState({mapCenter: {lat: 51.5074, lng: 0.1278}})
    document.getElementById("modal").style.display = "none";
  }

  render() {
    this.watchID()

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <h1 className="App-title"><span className='london'>London</span><span className='theatre'>Theatre</span></h1>
            <div className='intro'>
              <p>Find theatres next to you</p>
              <input className='enter-address' onFocus={this.eraseText}/>
              <button onClick={this.getAddress}>Find theatres</button>
            </div>
          </div>
        </header>
        <main>
         <div id='map' style={{height: 'calc(100vh / 1.5)', width:'95%'}}>
         <Test mapCenter={this.state.mapCenter} mapZoom={this.state.mapZoom} getVenueInfo={this.getVenueInfo.bind(this)} newDecodedAddress={this.state.newDecodedAddress}/>
         </div>
          <div className='theatres'>
            {this.displayVenues()}
          </div>
          <div id='modal'>
          <div id='modal-content'>
            <div className='attention'>
              <p>Would you like to go to London?</p>
              <button onClick={this.goLondon.bind(this)}>yes, go to London</button>
            </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
