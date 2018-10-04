import React, { Component } from 'react';
import { Fragment } from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import Markers from './Markers.js'



class Map extends Component {

  state = {
    venueInfo: 'https://api.londontheatredirect.com/rest/v2/Venues/',
    venues: [],
  }

  componentDidMount() {
    // fetch the venues from londontheatredirect
    var request = new XMLHttpRequest();

    fetch('https://api-sandbox.londontheatredirect.com/rest/v2/Venues', {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        headers: {
          'Api-Key': 'jytxx2cbjne3w8sqsgbe9be6',
          'Content-Type': 'application/json'
        }})
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Something went wrong on api server!')
      }
    })
    .then(responseInfo => this.venueIterator(responseInfo))
    .catch(error => console.log(error, ' error happened on the second instance of the request'))

  }

  // -------------
  //  iterate through the venues
  // -------------
  venueIterator(responseInfo) {
    if (responseInfo) {
      const venueInfo = Object.values(responseInfo).map(value => value.map(venue => venue))
      const venueValues = []
    // -------------
    //  get their information: I just use their address, name, and info from the request
    // -------------
    function createVenue() {
      for(let i in venueInfo[0]) {
        venueValues.push([Address(i), Name(i), Info(i)])
      }
    }
      function Address(i) {
          if (venueInfo[0][i].Address){
            const address = venueInfo[0][i].Address
            return address
          }
        }
      function Name(i) {
          if (venueInfo[0][i].Name){
            const name = venueInfo[0][i].Name
            return name
          }
        }
      function Info(i) {
          if (venueInfo[0][i].Info){
            const info = venueInfo[0][i].Info
            return info
          }
        }

    createVenue()
    // set venue values in state
    this.setState({venues: venueValues})
    return venueValues
    }
  }



  render() {

    console.log(this.state, this.props)
    // variables from react-google-maps
    const MapWithAMarkerClusterer = withScriptjs(withGoogleMap(props =>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: 51.5074, lng: 0.1278 }}
        >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
        >
          <Markers venues={this.state.venues}/>
        </ MarkerClusterer>
        </GoogleMap>
    ));
    console.log(this.state)

    return (
        <MapWithAMarkerClusterer
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXHssNaFm57yh0sOVvfmjp8VkfiPTW7yY&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: 'calc(100vh / 2)' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    )
  }
}

export default Map;
