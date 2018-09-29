import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import CreateMarker from './CreateMarker.js'
const { compose } = require("recompose");



let result = [];

class Map extends Component {

  state = {
    venueInfo: 'https://api.londontheatredirect.com/rest/v2/Venues/',
    venues: [],
    markerPosition: [],
    map: [],
  }

  componentDidMount() {
    // fetch the venues from londontheatredirect
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


    this.waitForGoogle()
  }
  // -------------
  //  iterate through the venues
  // -------------
  venueIterator(responseInfo) {
    console.log('... retrieving venues')
    if (responseInfo) {

      document.getElementById("api-handling").style.display = "none";
      document.getElementById("api-handling").setAttribute('aria-hidden', 'true');
      const venueInfo = Object.values(responseInfo).map(value => value.map(venue => venue))
      const venueValues = []

    // -------------
    //  get their information: I just use their address, name, and info from the request
    // -------------
    function createVenue() {
      for(let i in venueInfo[0]) {

        if (venueInfo[0][i].Info !== null) {
          venueValues.push([Address(i), Name(i), Info(i), Image(i)])
        }
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

    function Image(i) {
      if (venueInfo[0][i].ImageUrl){
        const image = venueInfo[0][i].ImageUrl
        return image
      }
    }

    createVenue()
    // set venue values in state
    this.setState({venues: venueValues})

    this.props.getVenueInfo(this.state.venues.slice(10, 20))
    }
  }

  // initialize Geocoding services
  waitForGoogle = (geocoder, map) => { !window.google?  (
      console.log('waiting for google'),
      setTimeout(this.waitForGoogle, 100)
    ) : (
      console.log('google is loaded'),
      geocoder = new window.google.maps.Geocoder(),
      map = window.google.maps.Map,

      this.setState({map: map}),
      // pass results to be decoded
      this.geocodeAddress(geocoder)

    )
  }

  displayWaiting() {
    // We show the modal stating we are loading venues
    return (document.getElementById("api-handling").style.display = "block",
    document.getElementById("api-handling").setAttribute('aria-hidden', 'false'))
  }
  // implement markers from venue addresses
  geocodeAddress = (geocoder) => {
    this.state.venues.length === 0? (this.displayWaiting(), setTimeout(this.geocodeAddress, 1000)):
    this.state.venues.slice(10, 20).map((venue) =>  // I HAD TO DO THIS TO AVOID GOOGLE API ERROR FOR TOO MANY REQUESTS

    {
      const address = venue[0]
      const name = venue[1]
      const that = this

      this.getAddress(geocoder, address, name, that)
    })
  }

  getAddress(geocoder, address, name, that) {
    if (address) {
      // ------------------
      //here is the handy code for geocode markers from google developers
      // ------------------
      geocoder = new window.google.maps.Geocoder();

      geocoder.geocode( { 'address': address, 'region': 'uk'}, function(results, status) {
        if (status === 'OK') {
          result.push([[results[0].geometry.location.lat(), results[0].geometry.location.lng(), address, name]])
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
        that.setState({ markerPosition: result})
      });
    }
  }


  render() {
    // variables from react-google-maps
    const MapWithAMarkerClusterer = compose(
    withScriptjs,
    withGoogleMap
  )(props =>
      <GoogleMap
        defaultZoom={this.props.mapZoom}
        defaultCenter={this.props.mapCenter}
      >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
        <CreateMarker state={this.state} />

        </MarkerClusterer>
      </GoogleMap>
  );

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
