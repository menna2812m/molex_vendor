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
        <button @click="openAddModal" class="btn btn-primary mt-3">
          <i class="fe fe-plus-circle me-1"></i> إضافة متجر جديد
        </button>
      </div>
    </section>

    <!-- Enhanced Modal with Error Handling -->
    <teleport to="body">
      <b-modal
        id="add-page"
        v-model="ShowModeledit"
        hide-footer
        title="تعديل البائع"
        centered
        size="lg"
        header-class="border-bottom pb-2"
        @hidden="onModalHidden"
      >
        <template #modal-header="{ close }">
          <h5 class="modal-title">
            {{ isEditMode ? "تعديل البائع" : "إضافة متجر جديد" }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </template>

        <div class="p-0">
          <form @submit.prevent="update" class="needs-validation">
            <div class="row">
              <!-- Store Name -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  الاسم <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': hasFieldError('name') && !formDataupdate.name,
                    'is-valid': !hasFieldError('name') && formDataupdate.name,
                  }"
                  v-model="formDataupdate.name"
                  @input="clearFieldError('name')"
                  @blur="clearFieldError('name')"
                  placeholder="أدخل اسم المتجر"
                  required
                />
                <div
                  class="invalid-feedback"
                  v-if="hasFieldError('name') && !formDataupdate.name"
                >
                  {{ getFieldError("name") }}
                </div>
              </div>

              <!-- Store Phone -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  الجوال <span class="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      hasFieldError('store_phone') &&
                      !formDataupdate.store_phone,
                    'is-valid':
                      !hasFieldError('store_phone') &&
                      formDataupdate.store_phone,
                  }"
                  v-model="formDataupdate.store_phone"
                  @input="clearFieldError('store_phone')"
                  @blur="clearFieldError('store_phone')"
                  placeholder="أدخل رقم الجوال"
                  required
                />
                <div
                  class="invalid-feedback"
                  v-if="
                    hasFieldError('store_phone') && !formDataupdate.store_phone
                  "
                >
                  {{ getFieldError("store_phone") }}
                </div>
              </div>

              <!-- Store Image -->
              <div class="col-12 mb-3">
                <label class="form-label">الصوره</label>
                <div class="pos-relative overflow-hidden file-upload-container">
                  <input
                    type="file"
                    @change="editFileSelected"
                    accept="image/jpeg, image/jpg, image/png"
                    class="form-control"
                    :class="{
                      'is-invalid':
                        hasFieldError('image') && !formDataupdate.image,
                    }"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="hasFieldError('image') && !formDataupdate.image"
                  >
                    {{ getFieldError("image") }}
                  </div>
                </div>
                <small class="form-text text-muted">
                  أنواع الملفات المدعومة: JPG, PNG. الحد الأقصى لحجم الملف: 5
                  ميجابايت
                </small>
                <div class="preview-image mt-3" v-if="imageUrl">
                  <div class="position-relative d-inline-block">
                    <img :src="imageUrl" alt="صورة" class="rounded" />
                    <button
                      type="button"
                      class="btn btn-danger btn-sm position-absolute top-0 end-0"
                      style="
                        transform: translate(50%, -50%);
                        width: 25px;
                        height: 25px;
                        padding: 0;
                        border-radius: 50%;
                      "
                      @click="removeImage"
                      title="حذف الصورة"
                    >
                      <i class="fe fe-x" style="font-size: 12px"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Store Video -->
              <div class="col-12 mb-3">
                <label class="form-label">فيديو</label>
                <div class="pos-relative overflow-hidden">
                  <input
                    type="file"
                    @change="editFilevideo"
                    accept="video/mp4, video/mov, video/webm"
                    class="form-control"
                    :class="{
                      'is-invalid':
                        hasFieldError('video') && !formDataupdate.video,
                    }"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="hasFieldError('video') && !formDataupdate.video"
                  >
                    {{ getFieldError("video") }}
                  </div>
                </div>
                <small class="form-text text-muted">
                  أنواع الملفات المدعومة: MP4, MOV, WEBM. الحد الأقصى لحجم
                  الملف: 10 ميجابايت
                </small>

                <div v-if="videoUrl" class="mt-3 position-relative">
                  <video
                    :src="videoUrl"
                    controls
                    style="width: 100%; height: 180px"
                    class="rounded"
                  ></video>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm position-absolute"
                    style="
                      top: 10px;
                      right: 10px;
                      width: 30px;
                      height: 30px;
                      padding: 0;
                      border-radius: 50%;
                    "
                    @click="removeVideo"
                    title="حذف الفيديو"
                  >
                    <i class="fe fe-x" style="font-size: 14px"></i>
                  </button>
                </div>
              </div>

              <!-- Country Selection -->
              <div class="col-12 mb-3">
                <label class="form-label required">
                  البلد <span class="text-danger">*</span>
                </label>
                <div
                  :class="{
                    'border border-danger rounded':
                      hasFieldError('country_id') && !formDataupdate.country_id,
                  }"
                >
                  <Multiselect
                    label="name"
                    :searchable="true"
                    :options="SelectOptions"
                    placeholder="اختر البلد"
                    v-model="formDataupdate.country_id"
                    @change="changecountry"
                    @select="clearFieldError('country_id')"
                  />
                </div>
                <div
                  class="text-danger small mt-1"
                  v-if="
                    hasFieldError('country_id') && !formDataupdate.country_id
                  "
                >
                  {{ getFieldError("country_id") }}
                </div>
              </div>

              <!-- Region Selection -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  الاقليم <span class="text-danger">*</span>
                </label>
                <div
                  :class="{
                    'border border-danger rounded':
                      hasFieldError('region_id') && !formDataupdate.region_id,
                  }"
                >
                  <Multiselect
                    label="name"
                    :searchable="true"
                    :options="regions"
                    placeholder="اختر الاقليم"
                    v-model="formDataupdate.region_id"
                    @change="changecities($event, regions)"
                    @select="clearFieldError('region_id')"
                    :disabled="!formDataupdate.country_id"
                  />
                </div>
                <div
                  class="text-danger small mt-1"
                  v-if="hasFieldError('region_id') && !formDataupdate.region_id"
                >
                  {{ getFieldError("region_id") }}
                </div>
              </div>

              <!-- City Selection -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  المدينة <span class="text-danger">*</span>
                </label>
                <div
                  :class="{
                    'border border-danger rounded':
                      hasFieldError('city_id') && !formDataupdate.city_id,
                  }"
                >
                  <Multiselect
                    label="name"
                    :searchable="true"
                    :options="cities"
                    placeholder="اختر المدينة"
                    v-model="formDataupdate.city_id"
                    @change="district($event, cities)"
                    @select="clearFieldError('city_id')"
                    :disabled="!formDataupdate.region_id"
                  />
                </div>
                <div
                  class="text-danger small mt-1"
                  v-if="hasFieldError('city_id') && !formDataupdate.city_id"
                >
                  {{ getFieldError("city_id") }}
                </div>
              </div>

              <!-- District Selection -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  المنطقة <span class="text-danger">*</span>
                </label>
                <div
                  :class="{
                    'border border-danger rounded':
                      hasFieldError('district_id') &&
                      !formDataupdate.district_id,
                  }"
                >
                  <Multiselect
                    label="name"
                    :searchable="true"
                    :options="districta"
                    placeholder="اختر المنطقة"
                    v-model="formDataupdate.district_id"
                    @select="clearFieldError('district_id')"
                    :disabled="!formDataupdate.city_id"
                  />
                </div>
                <div
                  class="text-danger small mt-1"
                  v-if="
                    hasFieldError('district_id') && !formDataupdate.district_id
                  "
                >
                  {{ getFieldError("district_id") }}
                </div>
              </div>
            </div>

            <!-- Form Validation Summary -->
            <div v-if="!isFormValid" class="alert alert-warning mb-3">
              <small>
                <i class="fe fe-info"></i>
                يرجى ملء جميع الحقول المطلوبة المميزة بعلامة النجمة (*) قبل
                الحفظ
              </small>
            </div>

            <!-- Submit Button -->
            <div class="text-center mt-4">
              <button
                type="button"
                class="btn btn-secondary me-2"
                @click="cancelEdit"
                :disabled="isSubmitting"
              >
                إلغاء
              </button>
              <button
                class="btn btn-primary px-4"
                type="submit"
                :disabled="isSubmitting || !isFormValid"
              >
                <span
                  v-if="isSubmitting"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{
                  isSubmitting
                    ? "جاري التحديث..."
                    : isEditMode
                    ? "تعديل"
                    : "إضافة"
                }}
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
      isEditMode: false,
      myList: {},

      // ✅ Form validation rules
      formValidationRules: {
        name: {
          required: true,
          label: "اسم المتجر",
          minLength: 2,
        },
        store_phone: {
          required: true,
          label: "جوال المتجر",
          minLength: 10,
        },
        country_id: {
          required: true,
          label: "البلد",
        },
        region_id: {
          required: true,
          label: "الاقليم",
        },
        city_id: {
          required: true,
          label: "المدينة",
        },
        district_id: {
          required: true,
          label: "المنطقة",
        },
      },

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

      // ✅ Fields to watch for clearing errors
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

  computed: {
    // ✅ Check if there are any errors
    hasAnyErrors() {
      return Object.keys(this.fieldErrors).length > 0;
    },

    // ✅ Check if form is valid for submission
    isFormValid() {
      return this.formDataupdate.name &&
        this.formDataupdate.store_phone &&
        this.formDataupdate.country_id &&
        this.formDataupdate.region_id &&
        this.formDataupdate.city_id &&
        this.formDataupdate.district_id
        ? true
        : false;
    },
  },

  methods: {
    // ✅ Open add modal
    openAddModal() {
      this.clearAllErrors();
      this.isEditMode = false;
      this.resetForm();
      this.ShowModeledit = true;
    },

    // ✅ Enhanced edit method with error clearing
    async edit(data) {
      this.clearAllErrors(); // Clear previous errors when opening modal
      this.isEditMode = true;
      this.ShowModeledit = true;
      this.id = data.id;

      // Populate form data
      this.formDataupdate.name = data.name || "";
      this.formDataupdate.store_phone = data.phone || "";
      this.formDataupdate.country_id = data.country_id || 1;
      this.formDataupdate.region_id = data.region_id || "";
      this.formDataupdate.city_id = data.city_id || "";
      this.formDataupdate.district_id = data.district_id || "";

      this.imageUrl = data.image || "";
      this.videoUrl = data.video || "";

      // Load dependent data if IDs exist
      if (this.formDataupdate.country_id) {
        await this.changecountry();
      }
      if (this.formDataupdate.region_id) {
        await this.changecities(this.formDataupdate.region_id, this.regions);
      }
      if (this.formDataupdate.city_id) {
        await this.district(this.formDataupdate.city_id, this.cities);
      }
    },

    // ✅ Cancel edit operation
    cancelEdit() {
      this.ShowModeledit = false;
      this.clearAllErrors();
      this.resetForm();
    },

    // ✅ Handle modal hidden event
    onModalHidden() {
      this.clearAllErrors();
      this.resetForm();
    },

    // ✅ Reset form to initial state
    resetForm() {
      this.formDataupdate = {
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
      };
      this.imageUrl = "";
      this.videoUrl = "";
      this.regions = [];
      this.cities = [];
      this.districta = [];
    },

    // ✅ Remove image
    removeImage() {
      this.imageUrl = "";
      this.formDataupdate.image = "";
      this.clearFieldError("image");
    },

    // ✅ Remove video
    removeVideo() {
      this.videoUrl = "";
      this.formDataupdate.video = "";
      this.clearFieldError("video");
    },

    // ✅ Enhanced update method with proper error handling
    async update() {
      const toast = useToast();

      // Clear previous errors
      this.clearAllErrors();

      this.isSubmitting = true;

      try {
        const formData = new FormData();

        // Append basic fields
        formData.append("name", this.formDataupdate.name);
        formData.append("store_phone", this.formDataupdate.store_phone);
        formData.append("country_id", this.formDataupdate.country_id);
        formData.append("region_id", this.formDataupdate.region_id);
        formData.append("city_id", this.formDataupdate.city_id);
        formData.append("district_id", this.formDataupdate.district_id);

        // Append files if they exist
        if (this.formDataupdate.image instanceof File) {
          formData.append("image", this.formDataupdate.image);
        }
        if (this.formDataupdate.video instanceof File) {
          formData.append("video", this.formDataupdate.video);
        }

        // Append arrays
        if (this.formDataupdate.brands_ids.length > 0) {
          this.formDataupdate.brands_ids.forEach((id, index) => {
            formData.append(`brands_ids[${index}]`, id);
          });
        }
        if (this.formDataupdate.categories_ids.length > 0) {
          this.formDataupdate.categories_ids.forEach((id, index) => {
            formData.append(`categories_ids[${index}]`, id);
          });
        }

        const endpoint = this.isEditMode ? `store?_method=put` : "store";
        const res = await crudDataService.create(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.status) {
          toast.success(
            res.data.message ||
              (this.isEditMode
                ? "تم تحديث المتجر بنجاح"
                : "تم إضافة المتجر بنجاح"),
            {
              position: "top-right",
              timeout: 5000,
            }
          );

          this.stores();
          this.ShowModeledit = false;
          this.resetForm();
        }
      } catch (error) {
        console.error("Store update/create error:", error);
        this.handleApiErrors(error, toast);
      } finally {
        this.isSubmitting = false;
      }
    },

    // ✅ Enhanced file handlers with validation
    editFileSelected(event) {
      this.clearFieldError("image");

      const file = event.target.files[0];
      if (!file) return;

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        const toast = useToast();
        toast.error("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت", {
          position: "top-right",
          timeout: 5000,
        });
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        const toast = useToast();
        toast.error("نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG", {
          position: "top-right",
          timeout: 5000,
        });
        return;
      }

      this.formDataupdate.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    },

    editFilevideo(event) {
      this.clearFieldError("video");

      const file = event.target.files[0];
      if (!file) return;

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        const toast = useToast();
        toast.error("حجم الفيديو كبير جداً. الحد الأقصى 10 ميجابايت", {
          position: "top-right",
          timeout: 5000,
        });
        return;
      }

      // Validate file type
      const allowedTypes = ["video/mp4", "video/mov", "video/webm"];
      if (!allowedTypes.includes(file.type)) {
        const toast = useToast();
        toast.error("نوع الملف غير مدعوم. الأنواع المدعومة: MP4, MOV, WEBM", {
          position: "top-right",
          timeout: 5000,
        });
        return;
      }

      this.formDataupdate.video = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.videoUrl = reader.result;
      };
      reader.readAsDataURL(file);
    },

    async country() {
      try {
        const result = await axios.get(
          "https://mall.alharazy.com/api/countries"
        );
        this.countries = result.data.data;
        this.SelectOptions = this.countries.map((country) => ({
          value: country.id,
          name: country.name,
        }));
      } catch (error) {
        console.error("Error fetching countries:", error);
        const toast = useToast();
        toast.error("خطأ في تحميل البلدان", {
          position: "top-right",
          timeout: 5000,
        });
      }
    },

    changecountry() {
      this.clearFieldError("country_id");

      const selectedCountry = this.countries.find(
        (country) => country.id === this.formDataupdate.country_id
      );

      if (selectedCountry && selectedCountry.regions) {
        this.regions = selectedCountry.regions.map((reg) => ({
          value: reg.id,
          name: reg.name,
          cities: reg.cities,
        }));
      } else {
        this.regions = [];
      }

      // Reset dependent fields
      this.formDataupdate.region_id = "";
      this.formDataupdate.city_id = "";
      this.formDataupdate.district_id = "";
      this.cities = [];
      this.districta = [];
    },

    changecities(events, regions) {
      this.clearFieldError("region_id");

      const regionId = events || this.formDataupdate.region_id;
      const selectedRegion = this.regions.find(
        (region) => region.value === regionId
      );

      if (selectedRegion && selectedRegion.cities) {
        this.cities = selectedRegion.cities.map((city) => ({
          value: city.id,
          name: city.name,
          districts: city.districts,
        }));
      } else {
        this.cities = [];
      }

      // Reset dependent fields
      this.formDataupdate.city_id = "";
      this.formDataupdate.district_id = "";
      this.districta = [];
    },

    district(events, dis) {
      this.clearFieldError("city_id");

      const cityId = events || this.formDataupdate.city_id;
      const selectedCity = this.cities.find((city) => city.value === cityId);

      if (selectedCity && selectedCity.districts) {
        this.districta = selectedCity.districts.map((dist) => ({
          value: dist.id,
          name: dist.name,
        }));
      } else {
        this.districta = [];
      }

      // Reset dependent field
      this.formDataupdate.district_id = "";
    },

    async stores() {
      this.loading = true;
      try {
        let res = await crudDataService.getAll("store");
        this.myList = res.data.data;
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        const toast = useToast();
        toast.error("خطأ في تحميل بيانات المتجر", {
          position: "top-right",
          timeout: 5000,
        });
      } finally {
        this.loading = false;
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
    // ✅ Reset errors when modal closes
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

.text-danger.small {
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
  display: block;
}

.form-label.required {
  position: relative;
}

.form-label .text-danger {
  color: #dc3545 !important;
  font-weight: bold;
  margin-left: 2px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  border-radius: 0.375rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-danger ul {
  margin-bottom: 0;
  padding-left: 1.25rem;
}

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffecb5;
  border-radius: 0.375rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.border-danger {
  border-color: #dc3545 !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.125rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

/* Animation for Error Display */
.invalid-feedback,
.text-danger.small {
  animation: fadeInError 0.3s ease-in-out;
}

@keyframes fadeInError {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

/* Responsive Design */
@media (max-width: 768px) {
  .store-info {
    .info-row {
      flex-direction: column;

      .info-label {
        flex: none;
        margin-bottom: 4px;
      }
    }
  }

  .preview-image img {
    width: 120px;
    height: 120px;
  }

  .invalid-feedback,
  .text-danger.small {
    font-size: 0.8rem;
  }

  .alert-danger,
  .alert-warning {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .btn:last-child {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
// Global styles
video {
  width: 100%;
  border-radius: 4px;
  background-color: #f8f8f8;
}

// Multiselect enhancements with error states
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

// Disabled state for dependent selects
.multiselect:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.multiselect:disabled .multiselect-wrapper {
  background-color: #f8f9fa;
  border-color: #e9ecef;
}

// Loading state
.btn.loading {
  position: relative;
  color: transparent;
}

.btn.loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
