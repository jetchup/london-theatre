import React, { Component } from 'react';
import { Marker } from "react-google-maps";


let result = [];

class Markers extends Component {
  state = {
    markerPosition: []
  }

  // -------------
  //  make the markers
  // -------------
  componentDidMount() {
    if (window.google) {
      var geocoder = new window.google.maps.Geocoder()
      var map = window.google.maps.Map

      if (this.props.venues){
        this.geocodeAddress(geocoder, map)
      }
    }
  }

  // implement markers from venue addresses
  geocodeAddress(geocoder, map) {
    const venues = this.props.venues.slice(10, 12); // I HAD TO DO THIS TO AVOID GOOGLE API ERROR FOR TOO MANY REQUESTS
    console.log(venues)
    venues.map(venue => individualVenue(venue))
    const that = this

    function individualVenue(venue) {
      const address = venue[0]
      const name = venue[1]
      const info = venue[2]
      console.log(address, name, info)

      if (address) {
        // ------------------
        //here is the handy code for geocode markers from google developers
        // ------------------
        geocoder = new window.google.maps.Geocoder();

          geocoder.geocode( { 'address': address, 'region': 'uk'}, function(results, status) {
            if (status === 'OK') {
              //map.setCenter(results[0].geometry.location);
              var marker = new window.google.maps.Marker({
                  position: results[0].geometry.location
              });
              result.push([[results[0].geometry.location.lat()], [results[0].geometry.location.lng()]])
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
            that.setState({ markerPosition: result})
          });
      }
    }
  }


  returningDivs() {
    console.log(Object.values(this.state.markerPosition).map((object, index) => console.log(   object[0][0], object[1][0]  ) ))
    return (Object.values(this.state.markerPosition).map((object, index) => <Marker key={index}  position={{ lat:  object[0][0], lng: object[1][0] }} />))
    //return Object.values(this.state.markerPosition).map((object, index) => <Marker key={index}  position={{ lat:  object[0][0], lng: object[1][0] }} />)

    // if (positions[0] && positions[1]) {
    //   if (positions[0].props && positions[1].props){
    //     console.log(positions[0].props.position)
    //     return ( positions )
    //   }
    // }

    //return (JSON.stringify(Object.values(this.state.markerPosition).map(object => <Marker position={object} />)))
  }

  render() {
    console.log(this.returningDivs())
    const returnDivs = this.returningDivs()

    return (
      {/*<div>{Object.values(this.state.markerPosition).map((object, index) => <Marker key={index}  position={{ lat:  object[0][0], lng: object[1][0] }} />)}</div>*/}
      <React.Fragment>
        {returnDivs}
      </React.Fragment>
    )
  }
}
export default Markers;
