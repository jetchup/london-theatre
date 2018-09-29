import React, { Component } from 'react';
import { Fragment } from 'react';
import theatre from './img/london-coliseum-view-from-t.jpg'
import GoogleMap from './GoogleMap.js'
import './App.css';


let venueArrays= []
let futureMapCenter = {}

const addressField = document.getElementsByClassName('enter-address')

class App extends Component {
  state = {
    venueArray: [],
    addressFieldValue : [],
    mapCenter: {lat: 51.5074, lng: 0.1278},
    mapZoom: 8,
    searchWord: '',
    targetId: ''
  }

  // gets data from GoogleMap.js
  getVenueInfo(venues) {
    this.setState({venueArray: venues})
  }

  recordChange(e) {
    this.displayVenues(e.target.value)
  }

  // creates the html nodes from venue api data
  displayVenues(inputValue){
    const listTheaters = this.state.venueArray.map((venue, index) =>{
      const address = venue[0]
      const name = venue[1]
      let image = venue[3]

      if (image === undefined) {
        image = theatre
      }

      if (inputValue){

        if (name.includes(inputValue)) {
            document.getElementById(name).style = ""
            document.getElementById(name).setAttribute('aria-hidden', 'false');
        } else {
          document.getElementById(name).style.display = "none"
          document.getElementById(name).setAttribute('aria-hidden', 'true');
        }
      } else {
        return (
          <div aria-hidden="false" id={name} key={'venue'+index} className='theatre-container' onClick={(e) => {this.clickedTheatre(e)}}>
            <div className='image-container'>
              <img alt='theatre' id='{theatre}' className='theatre-picture' src={theatre} />
            </div>
            <div className='theatre-info'>
              <p className="name">{name}</p>
              <hr />
              <p className="address">{address}</p>
            </div>
          </div>
        )
      }

    })
    return listTheaters
  }


  clickedTheatre(e) {
    this.setState({
      targetId: e.target.parentNode.parentNode.id
    })

  }


  render() {

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <h1 className="App-title"><span className='london'>London</span><span className='theatre'>Theatre</span></h1>
            <div className='intro'>
              <p>Search for your favourite theatre</p>
              <input id='enter-address' onChange={(e) => {this.recordChange(e)}}/>
            </div>
          </div>
        </header>
        <main>
         <div id='map' style={{ width:'95%'}}>
         <GoogleMap targetId={this.state.targetId} mapCenter={this.state.mapCenter} mapZoom={this.state.mapZoom} getVenueInfo={this.getVenueInfo.bind(this)} newDecodedAddress={this.state.newDecodedAddress}/>
         </div>
          <div className='theatres'>
            {this.displayVenues()}
          </div>
          <div id='api-handling' aria-hidden="true">
            <div id='modal-content'>
              <div className='attention'>
                <p>Loading venues...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
