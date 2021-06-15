# Track the International Space Station [live!](https://corquaid.github.io/react-iss-tracker)

![App screenshot](https://github.com/corquaid/react-iss-tracker/blob/main/src/Images/Screenshot%202021-06-14%20162703.jpg)

This app was created with create-react-app and based on my original vanilla Javascript [app](https://github.com/corquaid/api-iss-tracker).

## Popover Modals

![](https://github.com/corquaid/react-iss-tracker/blob/main/src/Images/Screenshot%202021-06-14%20163045.jpg) 

![](https://github.com/corquaid/react-iss-tracker/blob/main/src/Images/Screenshot%202021-06-14%20163241.jpg)

![](https://github.com/corquaid/react-iss-tracker/blob/main/src/Images/Screenshot%202021-06-14%20163600.jpg)



The following resources were used to create this app:

- [Where The ISS At? REST API](https://wheretheiss.at/w/developer) for the live ISS orbital data, created by Bill Shupp.
- My own ISS-related [APIs](https://github.com/corquaid/international-space-station-APIs) for spacecraft and crew information.
- [react-leaflet](https://react-leaflet.js.org/) providing React components based on Leaflet.js.
- A great day/night overlay for react-leaflet from [Ivan Tamarro](https://github.com/tammaroivan/react-leaflet-night-region).
- The invaluable [use-interval](https://github.com/Hermanya/use-interval) package from Herman Starikov to allow me to use setInterval inside the useEffect hook. I also used this to tweak the night-region package to make it live-updating, creating a moving day/night terminator line on the map.
- [Material-UI](https://material-ui.com/) for the all-important Popovers.

## To-Dos
- [ ] Add Context API for state management
- [ ] Split out additional components from App.js
- [ ] Add lazy loading / Spinners for data fetching


