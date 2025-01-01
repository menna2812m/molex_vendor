<template>
  <section v-if="oneuser.length>0">
    <div class="row row-sm mt-5 pt-5">
      <div class="col-12">
        <div class="card productdesc pb-3 border-1">
          <div
            class="card-header pb-2 d-flex align-items-center justify-content-between"
          >
            <h4 class="mb-0">العميل</h4>
          
          </div>
          <div class="row align-items-center justify-content-center pt-3">
            <div class="col-lg-7">
              <div class="row" v-for="(user, i) in oneuser" :key="i">
                <div class="col-lg-4 text-center">
                  <img
                    src="../../assets/img/avatar_male.jpg"
                    alt="img"
                    class="mx-auto"
                    style="width: 80px; height: 80px; border-radius: 50%"
                  />
                  <h5>{{ user.fname }} {{ user.lname }}</h5>
                  <h5>{{ user?user.email:"" }}</h5>
                  <p>
                    {{ user.birth_date }}
                  </p>
                </div>
                <div class="col-lg-7 mt-3">
                  <ul style="list-style: none; font-size: 16px">
                    <li class="pb-3">
                      <i class="si si-location-pin"></i>
                      المنطقة:
                      <span>
                        {{ user.country.name }}
                      </span>
                    </li>
                    <li class="pb-3">
                      <i class="fa fa-calendar"></i>
                      تاريخ التسجيل في المتجر:
                      <span>{{ user.created_at }}</span>
                    </li>
                    <li class="pb-3">
                      <p
                        class="p-2"
                        style="
                          border-radius: 25px;
                          border: 1px solid #E66239;
                          width: max-content;
                        "
                      >
                        <i class="si si-phone"></i>
                        <a href="tel:`+${user.country.phonecode}${user.phone}`">
                          اتصل {{ user.phone }}
                        </a>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
 
  </section>
  <section class="position-relative" style="height: 100vh;display: grid;
    place-items: center;"
    v-else
   >

<section class="cate">
</section>
 <progress class="pure-material-progress-circular"/> 

   </section>  
</template>

<script>
import Multiselect from "@vueform/multiselect";
import axios from "axios";
import crudDataService from "../../Services/crudDataService.js";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      blocktext:"حظر المستخدم",
      ShowModel: false,
      isDropdownOpen: false,
      isDropendOpen: false,
      oneuser: [],
      formData: {
        email: "",
        fname: "",
        lname: "",
        phone: "",
        birth_date: "",
        gender: "",
        phone: "",
        country_id: null,
        region_id: "",
        city_id: "",
        district_id: "",
      },
      codephone: "+966",
      countries: [],
      gender: [
        { value: "male", name: "ذكر" },
        { value: "female", name: "انثي" },
      ],
      districta: [],
      SelectOptions: [],
      regions: [],
      cities: [],
      items:[],
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async getCustomer() {
      const res = await crudDataService.get(
        "users",
        `${this.$route.params.id}`
      );
      console.log(res.data.data);
      if (res.data.data.blocked==1) {
        this.blocktext='إلغاء الحظر'
      }else{
        this.blocktext="حظر المستخدم"
      }
      this.oneuser.push(res.data.data),
      (this.formData.fname = res.data.data.fname),
        (this.formData.lname = res.data.data.lname),
        (this.formData.birth_date = res.data.data.birth_date),
        (this.formData.gender = res.data.data.gender),
        (this.formData.email = res.data.data.email),
        (this.formData.phone = res.data.data.phone),
        (this.formData.country_id = res.data.data.country.id),
        (this.formData.city_id = res.data.data.city?res.data.data.city.id:null),
        (this.formData.region_id = res.data.data.region?res.data.data.region.id:null),
        (this.formData.district_id = res.data.data.district?res.data.data.district.id:null)
    },
    async country() {
      const result = await crudDataService.getAll(
        "countries"
      );
      this.countries = result.data.data;
      this.SelectOptions = this.countries.map((country) => ({
        value: country.id,
        name: country.name,
        regions: country.regions,
      }));
      this.countries.find((country) => {
        this.regions = country.regions.map((reg) => ({
          value: reg.id,
          name: reg.name,
          cities: reg.cities,
        }));
      });
      this.oneuser.forEach((ele) => {
        this.regions.forEach((city) => {
          city.cities.forEach((one) => {
            if (ele.city) {
              if (ele.city.id === one.id) {
              this.cities = city.cities.map((dist) => ({
                value: dist.id,
                name: dist.name,
                districts: dist.districts,
              }));
            }
            }
          
          });
        });
      });
      this.oneuser.forEach((ele) => {
        this.cities.forEach((dist) => {
          dist.districts.forEach((district) => {
            if (ele.district.id === district.id) {
              this.districta = dist.districts.map((ass) => ({
                value: ass.id,
                name: ass.name,
              }));
            }
          });
        });
      });
    },
    async edit() {
      const res = await crudDataService.put(`users/${this.$route.params.id}` ,this.formData);
   console.log(res);
   this.ShowModel= false;
   this.oneuser=[]
   this.getCustomer();
    },
  
    async blocked(){
      const res = await crudDataService.create(`users/${this.$route.params.id}/toggle`,'');
      console.log();
      if (res.data.data.blocked) {
        this.blocktext="إلغاء الحظر"
      }else{
        this.blocktext="حظر المستخدم"
      }
    },
    changecode() {
      this.countries.find((country) => {
        this.codephone = "+" + country.phonecode;
      });
    },
    changecities(events, regions) {
      regions.forEach((ele) => {
        if (events === ele.value) {
          this.cities = ele.cities.map((city) => ({
            value: city.id,
            name: city.name,
            districts: city.districts,
          }));
        }
      });
    },
    district(events, dis) {
      dis.forEach((ele) => {
        if (events === ele.value) {
          this.districta = ele.districts.map((dist) => ({
            value: dist.id,
            name: dist.name,
          }));
        }
      });
    },
  },
  mounted() {
    this.getCustomer();
    this.country();
  },
};
</script>

<style scoped lang="scss">
.dropend {
  background: #fff;
  position: absolute;
  width: 150px;
  box-shadow: 0px 3px 3px 0px #e6edf0;
  border-radius: 3px;
  a {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.multiselect-caret {
  margin: 0 var(--ms-px, 0.875rem) 0 var(--ms-px, 0.875rem);
}
.multiselect-multiple-label,
.multiselect-placeholder,
.multiselect-single-label {
  left: auto;

  padding-right: 9px;

  right: 0;
}
.modal .modal-header {
  display: none;
}
.imgtoadd {
  background: #fff;
  width: 100px;
  height: 100px;
  position: absolute;
  right: 40%;
  border-radius: 50%;
  top: -50px;
  text-align: center;
  img {
    width: 90%;
    height: 90%;
    object-fit: cover;
  }
}
@media (min-width: 576px) {
  .modal-dialog {
    margin: 8.75rem auto;
  }
}
</style>
