<template>
  <section class="mt-5 pt-5 discount-coupons-container">
    <div class="d-flex justify-content-between align-items-center">
      <Tabscopuns @customEvent="handleCustomEvent" />
      <!-- <Fillter /> -->
    </div>

    <!-- Loading state -->
    <div class="loading-container" v-if="loading">
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </div>

    <!-- Content when loaded -->
    <section v-else>
      <!-- Table with data -->
      <div class="card custom-card" v-if="myList.length > 0">
        <div class="card-body p-0">
          <div class="table-responsive border-0 rounded">
            <table class="table coupons-table">
              <thead>
                <tr>
                  <th class="text-muted">عنوان الكوبون</th>
                  <th class="text-muted">تاريخ بداية الكوبون</th>
                  <th class="text-muted">تاريخ انتهاء الكوبون</th>
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
                  <td class="coupon-code" @click="singlecopun(item.id)">
                    {{ item.code }}
                  </td>
                  <td>{{ item.start_date }}</td>
                  <td>{{ item.end_date }}</td>
                  <td class="text-center">
                    <label class="custom-switch justify-content-center">
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
                      @click="del(item.id, index, item.code)"
                      title="حذف الكوبون"
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
        <div class="empty-state-message">لا يوجد كوبونات حتي الان</div>
      </div>
    </section>
  </section>
</template>

<script>
import { useToast } from "vue-toastification";
import Multiselect from "@vueform/multiselect";
import Fillter from "./Fillter.vue";
import Tabscopuns from "./Tabscopuns.vue";
import crudDataService from "../../Services/crudDataService.js";
export default {
  components: {
    Multiselect,
    Fillter,
    Tabscopuns,
  },
  data() {
    return {
      ShowModel: false,
      myList: [],
      loading: false,
    };
  },
  methods: {
    async toggleactive(id) {
      let res = await crudDataService.create(`coupons/${id}/toggle`, "");
      const toast = useToast();
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      }
    },
    handleCustomEvent(data) {
      this.myList = data;
    },
    async copuns() {
      this.loading = true; // Start loading
      try {
        let res = await crudDataService.getAll("coupons");
        this.myList = res.data.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error
      } finally {
        this.loading = false; // End loading regardless of success or failure
      }
    },
    singlecopun(id) {
      this.$router.push({ name: "SingleCopun", params: { id } });
    },
    del(data, index, name) {
      this.$swal
        .fire({
          title: `؟"${name}" هل تريد حذف الكوبون `,
          showCancelButton: true,
          confirmButtonText: "نعم",
          cancelButtonText: "إلغاء",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$swal.fire("تم الحذف بنجاح!", "", "success");
            crudDataService.delete("coupons", `${data}`).then(() => {
              this.myList.splice(index, 1);
            });
          }
        });
    },
  },
  mounted() {
    this.copuns();
  },
};
</script>

<style scoped lang="scss">
.coupon-container {
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

.coupons-table {
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

  .coupon-code {
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

.custom-switch {
  display: inline-flex;
  align-items: center;

  .custom-switch-indicator {
    border-radius: 50px;
  }
}

.discount-coupons-container {
  padding: 1rem;
}
</style>

<style lang="scss">
// Modal positioning and overflow fixes
.modal {
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
    max-height: calc(100vh - 200px);
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

  & .multiselect-placeholder,
  & ::placeholder {
    font-size: 12px;
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
