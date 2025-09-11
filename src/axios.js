import axios from "axios";
const authvendor = localStorage.getItem("authvendor");
var domain = "https://backend.molexapp.com/vendor";
axios.defaults.baseURL = domain;
if (domain == "https://backend.molexapp.com/vendor") {
  axios.defaults.token = `Bearer ${authvendor}`;
} else {
  axios.defaults.token;
}
