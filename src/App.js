import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import theatre from './img/london-coliseum-view-from-t.jpg'
import GoogleMap from './GoogleMap.js'
import './App.css';


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


          // Change marker's visibility: refer to the function on googlemap.js,
          this.state.GoogleMapFunction.filterMarkers(match)


          match.test(name)?(
            // Change the theatre list's visibility
            document.getElementById(name).style = "",
            document.getElementById(name).setAttribute('aria-hidden', 'false')
           ):(
            // Change the theatre list's visibility
            document.getElementById(name).style.display = "none",
            document.getElementById(name).setAttribute('aria-hidden', 'true')
          )
        } else {
          // Change the theatre list's visibility
          document.getElementById(name).style = ""
          document.getElementById(name).setAttribute('aria-hidden', 'false')
          // Change marker's visibility: refer to the function on googlemap.js,
          this.state.GoogleMapFunction.filterMarkers()
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
            tabIndex="0"
            key={'venue'+index}
            onClick={
              (e) => {
                this.clickedTheatre(e)
              }
            }
            onKeyPress={
              (e) => {
                this.keyedTheatre(e)
              }
            }
            >
            <div className='image-container'>
              <img alt={'photo of ' + name} className='theatre-picture' src={theatre} />
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

  keyedTheatre = (e) => {
    if (e.key === 'Enter') {
      e.target.classList.toggle("to-side")
      this.setState({
        targetId: e.target.parentNode.parentNode.id,
      }, () => {
        // refer to the function on googlemap.js,
        this.state.GoogleMapFunction.passPosition()
      })
    }
  }

  clickedTheatre = (e) => {
    e.target.parentNode.parentNode.classList.toggle("to-side")
    this.setState({
      targetId: e.target.parentNode.parentNode.id,
    }, () => {
      // refer to the function on googlemap.js,
      this.state.GoogleMapFunction.passPosition()
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
              <input aria-label='enter theatre name' id='enter-address' onChange={(e) => {this.recordChange(e)}}/>
            </div>
          </div>
        </header>
        <main>
         <div id='map' aria-role='application'>
         <GoogleMap ref={this.referenceFunction} targetId={this.state.targetId} getVenueInfo={this.getVenueInfo.bind(this)} newDecodedAddress={this.state.newDecodedAddress}/>
         </div>
          <div className='theatres' tabIndex="0">
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
        <footer>Background image by Gjon Mili. Theatre data from londontheatredirect.com</footer>
      </div>
    );
  }
}

export default App;
