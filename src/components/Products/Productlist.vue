<template>
  <div class="panel panel-primary tabs-style-3 border-0 p-0">
    <div class="tab-menu-heading">
      <div class="tabs-menu d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <Prouductdrop @allproducts="updateProductsList" />
          <!-- <div
            v-if="listofproducr.length >= 1"
            class="px-3 py-1 ms-2 border rounded pos-relative"
          >
            <input
              type="checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
            />
            <button
              @click="toggleDropdown"
              class="bg-transparent py-1 border-0 me-0"
            >
              المنتجات المحددة
              <span style="color: #fb99bf">
                ( {{ listofproducr.length }} )
              </span>
            </button>
            <div v-if="isDropdownOpen" class="dropitem" style="z-index: 4444">
              <div class="tx-13 text-start">
                <a
                  class="dropdown-item bg-transparent text-muted d-flex border-bottom"
                  @click="
                    ShowModel = true;
                    isDropdownOpen = false;
                  "
                >
                  <img
                    src="../../assets/img/delete-empty.png"
                    class="h-25 px-2 pt-1"
                    alt=""
                  />

                  <p class="mb-0 text-danger">حذف المنتج نهائيا</p>
                </a>
              </div>
            </div>
          </div> -->
        </div>
        <!-- Tabs -->
        <ul class="nav panel-tabs edit-nav">
          <li>
            <a href="#tab12" data-bs-toggle="tab" class="py-1">
              <i class="mdi mdi-apps fs-5"></i>
            </a>
          </li>
          <li class="">
            <a href="#tab11" class="active px-3" data-bs-toggle="tab">
              <i class="fa fa-bars fs-6"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <section
      class="position-relative"
      style="height: 100vh; display: grid; place-items: center"
      v-if="loading"
    >
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </section>
    <div v-else>
      <div class="panel-body tabs-menu-body px-0" v-if="items.length > 0">
        <div class="tab-content">
          <div class="tab-pane active" id="tab11">
            <div
              class="row border rounded mb-2 p-2"
              v-for="(item, index) in items"
              :key="index"
            >
              <div class="col-md-4 overflow-hidden">
                <vueper-slides fade>
                  <vueper-slide
                    v-for="img in item.images"
                    :key="img.id"
                    :image="img.path"
                  />
                </vueper-slides>
              </div>
              <div class="col-md-6">
                <div class="h-100 border rounded p-2">
                  <div class="row">
                    <div class="col-md-4">
                      <p class="fw-bold mb-1 mb-1">
                        الاسم :
                        <span class="fw-semibold"> {{ item.name.ar }}</span>
                      </p>
                      <p class="fw-bold mb-1" v-if="item.current_price">
                        السعر بعد الخصم :
                        <span class="fw-semibold">
                          {{ item.current_price }}</span
                        >
                      </p>
                      <p class="fw-bold mb-1" v-else>
                        السعر :
                        <span class="fw-semibold"> {{ item.base_price }}</span>
                      </p>
                    </div>
                    <div class="col-md-4">
                      <p class="fw-bold mb-1">
                        التقييم :
                        <span class="fw-semibold"> {{ item.rating }}</span>
                      </p>

                      <p class="fw-bold mb-1">
                        عدد المقيمين :
                        <span class="fw-semibold">
                          {{ item.raters_count }}</span
                        >
                      </p>
                    </div>
                    <div class="col-md-4">
                      <p class="fw-bold mb-1">
                        جميع الطلبات :
                        <span class="fw-semibold">
                          {{ item.total_orders }}</span
                        >
                      </p>

                      <p class="fw-bold mb-1">
                        كمية الطلبات :
                        <span class="fw-semibold">
                          {{ item.total_orders_quantity }}</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="d-flex h-100 align-items-center flex-wrap">
                  <button
                    class="btn btn-info rounded m-1 border-0"
                    @click="edit(item)"
                  >
                    <i class="fe fe-edit-2"></i>
                  </button>
                  <button
                    class="btn btn-danger rounded m-1 border-0"
                    @click="del(item.id, index, item.name)"
                  >
                    <i class="fe fe-trash"></i>
                  </button>
                  <button
                    class="btn btn-success rounded m-1 border-0"
                    @click="addoption(item)"
                  >
                    <i class="fe fe-plus"></i>
                  </button>
                  <div class="">
                    <!-- <input type="text" class="form-control w-100"> -->
                    <label class="custom-switch justify-content-center">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        class="custom-switch-input"
                        :checked="item.is_active"
                        @change="toggleactive(item.id)"
                      />
                      <span class="custom-switch-description"> </span>
                      <span class="custom-switch-indicator"></span>
                    </label>
                    <!-- <button class="btn-add fs-15 twobtn ms-0">
            <i class="ion-reply"></i>
             رد
              
             الموافقة
           </button> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane" id="tab12">
            <div class="row">
              <div class="col-md-4" v-for="(item, index) in items" :key="index">
                <div class="card mb-2 align-start overflow-hidden">
                  <!-- <input
                    class="ms-2 mt-2"
                    type="checkbox"
                    @change="selectthis($event.target.checked, $event.target)"
                  /> -->

                  <div class="pb-2">
                    <vueper-slides fade>
                      <vueper-slide
                        v-for="img in item.images"
                        :key="img.id"
                        :image="img.path"
                      />
                    </vueper-slides>
                  </div>
                  <div class="h-100 rounded p-2">
                    <p class="fw-bold mb-1 mb-1">
                      الاسم :
                      <span class="fw-semibold"> {{ item.name.ar }}</span>
                    </p>
                    <p class="fw-bold mb-1">
                      السعر :
                      <span class="fw-semibold"> {{ item.base_price }}</span>
                    </p>
                    <p class="fw-bold mb-1">
                      التقييم :
                      <span class="fw-semibold"> {{ item.rating }}</span>
                    </p>

                    <p class="fw-bold mb-1">
                      عدد المقيمين :
                      <span class="fw-semibold"> {{ item.raters_count }}</span>
                    </p>
                    <p class="fw-bold mb-1">
                      جميع الطلبات :
                      <span class="fw-semibold"> {{ item.total_orders }}</span>
                    </p>

                    <p class="fw-bold mb-1">
                      كمية الطلبات :
                      <span class="fw-semibold">
                        {{ item.total_orders_quantity }}</span
                      >
                    </p>
                    <div class="text-center">
                      <button
                        class="btn btn-info rounded m-1 border-0"
                        @click="edit(item)"
                      >
                        <i class="fe fe-edit-2"></i>
                      </button>
                      <button
                        class="btn btn-danger rounded m-1 border-0"
                        @click="del(item.id, index, item.name)"
                      >
                        <i class="fe fe-trash"></i>
                      </button>
                      <button
                        class="btn btn-success rounded m-1 border-0"
                        @click="addoption(item)"
                      >
                        <i class="fe fe-plus"></i>
                      </button>
                      <label class="custom-switch justify-content-center">
                        <input
                          type="checkbox"
                          name="custom-switch-checkbox"
                          class="custom-switch-input"
                          :checked="item.is_active"
                          @change="toggleactive(item.id)"
                        />
                        <span class="custom-switch-description"> </span>
                        <span class="custom-switch-indicator"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        style="height: 100vh; display: grid; place-items: center"
        v-else
      >
        <div
          style="background: #e66239; padding: 30px; font-size: 20px"
          class="w-50 text-center text-white rounded-10"
        >
          لا يوجد منتجات حتي الان
        </div>
      </section>
    </div>
    <!-- Edit Product Modal with improved positioning -->
    <teleport to="body">
      <b-modal
        id="edit-product-modal"
        v-model="ShowModelEdit"
        hide-footer
        class="edit-modal"
        title="تعديل منتج"
        size="xl"
        centered
        scrollable
      >
        <div class="modal-content-wrapper">
          <form @submit.prevent="update" class="product-edit-form">
            <div class="row">
              <!-- Arabic Name -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">الإسم عربي</label>
                <input
                  type="text"
                  v-model="formData.name.ar"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('name.ar') }"
                  @input="clearFieldError('name.ar')"
                  placeholder="أدخل اسم المنتج بالعربية"
                />
                <div v-if="hasFieldError('name.ar')" class="invalid-feedback">
                  {{ getFieldError("name.ar") }}
                </div>
              </div>

              <!-- English Name -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">الإسم انجليزي</label>
                <input
                  type="text"
                  v-model="formData.name.en"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('name.en') }"
                  @input="clearFieldError('name.en')"
                  placeholder="Enter product name in English"
                />
                <div v-if="hasFieldError('name.en')" class="invalid-feedback">
                  {{ getFieldError("name.en") }}
                </div>
              </div>

              <!-- Arabic Description -->
              <div class="col-md-6 mb-3">
                <label class="form-label">الوصف عربي</label>
                <ckeditor
                  :editor="editor"
                  v-model="formData.description.ar"
                  :config="editorConfigs"
                  :class="{ 'is-invalid': hasFieldError('description.ar') }"
                  @ready="clearFieldError('description.ar')"
                />
                <div
                  v-if="hasFieldError('description.ar')"
                  class="invalid-feedback d-block"
                >
                  {{ getFieldError("description.ar") }}
                </div>
              </div>

              <!-- English Description -->
              <div class="col-md-6 mb-3">
                <label class="form-label">الوصف انجليزي</label>
                <ckeditor
                  :editor="editor"
                  v-model="formData.description.en"
                  :config="editorConfigs"
                  :class="{ 'is-invalid': hasFieldError('description.en') }"
                  @ready="clearFieldError('description.en')"
                />
                <div
                  v-if="hasFieldError('description.en')"
                  class="invalid-feedback d-block"
                >
                  {{ getFieldError("description.en") }}
                </div>
              </div>

              <!-- Brand Selection -->
              <div class="col-md-6 mb-3">
                <label class="form-label">اختر العلامة التجارية</label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="Selectbrand"
                  placeholder="اختر العلامة التجارية"
                  v-model="formData.brand_id"
                  :class="{ 'is-invalid': hasFieldError('brand_id') }"
                  @change="clearFieldError('brand_id')"
                />
                <div
                  v-if="hasFieldError('brand_id')"
                  class="invalid-feedback d-block"
                >
                  {{ getFieldError("brand_id") }}
                </div>
              </div>

              <!-- Categories Selection -->
              <div class="col-md-6 mb-3">
                <label class="form-label">اختر القسم</label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="Selectcategories"
                  placeholder="اختر القسم"
                  v-model="formData.categories_ids"
                  mode="tags"
                  :close-on-select="false"
                  group-values="options"
                  group-label="name"
                  :class="{ 'is-invalid': hasFieldError('categories_ids') }"
                  @change="clearFieldError('categories_ids')"
                >
                  <template v-slot:option="{ option }">
                    <div
                      :style="getOptionStyle(option)"
                      class="multiselect-option"
                    >
                      {{ option.name }}
                    </div>
                  </template>
                </Multiselect>
                <div
                  v-if="hasFieldError('categories_ids')"
                  class="invalid-feedback d-block"
                >
                  {{ getFieldError("categories_ids") }}
                </div>
              </div>

              <!-- Base Price -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">السعر الأساسي</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  v-model="formData.base_price"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('base_price') }"
                  @input="clearFieldError('base_price')"
                  placeholder="0.00"
                />
                <div
                  v-if="hasFieldError('base_price')"
                  class="invalid-feedback"
                >
                  {{ getFieldError("base_price") }}
                </div>
              </div>

              <!-- SEO URL -->
              <div class="col-md-6 mb-3">
                <label class="form-label">لينك SEO</label>
                <input
                  type="text"
                  v-model="formData.seo_url"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('seo_url') }"
                  @input="clearFieldError('seo_url')"
                  placeholder="product-url-slug"
                />
                <div v-if="hasFieldError('seo_url')" class="invalid-feedback">
                  {{ getFieldError("seo_url") }}
                </div>
              </div>

              <!-- SEO Title -->
              <div class="col-md-6 mb-3">
                <label class="form-label">عنوان SEO</label>
                <input
                  type="text"
                  v-model="formData.seo_title"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('seo_title') }"
                  @input="clearFieldError('seo_title')"
                  placeholder="عنوان محسن لمحركات البحث"
                />
                <div v-if="hasFieldError('seo_title')" class="invalid-feedback">
                  {{ getFieldError("seo_title") }}
                </div>
              </div>

              <!-- SEO Description -->
              <div class="col-md-6 mb-3">
                <label class="form-label">وصف SEO</label>
                <input
                  type="text"
                  v-model="formData.seo_description"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('seo_description') }"
                  @input="clearFieldError('seo_description')"
                  placeholder="وصف محسن لمحركات البحث"
                />
                <div
                  v-if="hasFieldError('seo_description')"
                  class="invalid-feedback"
                >
                  {{ getFieldError("seo_description") }}
                </div>
              </div>

              <!-- Barcode -->
              <div class="col-md-6 mb-3">
                <label class="form-label">باركود</label>
                <input
                  type="text"
                  v-model="formData.barcode"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('barcode') }"
                  @input="clearFieldError('barcode')"
                  placeholder="رقم الباركود"
                />
                <div v-if="hasFieldError('barcode')" class="invalid-feedback">
                  {{ getFieldError("barcode") }}
                </div>
              </div>

              <!-- Quantity -->
              <div class="col-md-6 mb-3">
                <label class="form-label">كمية</label>
                <input
                  type="number"
                  min="0"
                  v-model="formData.quantity"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('quantity') }"
                  @input="clearFieldError('quantity')"
                  placeholder="0"
                />
                <div v-if="hasFieldError('quantity')" class="invalid-feedback">
                  {{ getFieldError("quantity") }}
                </div>
              </div>

              <!-- Price -->
              <div class="col-md-6 mb-3">
                <label class="form-label">السعر</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  v-model="formData.price"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('price') }"
                  @input="clearFieldError('price')"
                  placeholder="0.00"
                />
                <div v-if="hasFieldError('price')" class="invalid-feedback">
                  {{ getFieldError("price") }}
                </div>
              </div>

              <!-- Cost Price -->
              <div class="col-md-6 mb-3">
                <label class="form-label">سعر الكلفة</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  v-model="formData.cost_price"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('cost_price') }"
                  @input="clearFieldError('cost_price')"
                  placeholder="0.00"
                />
                <div
                  v-if="hasFieldError('cost_price')"
                  class="invalid-feedback"
                >
                  {{ getFieldError("cost_price") }}
                </div>
              </div>

              <!-- Discounted Price -->
              <div class="col-md-6 mb-3">
                <label class="form-label">السعر بعد الخصم</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  v-model="formData.discounted_price"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('discounted_price') }"
                  @input="clearFieldError('discounted_price')"
                  placeholder="0.00"
                />
                <div
                  v-if="hasFieldError('discounted_price')"
                  class="invalid-feedback"
                >
                  {{ getFieldError("discounted_price") }}
                </div>
              </div>

              <!-- Discount End Date -->
              <div class="col-md-6 mb-3">
                <label class="form-label">تاريخ انتهاء الخصم</label>
                <input
                  type="date"
                  v-model="formData.discount_end_date"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('discount_end_date') }"
                  @input="clearFieldError('discount_end_date')"
                />
                <div
                  v-if="hasFieldError('discount_end_date')"
                  class="invalid-feedback"
                >
                  {{ getFieldError("discount_end_date") }}
                </div>
              </div>

              <!-- Images Upload -->
              <div class="col-12 mb-3">
                <label class="form-label">الصور والفيديوهات</label>
                <input
                  type="file"
                  @change="handleFileChange"
                  accept="image/jpg, image/jpeg, image/png, video/mp4,video/mov"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('images') }"
                  multiple
                />
                <div v-if="hasFieldError('images')" class="invalid-feedback">
                  {{ getFieldError("images") }}
                </div>

                <!-- Media Preview -->
                <div
                  class="media-preview mt-3"
                  v-if="imageUrls.length || videoUrls.length"
                >
                  <div class="d-flex flex-wrap gap-3">
                    <!-- Image Previews -->
                    <div
                      v-for="(file, index) in imageUrls"
                      :key="'image-' + index"
                      class="media-item"
                    >
                      <img
                        v-if="
                          file && file.type && file.type.startsWith('image')
                        "
                        :src="file.path"
                        alt="Image preview"
                        class="preview-image"
                      />
                      <button
                        type="button"
                        class="btn-remove"
                        @click="removeMedia(file.id, index, 'image')"
                        title="حذف الصورة"
                      >
                        <i class="mdi mdi-close"></i>
                      </button>
                    </div>

                    <!-- Video Previews -->
                    <div
                      v-for="(file, index) in videoUrls"
                      :key="'video-' + index"
                      class="media-item"
                    >
                      <video
                        v-if="
                          file && file.type && file.type.startsWith('video')
                        "
                        class="preview-video"
                        controls
                      >
                        <source :src="file.path" :type="file.type" />
                      </video>
                      <button
                        type="button"
                        class="btn-remove"
                        @click="removeMedia(file.id, index, 'video')"
                        title="حذف الفيديو"
                      >
                        <i class="mdi mdi-close"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer-custom">
              <button
                type="button"
                class="btn btn-secondary me-2"
                @click="cancelEdit"
              >
                إلغاء
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isUpdating"
              >
                <span
                  v-if="isUpdating"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ isUpdating ? "جاري الحفظ..." : "حفظ التعديلات" }}
              </button>
            </div>
          </form>
        </div>
      </b-modal>
    </teleport>

    <!-- Product Options Modal with improved positioning -->
    <teleport to="body">
      <b-modal
        id="product-options-modal"
        v-model="addModel"
        hide-footer
        class="options-modal"
        title="خيارات المنتج"
        size="lg"
        centered
        scrollable
      >
        <div class="mt-4">
          <div class="form-group">
            <label class="custom-switch">
              <input
                type="checkbox"
                name="custom-switch-checkbox"
                class="custom-switch-input"
                @change="showdetail($event)"
              />
              <span class="custom-switch-indicator"></span>
              <span class="custom-switch-description">
                تفعيل خيارات المنتج</span
              >
            </label>
          </div>

          <div v-if="cardnew">
            <div class="row" v-for="(option, i) in options" :key="i">
              <div class="col-md-6 mb-2">
                <input
                  v-model="option.id"
                  type="number"
                  class="form-control mb-2"
                  placeholder="الرقم التسلسلي"
                />
                <input
                  v-model="option.name.ar"
                  placeholder="مسمي الخيار مثل (اللون و المقاس)"
                  type="text"
                  class="form-control mb-2"
                />
              </div>
              <div class="col-md-6 mb-2">
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="Selectone"
                  @change="selctchange($event, i)"
                  v-model="option.select"
                  class="mb-2"
                />
                <input
                  v-model="option.name.en"
                  placeholder="Name the option, such as (color and size)"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-12 mb-2">
                <div v-for="(element, index) in option.values" :key="index">
                  <input
                    v-model="element.id"
                    type="number"
                    class="form-control mb-2"
                    placeholder="الرقم التسلسلي"
                  />
                  <div class="pos-relative">
                    <input
                      v-if="option.is_color"
                      type="color"
                      class="pos-absolute p-0 border-0"
                      style="width: 40px; top: 5px; left: 25px"
                      v-model="element.color"
                    />
                    <input
                      type="text"
                      class="form-control mb-2"
                      :placeholder="'القيمة' + `${index + 1}`"
                      v-model="element.value.ar"
                      @keyup="addElement"
                    />
                  </div>

                  <input
                    type="text"
                    class="form-control mb-2"
                    :placeholder="'value' + `${index + 1}`"
                    v-model="element.value.en"
                    @keyup="addElement"
                  />
                </div>
              </div>

              <div class="col-12 mb-2">
                <button
                  @click="addNewInput(i)"
                  class="w-100 p-2 bg-transparent rounded"
                  style="border: 1px dashed #87a9e3"
                >
                  <i class="fa fa-plus"></i>
                  اضافة قيمة جديدة
                </button>
              </div>
            </div>
            <button
              @click="addNewOption"
              class="w-100 p-2 bg-transparent rounded mb-2"
              style="border: 1px dashed #87a9e3"
            >
              <i class="fa fa-plus"></i>
              اضافة خيار جديد
            </button>
            <button
              @click="addalloptions"
              class="w-100 p-2 bg-primary rounded mb-2 border-0"
            >
              <i class="fa fa-plus"></i>
              اضافة للمتغيرات
            </button>
            <div
              aria-multiselectable="true"
              class="accordion"
              id="accordion"
              role="tablist"
              v-if="cartdetail"
            >
              <div
                class="card mb-2"
                v-for="(onevar, iover) in variants"
                :key="iover"
              >
                <div class="card-header" :id="`heading_${iover}`" role="tab">
                  <a
                    :aria-controls="`collapse_${iover}`"
                    aria-expanded="false"
                    class="collapsed"
                    data-bs-toggle="collapse"
                    :href="`#collapse_${iover}`"
                  >
                    متغير
                    {{ iover + 1 }}
                  </a>
                </div>
                <div
                  :aria-labelledby="`heading_${iover}`"
                  class="collapse"
                  :id="`collapse_${iover}`"
                  data-bs-parent="#accordion"
                  role="tabpanel"
                >
                  <div class="card-body">
                    <form action="">
                      <div class="row">
                        <div class="col-md-12 mb-2">
                          <input
                            v-model="onevar.id"
                            type="number"
                            class="form-control"
                            placeholder="الرقم التسلسلي"
                          />
                        </div>
                        <div class="col-md-6 mb-2">
                          <!-- <select
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            " 
                            v-model="optionfirstid"
                            @click="addvalueoption"       >
                            <option v-for="(oneoption, i) in options" :key="i" :value="oneoption.id"                     
                            >

                              {{ oneoption.name.ar }}
                            </option>
                          </select> -->
                          <select
                            v-model="onevar.selectSettings.optionfirstid"
                            @change="addvalueoption($event.target.value)"
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                          >
                            <option
                              v-for="option in options"
                              :value="option.id"
                              :key="option.id"
                            >
                              {{ option.name.ar }}
                            </option>
                          </select>
                        </div>
                        <div class="col-md-6 mb-2">
                          <select
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                            v-model="onevar.selectSettings.valfirstid"
                          >
                            <option
                              v-for="(valoption, i) in onevar.selectSettings
                                .valueinoption"
                              :key="i"
                              :value="valoption.id"
                            >
                              {{ valoption.value.ar }}
                            </option>
                          </select>
                        </div>
                        <div class="col-md-6 mb-2">
                          <!-- <select
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                            v-model="optionsecondid"
                            @click="addsecoption" 

                          >
                            <option v-for="(oneoption, i) in options" :key="i" :value="oneoption.id" >
                              {{ oneoption.name.ar }}
                            </option>
                          </select> -->
                          <select
                            v-model="onevar.selectSettings.optionsecondid"
                            @change="addsecoption($event.target.value)"
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                          >
                            <option
                              v-for="option in options"
                              :value="option.id"
                              :key="option.id"
                            >
                              {{ option.name.ar }}
                            </option>
                          </select>
                        </div>

                        <div class="col-md-6 mb-2">
                          <!-- <select
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                            v-model="valsecondid"
                          >
                            <option v-for="(valoption, i) in valueoptionsec" :key="i" :value="valoption.id" >
                              {{ valoption.value.ar }}
                            </option>
                          </select> -->
                          <select
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                            v-model="onevar.selectSettings.valsecondid"
                          >
                            <option
                              v-for="(valoption, i) in onevar.selectSettings
                                .valueoptionsec"
                              :key="i"
                              :value="valoption.id"
                            >
                              {{ valoption.value.ar }}
                            </option>
                          </select>
                        </div>

                        <div class="col-md-12 mb-2">
                          <label for=""> السعر </label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="onevar.price"
                          />
                        </div>
                        <div class="col-md-6 mb-2">
                          <label for=""> سعر التكلفه </label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="onevar.cost_price"
                          />
                        </div>
                        <div class="col-md-6 mb-2">
                          <label for=""> سعر المخفض </label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="onevar.discounted_price"
                          />
                        </div>
                        <div class="col-md-4 mb-2">
                          <label for=""> الوزن </label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="onevar.weight"
                          />
                        </div>
                        <div class="col-md-4 mb-2">
                          <label for=""> الباركود </label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="onevar.barcode"
                          />
                        </div>

                        <div class="col-md-4 mb-2">
                          <label for=""> رمز التخزين </label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="onevar.sku"
                          />
                        </div>
                        <div class="col-md-12 mb-2">
                          <label for=""> الكمية </label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="onevar.quantity"
                          />
                        </div>
                        <div class="col-md-12 mb-2">
                          <input v-model="onevar.is_default" type="checkbox" />
                          افتراضي
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <button class="w-100 btn btn-primary" @click="newvariant()">
                حفظ
              </button>
            </div>
          </div>
        </div>
      </b-modal>
    </teleport>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <b-modal
        id="delete-confirmation-modal"
        v-model="ShowModel"
        hide-footer
        class="delete-modal"
        centered
      >
        <div class="delete-modal-content">
          <div class="delete-icon">
            <img src="../../assets/img/delet.png" alt="Delete" />
          </div>
          <h5 class="text-center mb-4 mt-4">سيتم حذف المنتج نهائياً</h5>
          <p class="text-center text-muted mb-4">
            هذا الإجراء لا يمكن التراجع عنه
          </p>
          <div class="text-center">
            <button
              type="button"
              class="btn btn-danger me-2"
              @click="confirmDelete"
            >
              موافق
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="ShowModel = false"
            >
              إلغاء
            </button>
          </div>
        </div>
      </b-modal>
    </teleport>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import moment from "moment";
