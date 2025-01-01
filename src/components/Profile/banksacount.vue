<template>
    <section class="mt-5 pt-5">
      <div class="pos-relative">
        <button
           @click="addModel = true"
          class="btn-add me-0 mb-4"
        >
          <i class="fe fe-plus"></i>
            اضافة حساب 
        </button>
      </div>
      <section
        class="position-relative"
        style="height: 100vh; display: grid; place-items: center"
        v-if="loading"
      >
        <section class="cate"></section>
        <progress class="pure-material-progress-circular" />
      </section>
      <section v-else>
        <div class="card custom-card border-0 mg-b-20" v-if="myList">
          <div class="card-body p-0">
            <div
              class="table-responsive border-0 rounded border-bottom-0 px-4 mb-0"
            >
              <table class="table text-nowrap text-md-nowrap mg-b-0 text-center">
                <tr>
                   <td class="text-muted">اسم صاحب الحساب</td>
                  <td class="text-muted">رقم الحساب </td>
                  <td class="text-muted">اسم البنك</td>
                  <td class="text-muted">
                    رقم الحساب المصرفي الدولي
                    (iban)
                    </td>
                  
                </tr>
                <tr
                  class="list_item py-3 w-100 align-items-center justify-content-between"
                >
       
                  <td>
                    {{ myList.account_holder_name }}
                  </td>
                  <td>
                    {{ myList.account_number }}
                  </td>
                  <td>
                    {{ myList.bank_name }}
                  </td>
                  <td>
                    {{ myList.iban }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
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
            لا يوجد حسابات حتي الان
          </div>
        </section>
      </section>
      <teleport to="body">
        <b-modal
          id="add"
          v-model="addModel"
          hide-footer
          title="اضافة الحساب"
        >
          <div class="p-0 pos-relative" style="z-index: 555">
            <form @submit.prevent="add">
              <div class="row">
                <div class="mt-1">
                    <label >اسم صاحب الحساب
                    </label>
                    <input
                    type="text"
                    name=""
                    id=""
                    placeholder="اسم صاحب الحساب"
                    class="form-control"
                    v-model="formData.account_holder_name"
                  />
  
                  </div>
                  <div class="mt-1">
                    <label >رقم الحساب </label>
                    <input
                    type="number"
                    name=""
                    id=""
                    placeholder="رقم الحساب"
                    class="form-control"
                    v-model="formData.account_number"
                  />
  
                  </div>
                <div class="mt-1">
                    <label >اسم البنك </label>
                    <input
                    type="text"
                    name=""
                    id=""
                    placeholder="اسم البنك"
                    class="form-control"
                    v-model="formData.bank_name"
                  />
  
                  </div>
             
                 
                  <div class="mt-1">
                    <label >رقم الحساب المصرفي الدولي 
                        (iban)
                    </label>
                    <input
                    type="text"
                    name=""
                    id=""
                    placeholder="رقم الحساب المصرفي الدولي"
                    class="form-control"
                    v-model="formData.iban"
                  />
  
                  </div>
              </div>
              <button class="btn btn-primary m-auto mt-3 d-block" type="submit">
                اضافة
              </button>
            </form>
          </div>
        </b-modal>
      </teleport>
    </section>
  </template>
  
  <script>
  import Multiselect from "@vueform/multiselect";
  import crudDataService from "../../Services/crudDataService.js";
  export default {
    components: {
      Multiselect,
    },
    data() {
      return {
        addModel: false,
        myList: [],
        id: null,
        loading: false,
        formData: {
          bank_name:'',
          account_holder_name:'',
          account_number:'',
          iban:''
        },
      };
    },
    methods: {
      async bankaccount() {
        this.loading = true; 
        try {
          let res = await crudDataService.getAll("bank-account");
          this.myList = res.data.data;          
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          this.loading = false; 
        }
      }, 
      async add() {
        let res = await crudDataService
          .create(`bank-account`, this.formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            this.bankaccount();
            this.addModel = false;
            (this.formData.bank_name = "")
            (this.formData.account_holder_name = "")
            (this.formData.account_number = "")
            (this.formData.iban = "")
             
          });
      },  
    },
    mounted() {
      this.bankaccount();
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
  </style>
  