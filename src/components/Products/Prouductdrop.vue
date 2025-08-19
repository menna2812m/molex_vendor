// Updated Add Product Component with FormErrorMixin

<template>
  <div class="pos-relative">
    <button @click="openAddModal" class="btn-add me-0">
      <i class="fe fe-plus"></i>
      إضافة منتج جديد
    </button>

    <teleport to="body">
      <b-modal
        id="add-page"
        v-model="ShowModelEdit"
        hide-footer
        class="add"
        title="إضافة منتج"
        size="lg"
        centered
        @hidden="onModalHidden"
      >
        <div class="row pos-relative" style="z-index: 5555">
          <div class="col-lg-12">
            <!-- Show general form errors if any -->
            <div v-if="hasAnyErrors" class="alert alert-danger mb-3">
              <strong>يرجى تصحيح الأخطاء التالية:</strong>
              <ul class="mb-0 mt-2">
                <li v-for="(errors, field) in fieldErrors" :key="field">
                  {{ Array.isArray(errors) ? errors[0] : errors }}
                </li>
              </ul>
            </div>

            <form ref="anyName" @submit.prevent="add">
              <div class="row">
                <!-- Arabic Name -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label required">
                    الإسم عربي
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="أدخل اسم المنتج بالعربية"
                    v-model="formData.name.ar"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('name.ar'),
                      'is-valid': !hasFieldError('name.ar') && formData.name.ar,
                    }"
                    @input="clearFieldError('name.ar')"
                    @blur="clearFieldError('name.ar')"
                    required
                  />
                  <div v-if="hasFieldError('name.ar')" class="invalid-feedback">
                    {{ getFieldError("name.ar") }}
                  </div>
                </div>

                <!-- English Name -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label required">
                    الإسم انجليزي <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name in English"
                    v-model="formData.name.en"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('name.en'),
                      'is-valid': !hasFieldError('name.en') && formData.name.en,
                    }"
                    @input="clearFieldError('name.en')"
                    @blur="clearFieldError('name.en')"
                    required
                  />
                  <div v-if="hasFieldError('name.en')" class="invalid-feedback">
                    {{ getFieldError("name.en") }}
                  </div>
                </div>

                <!-- Arabic Description -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label"
                    >الوصف عربي <span class="text-danger">*</span>
                  </label>
                  <div
                    :class="{
                      'ckeditor-error': hasFieldError('description.ar'),
                    }"
                  >
                    <ckeditor
                      :editor="editor"
                      v-model="formData.description.ar"
                      :config="editorConfigs"
                      @ready="clearFieldError('description.ar')"
                      @input="clearFieldError('description.ar')"
                    />
                  </div>
                  <div
                    v-if="hasFieldError('description.ar')"
                    class="text-danger small mt-1"
                  >
                    {{ getFieldError("description.ar") }}
                  </div>
                </div>

                <!-- English Description -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label"
                    >الوصف انجليزي <span class="text-danger">*</span>
                  </label>
                  <div
                    :class="{
                      'ckeditor-error': hasFieldError('description.en'),
                    }"
                  >
                    <ckeditor
                      :editor="editor"
                      v-model="formData.description.en"
                      :config="editorConfigs"
                      @ready="clearFieldError('description.en')"
                      @input="clearFieldError('description.en')"
                    />
                  </div>
                  <div
                    v-if="hasFieldError('description.en')"
                    class="text-danger small mt-1"
                  >
                    {{ getFieldError("description.en") }}
                  </div>
                </div>

                <!-- Brand Selection -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label required">
                    اختر العلامة التجارية <span class="text-danger">*</span>
                  </label>
                  <div
                    :class="{
                      'border border-danger rounded': hasFieldError('brand_id'),
                    }"
                  >
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="Selectbrand"
                      placeholder="اختر العلامة التجارية"
                      v-model="formData.brand_id"
                      @change="clearFieldError('brand_id')"
                      @select="clearFieldError('brand_id')"
                    />
                  </div>
                  <div
                    v-if="hasFieldError('brand_id')"
                    class="text-danger small mt-1"
                  >
                    {{ getFieldError("brand_id") }}
                  </div>
                </div>

                <!-- Categories Selection -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label required">
                    اختر القسم <span class="text-danger">*</span>
                  </label>
                  <div
                    :class="{
                      'border border-danger rounded':
                        hasFieldError('categories_ids'),
                    }"
                  >
                    <Multiselect
                      label="name"
                      :searchable="true"
                      :options="Selectcategories"
                      placeholder="اختر القسم"
                      v-model="formData.categories_ids"
                      mode="tags"
                      :close-on-select="true"
                      group-values="options"
                      group-label="name"
                      class="itteemm"
                      @change="clearFieldError('categories_ids')"
                      @select="clearFieldError('categories_ids')"
                    >
                      <template v-slot:option="{ option }">
                        <div
                          :style="getOptionStyle(option)"
                          style="
                            padding: 10px;
                            width: 100%;
                            text-align: right;
                            margin-bottom: 2px;
                          "
                        >
                          {{ option.name }}
                        </div>
                      </template>
                    </Multiselect>
                  </div>
                  <div
                    v-if="hasFieldError('categories_ids')"
                    class="text-danger small mt-1"
                  >
                    {{ getFieldError("categories_ids") }}
                  </div>
                </div>

                <!-- Base Price -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label required">
                    السعر الأساسي <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    v-model="formData.base_price"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('base_price'),
                      'is-valid':
                        !hasFieldError('base_price') && formData.base_price,
                    }"
                    @input="clearFieldError('base_price')"
                    @blur="clearFieldError('base_price')"
                    required
                  />
                  <div
                    v-if="hasFieldError('base_price')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("base_price") }}
                  </div>
                </div>

                <!-- SEO URL -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label">لينك SEO</label>
                  <input
                    type="text"
                    placeholder="product-url-slug"
                    v-model="formData.seo_url"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('seo_url'),
                      'is-valid': !hasFieldError('seo_url') && formData.seo_url,
                    }"
                    @input="clearFieldError('seo_url')"
                    @blur="clearFieldError('seo_url')"
                  />
                  <div v-if="hasFieldError('seo_url')" class="invalid-feedback">
                    {{ getFieldError("seo_url") }}
                  </div>
                </div>

                <!-- SEO Title -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label">عنوان SEO</label>
                  <input
                    type="text"
                    placeholder="عنوان محسن لمحركات البحث"
                    v-model="formData.seo_title"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('seo_title'),
                      'is-valid':
                        !hasFieldError('seo_title') && formData.seo_title,
                    }"
                    @input="clearFieldError('seo_title')"
                    @blur="clearFieldError('seo_title')"
                  />
                  <div
                    v-if="hasFieldError('seo_title')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("seo_title") }}
                  </div>
                </div>

                <!-- SEO Description -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label">وصف SEO</label>
                  <input
                    type="text"
                    placeholder="وصف محسن لمحركات البحث"
                    v-model="formData.seo_description"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('seo_description'),
                      'is-valid':
                        !hasFieldError('seo_description') &&
                        formData.seo_description,
                    }"
                    @input="clearFieldError('seo_description')"
                    @blur="clearFieldError('seo_description')"
                  />
                  <div
                    v-if="hasFieldError('seo_description')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("seo_description") }}
                  </div>
                </div>

                <!-- Barcode -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label">باركود</label>
                  <input
                    type="text"
                    placeholder="رقم الباركود"
                    v-model="formData.barcode"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('barcode'),
                      'is-valid': !hasFieldError('barcode') && formData.barcode,
                    }"
                    @input="clearFieldError('barcode')"
                    @blur="clearFieldError('barcode')"
                  />
                  <div v-if="hasFieldError('barcode')" class="invalid-feedback">
                    {{ getFieldError("barcode") }}
                  </div>
                </div>

                <!-- Quantity -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label"
                    >كمية <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    v-model="formData.quantity"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('quantity'),
                      'is-valid':
                        !hasFieldError('quantity') && formData.quantity,
                    }"
                    @input="clearFieldError('quantity')"
                    @blur="clearFieldError('quantity')"
                  />
                  <div
                    v-if="hasFieldError('quantity')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("quantity") }}
                  </div>
                </div>

                <!-- Price -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label"
                    >السعر <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    v-model="formData.price"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('price'),
                      'is-valid': !hasFieldError('price') && formData.price,
                    }"
                    @input="clearFieldError('price')"
                    @blur="clearFieldError('price')"
                  />
                  <div v-if="hasFieldError('price')" class="invalid-feedback">
                    {{ getFieldError("price") }}
                  </div>
                </div>

                <!-- Cost Price -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label"
                    >سعر الكلفة <span class="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    v-model="formData.cost_price"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('cost_price'),
                      'is-valid':
                        !hasFieldError('cost_price') && formData.cost_price,
                    }"
                    @input="clearFieldError('cost_price')"
                    @blur="clearFieldError('cost_price')"
                  />
                  <div
                    v-if="hasFieldError('cost_price')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("cost_price") }}
                  </div>
                </div>

                <!-- Discounted Price -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label">السعر بعد الخصم</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    v-model="formData.discounted_price"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('discounted_price'),
                      'is-valid':
                        !hasFieldError('discounted_price') &&
                        formData.discounted_price,
                    }"
                    @input="clearFieldError('discounted_price')"
                    @blur="clearFieldError('discounted_price')"
                  />
                  <div
                    v-if="hasFieldError('discounted_price')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("discounted_price") }}
                  </div>
                </div>

                <!-- Discount End Date -->
                <div class="col-md-6 mt-1">
                  <label for="" class="form-label">تاريخ انتهاء الخصم</label>
                  <input
                    type="date"
                    v-model="formData.discount_end_date"
                    class="form-control"
                    :class="{
                      'is-invalid': hasFieldError('discount_end_date'),
                      'is-valid':
                        !hasFieldError('discount_end_date') &&
                        formData.discount_end_date,
                    }"
                    @input="clearFieldError('discount_end_date')"
                    @change="clearFieldError('discount_end_date')"
                  />
                  <div
                    v-if="hasFieldError('discount_end_date')"
                    class="invalid-feedback"
                  >
                    {{ getFieldError("discount_end_date") }}
                  </div>
                </div>

                <!-- Images Upload -->
                <div class="col-md-12 mt-3">
                  <label for="" class="form-label"
                    >الصوره <span class="text-danger">*</span>
                  </label>
                  <div class="form-group">
                    <input
                      type="file"
                      @change="handleFileChange"
                      accept="image/jpeg, image/jpg, image/png, video/mp4, video/mov"
                      class="form-control"
                      :class="{ 'is-invalid': hasFieldError('images') }"
                      multiple
                    />
                    <div
                      v-if="hasFieldError('images')"
                      class="invalid-feedback"
                    >
                      {{ getFieldError("images") }}
                    </div>
                    <small class="form-text text-muted">
                      أنواع الملفات المدعومة: JPG, PNG, MP4, MOV. الحد الأقصى
                      لحجم الملف: 5 ميجابايت
                    </small>

                    <!-- Image Preview -->
                    <div
                      class="d-flex flex-wrap mt-2"
                      v-if="imageUrl.length > 0"
                    >
                      <div
                        v-for="(url, index) in imageUrl"
                        :key="index"
                        class="position-relative me-2 mb-2"
                      >
                        <img
                          :src="url.path"
                          alt="Preview Image"
                          style="width: 120px; height: 120px; object-fit: cover"
                          class="border rounded"
                        />
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
                          @click="removeImage(index)"
                          title="حذف الصورة"
                        >
                          <i class="fe fe-x" style="font-size: 12px"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Validation Summary -->
              <div v-if="!isFormValid" class="alert alert-warning mt-3 mb-3">
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
                  @click="cancelAdd"
                  :disabled="isSubmitting"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting || !isFormValid"
                >
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ isSubmitting ? "جاري الإضافة..." : "إضافة" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </b-modal>
    </teleport>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { reactive } from "vue";