import crudDataService from "../../Services/crudDataService.js";
import Multiselect from "@vueform/multiselect";
import Prouductdrop from "./Prouductdrop.vue";
import "vueperslides/dist/vueperslides.css";
import { VueperSlides, VueperSlide } from "vueperslides";
import { reactive } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormErrorMixin } from "../../Shared/mixins/FormErrorMixin.js";

export default {
  name: "ProductList",
  mixins: [FormErrorMixin],
  components: {
    Prouductdrop,
    Multiselect,
    VueperSlides,
    VueperSlide,
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
      valueinoption: [],
      optionfirstid: "",
      valfirstid: "",
      optionsecondid: "",
      valsecondid: "",
      loading: false,
      sizesen: [],
      sizesar: [],
      colorsar: [],
      colorsen: [],
      Selectone: [
        { value: "text", name: "نص" },
        { value: "color", name: "لون" },
      ],

      options: [
        {
          id: null,
          is_new: true,
          name: {
            ar: "",
            en: "",
          },
          select: "",
          is_color: false,
          values: [],
        },
      ],
      variants: [],
      addModel: false,
      Selectbrand: [],
      imageUrls: [],
      videoUrls: [],
      ShowModelEdit: false,
      ShowModel: false,
      Selecttype: [{ value: 1, name: "النوع" }],
      listofproducr: [],
      myList: [
        {
          selected: false,
        },
        {
          selected: false,
        },
        {
          selected: false,
        },
      ],
      selectAll: false,
      color: true,
      isDropdownOpen: false,
      items: [],
      id: null,
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
      Selectcategories: [],
      links: [],
      page: 1,
      last: 2,
      variant: [],
      cardnew: false,
      cartdetail: false,
      valueoptionsec: [],
      isUpdating: false,
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
    };
  },

  methods: {
    updateProductsList(products) {
      this.items = products; // Update the product list in the parent component
    },
    handleSelectChange(selectedValue) {
      this.valfirstid = selectedValue.target.value;
    },
    handleSelectvalue(selectedValue) {
      this.valsecondid = selectedValue.target.value;
    },
    getoneotion(e, a) {
      console.log(e, a);
    },
    async toggleactive(id) {
      let res = await crudDataService.create(`products/${id}/toggle`, "");
      const toast = useToast();
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      }
    },
    getOptionStyle(option) {
      return {
        background: option.options ? "#d6d8dddb" : "",
      };
    },
    async removeMedia(file, index, type) {
      let id_image = [];
      id_image.push(file);
      let res = await crudDataService.create(
        `products/${this.id}/delete-image`,
        {
          images_ids: id_image,
        }
      );
      if (type === "image") {
        this.imageUrls.splice(index, 1);
      } else if (type === "video") {
        this.videoUrls.splice(index, 1);
      }
    },
    addsecoption(e) {
      this.options.forEach((ele) => {
        if (ele.id == e) {
          this.variants.forEach((element) => {
            element.selectSettings.valueoptionsec.push(...ele.values);
          });
        }
      });
    },
    addvalueoption(e) {
      this.options.forEach((ele) => {
        if (ele.id == e) {
          this.variants.forEach((element) => {
            element.selectSettings.valueinoption.push(...ele.values);
          });
        }
      });
    },
    addalloptions() {
      this.cartdetail = true;
      this.variants.push({
        id: null,
        is_default: false,
        sku: null,
        barcode: null,
        quantity: null,
        price: "",
        cost_price: null,
        discounted_price: null,
        discount_end_date: null,
        weight: null,
        weight_unit_id: null,
        dimensions: null,
        max_user_quantity: "",
        min_notify_quantity: null,
        options: [],
        selectSettings: {
          optionfirstid: null,
          valfirstid: null,
          optionsecondid: null,
          valsecondid: null,
          valueinoption: [],
          valueoptionsec: [],
        },
      });
    },
    addoption(data) {
      this.addModel = true;
      this.id = data.id;
    },
    async newvariant() {
      this.variants.forEach((element) => {
        console.log(element);
        element.options.push(
          {
            option_id: element.selectSettings.optionfirstid,
            value_id: element.selectSettings.valfirstid,
          },
          {
            option_id: element.selectSettings.optionsecondid,
            value_id: element.selectSettings.valsecondid,
          }
        );
      });

      let res = await crudDataService.create(`products/${this.id}/variants`, {
        options: this.options,
        variants: this.variants,
      });
      this.addModel = false;
    },

    addNewInput(index) {
      if (this.options[index].is_color) {
        this.options[index].values.push({
          value: {
            ar: "",
            en: "",
          },
          color: "",
          id: "",
          is_new: true,
        });
      } else {
        this.options[index].values.push({
          value: {
            ar: "",
            en: "",
          },
          color: "#FFF",
          id: "",
          is_new: true,
        });
      }
    },

    addNewOption() {
      this.options.push({
        id: null,
        is_new: true,
        name: {
          ar: "",
          en: "",
        },
        select: "",
        is_color: false,
        values: [],
      });
    },

    selctchange(selectedValue, index) {
      const is_color = selectedValue === "color";
      this.options[index].is_color = is_color;
      if (is_color) {
        this.options[index].values.push({
          id: null,
          is_new: true,
          value: {
            ar: "",
            en: "",
          },
          color: "",
        });
      } else {
        this.options[index].values.push({
          id: null,
          is_new: true,
          color: "#FFF",
          value: {
            ar: "",
            en: "",
          },
        });
      }
    },

    addElement() {
      this.options.forEach((element) => {
        if (element.is_color) {
          element.values.map((option) => {
            this.colorsar.push(option);
            this.colorsen.push(option);
          });
        } else {
          element.values.map((option) => {
            this.sizesar.push(option);
            this.sizesen.push(option);
          });
        }
      });
    },
    showdetail(e) {
      if (e.target.checked) {
        this.cardnew = true;
      } else {
        this.cardnew = false;
      }
    },
    handleFileChange(event) {
      const files = event.target.files;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        this.formData.images = [];
        this.formData.images.push(file);
        reader.onload = (e) => {
          const fileData = {
            thumbnail: e.target.result,
            path: e.target.result,
            type: file.type,
          };
          if (file.type.startsWith("image")) {
            this.imageUrls.push(fileData);
          } else if (file.type.startsWith("video")) {
            this.videoUrls.push(fileData);
          }
        };
        if (file.type.startsWith("image") || file.type.startsWith("video")) {
          reader.readAsDataURL(file);
        }
      });
    },
    async getbrands() {
      const res = await crudDataService.getAll("brands");
      this.Selectbrand = res.data.data.map((ele) => ({
        value: ele.id,
        name: ele.name,
      }));
    },
    async getcategories() {
      const res = await crudDataService.getAll("categories");
      const groupedCategories = [];
      res.data.data.forEach((ele) => {
        const mainCategory = {
          value: ele.id,
          name: ele.name,
          options: [],
          style: {
            background: "blue",
          },
        };
        if (ele.sub_categories && ele.sub_categories.length > 0) {
          ele.sub_categories.forEach((subCat) => {
            mainCategory.options.push({
              value: subCat.id,
              name: subCat.name.ar,
            });
          });
        }
        groupedCategories.push(mainCategory);
      });

      this.Selectcategories = groupedCategories.reduce((acc, category) => {
        acc.push(category, ...category.options);
        return acc;
      }, []);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleSelectAll() {
      this.myList.forEach((item) => (item.selected = this.selectAll));
    },
    selectthis(e, target) {
      if (e) {
        this.listofproducr.push(target);
      } else {
        this.listofproducr.splice(target, 1);
      }
    },

    async getAllData() {
      this.loading = true; // Start loading

      try {
        let res = await crudDataService.getAll(`products`);
        this.items = res.data.data.data;
        this.last = res.data.data.last_page;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error
      } finally {
        this.loading = false; // End loading regardless of success or failure
      }
    },
    handleCustomEvent(data) {
      this.items = data;
    },
    async paginag(p) {
      let res = await crudDataService.getAll(`products?page=${this.page}`);
      this.items = res.data.data.data;
    },
    async edit(data) {
      this.clearAllErrors();
      this.id = data.id;

      try {
        let res = await crudDataService.getAll(`products/${this.id}/variants`);
        this.variant = res.data.data;
        this.ShowModelEdit = true;

        // Populate form data
        this.formData.name.ar = data.name.ar || "";
        this.formData.name.en = data.name.en || "";
        this.formData.description.ar = data.description.ar || "";
        this.formData.description.en = data.description.en || "";
        this.formData.brand_id = data.brand ? data.brand.id : "";
        this.formData.barcode = data.barcode || "";
        this.formData.base_price = data.base_price || "";
        this.formData.seo_url = data.seo_url || "";
        this.formData.seo_title = data.seo_title || "";
        this.formData.seo_description = data.seo_description || "";
        this.formData.quantity = data.quantity || "";
        this.formData.price = data.price || "";
        this.formData.cost_price = data.cost_price || "";
        this.formData.discounted_price = data.discounted_price || "";
        this.formData.discount_end_date = data.discount_end_date
          ? moment(data.discount_end_date).format("YYYY-MM-DD")
          : "";
        this.formData.categories_ids = Array.isArray(data.categories)
          ? data.categories.map((category) => (category ? category.id : ""))
          : [];

        // Handle images and videos
        this.imageUrls = [];
        this.videoUrls = [];
        if (Array.isArray(data.images)) {
          data.images.forEach((element) => {
            const extension = element.path.split(".").pop().toLowerCase();
            if (["png", "jpg", "jpeg", "gif"].includes(extension)) {
              this.imageUrls.push({ ...element, type: `image/${extension}` });
            } else if (["mp4", "avi", "webm"].includes(extension)) {
              this.videoUrls.push({ ...element, type: `video/${extension}` });
            }
          });
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        const toast = useToast();
        toast.error("حدث خطأ في تحميل بيانات المنتج", {
          position: "top-center",
          timeout: 5000,
        });
      }
    },

    confirmDelete() {
      // Handle delete confirmation logic here
      this.ShowModel = false;
    },

    // ...existing methods...
  },

  mounted() {
    this.getAllData();
    this.getbrands();
    this.getcategories();
    // this.generateCombinations();
  },
};
</script>

