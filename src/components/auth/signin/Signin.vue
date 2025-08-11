<template>
  <div class="page main-signin-wrapper">
    <!-- Row -->
    <div class="row signpages text-center">
      <div class="col-md-12 my-auto">
        <div class="card">
          <div class="row row-sm">
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary-05"
            >
              <div
                class="mt-2 p-2 d-flex justify-content-between flex-column align-items-center"
              >
                <img
                  src="../../../../src/assets/img/logo.png"
                  class="header-brand-img desktop-logo"
                  alt="logo"
                  v-if="isDark"
                />
                <img
                  src="../../../../src/assets/img/logo-dark.png"
                  class="header-brand-img desktop-logo p-2"
                  alt="logo"
                  v-if="!isDark"
                />
                <div class="clearfix"></div>
                <img
                  src="../../../assets/img/svgs/user.svg"
                  class="ht-100 mb-0 mt-4"
                  alt="user"
                />
                <!-- <h5 class="mt-4 text-white">Create Your Account</h5> -->
                <!-- <span class="tx-white-6 tx-13 mb-5 mt-xl-0"
                    >Signup to create, discover and connect with the global community</span
                  > -->
              </div>
            </div>
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm">
                  <div class="card-body mt-2 mb-2">
                    <img
                      src="../../../assets/img/logo.png"
                      class="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light"
                      alt="logo"
                    />
                    <img
                      src="../../../assets/img/logo.png"
                      class="d-lg-none header-brand-img header-brand-img-sm text-start float-start mb-4 error-logo"
                      alt="logo"
                      v-if="isDark"
                    />
                    <img
                      src="../../../assets/img/logo-dark.png"
                      class="d-lg-none header-brand-img header-brand-img-sm text-start float-start mb-4 error-logo"
                      alt="logo"
                      v-if="!isDark"
                    />
                    <div class="clearfix"></div>
                    <form
                      action="#"
                      @submit.prevent="handleLogin()"
                      class="mt-4"
                    >
                      <div class="form-group text-start">
                        <label>البريد الإلكتروني</label>
                        <input
                          name="email"
                          type="email"
                          v-model="form.email"
                          class="form-control"
                          placeholder="ادخل البريد الالكتروني"
                        />
                      </div>
                      <div class="form-group text-start">
                        <label>كلمة السر </label>
                        <input
                          type="password"
                          name="password"
                          v-model="form.password"
                          class="form-control"
                          placeholder="*******"
                        />
                      </div>
                      <div v-if="messageerror">
                        <p class="text-danger text-start">
                          {{ messageerror }}
                        </p>
                      </div>
                      <button
                        type="submit"
                        class="btn ripple btn-primary btn-block"
                      >
                        تسجيل الدخول
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End Row -->
  </div>
</template>
<script>
import crudDataService from "../../../Services/crudDataService.js";
import { themeMixin } from "../../../Shared/mixins/themeMixin.js";
export default {
  mixins: [themeMixin],

  data() {
    return {
      url: import.meta.env.BASE_URL,
      form: {
        email: "",
        password: "",
      },
      messageerror: "",
    };
  },
  mounted() {},
  methods: {
    Switcherbutton() {
      return this.$store.commit("Switcherbutton");
    },
    async handleLogin() {
      await crudDataService
        .create("login", this.form)
        .then((response) => {
          localStorage.setItem("authvendor", response.data.data.token);
          this.$router.push({ name: "store" });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          this.messageerror = err.data.message;
        });
    },
  },
};
</script>

<style>
.header-brand-img-sm {
  width: 30%;
}
</style>
