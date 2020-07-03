import { notification } from "antd";

export function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return monthNames[monthIndex] + " " + year;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return (
    date.getDate() +
    " " +
    monthNames[monthIndex] +
    " " +
    year +
    " - " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
}

export function currentLocation() {
  var currentPosition = {
    latitude: 0,
    longitude: 0
  };

  if (!"geolocation" in navigator) {
    notification.info({
      message: 'Evliion App',
      description: "You must activate the geolocation in your browser!",
    }); 
  } else {
    navigator.geolocation.getCurrentPosition(function (position) {
      currentPosition.latitude = position.coords.latitude;
      currentPosition.longitude = position.coords.longitude;
    });
  }  

  return currentPosition;
}