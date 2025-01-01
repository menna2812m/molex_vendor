<template>
  <section class="mt-5 pt-5">
    <div class="pos-relative">
      <button
         @click="addModel = true"
        class="btn-add me-0 mb-4"
      >
        <i class="fe fe-plus"></i>
          طلب سحب
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
      <div class="card custom-card border-0 mg-b-20" v-if="myList.length > 0">
        <div class="card-body p-0">
          <div
            class="table-responsive border-0 rounded border-bottom-0 px-4 mb-0"
          >
            <table class="table text-nowrap text-md-nowrap mg-b-0 text-center">
              <tr>
                 <td class="text-muted">الكمية</td>
                <td class="text-muted">ايصال التحويل</td>
                <td class="text-muted">الحالة</td>
                <td class="text-muted">اسم البنك</td>
              </tr>
              <tr
                v-for="(item, index) in myList"
                :key="index"
                class="list_item py-3 w-100 align-items-center justify-content-between"
              >
              
                <td>
                  {{ item.amount }}
                </td>
                <td>
                  <img
                        :src="item.transfer_receipt"
                        style="width: 100px; height: 100px; object-fit: fill"
                        class="m-1"
                        v-if="item.transfer_receipt"
                      />
                </td>
                <td>
                  {{ item.status }}
                </td>
                <td>
                  {{ item.bank_account?.bank_name }}
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
          لا يوجد  طلبات سحب حتي الان
        </div>
      </section>
    </section>
    <teleport to="body">
      <b-modal
        id="add"
        v-model="addModel"
        hide-footer
        title="طلب السحب"
      >
        <div class="p-0 pos-relative" style="z-index: 555">
          <form @submit.prevent="add">
            <div class="row">
              <div class="mt-1">
                  <label >الكمية </label>
                  <input
                  type="number"
                  name=""
                  id=""
                  placeholder="الكمية"
                  class="form-control"
                  v-model="formData.amount"
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
import { useToast } from "vue-toastification";
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService.js";
import axios from "axios";
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
        amount:''
      },
    };
  },
  methods: {
    async withdrawal_requests() {
      this.loading = true; 
      try {
        let res = await crudDataService.getAll("withdrawal");
        this.myList = res.data.data.data;
        console.log(this.myList);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        this.loading = false; 
      }
    }, 
    async add() {
      let res = await crudDataService
        .create(`withdrawal`, this.formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.withdrawal_requests();
          this.addModel = false;
          (this.formData.amount = "")
           
        });
    },   
    // approve(data, index, name) {
    //   this.$swal
    //     .fire({
    //       title: `؟"${name.name}" هل تريد الموافقة علي طلب سحب  `,
    //       showCancelButton: true,
    //       confirmButtonText: "Yes",
    //     })
    //     .then((result) => {
    //       if (result.isConfirmed) {
    //         crudDataService.create(`withdrawal/${data}/approve`).then((res) => {              
    //             this.$swal.fire(res.data.message,"", "success");
    //             this.withdrawal_requests();
    //           })
    //           .catch((error) => {
    //             this.$swal.fire(error.data.message,"", "error");
    //           });
    //       }         
    //     });
    // },
   
  },
  mounted() {
    this.withdrawal_requests();
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