import crudDataService from "../../Services/crudDataService";
import Multiselect from "@vueform/multiselect";
import { useToast } from "vue-toastification";
import { FormErrorMixin } from "../../Shared/mixins/FormErrorMixin.js";

export default {
  mixins: [FormErrorMixin],
  components: {
    Multiselect,
  },

  setup() {
    const editorConfigs = reactive({
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockQuote",
        "undo",
        "redo",
      ],
    });
    return { editor: ClassicEditor, editorConfigs };
  },

  data() {
    return {
      Selectcategories: [],
      Selectbrand: [],
      imageUrl: [],
      ShowModelEdit: false,
      isSubmitting: false,

      // ✅ Form validation rules
      formValidationRules: {
        "name.ar": {
          required: true,
          label: "الاسم بالعربية",
          minLength: 2,
        },
        "name.en": {
          required: true,
          label: "الاسم بالإنجليزية",
          minLength: 2,
        },
        "description.ar": {
          required: true,
          label: "الوصف بالعربية",
          minLength: 2,
        },
        "description.en": {
          required: true,
          label: "الوصف بالإنجليزية",
          minLength: 2,
        },
        base_price: {
          required: true,
          label: "السعر الأساسي",
        },
        brand_id: {
          required: true,
          label: "العلامة التجارية",
        },
        categories_ids: {
          required: true,
          label: "الفئات",
        },
        quantity: {
          required: true,
          label: "الكمية",
        },
        price: {
          required: true,
          label: "السعر",
        },
        cost_price: {
          required: true,
          label: "سعر التكلفة",
        },
        images: {
          required: true,
          label: "الصور",
        },
      },

      // ✅ Fields to watch for automatic error clearing
      watchedFields: [
        "formData.name.ar",
        "formData.name.en",
        "formData.description.ar",
        "formData.description.en",
        "formData.base_price",
        "formData.brand_id",
        "formData.categories_ids",
        "formData.seo_url",
        "formData.seo_title",
        "formData.seo_description",
        "formData.barcode",
        "formData.quantity",
        "formData.price",
        "formData.cost_price",
        "formData.discounted_price",
        "formData.discount_end_date",
      ],

      formData: {
        name: {
          ar: "",
          en: "",
        },
        description: {
          ar: "",
          en: "",
        },
        base_price: "",
        seo_url: "",
        seo_title: "",
        seo_description: "",
        barcode: "",
        quantity: "",
        price: "",
        cost_price: "",
        discounted_price: "",
        discount_end_date: "",
        categories_ids: [],
        images: [],
        brand_id: "",
      },
    };
  },

  computed: {
    // ✅ Check if there are any errors
    hasAnyErrors() {
      return Object.keys(this.fieldErrors).length > 0;
    },

    // ✅ Check if form is valid for submission
    isFormValid() {
      return (
        this.formData.name.ar &&
        this.formData.name.en &&
        this.formData.base_price &&
        this.formData.brand_id &&
        this.formData.categories_ids.length > 0
      );
    },
  },

  methods: {
    // ✅ Open modal and clear errors
    openAddModal() {
      this.clearAllErrors();
      this.ShowModelEdit = true;
    },

    // ✅ Handle modal hidden event
    onModalHidden() {
      this.clearAllErrors();
      this.resetForm();
    },

    // ✅ Cancel add operation
    cancelAdd() {
      this.ShowModelEdit = false;
      this.clearAllErrors();
      this.resetForm();
    },

    // ✅ Reset form to initial state
    resetForm() {
      this.formData = {
        name: { ar: "", en: "" },
        description: { ar: "", en: "" },
        base_price: "",
        seo_url: "",
        seo_title: "",
        seo_description: "",
        barcode: "",
        quantity: "",
        price: "",
        cost_price: "",
        discounted_price: "",
        discount_end_date: "",
        categories_ids: [],
        images: [],
        brand_id: "",
      };
      this.imageUrl = [];
    },

    // ✅ Remove image from preview
    removeImage(index) {
      this.imageUrl.splice(index, 1);
      this.formData.images.splice(index, 1);
    },

    async getproducts() {
      let res = await crudDataService.getAll("products");
      this.$emit("allproducts", res.data.data.data);
    },

    getOptionStyle(option) {
      return {
        background: option.options ? "#d6d8dddb" : "",
      };
    },

    // ✅ Enhanced file change handler with validation
    handleFileChange(event) {
      this.clearFieldError("images");

      const files = event.target.files;
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      const allowedVideoTypes = ["video/mp4", "video/mov"];
      const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

      this.formData.images = [];
      this.imageUrl = [];

      Array.from(files).forEach((file) => {
        // Validate file size
        if (file.size > maxFileSize) {
          const toast = useToast();
          toast.error(
            `حجم الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت`,
            {
              position: "top-right",
              timeout: 5000,
            }
          );
          return;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          const toast = useToast();
          toast.error(`نوع الملف ${file.name} غير مدعوم`, {
            position: "top-right",
            timeout: 5000,
          });
          return;
        }

        this.formData.images.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl.push({
            path: e.target.result,
            thumbnail: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    },

    async getbrands() {
      try {
        const res = await crudDataService.getAll("brands");
        this.Selectbrand = res.data.data.map((ele) => ({
          value: ele.id,
          name: ele.name,
        }));
      } catch (error) {
        console.error("Error fetching brands:", error);
        const toast = useToast();
        toast.error("خطأ في تحميل العلامات التجارية", {
          position: "top-right",
          timeout: 5000,
        });
      }
    },

    async getcategories() {
      try {
        const res = await crudDataService.getAll("categories");
        const groupedCategories = [];

        res.data.data.forEach((ele) => {
          const mainCategory = {
            value: ele.id,
            name: ele.name,
            options: [],
            style: { background: "blue" },
          };

          if (ele.sub_categories && ele.sub_categories.length > 0) {
            ele.sub_categories.forEach((subCat) => {
              mainCategory.options.push({
                value: subCat.id,
                name: subCat.name,
              });
            });
          }

          groupedCategories.push(mainCategory);
        });

        this.Selectcategories = groupedCategories.reduce((acc, category) => {
          acc.push(category, ...category.options);
          return acc;
        }, []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        const toast = useToast();
        toast.error("خطأ في تحميل الفئات", {
          position: "top-right",
          timeout: 5000,
        });
      }
    },

    // ✅ Enhanced add method with proper error handling
    async add() {
      const toast = useToast();

      // Clear previous errors
      this.clearAllErrors();

      // Client-side validation
      if (!this.validateForm(this.formValidationRules)) {
        toast.error("يرجى تصحيح الأخطاء المذكورة", {
          position: "top-right",
          timeout: 5000,
        });
        return;
      }

      this.isSubmitting = true;

      try {
        const formData = new FormData();

        // Append basic fields
        formData.append("name[ar]", this.formData.name.ar);
        formData.append("name[en]", this.formData.name.en);
        formData.append("description[ar]", this.formData.description.ar);
        formData.append("description[en]", this.formData.description.en);
        formData.append("base_price", this.formData.base_price);
        formData.append("brand_id", this.formData.brand_id);

        // Append categories
        if (Array.isArray(this.formData.categories_ids)) {
          this.formData.categories_ids.forEach((categoryId, index) => {
            formData.append(`categories_ids[${index}]`, categoryId);
          });
        }

        // Append optional fields
        if (this.formData.seo_url)
          formData.append("seo_url", this.formData.seo_url);
        if (this.formData.seo_title)
          formData.append("seo_title", this.formData.seo_title);
        if (this.formData.seo_description)
          formData.append("seo_description", this.formData.seo_description);
        if (this.formData.barcode)
          formData.append("barcode", this.formData.barcode);
        if (this.formData.quantity)
          formData.append("quantity", this.formData.quantity);
        if (this.formData.price) formData.append("price", this.formData.price);
        if (this.formData.cost_price)
          formData.append("cost_price", this.formData.cost_price);
        if (this.formData.discounted_price)
          formData.append("discounted_price", this.formData.discounted_price);
        if (this.formData.discount_end_date)
          formData.append("discount_end_date", this.formData.discount_end_date);

        // Append images
        if (this.formData.images && this.formData.images.length > 0) {
          this.formData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }

        const response = await crudDataService.create("products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status) {
          toast.success(response.data.message || "تم إضافة المنتج بنجاح", {
            position: "top-right",
            timeout: 5000,
          });

          this.getproducts(); // Fetch all products after adding
          this.ShowModelEdit = false;
          this.resetForm();
        }
      } catch (error) {
        console.error("Add product error:", error);
        this.handleApiErrors(error, toast);
      } finally {
        this.isSubmitting = false;
      }
    },
  },

  // ✅ Watch for modal state changes
  watch: {
    ShowModelEdit(newVal) {
      if (!newVal) {
        // Clear errors when modal is closed
        this.clearAllErrors();
      }
    },
  },

  mounted() {
    this.getbrands();
    this.getcategories();
  },
};
</script>

<style lang="scss">
.itteemm .multiselect-option {
  padding: 0 !important;
}

.modal.show.add .modal-header {
  display: inline-flex;
}

.modal.show.add .modal-dialog {
  max-width: 900px;
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

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.125rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Responsive Design */
@media (max-width: 768px) {
  .modal.show.add .modal-dialog {
    max-width: 95%;
    margin: 0.5rem auto;
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

<style scoped lang="scss">
.dropitem {
  border: 1px solid #e8e8f7;
  margin-top: 3px;
}

/* Image preview styles */
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-0 {
  top: 0 !important;
}

.end-0 {
  right: 0 !important;
}

/* Loading state */
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
