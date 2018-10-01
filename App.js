import React, { Component } from 'react';
import { Fragment } from 'react';
import escapeRegExp from 'escape-string-regexp'
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
    searchWord: '',
    targetId: '',
    filteredTheatres: [],
    GoogleMapFunction: null
  }

  // gets data from GoogleMap.js
  getVenueInfo(venues) {
    this.setState({venueArray: venues})
  }

  recordChange(e) {
    this.inputFilter(e.target.value)
  }

  // filter if input
  inputFilter(inputValue) {
      return this.state.venueArray.filter(venue => {
        const name = venue[1]
        if (inputValue){
          const match = new RegExp(escapeRegExp(inputValue), 'i')
          match.test(name)?
            (console.log(inputValue, name),
            document.getElementById(name).style = "",
            document.getElementById(name).setAttribute('aria-hidden', 'false')
           ):(
            document.getElementById(name).style.display = "none",
            document.getElementById(name).setAttribute('aria-hidden', 'true')
          )
        } else {
          document.getElementById(name).style = "",
          document.getElementById(name).setAttribute('aria-hidden', 'false')
        }
    })
  }


  // creates the html nodes from venue api data
  displayVenues(){

    const listTheaters = this.state.venueArray.map((venue, index) =>{
      const address = venue[0]
      const name = venue[1]
      let image = venue[3]

      if (image === undefined) {
        image = theatre
      }
        return (
          <div className='theatre-container'
            id={name}
            aria-hidden="false"
            key={'venue'+index}
            onClick={
              (e) => {
                this.clickedTheatre(e),
                e.target.parentNode.parentNode.classList.toggle("to-side")
              }
            }>
            <div className='image-container'>
              <img alt={'photo of ' + name} id='{theatre}' className='theatre-picture' src={theatre} />
            </div>
            <div className='theatre-info'>
              <p className="name">{name}</p>
              <hr />
              <p className="address">{address}</p>
            </div>
          </div>
        )

    })
    return listTheaters
  }

  referenceFunction = (e) => {
    this.setState({GoogleMapFunction: e})
  }

  clickedTheatre = (e) => {
    this.setState({
      targetId: e.target.parentNode.parentNode.id,
    }, () => {
      // refer to the function on googlemap.js,
      console.log(this.state.targetId),
      this.state.GoogleMapFunction.passPosition()
    }
  )}


  render() {

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <h1 className="App-title"><span className='london'>London</span><span className='theatre'>Theatre</span></h1>
            <div className='intro'>
              <p>Search for your favourite theatre</p>
              <input aria-label='enter theatre name' id='enter-address' onChange={(e) => {this.recordChange(e)}}/>
            </div>
          </div>
        </header>
        <main>
         <div id='map' style={{ width:'95%'}}>
         <GoogleMap ref={this.referenceFunction} targetId={this.state.targetId} getVenueInfo={this.getVenueInfo.bind(this)} newDecodedAddress={this.state.newDecodedAddress}/>
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
