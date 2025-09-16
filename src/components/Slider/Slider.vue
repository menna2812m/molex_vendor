<template>
  <section class="slider-container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="section-title mb-0">إدارة الاسلايدر</h4>
      <button @click="ShowModel = true" class="btn-add">
        <i class="fe fe-plus me-1"></i>
        اسلايد جديد
      </button>
    </div>

    <!-- Loading state -->
    <div class="loading-container" v-if="loading">
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </div>

    <!-- Content when loaded -->
    <section v-else>
      <!-- Grid view of slides -->
      <div class="row" v-if="myList.length > 0">
        <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="(item, index) in myList"
          :key="index"
        >
          <div class="slide-card card">
            <div class="slide-image-container">
              <img :src="item.image" :alt="item.title.ar" class="slide-image" />
              <div
                class="slide-status"
                :class="{ 'status-active': item.is_active }"
              >
                {{ item.is_active ? "نشط" : "غير نشط" }}
              </div>
            </div>

            <div class="slide-content">
              <h5 class="slide-title">{{ item.title.ar }}</h5>
              <p class="slide-link">{{ item.link || "لا يوجد رابط" }}</p>

              <div class="slide-actions">
                <label class="custom-switch me-3">
                  <input
                    type="checkbox"
                    class="custom-switch-input"
                    :checked="item.is_active"
                    @change="toggleactive(item.id)"
                  />
                  <span class="custom-switch-indicator"></span>
                  <span class="custom-switch-description">تفعيل</span>
                </label>

                <div class="action-buttons">
                  <button
                    class="btn btn-icon"
                    @click="edit(item)"
                    title="تعديل"
                  >
                    <i class="fe fe-edit-2 text-info"></i>
                  </button>
                  <button
                    class="btn btn-icon"
                    @click="del(item.id, index, item.title)"
                    title="حذف"
                  >
                    <i class="fe fe-trash text-danger"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" v-else>
        <div class="empty-state-message">لا يوجد اسلايدر حتي الان</div>
      </div>
    </section>

    <!-- Add Slider Modal -->
    <teleport to="body">
      <b-modal
        id="add-slide-modal"
        v-model="ShowModel"
        hide-footer
        centered
        size="md"
      >
        <h5 class="modal-title">إضافة اسلايد جديد</h5>

        <div class="modal-body-content">
          <form @submit.prevent="add" class="slide-form">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">الاسم عربي</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="أدخل العنوان بالعربي"
                    v-model="formData.title.ar"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">الاسم انجليزي</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="أدخل العنوان بالإنجليزي"
                    v-model="formData.title.en"
                  />
                </div>
              </div>

              <div class="col-12">
                <div class="form-group">
                  <label class="form-label">الرابط</label>
                  <div class="input-with-icon">
                    <i class="fe fe-link input-icon"></i>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="أدخل الرابط"
                      v-model="formData.link"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="form-group">
                  <label class="form-label">صورة الاسلايد</label>
                  <div class="image-upload-container">
                    <div class="image-upload-area" @click="triggerFileInput">
                      <input
                        type="file"
                        ref="fileInput"
                        class="file-input"
                        @change="onFileSelected"
                        accept="image/jpeg, image/png"
                      />
                      <div v-if="!imgurl.length" class="upload-placeholder">
                        <i class="fe fe-upload"></i>
                        <p>اضغط لاختيار صورة</p>
                      </div>
                      <img
                        v-else
                        :src="imgurl"
                        class="preview-image"
                        alt="معاينة الصورة"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                class="btn btn-primary"
                type="submit"
                :disabled="isLoading || !isFormValid"
              >
                <span v-if="!isLoading"> إضافة الاسلايد </span>
                <span v-if="isLoading"> جاري الاضافه... </span>
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
      </b-modal>
    </teleport>

    <!-- Edit Slider Modal -->
    <teleport to="body">
      <b-modal
        id="edit-slide-modal"
        v-model="ShowEditModel"
        hide-footer
        centered
        size="md"
      >
        <template #modal-header>
          <h5 class="modal-title">تعديل الاسلايد</h5>
        </template>

        <div class="modal-body-content">
          <form @submit.prevent="update" class="slide-form">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">الاسم عربي</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="أدخل العنوان بالعربي"
                    v-model="EditData.title.ar"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">الاسم انجليزي</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="أدخل العنوان بالإنجليزي"
                    v-model="EditData.title.en"
                  />
                </div>
              </div>

              <div class="col-12">
                <div class="form-group">
                  <label class="form-label">الرابط</label>
                  <div class="input-with-icon">
                    <i class="fe fe-link input-icon"></i>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="أدخل الرابط"
                      v-model="EditData.link"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="form-group">
                  <label class="form-label">صورة الاسلايد</label>
                  <div class="image-upload-container">
                    <div
                      class="image-upload-area"
                      @click="triggerEditFileInput"
                    >
                      <input
                        type="file"
                        ref="editFileInput"
                        class="file-input"
                        @change="editFileSelected"
                        accept="image/jpeg, image/png"
                      />
                      <img
                        :src="imageedit"
                        class="preview-image"
                        alt="معاينة الصورة"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                class="btn btn-primary"
                type="submit"
                :disabled="isEditLoading"
              >
                <span v-if="!isEditLoading"> حفظ التغييرات </span>
                <span v-if="isEditLoading"> جاري حفظ التغييرات... </span>
              </button>

              <button
                class="btn btn-light"
                type="button"
                @click="ShowEditModel = false"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </b-modal>
    </teleport>
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      textimage: "",
      changeedit: true,
      ShowModel: false,
      ShowEditModel: false,
      myList: [],
      id: null,
      imgurl: [],
      imageedit: [],
      loading: false,
      formData: {
        title: {
          ar: "",
          en: "",
        },
        link: "",
        image: "",
      },
      EditData: {
        title: {
          ar: "",
          en: "",
        },
        link: "",
        image: "",
      },
      isLoading: false,
      isEditLoading: false,
    };
  },
  computed: {
    isFormValid() {
      return this.formData.title.ar && this.formData.image;
    },
  },
  methods: {
    async toggleactive(id) {
      let res = await crudDataService.create(`sliders/${id}/toggle`, "");
      const toast = useToast();
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
        this.sliders(); // Refresh the list to update the status
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    triggerEditFileInput() {
      this.$refs.editFileInput.click();
    },

    onFileSelected(event) {
      this.formData.image = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imgurl = reader.result;
      };
      reader.readAsDataURL(this.formData.image);
    },

    editFileSelected(event) {
      console.log(event);
      if (event.target) {
        this.changeedit = false;

        this.EditData.image = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imageedit = reader.result;
        };
        reader.readAsDataURL(this.EditData.image);
      } else {
        this.changeedit = true;

        this.EditData.image = event;
      }
    },

    async edit(data) {
      this.id = data.id;
      this.ShowEditModel = true;
      this.EditData.title.ar = data.title.ar;
      this.EditData.title.en = data.title.en;
      this.EditData.link = data.link;
      (this.textimage = data.image),
        (this.EditData.image = this.editFileSelected(data.image));
      this.imageedit = data.image;
    },

    async update() {
      const toast = useToast();
      this.isEditLoading = true;
      try {
        let res = await crudDataService.create(
          `sliders/${this.id}?_method=put`,
          this.EditData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.isEditLoading = false;
        this.ShowEditModel = false;
        this.sliders();
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      } catch (error) {
        const errorData = error?.data?.errors || {};
        this.isEditLoading = false;
        if (typeof errorData === "object") {
          const errorMessages = Object.values(errorData)
            .flat()
            .filter((msg) => typeof msg === "string");
          if (errorMessages.length) {
            toast.error(errorMessages[0], {
              position: "top-center",
              timeout: 5000,
            });
          }
        } else {
          toast.error(error.data.errors, {
            position: "top-center",
            timeout: 5000,
          });
        }
      }
    },

    async sliders() {
      this.loading = true;

      try {
        let res = await crudDataService.getAll("sliders");
        this.myList = res.data.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        this.loading = false;
      }
    },

    async add() {
      const toast = useToast();
      this.isLoading = true;

      if (!this.isFormValid) {
        toast.error("يرجى ملء جميع الحقول المطلوبة", {
          position: "top-center",
          timeout: 5000,
        });
        return;
      }

      try {
        let res = await crudDataService.create(`sliders`, this.formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.isLoading = false;
        this.sliders();
        this.ShowModel = false;
        this.formData.title.ar = "";
        this.formData.title.en = "";
        this.formData.link = "";
        this.formData.image = "";
        this.imgurl = "";

        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      } catch (error) {
        const errorData = error?.data?.errors || {};
        this.isLoading = false;
        if (typeof errorData === "object") {
          const errorMessages = Object.values(errorData)
            .flat()
            .filter((msg) => typeof msg === "string");
          if (errorMessages.length) {
            toast.error(errorMessages[0], {
              position: "top-center",
              timeout: 5000,
            });
          }
        } else {
          toast.error(error.data.errors, {
            position: "top-center",
            timeout: 5000,
          });
        }
      }
    },

    del(data, index, name) {
      this.$swal
        .fire({
          title: `؟"${name.ar}" هل تريد حذف الاسلايد `,
          showCancelButton: true,
          confirmButtonText: "نعم",
          cancelButtonText: "إلغاء",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$swal.fire("تم الحذف بنجاح!", "", "success");
            crudDataService.delete("sliders", `${data}`).then(() => {
              this.myList.splice(index, 1);
            });
          }
        });
    },
  },
  mounted() {
    this.sliders();
  },
};
</script>

