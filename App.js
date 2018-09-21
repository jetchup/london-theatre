import React, { Component } from 'react';
import { Fragment } from 'react'
import headerImage from './img/gjon-mili-stroboscopic-09.jpg';
import theatre from './img/london-coliseum-view-from-t.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons'
import Test from './TESTgooglemap.js'
import FindAddress from './FindAddress.js'
import './App.css';


let venueArrays= []
const addressField = document.getElementsByClassName('enter-address')

class App extends Component {
  state = {
    venueArray: [],
    addressFieldValue : [],
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
    const listTheaters = this.state.venueArray.map(venue =>{
      const address = venue[0]
      const name = venue[1]
      const info = venue[2]
      let image = venue[3]

      if (image === undefined) {
        image = theatre
      }

      return (
        <Fragment >
          <div className='image-container'>
            <img id='{theatre}' className='theatre-picture' src={theatre} />
          </div>
          <div className='theatre-info'>
            <p className="name">{name}</p>
            <hr />
            <p className="address">{address}</p>
          </div>
          <div  className='theatre-info'>
            <p dangerouslySetInnerHTML={{__html: info}} className="info"></p>
          </div>
        </Fragment>
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
    
    //this.props.geocodeAddress(null, null, addressField[0].value)
    }
  }

  eraseText() {
    addressField[0].value = ''
  }


  render() {
    console.log(venueArrays)
    console.log(this.displayVenues())

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
         <div id='map' style={{height: 'calc(100vh / 2)', width:'100%'}}>
         <Test getVenueInfo={this.getVenueInfo.bind(this)} />
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
