import axios from "axios";
const authvendor = localStorage.getItem("authvendor");
console.log(authvendor);
var domain = "https://mall-express.code7x.com/vendor";
axios.defaults.baseURL = domain;
if (domain == "https://mall-express.code7x.com/vendor") {
    axios.defaults.token = `Bearer ${authvendor}`;
} else {
  axios.defaults.token;
}
