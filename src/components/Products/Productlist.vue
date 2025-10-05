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
    <!-- Updated Edit Product Modal with Error Handling -->
    <teleport to="body">
      <b-modal
        id="edit-product-modal"
        v-model="ShowModelEdit"
        hide-footer
        class="edit-modal"
        title="تعديل منتج"
        size="lg"
        centered
        @hidden="clearAllErrors"
      >
        <div class="modal-content-wrapper">
          <!-- Show general form errors if any -->
          <div v-if="hasAnyErrors" class="alert alert-danger mb-3">
            <strong>يرجى تصحيح الأخطاء التالية:</strong>
            <ul class="mb-0 mt-2">
              <li v-for="(errors, field) in fieldErrors" :key="field">
                {{ Array.isArray(errors) ? errors[0] : errors }}
              </li>
            </ul>
          </div>

          <form @submit.prevent="update" class="product-edit-form">
            <div class="row">
              <!-- Arabic Name -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  الإسم عربي <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.name.ar"
                  class="form-control"
                  :class="{
                    'is-invalid': hasFieldError('name.ar'),
                    'is-valid': !hasFieldError('name.ar') && formData.name.ar,
                  }"
                  @input="clearFieldError('name.ar')"
                  @blur="clearFieldError('name.ar')"
                  placeholder="أدخل اسم المنتج بالعربية"
                  required
                />
                <div v-if="hasFieldError('name.ar')" class="invalid-feedback">
                  {{ getFieldError("name.ar") }}
                </div>
              </div>

              <!-- English Name -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  الإسم انجليزي <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.name.en"
                  class="form-control"
                  :class="{
                    'is-invalid': hasFieldError('name.en'),
                    'is-valid': !hasFieldError('name.en') && formData.name.en,
                  }"
                  @input="clearFieldError('name.en')"
                  @blur="clearFieldError('name.en')"
                  placeholder="Enter product name in English"
                  required
                />
                <div v-if="hasFieldError('name.en')" class="invalid-feedback">
                  {{ getFieldError("name.en") }}
                </div>
              </div>

              <!-- Arabic Description -->
              <div class="col-md-6 mb-3">
                <label class="form-label">الوصف عربي</label>
                <div
                  :class="{
                    'border border-danger rounded':
                      hasFieldError('description.ar'),
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
              <div class="col-md-6 mb-3">
                <label class="form-label">الوصف انجليزي</label>
                <div
                  :class="{
                    'border border-danger rounded':
                      hasFieldError('description.en'),
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
              <div class="col-md-6 mb-3">
                <label class="form-label required">
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
              <div class="col-md-6 mb-3">
                <label class="form-label required">
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
                    :close-on-select="false"
                    group-values="options"
                    group-label="name"
                    @change="clearFieldError('categories_ids')"
                    @select="clearFieldError('categories_ids')"
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
                </div>
                <div
                  v-if="hasFieldError('categories_ids')"
                  class="text-danger small mt-1"
                >
                  {{ getFieldError("categories_ids") }}
                </div>
              </div>

              <!-- Base Price -->
              <div class="col-md-6 mb-3">
                <label class="form-label required">
                  السعر الأساسي <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  v-model="formData.base_price"
                  class="form-control"
                  :class="{
                    'is-invalid': hasFieldError('base_price'),
                    'is-valid':
                      !hasFieldError('base_price') && formData.base_price,
                  }"
                  @input="clearFieldError('base_price')"
                  @blur="clearFieldError('base_price')"
                  placeholder="0.00"
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
              <div class="col-md-6 mb-3">
                <label class="form-label">لينك SEO</label>
                <input
                  type="text"
                  v-model="formData.seo_url"
                  class="form-control"
                  :class="{
                    'is-invalid': hasFieldError('seo_url'),
                    'is-valid': !hasFieldError('seo_url') && formData.seo_url,
                  }"
                  @input="clearFieldError('seo_url')"
                  @blur="clearFieldError('seo_url')"
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
                  :class="{
                    'is-invalid': hasFieldError('seo_title'),
                    'is-valid':
                      !hasFieldError('seo_title') && formData.seo_title,
                  }"
                  @input="clearFieldError('seo_title')"
                  @blur="clearFieldError('seo_title')"
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
                  :class="{
                    'is-invalid': hasFieldError('seo_description'),
                    'is-valid':
                      !hasFieldError('seo_description') &&
                      formData.seo_description,
                  }"
                  @input="clearFieldError('seo_description')"
                  @blur="clearFieldError('seo_description')"
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
                  :class="{
                    'is-invalid': hasFieldError('barcode'),
                    'is-valid': !hasFieldError('barcode') && formData.barcode,
                  }"
                  @input="clearFieldError('barcode')"
                  @blur="clearFieldError('barcode')"
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
                  :class="{
                    'is-invalid': hasFieldError('quantity'),
                    'is-valid': !hasFieldError('quantity') && formData.quantity,
                  }"
                  @input="clearFieldError('quantity')"
                  @blur="clearFieldError('quantity')"
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
                  :class="{
                    'is-invalid': hasFieldError('price'),
                    'is-valid': !hasFieldError('price') && formData.price,
                  }"
                  @input="clearFieldError('price')"
                  @blur="clearFieldError('price')"
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
                  :class="{
                    'is-invalid': hasFieldError('cost_price'),
                    'is-valid':
                      !hasFieldError('cost_price') && formData.cost_price,
                  }"
                  @input="clearFieldError('cost_price')"
                  @blur="clearFieldError('cost_price')"
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
                  :max="formData.price"
                  v-model="formData.discounted_price"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      hasFieldError('discounted_price') ||
                      (formData.discounted_price &&
                        formData.price &&
                        formData.discounted_price >= formData.price),
                    'is-valid':
                      !hasFieldError('discounted_price') &&
                      formData.discounted_price &&
                      formData.price &&
                      formData.discounted_price < formData.price,
                  }"
                  @input="clearFieldError('discounted_price')"
                  @blur="clearFieldError('discounted_price')"
                  placeholder="0.00"
                />
                <div
                  v-if="hasFieldError('discounted_price')"
                  class="invalid-feedback"
                >
                  {{ getFieldError("discounted_price") }}
                </div>
                <div
                  v-if="
                    formData.price &&
                    formData.discounted_price &&
                    formData.discounted_price >= formData.price
                  "
                  class="invalid-feedback"
                >
                  يجب أن يكون السعر بعد الخصم أقل من السعر الأصلي
                </div>
              </div>

              <!-- Discount End Date -->
              <div class="col-md-6 mb-3">
                <label class="form-label">تاريخ انتهاء الخصم</label>
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
              <div class="col-12 mb-3">
                <label class="form-label">
                  الصور والفيديوهات
                  <span
                    v-if="!imageUrls.length && !videoUrls.length"
                    class="text-danger"
                    >*</span
                  >
                </label>
                <input
                  type="file"
                  @change="handleFileChange"
                  accept="image/jpg, image/jpeg, image/png, video/mp4,video/mov"
                  class="form-control"
                  :class="{ 'is-invalid': hasFieldError('images') }"
                  multiple
                  :required="!imageUrls.length && !videoUrls.length"
                />
                <div v-if="hasFieldError('images')" class="invalid-feedback">
                  {{ getFieldError("images") }}
                </div>
                <small class="form-text text-muted">
                  أنواع الملفات المدعومة: JPG, PNG, MP4, MOV. الحد الأقصى لحجم
                  الملف: 5 ميجابايت
                </small>

                <!-- Media Preview -->
                <div
                  class="media-preview mt-3"
                  v-if="imageUrls.length || videoUrls.length"
                >
                  <div
                    class="d-flex align-items-center justify-content-between mb-2"
                  >
                    <h6 class="mb-0 text-primary">
                      <i class="mdi mdi-folder-image"></i>
                      الملفات الحالية ({{
                        imageUrls.length + videoUrls.length
                      }})
                    </h6>
                    <small class="text-muted">انقر على × لحذف الملف</small>
                  </div>
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

            <!-- Form Validation Summary -->
            <div v-if="!isFormValid" class="alert alert-warning mb-3">
              <small>
                <i class="mdi mdi-information"></i>
                <span v-if="!imageUrls.length && !videoUrls.length">
                  يرجى ملء جميع الحقول المطلوبة المميزة بعلامة النجمة (*) وإضافة
                  صورة واحدة على الأقل قبل الحفظ
                </span>
                <span v-else>
                  يرجى ملء جميع الحقول المطلوبة المميزة بعلامة النجمة (*) قبل
                  الحفظ
                </span>
              </small>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer-custom">
              <button
                type="button"
                class="btn btn-secondary me-2"
                @click="cancelEdit"
                :disabled="isUpdating"
              >
                إلغاء
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isUpdating || !isFormValid"
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

    <!-- Product Options Modal -->
    <teleport to="body">
      <b-modal
        id="product-options-modal"
        v-model="addModel"
        hide-footer
        class="options-modal"
        title="خيارات المنتج"
        size="md"
        centered
        scrollable
        @hidden="clearAllErrors"
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
                  :class="{ 'is-invalid': hasFieldError(`options.${i}.id`) }"
                  @input="clearFieldError(`options.${i}.id`)"
                  @click.stop
                  @focus.stop
                />
                <div
                  v-if="hasFieldError(`options.${i}.id`)"
                  class="invalid-feedback"
                >
                  {{ getFieldError(`options.${i}.id`) }}
                </div>

                <input
                  v-model="option.name.ar"
                  placeholder="مسمي الخيار مثل (اللون و المقاس)"
                  type="text"
                  class="form-control mb-2"
                  :class="{
                    'is-invalid': hasFieldError(`options.${i}.name.ar`),
                  }"
                  @input="clearFieldError(`options.${i}.name.ar`)"
                  @click.stop
                  @focus.stop
                />
                <div
                  v-if="hasFieldError(`options.${i}.name.ar`)"
                  class="invalid-feedback"
                >
                  {{ getFieldError(`options.${i}.name.ar`) }}
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div
                  :class="{
                    'border border-danger rounded': hasFieldError(
                      `options.${i}.select`
                    ),
                  }"
                >
                  <Multiselect
                    label="name"
                    :searchable="true"
                    :options="Selectone"
                    @change="
                      selctchange($event, i);
                      clearFieldError(`options.${i}.select`);
                    "
                    v-model="option.select"
                    class="mb-2"
                  />
                </div>
                <div
                  v-if="hasFieldError(`options.${i}.select`)"
                  class="text-danger small"
                >
                  {{ getFieldError(`options.${i}.select`) }}
                </div>

                <input
                  v-model="option.name.en"
                  placeholder="Name the option, such as (color and size)"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': hasFieldError(`options.${i}.name.en`),
                  }"
                  @input="clearFieldError(`options.${i}.name.en`)"
                  @click.stop
                  @focus.stop
                />
                <div
                  v-if="hasFieldError(`options.${i}.name.en`)"
                  class="invalid-feedback"
                >
                  {{ getFieldError(`options.${i}.name.en`) }}
                </div>
              </div>

              <div class="col-md-12 mb-2">
                <div v-for="(element, index) in option.values" :key="index">
                  <input
                    v-model="element.id"
                    type="number"
                    class="form-control mb-2"
                    placeholder="الرقم التسلسلي"
                    :class="{
                      'is-invalid': hasFieldError(
                        `options.${i}.values.${index}.id`
                      ),
                    }"
                    @input="clearFieldError(`options.${i}.values.${index}.id`)"
                    @click.stop
                    @focus.stop
                  />
                  <div
                    v-if="hasFieldError(`options.${i}.values.${index}.id`)"
                    class="invalid-feedback"
                  >
                    {{ getFieldError(`options.${i}.values.${index}.id`) }}
                  </div>

                  <div class="pos-relative">
                    <input
                      v-if="option.is_color"
                      type="color"
                      class="pos-absolute p-0 border-0"
                      style="width: 40px; top: 5px; left: 25px"
                      v-model="element.color"
                      @change="
                        clearFieldError(`options.${i}.values.${index}.color`)
                      "
                      @click.stop
                      @focus.stop
                    />
                    <input
                      type="text"
                      class="form-control mb-2"
                      :placeholder="'القيمة' + `${index + 1}`"
                      v-model="element.value.ar"
                      :class="{
                        'is-invalid': hasFieldError(
                          `options.${i}.values.${index}.value.ar`
                        ),
                      }"
                      @keyup="addElement"
                      @input="
                        clearFieldError(`options.${i}.values.${index}.value.ar`)
                      "
                      @click.stop
                      @focus.stop
                    />
                    <div
                      v-if="
                        hasFieldError(`options.${i}.values.${index}.value.ar`)
                      "
                      class="invalid-feedback"
                    >
                      {{
                        getFieldError(`options.${i}.values.${index}.value.ar`)
                      }}
                    </div>
                  </div>

                  <input
                    type="text"
                    class="form-control mb-2"
                    :placeholder="'value' + `${index + 1}`"
                    v-model="element.value.en"
                    :class="{
                      'is-invalid': hasFieldError(
                        `options.${i}.values.${index}.value.en`
                      ),
                    }"
                    @keyup="addElement"
                    @input="
                      clearFieldError(`options.${i}.values.${index}.value.en`)
                    "
                    @click.stop
                    @focus.stop
                  />
                  <div
                    v-if="
                      hasFieldError(`options.${i}.values.${index}.value.en`)
                    "
                    class="invalid-feedback"
                  >
                    {{ getFieldError(`options.${i}.values.${index}.value.en`) }}
                  </div>
                </div>
              </div>

              <div class="col-12 mb-2">
                <button
                  @click="addNewInput(i)"
                  class="w-100 p-2 bg-transparent rounded text-primary"
                  style="border: 1px dashed #87a9e3"
                  type="button"
                >
                  <i class="fa fa-plus"></i>
                  اضافة قيمة جديدة
                </button>
              </div>
            </div>

            <button
              @click="addNewOption"
              class="w-100 p-2 bg-transparent rounded mb-2 text-primary"
              style="border: 1px dashed #87a9e3"
              type="button"
            >
              <i class="fa fa-plus"></i>
              اضافة خيار جديد
            </button>

            <button
              @click="addalloptions"
              class="w-100 p-2 bg-primary rounded mb-2 border-0"
              type="button"
            >
              <i class="fa fa-plus"></i>
              اضافة للمتغيرات
            </button>

            <!-- Variants Section -->
            <div
              aria-multiselectable="true"
              class="accordion"
              id="accordion"
              role="tablist"
              v-if="cartdetail"
            >
              <!-- Accordion Control Buttons -->
              <div
                class="d-flex justify-content-between mb-3"
                v-if="variants.length > 1"
              >
                <button
                  @click="expandAllVariants"
                  class="btn btn-outline-primary btn-sm"
                  type="button"
                >
                  <i class="fas fa-expand-arrows-alt"></i>
                  توسيع الكل
                </button>
                <button
                  @click="collapseAllVariants"
                  class="btn btn-outline-secondary btn-sm"
                  type="button"
                >
                  <i class="fas fa-compress-arrows-alt"></i>
                  طي الكل
                </button>
              </div>

              <div
                class="card mb-2"
                v-for="(onevar, iover) in variants"
                :key="iover"
              >
                <div class="card-header" :id="`heading_${iover}`" role="tab">
                  <a
                    :aria-controls="`collapse_${iover}`"
                    :aria-expanded="isVariantExpanded(iover)"
                    :class="{ collapsed: !isVariantExpanded(iover) }"
                    href="javascript:void(0)"
                    @click.prevent="toggleVariantCollapse(iover)"
                    class="accordion-toggle"
                  >
                    متغير {{ iover + 1 }}
                    <span v-if="onevar.is_default" class="badge bg-primary ms-2"
                      >افتراضي</span
                    >
                  </a>
                </div>
                <div
                  :aria-labelledby="`heading_${iover}`"
                  :class="['collapse', { show: isVariantExpanded(iover) }]"
                  :id="`collapse_${iover}`"
                  data-bs-parent="#accordion"
                  role="tabpanel"
                >
                  <div class="card-body" @click.stop>
                    <form @submit.prevent class="p-3" @click.stop>
                      <div class="row">
                        <div class="col-md-12 mb-2">
                          <input
                            v-model="onevar.id"
                            type="number"
                            class="form-control"
                            placeholder="الرقم التسلسلي"
                            :class="{
                              'is-invalid': hasFieldError(
                                `variants.${iover}.id`
                              ),
                            }"
                            @input="clearFieldError(`variants.${iover}.id`)"
                            @click.stop
                            @focus.stop
                          />
                          <div
                            v-if="hasFieldError(`variants.${iover}.id`)"
                            class="invalid-feedback"
                          >
                            {{ getFieldError(`variants.${iover}.id`) }}
                          </div>
                        </div>

                        <div class="col-md-6 mb-2">
                          <select
                            v-model="onevar.selectSettings.optionfirstid"
                            @change="
                              addvalueoption($event.target.value);
                              clearFieldError(
                                `variants.${iover}.optionfirstid`
                              );
                            "
                            @click.stop
                            @focus.stop
                            style="
                              width: 100%;
                              padding: 4px;
                              border-radius: 6px;
                              color: #999999;
                              border: 1px solid #e8e8f7;
                            "
                            :class="{
                              'border-danger': hasFieldError(
                                `variants.${iover}.optionfirstid`
                              ),
                            }"
                          >
                            <option value="">اختر الخيار الأول</option>
                            <option
                              v-for="option in options"
                              :value="option.id"
                              :key="option.id"
                            >
                              {{ option.name.ar }}
                            </option>
                          </select>
                          <div
                            v-if="
                              hasFieldError(`variants.${iover}.optionfirstid`)
                            "
                            class="text-danger small"
                          >
                            {{
                              getFieldError(`variants.${iover}.optionfirstid`)
                            }}
                          </div>
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
                            :class="{
                              'border-danger': hasFieldError(
                                `variants.${iover}.valfirstid`
                              ),
                            }"
                            @change="
                              clearFieldError(`variants.${iover}.valfirstid`)
                            "
                            @click.stop
                            @focus.stop
                          >
                            <option value="">اختر القيمة الأولى</option>
                            <option
                              v-for="(valoption, i) in onevar.selectSettings
                                .valueinoption"
                              :key="i"
                              :value="valoption.id"
                            >
                              {{ valoption.value.ar }}
                            </option>
                          </select>
                          <div
                            v-if="hasFieldError(`variants.${iover}.valfirstid`)"
                            class="text-danger small"
                          >
                            {{ getFieldError(`variants.${iover}.valfirstid`) }}
                          </div>
                        </div>

                        <!-- Additional variant fields with error handling -->
                        <div class="col-md-12 mb-2">
                          <label for="">السعر</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            class="form-control"
                            v-model="onevar.price"
                            :class="{
                              'is-invalid': hasFieldError(
                                `variants.${iover}.price`
                              ),
                            }"
                            @input="clearFieldError(`variants.${iover}.price`)"
                            @click.stop
                            @focus.stop
                          />
                          <div
                            v-if="hasFieldError(`variants.${iover}.price`)"
                            class="invalid-feedback"
                          >
                            {{ getFieldError(`variants.${iover}.price`) }}
                          </div>
                        </div>

                        <div class="col-md-6 mb-2">
                          <label for="">سعر التكلفه</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            class="form-control"
                            v-model="onevar.cost_price"
                            :class="{
                              'is-invalid': hasFieldError(
                                `variants.${iover}.cost_price`
                              ),
                            }"
                            @input="
                              clearFieldError(`variants.${iover}.cost_price`)
                            "
                            @click.stop
                            @focus.stop
                          />
                          <div
                            v-if="hasFieldError(`variants.${iover}.cost_price`)"
                            class="invalid-feedback"
                          >
                            {{ getFieldError(`variants.${iover}.cost_price`) }}
                          </div>
                        </div>

                        <div class="col-md-6 mb-2">
                          <label for="">سعر المخفض</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            class="form-control"
                            v-model="onevar.discounted_price"
                            :class="{
                              'is-invalid': hasFieldError(
                                `variants.${iover}.discounted_price`
                              ),
                            }"
                            @input="
                              clearFieldError(
                                `variants.${iover}.discounted_price`
                              )
                            "
                            @click.stop
                            @focus.stop
                          />
                          <div
                            v-if="
                              hasFieldError(
                                `variants.${iover}.discounted_price`
                              )
                            "
                            class="invalid-feedback"
                          >
                            {{
                              getFieldError(
                                `variants.${iover}.discounted_price`
                              )
                            }}
                          </div>
                        </div>

                        <div class="col-md-12 mb-2">
                          <label for="">الكمية</label>
                          <input
                            type="number"
                            min="0"
                            class="form-control"
                            v-model="onevar.quantity"
                            :class="{
                              'is-invalid': hasFieldError(
                                `variants.${iover}.quantity`
                              ),
                            }"
                            @input="
                              clearFieldError(`variants.${iover}.quantity`)
                            "
                            @click.stop
                            @focus.stop
                          />
                          <div
                            v-if="hasFieldError(`variants.${iover}.quantity`)"
                            class="invalid-feedback"
                          >
                            {{ getFieldError(`variants.${iover}.quantity`) }}
                          </div>
                        </div>

                        <div class="col-md-12 mb-2">
                          <label class="form-check-label">
                            <input
                              v-model="onevar.is_default"
                              type="checkbox"
                              class="form-check-input"
                            />
                            افتراضي
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <button
                class="w-100 btn btn-primary"
                @click="newvariant()"
                :disabled="isUpdating"
              >
                <span
                  v-if="isUpdating"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ isUpdating ? "جاري الحفظ..." : "حفظ" }}
              </button>
            </div>
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
      expandedVariants: [], // Track which variant cards are expanded
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
      },
    };
  },

  methods: {
    async update() {
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

      // Additional validation for images when editing
      if (
        !this.imageUrls.length &&
        !this.videoUrls.length &&
        (!this.formData.images || this.formData.images.length === 0)
      ) {
        toast.error("يرجى إضافة صورة واحدة على الأقل للمنتج", {
          position: "top-right",
          timeout: 5000,
        });
        return;
      }

      this.isUpdating = true;

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

        let response = await crudDataService.create(
          `products/${this.id}?_method=put`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.status) {
          toast.success(response.data.message || "تم تحديث المنتج بنجاح", {
            position: "top-right",
            timeout: 5000,
          });

          this.ShowModelEdit = false;
          this.getAllData(); // Refresh the product list
        }
      } catch (error) {
        console.error("Update error:", error);
        this.handleApiErrors(error, toast);
      } finally {
        this.isUpdating = false;
      }
    },
    async edit(data) {
      // Clear all previous errors when opening edit modal
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
        this.handleApiErrors(error, toast);
      }
    },
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
      this.imageUrls = [];
      this.videoUrls = [];
    },
    // ✅ Enhanced cancel method with error clearing
    cancelEdit() {
      this.clearAllErrors();
      this.ShowModelEdit = false;
      this.resetForm();
    },
    updateProductsList(products) {
      this.items = products;
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
      try {
        let id_image = [file];
        let res = await crudDataService.create(
          `products/${this.id}/delete-image`,
          { images_ids: id_image }
        );

        if (type === "image") {
          this.imageUrls.splice(index, 1);
        } else if (type === "video") {
          this.videoUrls.splice(index, 1);
        }

        const toast = useToast();
        toast.success("تم حذف الملف بنجاح", {
          position: "top-right",
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing media:", error);
        const toast = useToast();
        this.handleApiErrors(error, toast);
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
      const newVariantIndex = this.variants.length; // Get the index of the new variant before adding it

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

      // Automatically expand the newly added variant
      if (!this.expandedVariants.includes(newVariantIndex)) {
        this.expandedVariants.push(newVariantIndex);
      }
    },
    addoption(data) {
      this.addModel = true;
      this.id = data.id;
    },
    async newvariant() {
      try {
        this.isUpdating = true;

        this.variants.forEach((element) => {
          // Clear existing options array to avoid duplicates
          element.options = [];

          // Add first option if both option_id and value_id are valid
          if (
            element.selectSettings.optionfirstid &&
            element.selectSettings.valfirstid
          ) {
            element.options.push({
              option_id: element.selectSettings.optionfirstid,
              value_id: element.selectSettings.valfirstid,
            });
          }

          // Add second option only if both option_id and value_id are valid
          if (
            element.selectSettings.optionsecondid &&
            element.selectSettings.valsecondid
          ) {
            element.options.push({
              option_id: element.selectSettings.optionsecondid,
              value_id: element.selectSettings.valsecondid,
            });
          }
        });

        let res = await crudDataService.create(`products/${this.id}/variants`, {
          options: this.options,
          variants: this.variants,
        });

        const toast = useToast();
        if (res.data.status) {
          toast.success(res.data.message || "تم حفظ المتغيرات بنجاح", {
            position: "top-center",
            timeout: 5000,
          });
          this.addModel = false;
        }
      } catch (error) {
        console.error("Error saving variants:", error);
        const toast = useToast();
        this.handleApiErrors(error, toast);
      } finally {
        this.isUpdating = false;
      }
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
      this.clearFieldError("images");

      const files = event.target.files;
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      const allowedVideoTypes = ["video/mp4", "video/mov", "video/webm"];

      this.formData.images = [];

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
        if (
          !allowedImageTypes.includes(file.type) &&
          !allowedVideoTypes.includes(file.type)
        ) {
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

        reader.readAsDataURL(file);
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

    // ✅ Initialize collapse event listeners
    initializeCollapseEventListeners() {
      // We don't need to add event listeners since we're handling collapse through Vue methods
      // This method is kept for consistency but can be empty
      console.log("Collapse handlers initialized through Vue methods");
    },

    // ✅ Clean up event listeners
    cleanupCollapseEventListeners() {
      // Clean up any potential Bootstrap instances
      this.variants.forEach((_, index) => {
        const collapseElement = document.getElementById(`collapse_${index}`);
        if (collapseElement) {
          // Dispose of any Bootstrap Collapse instances
          const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
          if (bsCollapse) {
            bsCollapse.dispose();
          }
        }
      });
    },

    async paginag(p) {
      let res = await crudDataService.getAll(`products?page=${this.page}`);
      this.items = res.data.data.data;
    },

    // ✅ Collapse handling methods
    toggleVariantCollapse(index) {
      const isCurrentlyExpanded = this.isVariantExpanded(index);

      if (isCurrentlyExpanded) {
        // Currently expanded, so collapse it
        this.expandedVariants = this.expandedVariants.filter(
          (i) => i !== index
        );
      } else {
        // Currently collapsed, so expand it
        if (!this.expandedVariants.includes(index)) {
          this.expandedVariants.push(index);
        }
      }
    },

    isVariantExpanded(index) {
      return this.expandedVariants.includes(index);
    },

    expandAllVariants() {
      // Expand all variant cards
      this.expandedVariants = this.variants.map((_, index) => index);
    },

    collapseAllVariants() {
      // Collapse all variant cards
      this.expandedVariants = [];
    },

    handleCollapseShow(index) {
      // Called when a collapse is shown
      if (!this.expandedVariants.includes(index)) {
        this.expandedVariants.push(index);
      }
    },

    handleCollapseHide(index) {
      // Called when a collapse is hidden
      this.expandedVariants = this.expandedVariants.filter((i) => i !== index);
    },

    confirmDelete() {
      // Handle delete confirmation logic here
      this.ShowModel = false;
    },

    del(data, index, name) {
      this.$swal
        .fire({
          title: ` ؟"${name.ar}" هل تريد حذف `,
          showCancelButton: true,
          confirmButtonText: "نعم",
          cancelButtonText: "إلغاء",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$swal.fire("تم الحذف بنجاح!", "", "success");
            crudDataService.delete("products", `${data}`).then(() => {
              this.items.splice(index, 1);
              this.ShowModelEdit = false;
            });
          }
        });
    },
  },
  computed: {
    hasAnyErrors() {
      return Object.keys(this.fieldErrors).length > 0;
    },

    isFormValid() {
      const hasRequiredFields =
        this.formData.name.ar &&
        this.formData.name.en &&
        this.formData.base_price &&
        this.formData.brand_id &&
        this.formData.categories_ids.length > 0;

      // Images are only required if no existing images are present
      const hasImages = this.imageUrls.length > 0 || this.videoUrls.length > 0;

      return hasRequiredFields && hasImages;
    },
  },
  watch: {
    variants: {
      handler(newVariants) {
        // When variants are loaded or changed, automatically expand the first one if none are expanded
        if (newVariants.length > 0 && this.expandedVariants.length === 0) {
          this.expandedVariants = [0]; // Expand the first variant by default
        }

        // Ensure expandedVariants doesn't contain indices that exceed the current variants length
        this.expandedVariants = this.expandedVariants.filter(
          (index) => index < newVariants.length
        );

        // Re-initialize event listeners for new variants
        this.$nextTick(() => {
          this.initializeCollapseEventListeners();
        });
      },
      deep: true,
    },
    cartdetail: {
      handler(newValue) {
        // When cartdetail becomes true and we have variants, expand the first one
        if (
          newValue &&
          this.variants.length > 0 &&
          this.expandedVariants.length === 0
        ) {
          this.expandedVariants = [0];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getAllData();
    this.getbrands();
    this.getcategories();
    // this.generateCombinations();

    // Initialize collapse event listeners after DOM is ready
    this.$nextTick(() => {
      this.initializeCollapseEventListeners();
    });
  },
  beforeUnmount() {
    // Clean up any Bootstrap collapse instances
    this.cleanupCollapseEventListeners();
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
    // max-height: calc(100vh - 200px);
    overflow-y: auto;
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

/* ✅ Accordion Collapse Styles */
.accordion-toggle {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px 20px;
  font-weight: 500;
  color: #333;

  &:hover {
    text-decoration: none;
    color: #007bff;
  }

  &.collapsed {
    color: #666;
  }

  .fas {
    transition: transform 0.3s ease;
  }

  &:not(.collapsed) .fas {
    transform: rotate(90deg);
  }
}

.accordion .card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    border-radius: 8px 8px 0 0 !important;

    &:hover {
      background-color: #e9ecef;
    }
  }

  .collapse {
    transition: all 0.35s ease;
  }
}

.badge {
  font-size: 0.75em;
}
</style>
