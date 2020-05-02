import React from "react";
import {GoogleMap,withScriptjs,withGoogleMap,Marker} from 'react-google-maps'
import "../EV/GoogleMapView/GoogleMapView.css";

const GoogleMapViewStore = props => {
    return <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: props.latitude, lng: props.longitude }}>
        {props.coordenates.map((coordinate, index) => {
                if(coordinate)
                    return <Marker key={index} position={{ lat: coordinate.latitude, lng: coordinate.longitude }} />
            }
        )}
    </GoogleMap>
};

const WrappedMap = withScriptjs(withGoogleMap(GoogleMapViewStore))  
export default WrappedMap