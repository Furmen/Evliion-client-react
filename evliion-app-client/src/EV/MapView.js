import React, { Component } from "react";
import HPlatform, { HMap, HMapPolyLine, HMapMarker } from "react-here-map";

export default class MapView extends Component {
  state = {
    coords: []
  };

  load_coords = () => {
    this.setState({
      coords: [
        { lat: 52.5309825, lng: 13.3845921 },
        { lat: 52.5311923, lng: 13.3853495 },
        { lat: 52.5313532, lng: 13.3861756 },
        { lat: 52.5315142, lng: 13.3872163 },
        { lat: 52.5316215, lng: 13.3885574 },
        { lat: 52.5320399, lng: 13.3925807 },
        { lat: 52.5321472, lng: 13.3935785 }
      ]
    });
  };

  calculate_center = () => {
    let centerLat = 0;
    let centerLng = 0;

    this.state.coords.forEach(
      coord => ((centerLat += coord.lat), (centerLng += coord.lng))
    );
    centerLat /= this.state.coords.length;
    centerLng /= this.statecoords.length;
    return { lat: centerLat, lng: centerLng };
  };

  calculate_zoom = () => {};

  componentDidMount() {
    this.load_coords();
  }

  render() {
    return (
      <div>
        <HPlatform
          app_id="8zMB1yFFa0yFVzoVjMF1"
          app_code="zCGWiI7X0C5puFyFaHbOdw"
          useCIT
          useHTTPS
          includeUI
          includePlaces
          interactive
        >
          <HMap
            style={{ height: "400px", width: "800px" }}
            mapOptions={{
              center: {
                lat: this.calculate_center.lat,
                lng: this.calculate_center.lng
              },
              zoom: 15
            }}
          >
            {this.state.coords.map(coord => (
              <HMapMarker coords={{ lat: coord.lat, lng: coord.lng }} />
            ))}
          </HMap>
        </HPlatform>
      </div>
    );
  }
}
