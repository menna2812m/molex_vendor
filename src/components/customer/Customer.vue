<template>
  <section>
    <section
      class="position-relative"
      style="height: 20vh; display: grid; place-items: center"
      v-if="loading"
    >
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </section>
    <section v-else>
      <div class="card custom-card border-0 mg-b-20" v-if="myList.length > 0">
        <div class="card-body p-0">
          <div
            class="table-responsive border rounded border-bottom-0 px-4 mb-0"
          >
            <table class="table text-nowrap text-md-nowrap mg-b-0">
              <tr>
                <th>
                  <h4 class="mb-0 fw-semibold">
                    العملاء
                    <span style="color: #fb99bf" class="fw-normal">
                      ({{ myList.length }})
                    </span>
                  </h4>
                </th>
                <th></th>
              </tr>
              <tr>
                <th>اسم العميل</th>
                <th>رقم الجوال</th>
                <th>الموقع</th>
                <!-- <th>الفعل</th> -->
              </tr>

              <tr
                v-for="(item, index) in myList"
                :key="index"
                class="list_item py-3 w-100 align-items-center justify-content-between"
              >
                <td>
                  <div class="checkbox-container">
                    <label>
                      <input
                        type="checkbox"
                        v-model="item.selected"
                        @change="selectuser(item.id)"
                      />
                    </label>

                    <div class="customer-info">
                      <img
                        src="../../assets/img/avatar_male.jpg"
                        alt="img"
                        class="customer-avatar"
                      />

                      <div class="customer-details">
                        <h5
                          class="mb-0 fw-semibold"
                          @click="SingleCustomer(item.id)"
                          style="cursor: pointer"
                        >
                          {{ item.fname }}
                          {{ item.lname }}
                        </h5>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="text-secondary">
                  <span class="text-secondary contact-info">
                    <div class="contact-icon">
                      <i class="fas fa-phone"></i>
                    </div>
                    <a :href="'tel:' + `${item.phone}`"> {{ item.phone }}</a>
                  </span>
                </td>
                <td>
                  <span
                    v-if="item?.city?.name || item?.country?.name"
                    class="text-secondary location-tag"
                  >
                    <i class="fas fa-map-marker-alt"></i>
                    <span>
                      {{
                        item?.city?.name
                          ? item?.city?.name
                          : item?.country?.name
                      }}
                    </span>
                  </span>
                  <span v-else> {{ "-" }} </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <b-pagination
          v-model="page"
          :total-rows="last"
          :per-page="1"
          @click="paginag(page)"
          class="justify-content-end"
        ></b-pagination>
      </div>
      <section
        class="position-relative"
        style="height: 10vh; display: grid; place-items: center"
        v-else
      >
        <div
          style="background: #e66239; padding: 30px; font-size: 20px"
          class="w-50 text-center text-white rounded-10"
        >
          لا يوجد عملاء حتي الان
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
import axios from "axios";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      page: 1,
      last: 2,
      loading: false,
      ShowModelAddgroup: false,
      isDropdownOpen: false,
      isDropendOpen: false,
      myList: [],
      items: [],
      loc: "",
      selectAll: false,
      codephone: "+966",
      SelectOptions: [],
      regions: [],
      cities: [],
      ShowModel: false,
      selectAll: false,
      formData: {
        email: "",
        fname: "",
        lname: "",
        phone: "",
        birth_date: "",
        gender: "",
        phone: "",
        country_id: "",
        region_id: "",
        city_id: "",
        district_id: "",
      },
      countries: [],
      gender: [
        { value: "male", name: "ذكر" },
        { value: "female", name: "انثي" },
      ],
      districta: [],
      addData: {
        group_id: "",
        user_ids: [],
      },
    };
  },
  methods: {
    SingleCustomer(data) {
      this.$router.push({ name: "SingleCustomer", params: { id: data } });
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleSelectAll() {
      this.myList.forEach((item) => (item.selected = this.selectAll));
    },
    toggleend() {
      this.isDropendOpen = !this.isDropendOpen;
    },
    async paginag(p) {
      let res = await crudDataService.getAll(`users?page=${this.page}`);
      this.myList = res.data.data.data;
    },
    async getAllCustomer() {
      this.loading = true; // Start loading

      try {
        const res = await crudDataService.getAll("users");
        this.myList = res.data.data.data;
        this.last = res.data.data.last_page;

        this.myList.forEach((ele) => {
          this.loc = ele?.address?.address || "";
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error
      } finally {
        this.loading = false; // End loading regardless of success or failure
      }
    },
    async add() {
      const res = await crudDataService
        .create("users", this.formData)
        .then((response) => {
          this.ShowModel = false;
          this.getAllCustomer();
          (this.formData.email = ""),
            (this.formData.fname = ""),
            (this.formData.lname = ""),
            (this.formData.phone = ""),
            (this.formData.birth_date = ""),
            (this.formData.gender = ""),
            (this.formData.country_id = ""),
            (this.formData.region_id = ""),
            (this.formData.city_id = ""),
            (this.formData.district_id = "");
        });
    },
    async country() {
      const result = await axios.get("https://mall.alharazy.com/api/countries");
      console.log(result);
      this.countries = result.data.data;
      this.SelectOptions = this.countries.map((country) => ({
        value: country.id,
        name: country.name,
      }));
    },
    changecode() {
      this.countries.find((country) => {
        this.codephone = "+" + country.phonecode;
        this.regions = country.regions.map((reg) => ({
          value: reg.id,
          name: reg.name,
          cities: reg.cities,
        }));
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
    async getallgroups() {
      let res = await crudDataService.getAll("groups");
      this.items = res.data.data.data;
    },
    checkitem(id) {
      this.addData.group_id = id;
    },
    selectuser(id) {
      this.addData.user_ids.push(id);
    },
    async adduser() {
      let res = await crudDataService.create(
        "add-users-to-group",
        this.addData
      );
      console.log(res);
      this.ShowModelAddgroup = false;
      this.isDropendOpen = false;
      this.getAllCustomer();
    },
    del(data, index, name) {
      this.$swal
        .fire({
          title: `؟"${name}" هل تريد حذف العميل `,
          showCancelButton: true,
          confirmButtonText: "نعم",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$swal.fire("Deleted successfully!", "", "success");
            crudDataService.delete("users", `${data}`).then(() => {
              this.myList.splice(index, 1);
            });
          }
        });
    },
    async removeuser() {
      let res = await crudDataService.create("remove-users-from-group", {
        user_ids: this.addData.user_ids,
      });
      console.log(res);

      this.getAllCustomer();
    },
  },
  mounted() {
    this.getAllCustomer();
    this.country();
  },
};
</script>

<style scoped lang="scss">
.customer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
  transition: all 0.3s ease;
}
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-checkbox {
  position: relative;
  width: 18px;
  height: 18px;
}
.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-info:hover {
  color: #667eea;
  transform: translateX(-3px);
}
.contact-icon {
  width: 20px;
  height: 20px;
  background: #fd601f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
}
.location-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.card {
  box-shadow: 0px 3px 3px 0px #e6edf0;
}

.list_item:not(:last-child) {
  border-bottom: 1px solid #e8e7ff;
}

.dropitem {
  position: absolute;
  left: 5px;
  border: 1px solid #e8e8f7;
  margin: 2px;
  border-radius: 3px;
  a {
    cursor: pointer;
  }
}
</style>
<style scoped lang="scss">
.card {
  box-shadow: 0px 3px 3px 0px #e6edf0;
}

.list_item:not(:last-child) {
  border-bottom: 1px solid #e8e7ff;
}
.icon_color {
  display: inline;
  padding: 12px;
  border-radius: 50%;
  &.icon_color_1 {
    color: #929aff;
    background: #e8e7ff;
  }
  &.icon_color_2 {
    color: #929aff;
    background: #e7faff;
  }
  &.icon_color_3 {
    color: #ffd891;
    background: #fffde7;
  }
  &.icon_color_4 {
    color: #ff7f7f;
    background: #ffe7e7;
  }
  &.icon_color_7 {
    color: #161548;
    background: #eff4fb;
  }
}
.progres {
  color: #e66239;
  font-weight: 600;
  font-size: 16px;
}
.faild {
  color: #ff6060;
  font-weight: 600;
  font-size: 16px;
}
.success {
  color: #62d56d;
  font-weight: 600;
  font-size: 16px;
}

.table-responsive .table > :not(caption) > * > * {
  border-bottom: 0px solid #e8e8f7 !important;
}
.tab-menu-heading {
  border: 1px solid #e8e8f7;
}
.tabs-style-3 .nav.panel-tabs li a {
  padding: 10px 18px 10px 18px;
  background: transparent;
  border-radius: 0;
  margin: 0;
  text-align: center;
  display: block;
  color: #14112d;
  &.active {
    background: #fff2f7;
    border-bottom: 1px solid #fe85b2;
    color: #fe85b2;
    border-radius: 0;
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
