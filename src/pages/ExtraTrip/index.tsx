import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  ProgressBar,
  Row,
  Tab,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

import Flatpickr from "react-flatpickr";

import { GoogleApiWrapper, Map } from "google-maps-react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
  LoadScript,
} from "@react-google-maps/api";

const center = { lat: 37.7749, lng: -122.4194 };
const ExtraTrip = (props: any) => {
  document.title = "Extra Trip | School Administration";

  const [activeTab, setactiveTab] = useState<number>(0);
  const [showExtraContent, setShowExtraContent] = useState(false);
  const [isReturnSelected, setIsReturnSelected] = useState(true);

  const [collectionAddress, setCollectionAddress] = useState("");
  const [extraDropsAddress, setExtraDropsAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const [showCollectionMap, setShowCollectionMap] = useState(false);
  const [showExtraDropsMap, setShowExtraDropsMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [map, setMap] = useState<google.maps.Map<Element> | null>(null);

  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [place, setPlace] = useState<any>(null);
  const [searchResult, setSearchResult] = useState("");
  const [nom, setNom] = useState<any>();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchDestination, setSearchDestination] = useState("");
  const [fatma, setFatma] = useState<any>();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBbORSZJBXcqDnY6BbMx_JSP0l_9HLQSkw",
    libraries: ["places"],
  });

  const originRef = useRef<any>(null);
  const destinationRef = useRef<any>(null);

  if (!isLoaded) {
    return <p>Loading!!!!!</p>;
  }

  async function calculateRoute(): Promise<void> {
    if (
      originRef?.current!.value === "" ||
      destinationRef?.current!.value === "" ||
      !map
    ) {
      console.error("Invalid inputs or map not loaded.");
      return;
    }

    setLoading(true);

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setLoading(false);

        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);

          const selectedRoute = result.routes.find(
            (route) =>
              route.legs[0].start_address === originRef.current.value &&
              route.legs[0].end_address === destinationRef.current.value
          );

          if (!selectedRoute) {
            console.error("Route not found");
            return;
          }

          setDistance(selectedRoute.legs[0].distance.text);
          setDuration(selectedRoute.legs[0].duration.text);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }
  function onLoad(autocomplete: any) {
    setSearchResult(autocomplete);
  }

  function onLoadDest(autocomplete: any) {
    setSearchDestination(autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = (
        searchResult as unknown as google.maps.places.Autocomplete
      ).getPlace();
      //variable to store the name from place details result
      const name = place.geometry?.location;
      setNom(place.geometry?.location);
      //variable to store the status from place details result
      const status = place.business_status;
      //variable to store the formatted address from place details result
      const formattedAddress = place.formatted_address;
      // console.log(place);
      //console log all results
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
    } else {
      alert("Please enter text");
    }
  }

  function onPlaceChangedDest() {
    if (searchDestination != null) {
      //variable to store the result
      const place = (
        searchDestination as unknown as google.maps.places.Autocomplete
      ).getPlace();
      //variable to store the name from place details result
      const name = place.geometry?.location;
      setFatma(place.geometry?.location);
      //variable to store the status from place details result
      const status = place.business_status;
      //variable to store the formatted address from place details result
      const formattedAddress = place.formatted_address;
      // console.log(place);
      //console log all results
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
    } else {
      alert("Please enter text");
    }
  }

  const handleLocationButtonClick = () => {
    // Set the first location marker
    setSelectedLocation(nom);
  };

  const handleLocationButtonClickDest = () => {
    // Set the first location marker
    setSelectedDestination(fatma);
  };

  // useEffect(() => {
  //   if (autocompleteRef.current) {
  //     const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current);
  //     autocomplete.addListener('place_changed', onPlaceChanged);

  //     return () => {
  //       // Cleanup event listener when component unmounts
  //       google.maps.event.clearInstanceListeners(autocomplete);
  //     };
  //   }
  // }, [google]);

  // const onPlaceChanged = () => {
  //   if (autocompleteRef.current) {
  //   //   const place = autocompleteRef.current.getPlace();
  //     setPlace(place);
  //   }
  // };
  // useEffect(() => {
  //   updateMap();
  // }, [collectionAddress, destinationAddress, extraDropsAddress]);

  const handleCollectionAddressChange = (value: any) => {
    // setCollectionAddress(value);
    console.log(value);
  };

  const handleDestinationAddressChange = (value: any) => {
    setDestinationAddress(value);
  };

  const handleExtraDropsAddressChange = (value: any) => {
    setExtraDropsAddress(value);
  };

  const locations = [
    { label: "Gatwick North Terminal", value: "Gatwick North Terminal" },
    {
      label:
        "North Terminal, LGW Airport, Gatwick Airport, England RH6 0PJ, United Kingdom",
      value:
        "North Terminal, LGW Airport, Gatwick Airport, England RH6 0PJ, United Kingdom",
    },
    {
      label:
        "Gate 25, South Terminal, Gatwick Airport, England RH6 0PJ, United Kingdom",
      value:
        "Gate 25, South Terminal, Gatwick Airport, England RH6 0PJ, United Kingdom",
    },
    {
      label:
        "Loaf, 61 Sandgate High St, Folkestone, England CT20 3AH, United Kingdom",
      value:
        "Loaf, 61 Sandgate High St, Folkestone, England CT20 3AH, United Kingdom",
    },
  ];

  // const handleCollectionAddressChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const location = e.target.value;
  //   setCollectionAddress(location);
  //   setShowCollectionMap(true);
  //   setShowExtraDropsMap(false);
  //   setShowDestinationMap(false);
  // };

  // const handleExtraDropsAddressChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const location = e.target.value;
  //   setExtraDropsAddress(location);
  //   setShowCollectionMap(false);
  //   setShowExtraDropsMap(true);
  //   setShowDestinationMap(false);
  // };

  // const handleDestinationAddressChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const location = e.target.value;
  //   setDestinationAddress(location);
  //   setShowCollectionMap(false);
  //   setShowExtraDropsMap(false);
  //   setShowDestinationMap(true);
  // };

  const handleClick = () => {
    setShowExtraContent(!showExtraContent);
  };

  const handleRadioChange = (event: any) => {
    setIsReturnSelected(event.target.id === "flexRadioDefault1");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Extra Trip" pageTitle="Tools" />
          <Col xl={12}>
            <Card>
              <Card.Header>
                <h4 className="card-title mb-0">Online Quote</h4>
              </Card.Header>
              <Card.Body className="form-steps">
                <Row
                  style={{
                    position: "relative",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100vh",
                    width: "100vw",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      height: "80%",
                      width: "80%",
                    }}
                  >
                    <GoogleMap
                      center={center}
                      zoom={15}
                      mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                      }}
                      onLoad={(map) => setMap(map)}
                    >
                      {/* <Marker position={center} />
                      {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                      )} */}
                      {selectedLocation && <Marker position={nom} />}
                      {selectedDestination && <Marker position={fatma} />}
                      {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                      )}
                    </GoogleMap>
                  </div>
                  <InputGroup className="mb-3">
                    <Autocomplete
                      onPlaceChanged={onPlaceChanged}
                      onLoad={onLoad}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Origin"
                        ref={originRef}
                        onClick={() => {
                          handleLocationButtonClick();
                          map?.panTo(nom);
                          map?.setZoom(15);
                        }}
                      />
                    </Autocomplete>
                    <InputGroup.Text>to</InputGroup.Text>
                    <Autocomplete onPlaceChanged={onPlaceChangedDest}
                      onLoad={onLoadDest}>
                      <Form.Control
                        type="text"
                        placeholder="Destination"
                        ref={destinationRef}
                        onClick={() => {
                          handleLocationButtonClickDest();
                          map?.panTo(fatma);
                          map?.setZoom(15);
                        }}
                      />
                    </Autocomplete>
                  </InputGroup>
                  <div>
                    {loading ? (
                      <p>Calculating route...</p>
                    ) : (
                      <Button type="submit" onClick={calculateRoute}>
                        Calculate Route
                      </Button>
                    )}

                    <Button aria-label="center back" onClick={clearRoute}>
                      {" "}
                      Clear Route{" "}
                    </Button>
                  </div>

                  <div>
                    <Form.Label>Distance: {distance} </Form.Label>
                    <Form.Label>Duration: {duration} </Form.Label>
                    <Button
                      aria-label="center back"
                      onClick={() => {
                        map?.panTo(center);
                        map?.setZoom(15);
                      }}
                    >
                      {" "}
                      Return Center{" "}
                    </Button>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ExtraTrip;
