import React, { useState } from "react";
import {GoogleMap,withScriptjs,withGoogleMap,Marker,InfoWindow} from 'react-google-maps'
import "./GoogleMapView.css";

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1===lat2) && (lon1===lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit==="K") { dist = dist * 1.609344 }
		if (unit==="N") { dist = dist * 0.8684 }
		return dist;
	}
}

const GoogleMapView = props => { 
  const [coordinates] = useState(props.storesArr);
  const [selectedPlace,setSelectedPlace] = useState(null)
  
  const sayHello = props => {
    alert("Hello!");
  }

    return (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: props.currentPosition.latitude, lng: props.currentPosition.longitude }}>
            {coordinates.map((coordinate, index) => {
                coordinate = coordinate[0];
                return <Marker key={index} position={{ lat: coordinate.lat, lng: coordinate.lng }}
                    onClick={() => {
                        setSelectedPlace(coordinate)
                    }}
                />
            }
            )}
            {selectedPlace && (<InfoWindow
                position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                onCloseClick={() => { setSelectedPlace(null) }}>
                <div style={{ width: "13.7rem" }}>
                    <h3>{selectedPlace.name}</h3>
                    <p className="text-description">Address: <strong>{selectedPlace.address}</strong></p>
                    <p className="text-description">ZipCode: <strong>{selectedPlace.zipcode}</strong></p>
                    <br />
                    <br />
                    <div className="same-line">
                        <button className="text-info-btn" onClick={sayHello}>Navigate ({distance(props.currentPosition.latitude, props.currentPosition.longitude, selectedPlace.lat,selectedPlace.lng, 'K')} km)</button>
                    </div>
                </div>
            </InfoWindow>)}
        </GoogleMap>
    );
};

const WrappedMap = withScriptjs(withGoogleMap(GoogleMapView))  
export default WrappedMap
