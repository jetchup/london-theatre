import React, { Component } from 'react';
import { Fragment } from 'react';
import { Marker, InfoWindow} from "react-google-maps";
import theatre from './img/london-coliseum-view-from-t.jpg'
import customIcon from './img/custom-marker.svg'

class CreateMarker extends Component {

  state = {
    isOpen: false,
    showInfoIndex: '',
  }

  onToggleOpen(index, name) {
    this.setState({
      isOpen: !(this.state.isOpen),
      showInfoIndex: index
    })
  }

  constructMarker() {
    return (this.props.state.markerPosition.map((marker, index) =>{
      let name = marker[0][3]
      let positionMarker = { lat: marker[0][0], lng: marker[0][1] }

      return (
      <Marker
          key={'Marker' + index}
          onClick={()=>{ this.onToggleOpen(index, name)} }
          position={{ lat: marker[0][0], lng: marker[0][1] }}
          animation= {window.google.maps.Animation.DROP}
      >
        { (this.state.isOpen && this.state.showInfoIndex === index)&& <InfoWindow onCloseClick={()=>{ this.onToggleOpen(index, name)} }>
       <div className='theatre-container-infobox'
          onClick={()=>{ document.getElementById(name).scrollIntoView() } }
        >
          <div className='image-container-infobox'>
            <img alt='theatre' id='{theatre}' className='theatre-picture-infobox' src={theatre} />
          </div>
          <div className='theatre-info-infobox'>
            <p className="name-infobox">{marker[0][3]}</p>
            <hr />
            <p className="address-infobox">{marker[0][2]}</p>
          </div>
        </div>
      </InfoWindow>}
    </Marker>)
  })
  )
  }

    // ----this helped a lot: https://github.com/tomchentw/react-google-maps/issues/753
  render() {
    return (
      <Fragment>
        {this.constructMarker()}
      </Fragment>
    )
  }
}
export default CreateMarker;