<style scoped lang="scss">
.slider-container {
  padding-bottom: 2rem;
}

.section-title {
  font-weight: 600;
}

.loading-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* Slide Card Styling */
.slide-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
  }
}

.slide-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.slide-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.85);
  color: #777;

  &.status-active {
    background-color: rgba(40, 167, 69, 0.85);
    color: white;
  }
}

.slide-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.slide-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.slide-link {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slide-actions {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .action-buttons {
    display: flex;
    gap: 8px;
  }
}

.custom-switch {
  display: inline-flex;
  align-items: center;

  .custom-switch-description {
    margin-right: 8px;
    font-size: 0.9rem;
    color: #555;
  }

  .custom-switch-indicator {
    border-radius: 50px;
  }
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
.modal-body-content {
  padding: 1rem;
}

.slide-form {
  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    font-weight: 500;
    margin-bottom: 8px;
    display: block;
  }

  .input-with-icon {
    position: relative;

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
    }

    .form-control {
      padding-left: 40px;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1.5rem;

  .btn {
    min-width: 120px;
  }
}

/* Image Upload Styling */
.image-upload-container {
  width: 100%;
}

.image-upload-area {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e66239;

    .upload-placeholder {
      color: #e66239;
    }
  }
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #777;

  i {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<style lang="scss">
// Modal positioning and overflow fixes
#add-slide-modal {
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
    // max-height: calc(100vh - 200px);
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
</style>