<style scoped lang="scss">
.edit-nav {
  margin-right: auto;
  width: max-content;
  background: #f1f4fa;
  border-radius: 6px;
  &.nav.panel-tabs li a {
    background: transparent;
    padding: 9px 14px;
    margin: 0;
    color: #e66239;
  }
  &.nav.panel-tabs li a.active {
    color: #fff;
    background: #e66239;
  }
}
.plus {
  position: absolute;
  top: 5px;
  right: 6px;
}
.pin-icon {
  padding: 5px;
  background: #eff4fb;
  border-radius: 2px;
  color: #e66239;
}
.pin-color {
  padding: 5px;
  background: #e66239;
  border-radius: 2px;
  color: #eff4fb;
}
.spanprice {
  background: #6295d51a;
  color: #e66239;
  text-align: center;
  justify-content: center;
  img {
    width: 30px;
  }
  span {
    border-left: 1px solid #6295d533;
  }
}
.dropitem {
  position: absolute;
  top: 44px;
  right: -1px;
  background: #fff;
  border: 1px solid #e8e8f7;
  margin: 0;
  border-radius: 3px;
  width: 200px;
  a {
    cursor: pointer;
  }

  img {
    width: 30px;
  }
}

/* Modal Improvements */
.edit-modal,
.options-modal,
.delete-modal {
  ::v-deep .modal-dialog {
    margin: 1rem auto;
    max-height: calc(100vh - 2rem);
  }

  ::v-deep .modal-content {
    height: auto;
    max-height: calc(100vh - 2rem);
    border: none;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  ::v-deep .modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    padding: 1rem 1.5rem;

    .modal-title {
      font-weight: 600;
      color: #495057;
    }

    .btn-close {
      padding: 0.5rem;
      margin: -0.5rem -0.5rem -0.5rem auto;
    }
  }

  ::v-deep .modal-body {
    padding: 1.5rem;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
}

/* Form Styling */
.product-edit-form {
  .form-label {
    font-weight: 500;
    color: #495057;
    margin-bottom: 0.5rem;

    &.required::after {
      content: " *";
      color: #dc3545;
    }
  }

  .form-control {
    border-radius: 6px;
    border: 1px solid #ced4da;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
      border-color: #e66239;
      box-shadow: 0 0 0 0.2rem rgba(230, 98, 57, 0.25);
    }

    &.is-invalid {
      border-color: #dc3545;

      &:focus {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
      }
    }
  }

  .invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #dc3545;
  }
}

