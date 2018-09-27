import React, { Component } from 'react';
import { Fragment } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import theatre from './img/london-coliseum-view-from-t.jpg'

class CreateMarker extends Component {

  state = {
    isOpen: false,
    showInfoIndex: ''
  }



  onToggleOpen(index, name) {
    this.setState({
      isOpen: !(this.state.isOpen),
      showInfoIndex: index
    })

      console.log(this.state.isOpen, index)
  }

  onShowTheatreInfo(name) {
    console.log(this.state.isOpen)
    let showOpen= this.state.isOpen? document.getElementById(name).style.display="block" : document.getElementById(name).style="none"
  }

    // ----this helped a lot: https://github.com/tomchentw/react-google-maps/issues/753


  render() {

    return (
      <Fragment>
      {this.props.state.markerPosition.map((marker, index) =>{
        let name = marker[0][3]
        return (
        <Marker
            key={'Marker' + index}
            onClick={()=>{ this.onToggleOpen(index, name), this.onShowTheatreInfo(name), console.log(index)} }
            position={{ lat: marker[0][0], lng: marker[0][1] }}
        >
          { (this.state.isOpen )&& <InfoWindow onCloseClick={()=>{ this.onToggleOpen(index, name), this.onShowTheatreInfo(name)} }>
         <div className='theatre-container-infobox'
            onClick={()=>{ document.getElementById(name).scrollIntoView() } }
          >
            <div className='image-container-infobox'>
              <img id='{theatre}' className='theatre-picture-infobox' src={theatre} />
            </div>
            <div className='theatre-info-infobox'>
              <p className="name-infobox">{marker[0][3]}</p>
              <hr />
              <p className="address-infobox">{marker[0][2]}</p>
            </div>
          </div>
        </InfoWindow>}
      </Marker>)
    })}
      </Fragment>
    )
  }
}
export default CreateMarker;
