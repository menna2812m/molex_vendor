<template>
  <section>
    <div
      class="store-header d-flex justify-content-between align-items-center mb-4"
    >
      <h4 class="page-title">معلومات المتجر</h4>
      <button @click="edit(myList)" class="btn btn-outline-primary">
        <i class="fe fe-edit me-1"></i> تعديل المتجر
      </button>
    </div>

    <section class="loading-container" v-if="loading">
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </section>

    <section v-else-if="myList" class="store-content">
      <div class="card custom-card border-0 mb-4 overflow-hidden">
        <div class="card-header d-flex align-items-center p-2">
          <h5 class="card-title mb-0">بيانات المتجر</h5>
          <span class="ms-auto badge bg-success">نشط</span>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4 col-md-5 text-center mb-4 mb-md-0">
              <div class="store-image-container">
                <img
                  :src="myList.image"
                  alt="صورة المتجر"
                  v-if="myList.image"
                  class="img-fluid rounded store-image"
                  @error="
                    $event.target.src =
                      'https://via.placeholder.com/200x200?text=صورة+المتجر'
                  "
                />
                <div v-else class="no-image-placeholder">
                  <i class="fe fe-image"></i>
                  <p>لا توجد صورة</p>
                </div>
              </div>

              <div class="mt-3" v-if="myList.video">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="showVideo = !showVideo"
                >
                  <i class="fe fe-video"></i> عرض الفيديو
                </button>
                <div v-if="showVideo" class="mt-3 video-container">
                  <video
                    :src="myList.video"
                    controls
                    class="rounded store-video"
                  ></video>
                </div>
              </div>
            </div>
            <div class="col-lg-8 col-md-7">
              <div class="store-info">
                <div class="info-row">
                  <div class="info-label">اسم المتجر:</div>
                  <div class="info-value">{{ myList.name || "غير متوفر" }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">رقم الجوال:</div>
                  <div class="info-value">
                    <a :href="`tel:${myList.phone}`">{{
                      myList.phone || "غير متوفر"
                    }}</a>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-label">العنوان:</div>
                  <div class="info-value">
                    {{ getFullAddress() }}
                  </div>
                </div>
                <div class="info-row" v-if="myList.email">
                  <div class="info-label">البريد الإلكتروني:</div>
                  <div class="info-value">
                    <a :href="`mailto:${myList.email}`">{{ myList.email }}</a>
                  </div>
                </div>
                <div class="info-row" v-if="myList.created_at">
                  <div class="info-label">تاريخ الإنشاء:</div>
                  <div class="info-value">
                    {{ formatDate(myList.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="empty-state-container">
      <div class="empty-state">
        <i class="fe fe-shopping-bag empty-icon"></i>
        <h5>لا يوجد متاجر حتى الآن</h5>
        <p>قم بإضافة متجر جديد للبدء في استخدام المنصة</p>
        <button @click="ShowModeledit = true" class="btn btn-primary mt-3">
          <i class="fe fe-plus-circle me-1"></i> إضافة متجر جديد
        </button>
      </div>
    </section>

    <teleport to="body">
      <b-modal
        id="add-page"
        v-model="ShowModeledit"
        hide-footer
        title="تعديل البائع"
        centered
        size="lg"
        header-class="border-bottom pb-2"
      >
        <template #modal-header="{ close }">
          <h5 class="modal-title">تعديل البائع</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </template>
        <div class="p-0">
          <form @submit.prevent="update" class="needs-validation">
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
                <div class="pos-relative overflow-hidden file-upload-container">
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
                <div class="preview-image mt-3" v-if="imageUrl">
                  <img :src="imageUrl" alt="صورة" class="rounded" />
                </div>
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
                <span
                  v-if="isSubmitting"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
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
      showVideo: false,
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
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    getFullAddress() {
      const parts = [];
      if (this.myList.district_name) parts.push(this.myList.district_name);
      if (this.myList.city_name) parts.push(this.myList.city_name);
      if (this.myList.region_name) parts.push(this.myList.region_name);
      if (this.myList.country_name) parts.push(this.myList.country_name);

      return parts.length > 0 ? parts.join("، ") : "غير متوفر";
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

// Enhanced styles
.preview-image {
  display: flex;
  justify-content: center;
  img {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border: 1px solid #e8e8f7;
    padding: 3px;
  }
}

.file-upload-container {
  position: relative;
}

.store-header {
  margin-bottom: 1.5rem;
  .page-title {
    color: #1f2937;
    font-weight: 600;
  }
}

.loading-container {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-content {
  animation: fadeIn 0.5s ease-in-out;
}

.store-image-container {
  padding: 5px;
  border-radius: 8px;
  background-color: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.store-image {
  max-width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: contain;
}

.no-image-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #9ca3af;

  i {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
}

.video-container {
  max-width: 100%;
}

.store-video {
  max-width: 100%;
  max-height: 250px;
}

.store-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .info-row {
    display: flex;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }

  .info-label {
    flex: 0 0 120px;
    font-weight: 600;
    color: #4b5563;
  }

  .info-value {
    flex: 1;
    color: #1f2937;

    a {
      color: #e66239;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.dark-theme {
  .info-label {
    color: white;
  }

  .info-value {
    color: #fff;
  }
}

.empty-state-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 2rem;
}

.empty-state {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;

  .empty-icon {
    font-size: 4rem;
    color: #d1d5db;
    margin-bottom: 1.5rem;
  }

  h5 {
    color: #4b5563;
    margin-bottom: 1rem;
  }

  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
<style lang="scss">
// Using global styles from style.scss instead of component-specific styles
video {
  width: 100%;
  border-radius: 4px;
  background-color: #f8f8f8;
}

// Multiselect enhancements
.multiselect {
  border-color: #e8e8f7 !important;
  min-height: 38px !important;

  &.is-active {
    border-color: var(--primary-bg-color) !important;
  }
}

.multiselect-option.is-selected {
  background-color: var(--primary-bg-color) !important;
}
</style>