/* Multiselect Styling */
.multiselect-option {
  padding: 10px;
  width: 100%;
  text-align: right;
  margin-bottom: 2px;
}

/* Media Preview */
.media-preview {
  .media-item {
    position: relative;
    display: inline-block;

    .preview-image,
    .preview-video {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 6px;
      border: 2px solid #e9ecef;
    }

    .btn-remove {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background-color: #dc3545;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: background-color 0.15s;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}

/* Modal Footer */
.modal-footer-custom {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .btn {
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;

    &.btn-primary {
      background-color: #e66239;
      border-color: #e66239;

      &:hover {
        background-color: #d85429;
        border-color: #d85429;
      }

      &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    }
  }
}

/* Delete Modal */
.delete-modal {
  ::v-deep .modal-dialog {
    max-width: 400px;
  }

  .delete-modal-content {
    text-align: center;
    padding: 1rem;

    .delete-icon {
      margin-bottom: 1rem;

      img {
        width: 60px;
        height: 60px;
        object-fit: contain;
      }
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .edit-modal,
  .options-modal {
    ::v-deep .modal-dialog {
      margin: 0.5rem;
      max-width: none;
      max-height: calc(100vh - 1rem);
    }

    ::v-deep .modal-content {
      max-height: calc(100vh - 1rem);
    }

    ::v-deep .modal-body {
      padding: 1rem;
      max-height: calc(100vh - 150px);
    }
  }

  .modal-footer-custom {
    padding: 1rem;

    .btn {
      width: 100%;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* Loading Spinner */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>

<style lang="scss">
/* Global Modal Styles */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

/* CKEditor Styling */
.ck-editor__editable_inline {
  min-height: 150px;
  border-radius: 6px;

  &.ck-focused {
    border-color: #e66239;
    box-shadow: 0 0 0 0.2rem rgba(230, 98, 57, 0.25);
  }
}

/* Multiselect Custom Styling */
.multiselect {
  &.is-invalid {
    border-color: #dc3545;
  }

  .multiselect-dropdown {
    border-radius: 6px;
    border-color: #ced4da;
  }

  .multiselect-option {
    &.is-selected {
      background-color: #e66239;
      color: white;
    }

    &.is-highlighted {
      background-color: rgba(230, 98, 57, 0.1);
    }
  }
}

/* Fix for Modal Z-index Issues */
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

/* Custom Scrollbar for Modal */
.modal-body {
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
</style>
