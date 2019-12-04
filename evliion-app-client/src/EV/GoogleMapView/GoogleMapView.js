import React, { useState, useEffect } from "react";
import {GoogleMap,withScriptjs,withGoogleMap,Marker,InfoWindow} from 'react-google-maps'

const GoogleMapView = props => {
  const [coordinates, setCoordinates] = useState([
    { name: "ABC (Pvt) LTd", lat: 52.53, lng: 13.3845921 },
    { name: "CDE (Pvt) LTd", lat: 54.53, lng: 14.3853495 },
    { name: "DFG (Pvt) LTd", lat: 56.53, lng: 15.3861756 },
    { name: "ABP (Pvt) LTd", lat: 48.0, lng: 16.3872163 },
    { name: "PSK (Pvt) LTd", lat: 39.5316215, lng: 17.3885574 },
    { name: "LSE (Pvt) LTd", lat: 42.5320399, lng: 18.3925807 },
    { name: "GOG (Pvt) LTd", lat: 52.1, lng: 19.3935785 },
  ]);
  const [selectedPlace,setSelectedPlace] = useState(null)

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{lat: 48.0, lng: 16.3872163 }}
    >
      {coordinates.map( (coordinate,index) => {
        return         <Marker key={index} position={{lat: coordinate.lat,lng: coordinate.lng}}
          onClick={ () => {
            setSelectedPlace(coordinate)
          }}
        
        />
      }
)}
{selectedPlace && (<InfoWindow
  position={{lat: selectedPlace.lat,lng: selectedPlace.lng}}
  onCloseClick={() => {
    setSelectedPlace(null)
  }}
>
  <div style={{width: "15vw"}}>
    <h2>{selectedPlace.name}</h2>
    <p>Description goes here</p>
  </div>
</InfoWindow>)}
    </GoogleMap>
  )

  // useEffect(() => {
  //   let isCancelled = false;

  //   let centerLat = 0;
  //   let centerLng = 0;

  //   if(!isCancelled){
  //     coordinates.forEach(
  //       coord => ((centerLat += coord.lat), (centerLng += coord.lng))
  //     );
  //     centerLat /= coordinates.length;
  //     centerLng /= coordinates.length;
  //     console.log({
  //       lat: Number(centerLat.toFixed(2)),
  //       lng: Number(centerLng.toFixed(2)),
  //     });
  //     setInitialCenter({
  //       lat: Number(centerLat.toFixed(2)),
  //       lng: Number(centerLng.toFixed(2)),
  //     });
  //   }
  
  //   return () => {
  //     isCancelled = true;
  //   };
  // }, [coordinates]);
};

const WrappedMap = withScriptjs(withGoogleMap(GoogleMapView))  
export default WrappedMap
// export default GoogleApiWrapper({
//   apiKey: "AIzaSyAYscCjPju-deY_MM2h5cy6GMw2pgpOARc",
// })(GoogleMapView);
