import React, { Component } from 'react';
import { Fragment } from 'react'
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"


let result = [];
let infoWindowOpen = true;

class Map extends Component {

  state = {
    venueInfo: 'https://api.londontheatredirect.com/rest/v2/Venues/',
    venues: [],
    markerPosition: [],
    map: []
  }

  componentDidMount() {
    // fetch the venues from londontheatredirect
    //var request = new XMLHttpRequest();

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



  waitForGoogle = (geocoder, map) => { !window.google?  (
      console.log('waiting for google'),
      setTimeout(this.waitForGoogle, 100)
    ) : (
    console.log(this.state),
      console.log('google is loaded'),
      geocoder = new window.google.maps.Geocoder(),
      map = window.google.maps.Map,

      this.setState({map: map}),

      this.geocodeAddress(geocoder)

    )
  }


  // implement markers from venue addresses
  geocodeAddress = (geocoder) => {
    this.state.venues.length === 0? (console.log('no venues found, waiting...'), setTimeout(this.geocodeAddress, 1000)):
    this.state.venues.slice(10, 20).map((venue) =>  // I HAD TO DO THIS TO AVOID GOOGLE API ERROR FOR TOO MANY REQUESTS

    {
      const address = venue[0]
      const name = venue[1]
      const that = this

      this.getAddress(geocoder, address, that)
    })
  }

  getAddress(geocoder, address, that) {
    if (address) {
      // ------------------
      //here is the handy code for geocode markers from google developers
      // ------------------
      geocoder = new window.google.maps.Geocoder();

      geocoder.geocode( { 'address': address, 'region': 'uk'}, function(results, status) {
        if (status === 'OK') {
          result.push([[results[0].geometry.location.lat(), results[0].geometry.location.lng()]])
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
        that.setState({ markerPosition: result})
      });
    }
  }

  drop() {
    if (window.google){
      return this.state.markerPosition.map((marker, index) =>
        <Fragment key={'Fragment' + index}>
         <Marker
          onClick={() => {this.handleMarker(marker)}}
          key={index}
          position={{ lat: marker[0][0], lng: marker[0][1] }}
          />

        </Fragment>
      )
    }
  }

  handleMarker(marker) {
    console.log(this.state.map)
    console.log(marker)
     const infowindow = new window.google.maps.InfoWindow({
          content: '<h1>Placeholder text InfoWindow</h1>'
        });


          // --------------------
          // https://stackoverflow.com/questions/12410062/check-if-infowindow-is-opened-google-maps-v3
          window.google.maps.InfoWindow.prototype.isOpen = function(map){

            console.log(map !== null && typeof map !== "undefined")
            return (map !== null && typeof map !== "undefined");
          }
          //--------------------------
    infowindow.open(this.state.map, marker);
    infowindow.isOpen(this.state.map)

    // let's show the infoWindow
    infoWindowOpen= true

  }

  render() {
    // variables from react-google-maps
    const MapWithAMarkerClusterer = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={this.props.mapZoom}
        defaultCenter={this.props.mapCenter}
      >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {this.drop()}
        </MarkerClusterer>
      </GoogleMap>
  ));

  return (
    <MapWithAMarkerClusterer
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXHssNaFm57yh0sOVvfmjp8VkfiPTW7yY&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: 'calc(100vh / 2)' }} />}
      containerElement={<div style={{ height: '100%' }} />}
      mapElement={<div style={{ height: `100%` }} />}
      visible = {true}
    />
  )

  }
}
export default Map;
