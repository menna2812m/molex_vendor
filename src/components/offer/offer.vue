<template>
  <section class="mt-5">
    <button @click="ShowModel = true" class="btn-add me-0 mb-4">
      <i class="fe fe-plus"></i>
      عرض جديد
    </button>
    <section
      class="position-relative"
      style="height: 100vh; display: grid; place-items: center"
      v-if="loading"
    >
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </section>
    <section v-else>
      <!-- Table with data -->
      <div class="card custom-card" v-if="myList.length > 0">
        <div class="card-body p-0">
          <div class="table-responsive border-0 rounded">
            <table class="table offers-table">
              <thead>
                <tr>
                  <th class="text-muted">اسم العرض</th>
                  <th class="text-muted">تاريخ بداية العرض</th>
                  <th class="text-muted">تاريخ انتهاء العرض</th>
                  <th class="text-muted text-center">الحالة</th>
                  <th class="text-muted text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in myList"
                  :key="index"
                  class="list_item"
                >
                  <td class="offer-name" @click="singleoffer(item.id)">
                    {{ item.title }}
                  </td>
                  <td>{{ item.start_date }}</td>
                  <td>{{ item.expire_date }}</td>
                  <td>
                    <label class="custom-switch justify-content-center w-100">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        :checked="item.is_active"
                        @change="toggleactive(item.id)"
                      />
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-icon btn-sm"
                      @click="del(item.id, index, item.title)"
                    >
                      <i class="fe fe-trash text-danger"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" v-else>
        <div class="empty-state-message">لا يوجد عروض حتي الان</div>
      </div>
    </section>

    <!-- Add new offer modal -->
    <teleport to="body">
      <b-modal
        id="add-offer"
        v-model="ShowModel"
        hide-footer
        size="lg"
        centered
        modal-class="offer-isolated-modal"
      >
        <div class="modal-content-wrapper">
          <div class="modal-header-icon">
            <img src="../../assets/img/dis.png" alt="offer icon" />
          </div>

          <div class="modal-body-content offer-isolated-modal-content">
            <h5 class="modal-title text-center mb-4">إنشاء عرض جديد</h5>

            <form @submit.prevent="add" class="offer-form">
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
                <div class="col-12" v-if="showvalue">
                  <div class="form-group coupon-checkbox">
                    <label class="custom-switch">
                      <input
                        type="checkbox"
                        class="custom-switch-input"
                        @change="changecoupon($event)"
                      />
                      <span class="custom-switch-indicator"></span>
                      <span class="custom-switch-description">متاح كوبون</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-primary" type="submit">
                  اضافة العرض
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
</template>

