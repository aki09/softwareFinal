import React, { useState,useEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import { Card } from "react-bootstrap";
import io from 'socket.io-client';

function Maap1({drones}) {
    const [currentLocation,setCurrentLocation]=useState({})
    const [markers, setMarkers] = useState([]);
    const [droneList, setDroneList] = useState(drones);

    const renderMarkers = (map, maps,locationTemp) => {
      for(let i=0;i<drones.length;i++)
      {
          let marker = new maps.Marker({
              position: { lat: locationTemp[i].location.lat, lng: locationTemp[i].location.lon },
              map,
              title: locationTemp[i].name,
              icon:{url:`http://maps.google.com/mapfiles/ms/icons/${locationTemp[i].colormap}.png`}
              });
      }
      };

    const fetchlocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                console.error("Geolocation is not supported by this browser.");
                alert("Geolocation is not supported by this browser.")
            }
        );
    }

    useEffect(() => {
      const socket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });
    
    socket.on('locationlat', data => {
      const { id, location } = data;
      const LocationIndex = drones.findIndex(drone => drone._id === id);
      if (LocationIndex === -1) return;
      handleLocationLat(id,location)
    });

    socket.on('locationlon', data => {
      const { id, location } = data;
      console.log(id)
      const LocationIndex = drones.findIndex(drone => drone._id === id);
      if (LocationIndex === -1) return;
      handleLocationLon(id,location)
    });
    fetchlocation();
    }, [])
    const handleLocationLat = (id,location) => {
      setDroneList((prevDroneList) =>
        prevDroneList.map((drone) => {
          if (drone._id === id) {
            return {
              ...drone,
              location: {lat:location,lon:drone.location.lon},
            };
          }
          return drone;
        })
      );
    };

    const handleLocationLon = (id,location) => {
      setDroneList((prevDroneList) =>
        prevDroneList.map((drone) => {
          if (drone._id === id) {
            return {
              ...drone,
              location: location,
            };
          }
          return drone;
        })
      );
    };
  return (
    <div style={{ width: "100%",marginTop:"25%",height:"50%" }} className="pt-4">
        <Card>
          <Card.Title className="ms-3 mt-3">
            LIVE MAP
          </Card.Title>
          <Card.Body>
            <Card.Text className="text-secondary">
              Location of all drones appears here in real time
            </Card.Text>
          </Card.Body>
        </Card> 
        <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.react_google_maps_api }}
        center={{lat: currentLocation.lat, lng: currentLocation.lng}}
        defaultZoom={18}
        options={{
            mapTypeId: 'satellite',
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps,droneList)}
        >
        </GoogleMapReact>
      </div>   
  );
};
export default Maap1