<template>
  <section v-if="item" class="coupon-details-container">
    <div class="row row-sm mt-5 pt-3">
      <div class="col-12">
        <div class="card details-card">
          <!-- Header Section -->
          <div
            class="card-header d-flex align-items-center justify-content-between"
          >
            <div class="coupon-header-info">
              <h4 class="coupon-code mb-0">
                <i class="fe fe-tag me-2 text-primary"></i>{{ item.code }}
              </h4>
              <span class="coupon-name text-muted">{{ item.name }}</span>
            </div>

            <div class="actions-dropdown-container">
              <button
                @click="toggleDropdown"
                class="btn btn-outline-primary dropdown-toggle"
              >
                خيارات الصفحة
              </button>

              <div class="dropend shadow-sm" v-if="isDropdownOpen">
                <a class="dropdown-item" @click="edit()">
                  <i class="fe fe-edit me-1"></i> تعديل الكوبون
                </a>
              </div>
            </div>
          </div>

          <!-- Body Section -->
          <div class="card-body">
            <div class="coupon-details-grid">
              <!-- Discount Information -->
              <div class="coupon-details-section">
                <h6 class="details-section-title">معلومات الخصم</h6>
                <div class="details-items">
                  <div class="coupon-detail-item">
                    <span class="detail-label">نوع الخصم:</span>
                    <span class="detail-value">{{ item.discount_type }}</span>
                  </div>

                  <div class="coupon-detail-item">
                    <span class="detail-label">قيمة الخصم:</span>
                    <span class="detail-value highlight">{{
                      item.discount_value
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Validity Period -->
              <div class="coupon-details-section">
                <h6 class="details-section-title">فترة الصلاحية</h6>
                <div class="details-items">
                  <div class="coupon-detail-item">
                    <span class="detail-label">بداية التاريخ:</span>
                    <span class="detail-value">{{ item.start_date }}</span>
                  </div>

                  <div class="coupon-detail-item">
                    <span class="detail-label">نهاية التاريخ:</span>
                    <span class="detail-value">{{ item.end_date }}</span>
                  </div>
                </div>
              </div>

              <!-- Usage Limitations -->
              <div class="coupon-details-section">
                <h6 class="details-section-title">حدود الاستخدام</h6>
                <div class="details-items">
                  <div class="coupon-detail-item">
                    <span class="detail-label"
                      >الحد الأقصى للاستخدام لكل مستخدم:</span
                    >
                    <span class="detail-value">{{
                      item.max_usage_per_user
                    }}</span>
                  </div>

                  <div class="coupon-detail-item">
                    <span class="detail-label">الحد الأقصى للاستخدام:</span>
                    <span class="detail-value">{{ item.max_usage }}</span>
                  </div>
                </div>
              </div>

              <!-- Price Conditions -->
              <div class="coupon-details-section">
                <h6 class="details-section-title">شروط السعر</h6>
                <div class="details-items">
                  <div class="coupon-detail-item">
                    <span class="detail-label"
                      >الحد الأدنى للسعر دون ضريبة القيمة المضافة:</span
                    >
                    <span class="detail-value">{{
                      item.minimum_price_without_vat
                    }}</span>
                  </div>

                  <div class="coupon-detail-item">
                    <span class="detail-label">الحد الأقصى لسعر الخصم:</span>
                    <span class="detail-value">{{
                      item.max_discounted_price
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Settings -->
              <div class="coupon-details-section">
                <h6 class="details-section-title">الإعدادات</h6>
                <div class="details-items settings-grid">
                  <div class="coupon-setting-item">
                    <span class="setting-label"
                      >الحد الأقصى لرؤية السعر الخصم:</span
                    >
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        :checked="item.max_discounted_price_visibility"
                        disabled
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>

                  <div class="coupon-setting-item">
                    <span class="setting-label">توصيل مجاني:</span>
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        :checked="item.is_free_shipping"
                        disabled
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>

                  <div class="coupon-setting-item">
                    <span class="setting-label"
                      >تم استبعاد العناصر المخفضة:</span
                    >
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        :checked="item.discounted_items_excluded"
                        disabled
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>

                  <div class="coupon-setting-item">
                    <span class="setting-label">متاح:</span>
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        :checked="item.is_active"
                        disabled
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>

                  <div class="coupon-setting-item">
                    <span class="setting-label">تابعة:</span>
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        :checked="item.is_affiliated"
                        disabled
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Coupon Modal -->
    <teleport to="body">
      <b-modal
        id="edit-coupon-modal"
        v-model="ShowModel"
        hide-footer
        size="lg"
        centered
      >
        <div class="modal-content-wrapper">
          <div class="modal-header-custom">
            <h5 class="modal-title">تعديل كوبون</h5>
          </div>

          <div class="modal-body-content">
            <form @submit.prevent="update" class="coupon-form">
              <div class="row g-3">
                <!-- Basic Info Section -->
                <div class="col-12 mb-3">
                  <h6 class="form-section-title">معلومات الكوبون الأساسية</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">الاسم</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.name"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">كود</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="كود الكوبون"
                      v-model="formData.code"
                    />
                  </div>
                </div>

                <!-- Discount Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">تفاصيل الخصم</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">نوع الخصم</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="discount_type"
                      placeholder="اختر النوع"
                      v-model="formData.discount_type"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">قيمة الخصم</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.discount_value"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">بداية التاريخ</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="formData.start_date"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">نهاية التاريخ</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="formData.end_date"
                    />
                  </div>
                </div>

                <!-- Usage Limits Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">حدود الاستخدام</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label"
                      >الحد الأقصى للاستخدام لكل مستخدم</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      v-model="formData.max_usage_per_user"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">الحد الأقصى للاستخدام</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="formData.max_usage"
                    />
                  </div>
                </div>

                <!-- Commission Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">تفاصيل العمولة</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">نوع العمولة</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="comission_type"
                      placeholder="اختر النوع"
                      v-model="formData.comission_type"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">قيمة العمولة</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.comission_value"
                    />
                  </div>
                </div>

                <!-- Price Conditions Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">شروط السعر</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">الحد الأقصى لسعر الخصم</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="formData.max_discounted_price"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label"
                      >الحد الأدنى للسعر دون ضريبة القيمة المضافة</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      v-model="formData.minimum_price_without_vat"
                    />
                  </div>
                </div>

                <!-- Notes Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">ملاحظات</h6>
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">ملحوظات</label>
                    <textarea
                      rows="4"
                      class="form-control"
                      v-model="formData.notes"
                    ></textarea>
                  </div>
                </div>

                <!-- Toggle Settings Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">الإعدادات</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group setting-item">
                    <label class="form-label"
                      >الحد الأقصى لرؤية السعر الخصم</label
                    >
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        v-model="formData.max_discounted_price_visibility"
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group setting-item">
                    <label class="form-label">توصيل مجاني</label>
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        v-model="formData.is_free_shipping"
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group setting-item">
                    <label class="form-label">تم استبعاد العناصر المخفضة</label>
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        v-model="formData.discounted_items_excluded"
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group setting-item">
                    <label class="form-label">تابعة</label>
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        v-model="formData.is_affiliated"
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-primary" type="submit">
                  حفظ التعديلات
                </button>
                <button
                  class="btn btn-light"
                  type="button"
                  @click="ShowModel = false"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </b-modal>
    </teleport>
  </section>

  <!-- Loading State -->
  <section class="loading-container" v-else>
    <section class="cate"></section>
    <progress class="pure-material-progress-circular" />
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import moment from "moment";
import Multiselect from "@vueform/multiselect";
import Fillter from "./Fillter.vue";
import Tabscopuns from "./Tabscopuns.vue";
import crudDataService from "../../Services/crudDataService.js";
export default {
  components: {
    Multiselect,
    Fillter,
    Tabscopuns,
  },
  data() {
    return {
      isDropdownOpen: false,
      ShowModel: false,
      item: null,
      discount_type: [
        { value: "fixed", name: "ثابتة" },
        { value: "percent", name: "نسية مئوية" },
      ],
      comission_type: [
        { value: "fixed", name: "ثابتة" },
        { value: "percent", name: "نسية مئوية" },
      ],
      formData: {
        code: "",
        discount_type: "",
        discount_value: "",
        start_date: "",
        end_date: "",
        max_usage_per_user: null,
        max_usage: null,
        minimum_price_without_vat: null,
        max_discounted_price: null,
        max_discounted_price_visibility: false,
        is_free_shipping: false,
        discounted_items_excluded: false,
        is_affiliated: false,
        name: "",
        comission_type: "",
        comission_value: "",
        notes: "",
        couponables: [],
      },
    };
  },
  methods: {
    edit() {
      console.log(this.item);
      this.ShowModel = true;
      this.formData.code = this.item.code;
      this.formData.discount_type = this.item.discount_type;
      this.formData.discount_value = this.item.discount_value;
      this.formData.start_date = moment(this.item.start_date).format(
        "YYYY-MM-DD"
      );
      this.formData.end_date = moment(this.item.end_date).format("YYYY-MM-DD");
      this.formData.max_usage_per_user = this.item.max_usage_per_user;
      this.formData.max_usage = this.item.max_usage;
      this.formData.minimum_price_without_vat =
        this.item.minimum_price_without_vat;
      this.formData.max_discounted_price = this.item.max_discounted_price;
      this.formData.max_discounted_price_visibility =
        this.item.max_discounted_price_visibility;
      this.formData.is_free_shipping = this.item.is_free_shipping;
      this.formData.discounted_items_excluded =
        this.item.discounted_items_excluded;
      this.formData.is_affiliated = this.item.is_affiliated;
      this.formData.name = this.item.name;
      this.formData.comission_type = this.item.affiliate.comission_type;
      this.formData.comission_value = this.item.affiliate.comission_value;
      this.formData.notes = this.item.note;
    },
    async update() {
      let res = await crudDataService
        .put(`coupons/${this.$route.params.id}`, this.formData)
        .then((res) => {
          this.ShowModel = false;
          this.onecopuns();
          const toast = useToast();
          toast.success(res.data.message, {
            position: "top-center",
            timeout: 5000,
          });
        })
        .catch((error) => {
          this.ShowModel = false;

          const toast = useToast();
          toast.error(error.data.message, {
            position: "top-center",
            timeout: 5000,
          });
        });
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async onecopuns() {
      let res = await crudDataService.get(
        "coupons",
        `${this.$route.params.id}`
      );
      this.item = res.data.data;
      console.log(this.item);
    },
  },
  mounted() {
    this.onecopuns();
  },
};
</script>

<style scoped lang="scss">
.coupon-details-container {
  padding: 0 0 2rem;
}

.loading-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.details-card {
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

.card-header {
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
}

.coupon-header-info {
  .coupon-code {
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .coupon-name {
    font-size: 0.875rem;
    display: block;
    margin-top: 0.25rem;
  }
}

.actions-dropdown-container {
  position: relative;

  .btn-outline-primary {
    border-color: #e66239 !important;
    color: #e66239;
    background-color: white;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease;

    &:hover {
      color: #e66239 !important;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 160px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    margin-top: 0.5rem;
    border: 1px solid #eee;
    padding: 0.5rem 0;

    .dropdown-item {
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}

.coupon-details-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.coupon-details-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;

  &:last-child {
    border-bottom: none;
  }

  .details-section-title {
    font-weight: 600;
    color: #e66239;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .details-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }
}

.coupon-detail-item {
  display: flex;
  align-items: center;

  .detail-label {
    font-weight: 500;
    margin-right: 0.5rem;
    flex: 1;
  }

  .detail-value {
    &.highlight {
      color: #e66239;
      font-weight: 500;
    }
  }
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.coupon-setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;

  .setting-label {
    font-weight: 500;
  }
}

/* Modal Styling */
.modal-content-wrapper {
  padding: 1.5rem;
}

.modal-header-custom {
  margin-bottom: 1.5rem;
  text-align: center;

  .modal-title {
    color: #febcd5;
    font-weight: 600;
    margin-bottom: 0;
  }
}

.form-section-title {
  font-weight: 600;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 6px;
}

.form-group {
  margin-bottom: 16px;

  &.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .form-label {
      margin-bottom: 0;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;

  .btn {
    min-width: 120px;
  }
}

.custom-multiselect {
  :deep(.multiselect-tag) {
    background: #e66239;
  }

  :deep(.multiselect-option.is-selected) {
    background: #e66239;
  }

  :deep(.multiselect-option.is-pointed) {
    background: #f8f8f8;
  }
}

.custom-switch {
  display: inline-flex;
  align-items: center;

  .custom-switch-indicator {
    border-radius: 50px;
  }
}
</style>

<style lang="scss">
.modal {
  overflow: auto;

  .modal-dialog {
    margin: 1.75rem auto;
    max-height: calc(100vh - 3.5rem);

    @media (max-width: 576px) {
      margin: 0.5rem;
      max-width: none;
      max-height: calc(100vh - 1rem);
    }
  }

  .modal-content {
    border-radius: 8px;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-height: calc(100vh - 3.5rem);
    overflow: hidden;

    @media (max-width: 576px) {
      max-height: calc(100vh - 1rem);
    }
  }

  .modal-header {
    display: none;
  }

  .modal-body {
    max-height: calc(100vh - 50px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }
}

// Backdrop positioning
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1050;
}

// Ensure proper z-index layering
.modal {
  z-index: 1055;
}

// Specific modal positioning
#edit-coupon-modal {
  overflow-y: auto;

  .modal-dialog {
    margin-top: 1.75rem;
    margin-bottom: 1.75rem;
  }
}
</style>
