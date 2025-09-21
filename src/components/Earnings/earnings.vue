<template>
  <section class="earnings-container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="section-title mb-0">الأرباح</h4>
    </div>

    <!-- Loading state -->
    <div class="loading-container" v-if="loading">
      <section class="cate"></section>
      <progress class="pure-material-progress-circular" />
    </div>

    <!-- Content when loaded -->
    <section v-else>
      <div class="row mb-4" v-if="myList.length > 0">
        <!-- Summary Cards -->
        <div class="col-md-4">
          <div class="summary-card">
            <div class="summary-card-content">
              <div class="summary-data">
                <h6 class="summary-title">ارباح المتجر</h6>
                <h3 class="summary-value">
                  {{ getTotalStoreEarning() }}
                </h3>
                <span>دينار عراقي</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="summary-card">
            <div class="summary-card-content">
              <div class="summary-data">
                <h6 class="summary-title">المبلغ المدفوع</h6>
                <h3 class="summary-value">
                  {{ getTotalPaidAmount() }}
                </h3>
                <span>دينار عراقي</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="summary-card">
            <div class="summary-card-content">
              <div class="summary-data">
                <h6 class="summary-title">رسوم المنصة</h6>
                <h3 class="summary-value">
                  {{ getTotalPlatformFee() }}
                </h3>
                <span>دينار عراقي</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table with data -->
      <div class="card custom-card" v-if="myList.length > 0">
        <div class="card-header">
          <h5 class="card-title mb-0">تفاصيل الأرباح</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive border-0 rounded">
            <table class="table earnings-table">
              <thead>
                <tr>
                  <th class="text-muted">ارباح المتجر</th>
                  <th class="text-muted">المبلغ المدفوع</th>
                  <th class="text-muted">رسوم المنصة</th>
                  <th class="text-muted">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in myList"
                  :key="index"
                  class="list_item"
                >
                  <td class="store-earning">
                    {{ item.store_earning }} دينار عراقي
                  </td>
                  <td class="paid-amount">
                    {{ item.paid_amount }} دينار عراقي
                  </td>
                  <td class="platform-fee">
                    {{ item.platform_fee }} دينار عراقي
                  </td>
                  <td class="date">{{ formatDate(item.created_at || "") }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" v-else>
        <div class="empty-state-message">لا يوجد أرباح حتي الان</div>
      </div>
    </section>
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
      myList: [],
      id: null,
      loading: false,
    };
  },
  methods: {
    async earnings() {
      this.loading = true;
      try {
        let res = await crudDataService.getAll("earnings");
        this.myList = res.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        this.loading = false;
      }
    },

    getTotalStoreEarning() {
      const total = this.myList.reduce(
        (sum, item) => sum + parseFloat(item.store_earning || 0),
        0
      );
      return total.toFixed(2);
    },

    getTotalPaidAmount() {
      const total = this.myList.reduce(
        (sum, item) => sum + parseFloat(item.paid_amount || 0),
        0
      );
      return total.toFixed(2);
    },

    getTotalPlatformFee() {
      const total = this.myList.reduce(
        (sum, item) => sum + parseFloat(item.platform_fee || 0),
        0
      );
      return total.toFixed(2);
    },

    formatDate(dateString) {
      if (!dateString) return "غير محدد";
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG");
    },
  },
  mounted() {
    this.earnings();
  },
};
</script>

<style scoped lang="scss">
.earnings-container {
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

/* Summary Cards */
.summary-card {
  border-radius: 8px;
  box-shadow: 0px 3px 10px rgba(230, 237, 240, 0.5);
  padding: 20px;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 15px rgba(230, 237, 240, 0.8);
  }
}

.summary-card-content {
  display: flex;
  align-items: center;
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e66239;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  i {
    font-size: 20px;
    color: white;
  }

  &.bg-success {
    background-color: #28a745;
  }

  &.bg-info {
    background-color: #17a2b8;
  }
}

.summary-data {
  flex: 1;

  .summary-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: #777;
    margin-bottom: 5px;
  }

  .summary-value {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
}

.card {
  border-radius: 8px;
  border: none;
  box-shadow: 0px 3px 10px rgba(230, 237, 240, 0.5);
  overflow: hidden;
  margin-bottom: 2rem;

  .card-header {
    border-bottom: 1px solid #eee;
    padding: 16px 20px;

    .card-title {
      font-weight: 600;
    }
  }
}

.earnings-table {
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

    &:hover {
      background-color: #f5f5f5;
    }
  }

  td {
    padding: 12px 16px;
    vertical-align: middle;
    text-align: center;

    &.store-earning {
      font-weight: 600;
      color: #e66239;
    }

    &.paid-amount {
      font-weight: 500;
      color: #28a745;
    }

    &.platform-fee {
      color: #17a2b8;
    }

    &.date {
      color: #777;
      font-size: 0.9rem;
    }
  }
}

.list_item:not(:last-child) {
  border-bottom: 1px solid #eee;
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
</style>
