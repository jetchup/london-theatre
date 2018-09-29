import React, { Component } from 'react';
import { Fragment } from 'react';
import { Marker, InfoWindow} from "react-google-maps";
import theatre from './img/london-coliseum-view-from-t.jpg'
import customIcon from './img/custom-marker.svg'

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
  }

  // Display the theatres corresponding to the markers clicked
  onShowTheatreInfo(name) {
    let currentElement = document.getElementById(name)
    this.state.isOpen? (
      (currentElement.style.display="block", currentElement.setAttribute('aria-hidden', 'false'))
    ) : (currentElement.style="none", currentElement.setAttribute('aria-hidden', 'true'))
  }

    // ----this helped a lot: https://github.com/tomchentw/react-google-maps/issues/753


  render() {
    return (
      <Fragment>
      {this.props.state.markerPosition.map((marker, index) =>{
        let name = marker[0][3]
        if (this.props.targetId) {

          // checking if this is the marker of the clicked theatre
          if (name === this.props.targetId) {
            console.log(name, this.props.targetId)
            let whereabouts = [marker[0][0], marker[0][1]]

            //Icon made by https://www.flaticon.com/free-icon/map-marker_33622 from www.flaticon.com

            return (
              <Marker
                key={'Marker' + index}
                onClick={()=>{ this.onToggleOpen(index, name), this.onShowTheatreInfo(name)} }
                position={{ lat: marker[0][0], lng: marker[0][1] }}
                options={{icon: customIcon}}
              >
                <InfoWindow onCloseClick={()=>{ this.onToggleOpen(index, name), this.onShowTheatreInfo(name)} }>
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
              </InfoWindow>
            </Marker>
          )
          }
        }
        return (
        <Marker
            key={'Marker' + index}
            onClick={()=>{ this.onToggleOpen(index, name), this.onShowTheatreInfo(name)} }
            position={{ lat: marker[0][0], lng: marker[0][1] }}
        >
          { (this.state.isOpen && this.state.showInfoIndex === index)&& <InfoWindow onCloseClick={()=>{ this.onToggleOpen(index, name), this.onShowTheatreInfo(name)} }>
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
    })}
      </Fragment>
    )
  }
}
export default CreateMarker;