<script>
import { useToast } from "vue-toastification";
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
import offerimage from "../../assets/img/offer.png";
import { error } from "jquery";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      imageUrl: offerimage,
      showdiscount: false,
      showField: false,
      showvalue: false,
      percshow: false,
      showx: false,
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
      myList: [],
      loading: false,
      allitempro: [],
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
        coupon_active: false,
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
        image: "",
      },
      conflictsdata: [],
      allpro: [],
    };
  },
  methods: {
    changecoupon(e) {
      if (e.target.checked) {
        this.formData.coupon_active = 1;
      } else {
        this.formData.coupon_active = 0;
      }
    },
    onFileSelected(event) {
      this.formData.image = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.formData.image);
    },
    async toggleactive(id) {
      let res = await crudDataService.create(`offers/${id}/toggle`, "");
      const toast = useToast();
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      }
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
          console.log(e);

          if (e === "products") {
            console.log(e);
            this.allitempro = [];
            let res = await crudDataService
              .getAll("products-without-pagination")
              .then((response) => {
                this.allpro = response.data.data.map((ele) => ({
                  value: ele.id,
                  name: ele.name,
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
                  console.log(
                    this.conflictsdata.category.includes(element.value)
                  );
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
    async offers() {
      this.loading = true; // Start loading
      try {
        let res = await crudDataService.getAll("offers");
        this.myList = res.data.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error
      } finally {
        this.loading = false; // End loading regardless of success or failure
      }
    },
    singleoffer(id) {
      this.$router.push({ name: "SingleOffer", params: { id } });
    },
    del(data, index, name) {
      this.$swal
        .fire({
          title: `؟"${name}" هل تريد حذف العرض `,
          showCancelButton: true,
          confirmButtonText: "نعم",
          cancelButtonText: "إلغاء",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$swal.fire("تم الحذف بنجاح!", "", "success");
            crudDataService.delete("offers", `${data}`).then(() => {
              this.myList.splice(index, 1);
            });
          }
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

    async add() {
      if (!this.formData.image && this.imageUrl) {
        try {
          const response = await fetch(this.imageUrl);
          const blob = await response.blob();
          this.formData.image = new File([blob], "filename.jpg", {
            type: "image/jpeg",
          });
        } catch (error) {
          console.error("Error downloading image:", error);
          return;
        }
      }

      let res = await crudDataService
        .create(`offers`, this.formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.ShowModel = false;
          this.offers();
          (this.formData.title.ar = ""),
            (this.formData.title.en = ""),
            (this.formData.is_active = ""),
            (this.formData.start_date = ""),
            (this.formData.expire_date = ""),
            (this.formData.type = ""),
            (this.formData.message = ""),
            (this.formData.value = ""),
            (this.formData.x_quantity = ""),
            (this.formData.y_quantity = ""),
            (this.formData.discount_type = ""),
            (this.formData.products_x = ""),
            (this.formData.products_y = ""),
            (this.formData.categories_x = ""),
            (this.formData.categories_y = "");
        });
    },
  },
  mounted() {
    this.offers();
  },
};
</script>

<style scoped lang="scss">
.offer-container {
  padding-bottom: 2rem;
}

.section-title {
  color: #14112d;
  font-weight: 600;
}

.loading-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.card {
  border-radius: 8px;
  border: none;
  box-shadow: 0px 3px 10px rgba(230, 237, 240, 0.5);
  overflow: hidden;
}

.offers-table {
  margin-bottom: 0;

  thead tr {
    th {
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }
  }

  tbody tr {
    transition: background 0.2s ease;
  }

  td {
    padding: 12px 16px;
    vertical-align: middle;
  }

  .offer-name {
    font-weight: 500;
    cursor: pointer;
    color: #e66239;

    &:hover {
      text-decoration: underline;
    }
  }
}

.list_item:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #eee;

  &:hover {
    background: #f8f8f8;
  }
}

.empty-state {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  &-message {
    background: #e66239;
    padding: 20px 30px;
    border-radius: 8px;
    color: white;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    box-shadow: 0 4px 12px rgba(230, 98, 57, 0.2);
  }
}

/* Modal Styling */
.modal-content-wrapper {
  padding: 1rem;
  position: relative;
}
.modal-body-content {
  height: 85vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 8px;
}
.modal-header-icon {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 666;
  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
}

.modal-body-content {
  padding-top: 50px;
}

.modal-title {
  color: #febcd5;
  font-weight: 600;
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
    right: 10px;
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

  :deep(.multiselect-option.is-pointed) {
    background: #f8f8f8;
    color: #333;
  }
}
</style>

<style lang="scss">
.offer-isolated-modal {
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
    overflow: unset !important;

    @media (max-width: 576px) {
      max-height: calc(100vh - 1rem);
    }
  }

  .modal-header {
    display: none;
  }

  .modal-body {
    max-height: calc(100vh - 50px);
    overflow-y: unset !important;

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

  & .multiselect-placeholder,
  & ::placeholder {
    font-size: 13px;
    color: #aaa;
  }
}

// Backdrop positioning
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1050;
}

// Ensure proper z-index layering
.offer-isolated-modal {
  z-index: 1055;
}

// Dropdown positioning fixes
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
