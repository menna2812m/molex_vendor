<template>
  <section v-if="item" class="offer-details-container">
    <div class="row row-sm mt-5 pt-3">
      <div class="col-12">
        <div class="card details-card">
          <!-- Header Section -->
          <div
            class="card-header d-flex align-items-center justify-content-between"
          >
            <div class="d-flex align-items-center">
              <div class="offer-image-container">
                <img :src="item.image" alt="صورة العرض" class="offer-image" />
              </div>
              <div class="offer-header-info">
                <h5 class="offer-title mb-1">
                  {{ item.title ? item.title.ar : "" }}
                </h5>
                <p class="offer-message text-muted mb-0">
                  {{ item.message.ar }}
                </p>
              </div>
            </div>

            <div class="actions-dropdown-container">
              <button
                @click="toggleDropdown"
                class="btn btn-outline-primary dropdown-toggle"
                style="border-color: #e66239 !important; color: #e66239"
              >
                خيارات الصفحة
              </button>

              <div class="text-start dropend mt-1" v-if="isDropdownOpen">
                <a class="dropdown-item" @click="edit()">تعديل العرض </a>
              </div>
            </div>
          </div>

          <!-- Body Section -->
          <div class="card-body">
            <div class="offer-details-grid">
              <div class="offer-detail-item" v-if="item.type">
                <span class="detail-label">نوع العرض:</span>
                <span class="detail-value">{{ item.type }}</span>
              </div>

              <div class="offer-detail-item" v-if="item.value">
                <span class="detail-label">قيمة العرض:</span>
                <span class="detail-value">{{ item.value }}</span>
              </div>

              <div class="offer-detail-item" v-if="item.min_type">
                <span class="detail-label">نوع الخصم:</span>
                <span class="detail-value">{{ item.min_type }}</span>
              </div>

              <div class="offer-detail-item">
                <span class="detail-label">بداية العرض:</span>
                <span class="detail-value">{{ item.start_date }}</span>
              </div>

              <div class="offer-detail-item">
                <span class="detail-label">نهاية العرض:</span>
                <span class="detail-value">{{ item.expire_date }}</span>
              </div>

              <div class="offer-detail-item" v-if="item.min_value">
                <span class="detail-label">اقل قيمة للعرض:</span>
                <span class="detail-value">{{ item.min_value }}</span>
              </div>

              <div class="offer-detail-item" v-if="item.max_discounted_value">
                <span class="detail-label">اقصي قيمة للعرض:</span>
                <span class="detail-value">{{
                  item.max_discounted_value
                }}</span>
              </div>

              <div
                class="offer-detail-item"
                v-if="item.products && item.products.length > 0"
              >
                <span class="detail-label">عدد المنتجات داخل العرض:</span>
                <span class="detail-value">{{ item.products.length }}</span>
              </div>

              <div
                class="offer-detail-item"
                v-if="item.categories && item.categories.length > 0"
              >
                <span class="detail-label">عدد الاقسام داخل العرض:</span>
                <span class="detail-value">{{ item.categories.length }}</span>
              </div>

              <div class="offer-detail-item" v-if="item.x_quantity">
                <span class="detail-label">الكميه داخل البند x:</span>
                <span class="detail-value highlight">{{
                  item.x_quantity
                }}</span>
              </div>

              <div class="offer-detail-item" v-if="item.y_quantity">
                <span class="detail-label">الكميه داخل البند y:</span>
                <span class="detail-value highlight">{{
                  item.y_quantity
                }}</span>
              </div>

              <!-- <div class="offer-detail-item">
                <span class="detail-label">متاح:</span>
                <label class="custom-switch">
                  <input
                    type="checkbox"
                    class="custom-switch-input"
                    :checked="item.is_active"
                    disabled
                  />
                  <span class="custom-switch-indicator ms-auto"></span>
                </label>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Offer Modal -->
    <teleport to="body">
      <b-modal
        id="edit-offer-modal"
        v-model="ShowModel"
        hide-footer
        size="lg"
        centered
      >
        <div class="modal-content-wrapper">
          <div class="modal-header-custom">
            <h5 class="modal-title text-center">تعديل العرض</h5>
          </div>

          <div class="modal-body-content">
            <form @submit.prevent="update" class="offer-form">
              <div class="row g-3">
                <!-- Basic Info Section -->
                <div class="col-12 mb-3">
                  <h6 class="form-section-title">معلومات العرض الأساسية</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">اسم العرض عربي</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.title.ar"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">اسم العرض انجليزي</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.title.en"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">بداية العرض</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="formData.start_date"
                      @change="
                        conflicts(formData.start_date, formData.expire_date)
                      "
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">نهاية العرض</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="formData.expire_date"
                      @change="
                        conflicts(formData.start_date, formData.expire_date)
                      "
                    />
                  </div>
                </div>

                <!-- Image Upload -->
                <div class="col-12">
                  <div class="form-group">
                    <label class="form-label">صورة العرض</label>
                    <div class="image-upload-container">
                      <div class="image-upload-field">
                        <input
                          type="file"
                          @change="onFileSelected"
                          accept=".pdf, image/jpeg, image/png"
                          class="form-control"
                        />
                      </div>
                      <div class="image-preview">
                        <img
                          :src="imageUrl"
                          alt="صورة العرض"
                          class="offer-image-preview"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Offer Type Section -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">تفاصيل العرض</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">نوع العرض</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="type"
                      placeholder="اختر النوع"
                      v-model="formData.type"
                      @change="handleTypeChange($event)"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <!-- Rest of the form fields with dynamic rendering based on type -->
                <div class="col-md-6" v-if="showField">
                  <div class="form-group">
                    <label class="form-label">اختر البند</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="catpro"
                      placeholder="اختر البند"
                      @change="changpro($event)"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <!-- Discount Type Fields -->
                <div class="col-md-6" v-if="showdiscount">
                  <div class="form-group">
                    <label class="form-label">نوع الخصم</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="discount_type"
                      @change="changdiscount($event)"
                      v-model="formData.discount_type"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <!-- Product/Category Selection -->
                <div class="col-md-6" v-if="showField">
                  <div class="form-group">
                    <label class="form-label">اختر الخصم علي</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="allitempro"
                      mode="tags"
                      :close-on-select="false"
                      group-values="options"
                      group-label="name"
                      placeholder="الخصم علي"
                      v-model="selectedDiscountItems"
                      @change="allmulti($event)"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <!-- Buy X Get Y Fields -->
                <template v-if="showx">
                  <div class="col-12 mt-3">
                    <h6 class="form-subsection-title">تفاصيل العنصر X</h6>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">اختر البند x</label>
                      <Multiselect
                        label="name"
                        :searchable="true"
                        :options="catpro"
                        placeholder="اختر البند"
                        @change="changcatx($event)"
                        class="custom-multiselect"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">الكمية من x</label>
                      <input
                        type="number"
                        class="form-control"
                        v-model="formData.x_quantity"
                      />
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">اختر الخصم علي x</label>
                      <Multiselect
                        label="name"
                        :searchable="true"
                        :options="allitempro"
                        mode="tags"
                        :close-on-select="false"
                        group-values="options"
                        group-label="name"
                        placeholder="الخصم علي"
                        v-model="selectedDiscountItemsX"
                        @change="allmultix($event)"
                        class="custom-multiselect"
                      />
                    </div>
                  </div>
                </template>

                <!-- Buy Y Details -->
                <template v-if="showdiscount">
                  <div class="col-12 mt-3">
                    <h6 class="form-subsection-title">تفاصيل العنصر Y</h6>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">اختر البند y</label>
                      <Multiselect
                        label="name"
                        :searchable="true"
                        :options="catpro"
                        placeholder="اختر البند"
                        @change="changcaty($event)"
                        class="custom-multiselect"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">الكمية من y</label>
                      <input
                        type="number"
                        class="form-control"
                        v-model="formData.y_quantity"
                      />
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">اختر الخصم علي y</label>
                      <Multiselect
                        label="name"
                        :searchable="true"
                        :options="allitempro"
                        mode="tags"
                        :close-on-select="false"
                        group-values="options"
                        group-label="name"
                        placeholder="الخصم علي"
                        v-model="selectedDiscountItemsY"
                        @change="allmultiy($event)"
                        class="custom-multiselect"
                      />
                    </div>
                  </div>
                </template>

                <!-- Value & Discount Details -->
                <div class="col-md-6" v-if="showvalue">
                  <div class="form-group">
                    <label class="form-label">قيمة العرض</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="formData.value"
                    />
                  </div>
                </div>

                <div class="col-md-6" v-if="showField">
                  <div class="form-group">
                    <label class="form-label">نوع الخصم</label>
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="porq"
                      placeholder="الخصم علي"
                      @change="changporq($event)"
                      v-model="formData.min_type"
                      class="custom-multiselect"
                    />
                  </div>
                </div>

                <div class="col-md-6" v-if="showField">
                  <div class="form-group">
                    <label class="form-label">اقل قيمة العرض</label>
                    <div class="input-with-badge">
                      <input
                        type="number"
                        class="form-control"
                        v-model="formData.min_value"
                      />
                      <span class="input-badge" v-if="pp">{{ pp }}</span>
                    </div>
                  </div>
                </div>

                <div class="col-md-6" v-if="percshow">
                  <div class="form-group">
                    <label class="form-label">اقصي قيمة العرض</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="formData.max_discounted_value"
                    />
                  </div>
                </div>

                <!-- Message Fields -->
                <div class="col-12 mt-4 mb-3">
                  <h6 class="form-section-title">رسالة العرض</h6>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">رسالة عربي</label>
                    <textarea
                      rows="3"
                      class="form-control"
                      v-model="formData.message.ar"
                    ></textarea>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">رسالة انجليزي</label>
                    <textarea
                      rows="3"
                      class="form-control"
                      v-model="formData.message.en"
                    ></textarea>
                  </div>
                </div>

                <!-- Coupon Option -->
                <!-- <div class="col-12" v-if="showvalue">
                  <div class="form-group coupon-checkbox">
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        v-model="formData.coupon_active"
                      />
                      <span class="custom-switch-indicator"></span>
                      <span class="custom-switch-description">متاح كوبون</span>
                    </label>
                  </div>
                </div> -->
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
import moment from "moment";
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      imageUrl: null,
      isDropdownOpen: false,
      discount_type: [
        { value: "free", name: "مجانا" },
        { value: "percent", name: "سية مئوية" },
      ],
      porq: [
        { value: "price", name: "سعر" },
        { value: "quantity", name: "كمية " },
      ],

      catpro: [
        { value: "products", name: "منتج" },
        { value: "categories", name: "قسم" },
      ],
      type: [
        { value: "fixed", name: "ثابتة" },
        { value: "percent", name: "سية مئوية" },
        { value: "buy_x_get_y", name: "اشتري قطعه واحصل ع اخري" },
      ],
      ShowModel: false,
      item: null,
      showdiscount: false,
      showField: false,
      showvalue: false,
      percshow: false,
      showx: false,
      allitempro: [],
      selectedDiscountItems: [],
      selectedDiscountItemsX: [],
      selectedDiscountItemsY: [],
      pp: "",
      formData: {
        title: {
          ar: "",
          en: "",
        },
        message: {
          ar: "",
          en: "",
        },
        coupon_active: "",
        start_date: "",
        expire_date: "",
        type: "",
        value: "",
        discount_type: "",
        max_discounted_value: "",
        min_value: "",
        min_type: "",
        x_quantity: "",
        y_quantity: "",
        offerables: [],
        image: null,
      },
      conflictsdata: [],
      allpro: [],
    };
  },
  methods: {
    edit() {
      this.ShowModel = true;
      this.formData.title.ar = this.item.title.ar;
      this.formData.title.en = this.item.title.en;
      this.formData.start_date = moment(this.item.start_date).format(
        "YYYY-MM-DD"
      );
      this.formData.expire_date = moment(this.item.expire_date).format(
        "YYYY-MM-DD"
      );
      this.formData.type = this.item.type;
      this.formData.value = this.item.value;
      this.formData.discount_type = this.item.discount_type;
      this.formData.min_type = this.item.min_type;
      this.formData.min_value = this.item.min_value;
      this.formData.message.ar = this.item.message.ar;
      this.formData.message.en = this.item.message.en;
      this.formData.is_active = this.item.is_active;
      this.imageUrl = this.item.image;
      if (this.item.min_type === "price") {
        this.pp = "سعر";
      } else if (this.item.min_type === "quantity") {
        this.pp = "كمية";
      } else {
        this.pp = "";
      }
    },
    async update() {
      let res = await crudDataService.create(
        `offers/${this.$route.params.id}?_method=put`,
        this.formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      this.onecopuns();
      this.ShowModel = false;
    },
    onFileSelected(event) {
      this.formData.image = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.formData.image);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async onecopuns() {
      let res = await crudDataService.get("offers", `${this.$route.params.id}`);
      this.item = res.data.data;
    },
    changdiscount(e) {
      if (e === "free") {
        this.showvalue = false;
      } else if (e === "percent") {
        this.showvalue = true;
      }
    },
    changporq(e) {
      if (e === "price") {
        this.pp = "سعر";
      } else if (e === "quantity") {
        this.pp = "كمية";
      } else {
        this.pp = "";
      }
    },
    changpro(e) {
      // Reset selected discount items when changing product type
      this.selectedDiscountItems = [];

      this.getall(e);
      if (e === "products") {
        this.formData.offerables.push({ type: null, model_name: "product" });
      } else if (e === "categories") {
        this.formData.offerables.push({ type: null, model_name: "category" });
      }
    },
    changcaty(e) {
      this.getall(e);
      if (e === "products") {
        this.formData.offerables.push({ type: "y", model_name: "product" });
      } else if (e === "categories") {
        this.formData.offerables.push({ type: "y", model_name: "category" });
      }
    },
    changcatx(e) {
      // Reset selected discount items X when changing product type
      this.selectedDiscountItemsX = [];

      this.getall(e);
      if (e === "products") {
        this.formData.offerables.push({ type: "x", model_name: "product" });
      } else if (e === "categories") {
        this.formData.offerables.push({ type: "x", model_name: "category" });
      }
    },
    handleTypeChange(e) {
      if (e === "fixed") {
        this.showdiscount = false;
        this.showField = true;
        this.showvalue = true;
        this.percshow = false;
        this.showx = false;
      } else if (e === "percent") {
        this.showField = true;
        this.percshow = true;
        this.showdiscount = false;
        this.showvalue = true;
        this.showx = false;
      } else {
        (this.showField = false), (this.pp = "");
        this.percshow = false;
        this.formData.coupon_active = false;
        this.showvalue = false;
        this.showx = true;
        this.showdiscount = true;
      }
    },
    async getall(e) {
      if (this.conflictsdata.product || this.conflictsdata.category) {
        if (
          this.conflictsdata.product.length > 0 ||
          this.conflictsdata.category.length > 0
        ) {
          if (e === "products") {
            this.allitempro = [];
            let res = await crudDataService
              .getAll("products-without-pagination")
              .then((response) => {
                this.allpro = response.data.data.map((ele) => ({
                  value: ele.id,
                  name: ele.name.ar,
                }));
                console.log(this.conflictsdata);
                console.log(this.allpro);
                this.allpro.forEach((element) => {
                  console.log(
                    this.conflictsdata.product.includes(element.value)
                  );
                  if (!this.conflictsdata.product.includes(element.value)) {
                    this.allitempro.push(element);
                  }
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else if (e === "categories") {
            this.allitempro = [];
            let res = await crudDataService
              .getAll("categories")
              .then((response) => {
                this.allpro = response.data.data.map((ele) => ({
                  value: ele.id,
                  name: ele.name,
                }));
                this.allpro.forEach((element) => {
                  if (!this.conflictsdata.category.includes(element.value)) {
                    this.allitempro.push(element);
                  }
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      } else {
        if (e === "products") {
          let res = await crudDataService
            .getAll("products-without-pagination")
            .then((response) => {
              this.allitempro = response.data.data.map((ele) => ({
                value: ele.id,
                name: ele.name,
              }));
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (e === "categories") {
          let res = await crudDataService
            .getAll("categories")
            .then((response) => {
              this.allitempro = response.data.data.map((ele) => ({
                value: ele.id,
                name: ele.name,
              }));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    },
    allmultiy(e) {
      this.formData.offerables.forEach((element) => {
        if (element.type === "y") {
          element.ids = e;
        }
      });
      console.log(this.formData.offerables);
    },
    allmultix(e) {
      this.formData.offerables.forEach((element) => {
        if (element.type === "x") {
          element.ids = e;
        }
      });
      console.log(this.formData.offerables);
    },
    allmulti(e) {
      console.log(this.formData.offerables);

      this.formData.offerables.forEach((element) => {
        element.ids = e;
      });
    },
    async conflicts(fdate, edate) {
      if (fdate && edate) {
        let res = await crudDataService.create(`offers/conflicts`, {
          start_date: fdate,
          expire_date: edate,
        });
        this.conflictsdata = res.data.data;
      }
    },
  },
  mounted() {
    this.onecopuns();
  },
};
</script>

<style scoped lang="scss">
.offer-details-container {
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

.offer-image-container {
  width: 80px;
  height: 70px;
  overflow: hidden;
  margin-right: 1rem;
  border-radius: 6px;
}

.offer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offer-header-info {
  .offer-title {
    font-weight: 600;
    color: #333;
  }

  .offer-message {
    font-size: 0.875rem;
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

.offer-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem 2rem;

  .offer-detail-item {
    display: flex;
    align-items: center;

    .detail-label {
      font-weight: 500;
      margin-right: 0.5rem;
      min-width: 120px;
    }

    .detail-value {
      &.highlight {
        color: #e66239;
        font-weight: 500;
      }
    }
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
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.form-subsection-title {
  font-weight: 500;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 6px;
}

.form-group {
  margin-bottom: 16px;
}

.image-upload-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.image-upload-field {
  flex: 1;
}

.image-preview {
  width: 120px;
}

.offer-image-preview {
  width: 100%;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
}

.input-with-badge {
  position: relative;

  .input-badge {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 82%;
    background: #e66239;
    color: white;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.coupon-checkbox {
  margin-top: 10px;
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
// Modal positioning and overflow fixes
#edit-offer-modal {
  overflow: auto;

  .modal-dialog {
    margin: 1.75rem auto;

    @media (max-width: 576px) {
      margin: 0.5rem;
      max-width: none;
      max-height: calc(100vh - 1rem);
    }
  }

  .modal-content {
    @media (max-width: 576px) {
      max-height: calc(100vh - 1rem);
    }
  }

  .modal-header {
    display: none;
  }

  .modal-body {
    max-height: calc(100vh - 50px);
    overflow-y: auto !important;

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

// File input styling
input::file-selector-button {
  background-image: linear-gradient(to right, #e66239, #e66239) !important;
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
#edit-offer-modal {
  overflow-y: auto;

  .modal-dialog {
    margin-top: 1.75rem;
    margin-bottom: 1.75rem;
  }
}
</style>
