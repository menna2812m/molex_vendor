<template>
  <section>
    <div class="pos-relative text-end">
      <button
        @click="edit(item)"
        class="twobtn bg-white border"
        style="border-color: #E66239 !important; color: #E66239"
      >
        تعديل الملف الشخصي
      </button>
    </div>
    <section class="mt-3">
      <div class="card productdesc pb-3 border-1">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between"
        >
          <h4 class="mb-0">الملف الشخصي</h4>
          <button
        @click="gotoacounts()"
        class="twobtn bg-primary border"
        style="border-color: #E66239 !important; color: #fff;"
      >
       الحسابات البنكية
      </button>
        </div>
        <div class="row align-items-center justify-content-center pt-3">
          <div class="col-12">
            <div class="d-flex align-items-center m-2 p-2 border rounded">
              <i class="fe fe-user mx-1"></i>
              <p class="mb-0">
                {{ item.name ? item.name : "لايوجد" }}
              </p>
            </div>

            <div class="d-flex align-items-center m-2 p-2 border rounded">
              <i class="fe fe-phone mx-1"></i>
              <p class="mb-0">
                {{ item.phone ? item.phone : "لايوجد" }}
              </p>
            </div>
            <div class="d-flex align-items-center m-2 p-2 border rounded">
              <i class="fe fe-mail mx-1"></i>
              <p class="mb-0">
                {{ item.email ? item.email : "لايوجد" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <teleport to="body">
      <b-modal
        id="add-page"
        v-model="ShowModeledit"
        hide-footer
        title="تعديل البيانات الشخصيه"
      >
        <div class="p-0">
          <form @submit.prevent="update">
            <div class="row">
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label> الاسم الاول </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formDataupdate.fname"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label> الاسم الاخير </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formDataupdate.lname"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label> الايميل </label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formDataupdate.email"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label> الجوال </label>
                  <input
                    type="phone"
                    class="form-control"
                    v-model="formDataupdate.phone"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-2">
                <div class="mt-1">
                  <label> تاريخ الميلاد </label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="formDataupdate.birth_date"
                  />
                </div>
              </div>
              <div class="col-6 mb-2">
                <label> النوع </label>
                <Multiselect
                  label="name"
                  :searchable="true"
                  :options="gender"
                  v-model="formDataupdate.gender"
                />
              </div>
            </div>
            <button class="btn btn-primary m-auto d-block mt-3" type="submit">
              تعديل
            </button>
          </form>
        </div>
      </b-modal>
    </teleport>
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import moment from "moment";
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      id: null,
      item: {},
      ShowModeledit: false,
      formDataupdate: {
        fname: "",
        lname: "",
        email: "",
        phone: "",
        birth_date: "",
        gender: "",
      },
      gender: [
        { value: "male", name: "ذكر" },
        { value: "female", name: "انثي" },
      ],
    };
  },
  methods: {
    async gotoacounts(){
      this.$router.push({ name: "banksacount"});

    },
    async getprofile() {
      const res = await crudDataService.getAll("profile");
      this.item = res.data.data;
    },
    async edit(data) {
      this.ShowModeledit = true;
      this.id = data.id;
      this.formDataupdate.fname = data.fname;
      this.formDataupdate.lname = data.lname;
      this.formDataupdate.email = data.email;
      this.formDataupdate.phone = data.phone;
      this.formDataupdate.gender = data.gender;
      this.formDataupdate.birth_date = data.birth_date
        ? moment(data.birth_date).format("YYYY-MM-DD")
        : "";
    },
    async update() {
      let res = await crudDataService
        .create(`profile?_method=PUT`, this.formDataupdate)
        .then((res) => {
          this.getprofile();
          this.ShowModeledit = false;
          const toast = useToast();
          toast.success(res.data.message, {
            position: "top-center",
            timeout: 5000,
          });
        })
        .catch((error) => {
          this.ShowModeledit = false;

          const toast = useToast();
          toast.error(error.data.message, {
            position: "top-center",
            timeout: 5000,
          });
        });
    },
  },
  mounted() {
    this.getprofile();
  },
};
</script>
