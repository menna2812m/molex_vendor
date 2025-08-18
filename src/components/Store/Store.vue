<template>
  <section>
    <div class="pos-relative text-end">
      <button
        @click="edit(myList)"
        class="twobtn bg-white border"
        style="border-color: #e66239 !important; color: #e66239"
      >
        تعديل متجر
      </button>
    </div>

    <section
      class="position-relative"
      style="height: 100vh; display: grid; place-items: center"
      v-if="loading"
    >
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </section>
    <section v-else>
      <div class="card custom-card border-0 mg-b-20" v-if="myList">
        <div class="card-body p-0">
          <div
            class="table-responsive border-0 rounded border-bottom-0 px-4 mb-0"
          >
            <table class="table text-nowrap text-md-nowrap mg-b-0">
              <tr>
                <td class="text-muted">اسم المتجر</td>
              </tr>
              <tr
                class="list_item py-3 w-100 align-items-center justify-content-between"
              >
                <td class="py-4">
                  <img
                    :src="myList.image"
                    alt=""
                    v-if="myList.image"
                    style="width: 200px; height: 200px"
                  />
                </td>
                <td class="py-4">{{ myList.name }}</td>
                <td class="py-4">{{ myList.phone }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <section
        class="position-relative"
        style="height: 100vh; display: grid; place-items: center"
        v-else
      >
        <div
          style="background: #e66239; padding: 30px; font-size: 20px"
          class="w-50 text-center text-white rounded-10"
        >
          لا يوجد متاجر حتي الان
        </div>
      </section>
    </section>

    <teleport to="body">
      <b-modal
        id="add-page"
        v-model="ShowModeledit"
        hide-footer
        title="تعديل البائع"
        class="store-edit-modal"
        centered
        size="lg"
        header-class="border-bottom pb-2"
      >
        <div class="p-0">
          <form @submit.prevent="update">
            <div class="row">
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label class="form-label"> الاسم </label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': hasFieldError('name') }"
                    v-model="formDataupdate.name"
                    @input="clearFieldError('name')"
                  />
                  <div class="invalid-feedback" v-if="hasFieldError('name')">
                    {{ getFieldError("name") }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label class="form-label"> الجوال </label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': hasFieldError('store_phone') }"
                    v-model="formDataupdate.store_phone"
                    @input="clearFieldError('store_phone')"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="hasFieldError('store_phone')"
                  >
                    {{ getFieldError("store_phone") }}
                  </div>
                </div>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">الصوره</label>
                <div class="pos-relative overflow-hidden">
                  <input
                    type="file"
                    @change="editFileSelected"
                    accept=".pdf, image/jpeg, image/png"
                    class="form-control"
                    :class="{ 'is-invalid': hasFieldError('image') }"
                  />
                  <div class="invalid-feedback" v-if="hasFieldError('image')">
                    {{ getFieldError("image") }}
                  </div>
                </div>
                <img
                  :src="imageUrl"
                  alt="صورة"
                  style="width: 180px; height: 180px; object-fit: fill"
                  class="mt-2 rounded"
                  v-if="imageUrl"
                />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">فيديو</label>
                <div class="pos-relative overflow-hidden">
                  <input
                    type="file"
                    @change="editFilevideo"
                    accept=".mp4,.mov, .webm"
                    class="form-control"
                    :class="{ 'is-invalid': hasFieldError('video') }"
                  />
                  <div class="invalid-feedback" v-if="hasFieldError('video')">
                    {{ getFieldError("video") }}
                  </div>
                </div>

                <video
                  :src="videoUrl"
                  controls
                  style="width: 100%; height: 180px"
                  class="mt-2 rounded"
                  v-if="videoUrl"
                ></video>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label"> البلد </label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="SelectOptions"
                  placeholder="اختر البلد"
                  v-model="formDataupdate.country_id"
                  @change="changecountry"
                  :class="{ 'is-invalid': hasFieldError('country_id') }"
                />
                <div
                  class="invalid-feedback d-block"
                  v-if="hasFieldError('country_id')"
                >
                  {{ getFieldError("country_id") }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label"> الاقليم </label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="regions"
                  placeholder="اختر الاقليم "
                  v-model="formDataupdate.region_id"
                  @change="changecities($event, regions)"
                  :class="{ 'is-invalid': hasFieldError('region_id') }"
                />
                <div
                  class="invalid-feedback d-block"
                  v-if="hasFieldError('region_id')"
                >
                  {{ getFieldError("region_id") }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label"> المدينة </label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="cities"
                  placeholder="اختر المدينة "
                  v-model="formDataupdate.city_id"
                  @change="district($event, cities)"
                  :class="{ 'is-invalid': hasFieldError('city_id') }"
                />
                <div
                  class="invalid-feedback d-block"
                  v-if="hasFieldError('city_id')"
                >
                  {{ getFieldError("city_id") }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label"> المنطقة </label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="districta"
                  placeholder="اختر المنطقة "
                  v-model="formDataupdate.district_id"
                  :class="{ 'is-invalid': hasFieldError('district_id') }"
                />
                <div
                  class="invalid-feedback d-block"
                  v-if="hasFieldError('district_id')"
                >
                  {{ getFieldError("district_id") }}
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button
                class="btn btn-primary px-4"
                type="submit"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "جاري التحديث..." : "تعديل" }}
              </button>
            </div>
          </form>
        </div>
      </b-modal>
    </teleport>
  </section>
</template>

<script>
import moment from "moment";
import { useToast } from "vue-toastification";
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
import axios from "axios";
import { FormErrorMixin } from "../../Shared/mixins/FormErrorMixin.js";

export default {
  components: {
    Multiselect,
  },
  mixins: [FormErrorMixin],
  data() {
    return {
      errormessage: "",
      id: null,
      ShowModeledit: false,
      myList: {},
      formDataupdate: {
        name: "",
        store_phone: "",
        image: "",
        video: "",
        country_id: "",
        region_id: "",
        city_id: "",
        district_id: "",
        brands_ids: [],
        categories_ids: [],
      },
      isSubmitting: false,
      loading: false,
      regions: [],
      cities: [],
      countries: [],
      districta: [],
      SelectOptions: [],
      imageUrl: "",
      videoUrl: "",
      // Fields to watch for clearing errors
      watchedFields: [
        "formDataupdate.name",
        "formDataupdate.store_phone",
        "formDataupdate.country_id",
        "formDataupdate.region_id",
        "formDataupdate.city_id",
        "formDataupdate.district_id",
      ],
    };
  },
  methods: {
    async edit(data) {
      this.clearAllErrors(); // Clear previous errors when opening modal
      this.ShowModeledit = true;
      this.id = data.id;
      this.formDataupdate.name = data.name;
      this.formDataupdate.store_phone = data.phone;
      this.formDataupdate.country_id = 1;
      this.formDataupdate.region_id = data.region_id;
      this.formDataupdate.city_id = data.city_id;
      this.formDataupdate.district_id = data.district_id;
      // data.categories.forEach(element => {
      //   this.formDataupdate.categories_ids.push(element.id)
      //           });
      //  data.brands.forEach(element => {
      //   this.formDataupdate.brands_ids.push(element.id)
      //       })
      this.imageUrl = data.image;
      this.videoUrl = data.video;
    },

    validateFormData() {
      // Basic form validation
      return this.validateForm({
        name: { required: true, label: "اسم المتجر" },
        store_phone: { required: true, label: "جوال المتجر" },
        country_id: { required: true, label: "البلد" },
        region_id: { required: true, label: "الاقليم" },
        city_id: { required: true, label: "المدينة" },
        district_id: { required: true, label: "المنطقة" },
      });
    },

    async update() {
      const toast = useToast();
      this.isSubmitting = true;

      try {
        const res = await crudDataService.create(
          `store?_method=put`,
          this.formDataupdate,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.stores();
        this.ShowModeledit = false;
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      } catch (error) {
        this.handleApiErrors(error, toast);
      } finally {
        this.isSubmitting = false;
      }
    },
    async country() {
      const result = await axios.get("https://mall.alharazy.com/api/countries");
      this.countries = result.data.data;
      this.SelectOptions = this.countries.map((country) => ({
        value: country.id,
        name: country.name,
      }));
    },
    changecountry() {
      this.countries.find((country) => {
        this.regions = country.regions.map((reg) => ({
          value: reg.id,
          name: reg.name,
          cities: reg.cities,
        }));
      });
      this.changecities();
      this.clearFieldError("country_id");
    },
    changecities(events, regions) {
      this.regions.forEach((ele) => {
        if (
          events === ele.value ||
          this.formDataupdate.region_id === ele.value
        ) {
          this.cities = ele.cities.map((city) => ({
            value: city.id,
            name: city.name,
            districts: city.districts,
          }));
        }
      });
      this.district();
      this.clearFieldError("region_id");
    },
    district(events, dis) {
      this.cities.forEach((ele) => {
        if (events === ele.value || this.formDataupdate.city_id === ele.value) {
          this.districta = ele.districts.map((dist) => ({
            value: dist.id,
            name: dist.name,
          }));
        }
      });
      this.clearFieldError("city_id");
    },
    editFileSelected(event) {
      this.formDataupdate.image = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.formDataupdate.image);
      this.clearFieldError("image");
    },
    editFilevideo(event) {
      this.formDataupdate.video = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.videoUrl = reader.result;
      };
      reader.readAsDataURL(this.formDataupdate.video);
      this.clearFieldError("video");
    },

    async stores() {
      this.loading = true; // Start loading
      try {
        let res = await crudDataService.getAll("store");
        this.myList = res.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error
      } finally {
        this.loading = false; // End loading regardless of success or failure
      }
    },
  },
  mounted() {
    this.stores();
    this.country();
  },
  watch: {
    // Reset errors when modal closes
    ShowModeledit(val) {
      if (!val) {
        this.clearAllErrors();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  box-shadow: 0px 3px 3px 0px #e6edf0;
}
.list_item:not(:last-child) {
  border-bottom: 1px solid #e8e7ff;
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
}
</style>
<style lang="scss">
// Modal styles
.store-edit-modal {
  .modal-dialog {
    max-width: 700px;
    margin: 1.75rem auto;
  }

  .modal-content {
    border: 0;
    border-radius: 0.5rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    direction: rtl;
    border-bottom: 1px solid #e8e8f7;
    padding: 1rem 1.5rem;

    .modal-title {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .btn-close {
      margin: 0;
      padding: 0;
      background: transparent;
      box-shadow: none;
      margin-left: auto;
      margin-right: 0;
    }
  }

  .modal-body {
    padding: 1.5rem;
    max-height: 83vh;
    overflow-y: auto;
  }

  .form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
}

// Prevent body scroll when modal is open
body.modal-open {
  overflow: hidden;
}

// File input styling
input[type="file"].form-control {
  padding: 0.375rem 0.75rem;

  &::file-selector-button {
    background-image: linear-gradient(to right, #e66239, #e66239) !important;
    color: white;
    border: 0;
    padding: 0.375rem 0.75rem;
    margin-left: 0.75rem;
    border-radius: 0.25rem;
  }
}

// Fix for datepicker
.dp__menu_index {
  z-index: 999999999 !important;
}

.dp__input_icon {
  margin-right: auto !important;
}

.dp__action_buttons {
  text-align: left;
  .dp__action.dp__cancel {
    display: none;
  }
}
</style>
