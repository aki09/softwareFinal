
import React, { useState,useEffect,useRef } from 'react'
import GoogleMapReact from 'google-map-react';


function Mapset({drones}) {
  const [currentLocation,setCurrentLocation]=useState({})

  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  const handleMapClick = (event) => {
    if (markers.length < 4) {
      const newMarker = { lat: event.lat, lng: event.lng };
      setMarkers([...markers, newMarker]);
      renderMarkers([...markers, newMarker]);
    }
  };
  


  const renderMarkers = (markers) => {
    console.log(markers)
    markers.forEach((marker) => {
      const newMarker = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapRef.current,
      });
      markerRefs.current.push(newMarker);
    });
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
        
    fetchlocation();
    }, [])
    

  return (
    <div style={{ width: "100%",marginTop:"25%",height:"80%" }} className="pt-4">
         
        <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.react_google_maps_api,libraries: ["places", "geometry"] }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
            mapRef.current = map;
            renderMarkers(markers);
          }}
        onClick={handleMapClick}
        center={{lat: currentLocation.lat, lng: currentLocation.lng}}
        defaultZoom={18}
        options={{
            mapTypeId: 'satellite',
        }}
        >
        </GoogleMapReact>
      </div>   
  );
};
export default Mapset
