import React, { useState,useEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import { Card } from "react-bootstrap";

function Maap1({drones}) {
    const [currentLocation,setCurrentLocation]=useState({})
    const [markers, setMarkers] = useState([]);

    const renderMarkers = (map, maps,locationTemp) => {
        for(let i=0;i<drones.length;i++)
        {
            let marker = new maps.Marker({
                position: { lat: locationTemp[i].lat, lng: locationTemp[i].lng },
                map,
                title: locationTemp[i].name,
                icon:{url:`http://maps.google.com/mapfiles/ms/icons/${locationTemp[i].color}.png`}
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
        for(let i=0;i<drones.length;i++)
        {
            setMarkers(prev => [...prev, { lat: drones[i].location.lat, lng: drones[i].location.lon, name: drones[i].name,type:drones[i].type,color:drones[i].colormap }]);
        }
    fetchlocation();
    }, [])
    

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
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps,markers)}
        >
        </GoogleMapReact>
      </div>   
  );
};
export default Maap1