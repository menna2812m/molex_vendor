<template>
  <section class="withdrawal-container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="section-title mb-0">طلبات السحب</h4>
      <button @click="addModel = true" class="btn-add">
        <i class="fe fe-plus me-1"></i>
        طلب سحب
      </button>
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
            <table class="table withdrawal-table">
              <thead>
                <tr>
                  <th class="text-muted">الكمية</th>
                  <th class="text-muted">ايصال التحويل</th>
                  <th class="text-muted">الحالة</th>
                  <th class="text-muted">اسم البنك</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in myList"
                  :key="index"
                  class="list_item"
                >
                  <td class="amount">{{ item.amount }}</td>
                  <td>
                    <div
                      class="receipt-image-container"
                      v-if="item.transfer_receipt"
                    >
                      <img
                        :src="item.transfer_receipt"
                        class="receipt-image"
                        @click="showFullImage(item.transfer_receipt)"
                      />
                    </div>
                    <span v-else class="no-receipt">لا يوجد إيصال</span>
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      :class="getStatusClass(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td>{{ item.bank_account?.bank_name || "غير محدد" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" v-else>
        <div class="empty-state-message">لا يوجد طلبات سحب حتي الان</div>
      </div>
    </section>

    <!-- Add withdrawal modal -->
    <teleport to="body">
      <b-modal
        id="add-withdrawal-modal"
        v-model="addModel"
        hide-footer
        centered
        size="md"
      >
        <template #modal-header>
          <h5 class="modal-title">طلب السحب</h5>
        </template>

        <div class="modal-body-content">
          <form @submit.prevent="add" class="withdrawal-form">
            <div class="form-group">
              <label class="form-label">الكمية</label>
              <div class="input-with-icon">
                <i class="fe fe-dollar-sign input-icon"></i>
                <input
                  type="number"
                  placeholder="أدخل المبلغ المراد سحبه"
                  class="form-control"
                  v-model="formData.amount"
                />
              </div>
            </div>

            <div class="form-actions">
              <button
                class="btn btn-primary"
                type="submit"
                :disabled="isLoading"
              >
                <span v-if="!isLoading"> تقديم الطلب</span>
                <span v-if="isLoading"> جاري تقديم الطلب... </span>
              </button>
              <button
                class="btn btn-light"
                type="button"
                @click="addModel = false"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </b-modal>
    </teleport>

    <!-- Image Preview Modal -->
    <teleport to="body">
      <div
        class="image-preview-modal"
        v-if="previewImage"
        @click="previewImage = null"
      >
        <div class="image-preview-container">
          <img :src="previewImage" alt="صورة الإيصال" class="preview-image" />
          <button class="close-preview" @click.stop="previewImage = null">
            <i class="fe fe-x"></i>
          </button>
        </div>
      </div>
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
      previewImage: null,
      formData: {
        amount: "",
      },
      isLoading: false,
    };
  },
  methods: {
    async withdrawal_requests() {
      this.loading = true;
      try {
        let res = await crudDataService.getAll("withdrawal");
        this.myList = res.data.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        this.loading = false;
      }
    },

    async add() {
      this.isLoading = true;
      const toast = useToast();

      if (!this.formData.amount || this.formData.amount <= 0) {
        toast.error("يرجى إدخال مبلغ صحيح للسحب", {
          position: "top-center",
          timeout: 5000,
        });
        return;
      }

      try {
        let res = await crudDataService.create(`withdrawal`, this.formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.isLoading = false;
        this.withdrawal_requests();
        this.addModel = false;
        this.formData.amount = "";

        toast.success("تم تقديم طلب السحب بنجاح", {
          position: "top-center",
          timeout: 5000,
        });
      } catch (error) {
        this.isLoading = false;
        toast.error(error?.data?.message || "حدث خطأ أثناء تقديم الطلب", {
          position: "top-center",
          timeout: 5000,
        });
      }
    },

    getStatusClass(status) {
      switch (status) {
        case "pending":
          return "status-pending";
        case "approved":
          return "status-approved";
        case "rejected":
          return "status-rejected";
        default:
          return "";
      }
    },

    showFullImage(image) {
      this.previewImage = image;
    },
  },
  mounted() {
    this.withdrawal_requests();
  },
};
</script>

<style scoped lang="scss">
.withdrawal-container {
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

.card {
  border-radius: 8px;
  border: none;
  box-shadow: 0px 3px 10px rgba(230, 237, 240, 0.5);
  overflow: hidden;
}

.withdrawal-table {
  margin-bottom: 0;

  thead tr {
    th {
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      text-align: center;
    }
  }

  tbody tr {
    transition: background 0.2s ease;
  }

  td {
    padding: 12px 16px;
    vertical-align: middle;
    text-align: center;

    &.amount {
      font-weight: 500;
      font-size: 1.1rem;
      color: #333;
    }
  }
}

.list_item:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.receipt-image-container {
  display: flex;
  justify-content: center;
}

.receipt-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #eee;

  &:hover {
    transform: scale(1.05);
  }
}

.no-receipt {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  min-width: 100px;

  &.status-pending {
    background-color: rgba(255, 193, 7, 0.15);
    color: #ffc107;
  }

  &.status-approved {
    background-color: rgba(40, 167, 69, 0.15);
    color: #28a745;
  }

  &.status-rejected {
    background-color: rgba(220, 53, 69, 0.15);
    color: #dc3545;
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

.withdrawal-form {
  .form-group {
    margin-bottom: 1.5rem;
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
      font-size: 1.1rem;
      height: 45px;
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

/* Image Preview Modal */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.image-preview-container {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.close-preview {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
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

// Image preview modal positioning
.image-preview-modal {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
