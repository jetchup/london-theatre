import React, { Component } from 'react';
import { Fragment } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps";
import ReactGoogleMapLoader from "react-google-maps-loader";
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
    mapCenter: {lat: 51.5074, lng: 0.1278},
    mapZoom: 8,
    filteredPosition: []
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
        document.getElementsByClassName('attention')[0].children[0].innerText = 'Error connecting to London Theatres server'
        document.getElementsByClassName('attention')[0].children[0].style.display = "block"
        document.getElementsByClassName('attention')[0].children[0].setAttribute('aria-hidden', 'false')
        throw new Error('Something went wrong on api server!')
      }
    })
    .then(responseInfo => this.venueIterator(responseInfo))
    .catch(error => {
      console.log(error, ' error happened on the second instance of the request'),
      document.getElementsByClassName('attention')[0].children[0].innerText = 'Error connecting to London Theatres',
      document.getElementsByClassName('attention')[0].children[0].style.display = "block",
      document.getElementsByClassName('attention')[0].children[0].setAttribute('aria-hidden', 'false')
    })


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

      this.getAddress(geocoder, address, name)
    })
  }

  getAddress(geocoder, address, name, that) {
    if (address) {
      const that = this
      // ------------------
      //here is the handy code for geocode markers from google developers
      // ------------------
      geocoder = new window.google.maps.Geocoder();

      geocoder.geocode( { 'address': address, 'region': 'uk'}, function(results, status) {
        if (status === 'OK') {
          let newMarker = [[results[0].geometry.location.lat(), results[0].geometry.location.lng(), address, name]]

          result.push(newMarker)



        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
        that.setState({ markerPosition: result})
      });
    }
  }

  passPosition(match) {
    this.state.markerPosition.map((marker, index) =>{
      let name = marker[0][3]
      let positionMarker = { lat: marker[0][0], lng: marker[0][1] }

      // if we clicked on one theatre
      if (this.props.targetId) {

        // checking if this is the marker of the clicked theatre
        if (name === this.props.targetId) {
          this.setState({
            mapZoom: 18,
            mapCenter: positionMarker
          })
        }}
      })
  }

  filterMarkers(match) {
    const allMarkers = this.state.markerPosition
    // let's filter the markers
    if (match) {
      let filteredMarkers = allMarkers.filter(marker =>
        match.test(marker[0][3])
      )
      this.setState({filteredPosition: filteredMarkers})
    }  else {
      this.setState({filteredPosition: []})
    }
  }


  render() {
    // variables from react-google-maps
    const MapWithAMarkerClusterer = compose(
    withScriptjs,
    withGoogleMap
  )(props =>
      <GoogleMap
        defaultZoom={this.state.mapZoom}
        defaultCenter={this.state.mapCenter}
      >
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
        <CreateMarker state={this.state} props={this.props}/>

        </MarkerClusterer>
      </GoogleMap>
  );

  return (
    <Fragment>
    {(MapWithAMarkerClusterer)?
      (<MapWithAMarkerClusterer
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXHssNaFm57yh0sOVvfmjp8VkfiPTW7yY&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: 'calc(100vh / 2)' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />):(
      document.getElementsByClassName('attention')[0].children[0].innerText = 'Error loading Google Maps',
      document.getElementsByClassName('attention')[0].children[0].style.display = "block",
      document.getElementsByClassName('attention')[0].children[0].setAttribute('aria-hidden', 'false')
    )}

    {/* Handle Google Maps error  */}
    <ReactGoogleMapLoader
    params={{
        key: 'AIzaSyBXHssNaFm57yh0sOVvfmjp8VkfiPTW7yY', // Define your api key here
    }}
    render={(googleMaps, error) =>
        googleMaps ? (
            <div>
                {/*Show a custom error if SDK Authentication Error. See N/B 2 below.*/}
                {error ? error : ""}
            </div>
        )   :   (
            <div>
                {/*Check for network error so loading state ends if user lost connection.*/}
                {error === "Google Maps Network Error" ? <p>{error}</p> : <p>isLoading...</p>}
            </div>
        )
    }/>
    </Fragment>
  )

  }
}
export default Map;
