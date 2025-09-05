<template>
  <div class="dashboard-container">
    <!-- Page Header -->
    <div class="page-header my-3">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="main-content-title tx-24 mg-b-5">لوحة التحكم</h2>
          <p class="mt-1 mb-0">مرحباً بك في لوحة تحكم المتجر</p>
        </div>
        <!-- <div class="col-auto">
          <div class="btn-group gap-3" role="group">
            <button class="btn btn-white btn-icon">
              <i class="fe fe-download"></i> تقرير
            </button>
            <button class="btn btn-primary btn-icon">
              <i class="fe fe-refresh-cw"></i> تحديث
            </button>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Statistics Cards -->
    <div v-if="items" class="row row-sm">
      <div
        class="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3"
        v-for="key in statisticsOrder"
        :key="key"
      >
        <div class="card custom-card dashboard-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper me-3">
                <i class="si text-white" :class="admin[key]"></i>
              </div>
              <div class="flex-grow-1">
                <p class="mb-2 tx-12">{{ statisticsLabels[key] || key }}</p>
                <h4 class="font-weight-bold mb-1">{{ items[key] }}</h4>
                <div class="progress ht-5 mt-1 mb-0">
                  <div
                    class="progress-bar"
                    :style="{
                      width: getRandomPercentage() + '%',
                      backgroundColor: getColorForKey(key),
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div v-if="items" class="row mt-4">
      <!-- Chart Section -->
      <div class="col-lg-8 col-md-12">
        <div class="card custom-card">
          <div
            class="card-header border-bottom-0 d-flex justify-content-between align-items-center"
          >
            <h6 class="main-content-label mb-0">إحصائيات المبيعات</h6>
            <div class="d-flex align-items-center gap-2">
              <select
                v-model="selectedMonth"
                @change="onMonthChange"
                class="form-select form-select-sm"
                style="width: auto; min-width: 120px"
              >
                <option
                  v-for="(month, idx) in months"
                  :key="idx"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div
              v-if="isSalesStatLoading"
              class="d-flex align-items-center justify-content-center"
              style="min-height: 300px"
            >
              <i class="fe fe-loader fe-spin fs-1 mb-3"></i>
              <p class="">جاري تحميل البيانات...</p>
            </div>
            <div
              v-if="!isSalesStatLoading"
              class="chart-container"
              style="min-height: 300px; position: relative"
            >
              <div v-if="salesStats" class="sales-stats-details">
                <div class="row mb-3">
                  <div class="col-md-4 col-12 mb-2">
                    <div class="stat-box">
                      <span class="stat-label">إجمالي الطلبات</span>
                      <span class="stat-value">{{
                        salesStats.total_orders
                      }}</span>
                    </div>
                  </div>
                  <div class="col-md-4 col-12 mb-2">
                    <div class="stat-box">
                      <span class="stat-label">إجمالي المبيعات</span>
                      <span class="stat-value"
                        >{{
                          salesStats.total_sales.toLocaleString("ar-EG", {
                            maximumFractionDigits: 2,
                          })
                        }}
                        دينار عراقي</span
                      >
                    </div>
                  </div>
                  <div class="col-md-4 col-12 mb-2">
                    <div class="stat-box">
                      <span class="stat-label">متوسط قيمة الطلب</span>
                      <span class="stat-value"
                        >{{
                          salesStats.average_order_value.toLocaleString(
                            "ar-EG",
                            { maximumFractionDigits: 2 }
                          )
                        }}
                        دينار عراقي</span
                      >
                    </div>
                  </div>
                </div>
                <div class="orders-status-table mt-3">
                  <h6 class="mb-2">الطلبات حسب الحالة</h6>
                  <table class="table table-sm table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>الحالة</th>
                        <th>عدد الطلبات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(count, status) in salesStats.orders_by_status"
                        :key="status"
                      >
                        <td>{{ orderStatusLabels[status] || status }}</td>
                        <td>{{ count }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                v-else
                class="chart-placeholder d-flex align-items-center justify-content-center flex-column"
              >
                <i
                  class="fe fe-bar-chart-2 fs-1 mb-3 text-muted"
                  style="font-size: 48px"
                ></i>
                <p class="text-muted">بيانات المبيعات ستظهر هنا</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="col-lg-4 col-md-12">
        <div class="card custom-card">
          <div class="card-header border-bottom-0">
            <h6 class="main-content-label mb-0">النشاط الأخير</h6>
          </div>
          <div class="card-body">
            <div class="recent-activity">
              <div v-if="activities.length > 0">
                <div
                  v-for="(activity, index) in activities"
                  :key="index"
                  class="activity-item d-flex align-items-center mb-3"
                >
                  <div class="activity-icon" :class="activity.iconClass">
                    <i :class="activity.icon"></i>
                  </div>
                  <div class="ms-3">
                    <p class="mb-1 font-weight-semibold">
                      {{ activity.title }}
                    </p>
                    <p class="mb-0 tx-12">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center p-4">
                <i
                  class="fe fe-activity text-muted mb-2"
                  style="font-size: 24px"
                ></i>
                <p class="text-muted">لا يوجد نشاطات حديثة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div v-if="items" class="row mt-4">
      <div class="col-12">
        <div class="card custom-card">
          <div
            class="card-header border-bottom-0 d-flex justify-content-between"
          >
            <h6 class="main-content-label mb-0">أحدث الطلبات</h6>
            <a href="#" class="btn btn-link p-0">عرض الكل</a>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mg-b-0">
                <thead>
                  <tr>
                    <th>#الطلب</th>
                    <th>العميل</th>
                    <th>التاريخ</th>
                    <th>القيمة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in 5" :key="i">
                    <td>#ORD-{{ 1000 + i }}</td>
                    <td>عميل {{ i }}</td>
                    <td>{{ new Date().toLocaleDateString("ar-EG") }}</td>
                    <td>{{ (Math.random() * 1000).toFixed(2) }} دينار عراقي</td>
                    <td>
                      <span :class="['badge', getRandomStatus().class]">{{
                        getRandomStatus().text
                      }}</span>
                    </td>
                    <td>
                      <div class="btn-group gap-3">
                        <button class="btn btn-sm btn-light">
                          <i class="fe fe-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-light">
                          <i class="fe fe-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-container">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">جاري التحميل...</span>
        </div>
        <p class="mt-3">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import crudDataService from "../../Services/crudDataService.js";
export default {
  name: "Dashboard",
  data() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    return {
      items: null,
      icon: false,
      admin: {},
      loading: true,
      isSalesStatLoading: false,
      useStaticData: false, // Set to true to use static data directly
      statisticsOrder: [
        "orders",
        "monthly_orders",
        "products",
        "offers",
        "coupons",
        "reviews",
        "earnings",
        "recent_earnings",
        "pending_withdrawals",
      ],
      statisticsLabels: {
        orders: "إجمالي الطلبات",
        monthly_orders: "طلبات هذا الشهر",
        products: "المنتجات",
        offers: "العروض",
        coupons: "الكوبونات",
        reviews: "المراجعات",
        earnings: "إجمالي الأرباح",
        recent_earnings: "أرباح حديثة",
        pending_withdrawals: "طلبات السحب المعلقة",
      },

      activities: [
        {
          title: "تم إضافة منتج جديد",
          time: "منذ 5 دقائق",
          icon: "fe fe-shopping-bag",
          iconClass: "bg-primary-transparent",
        },
        {
          title: "طلب جديد #1082",
          time: "منذ 10 دقائق",
          icon: "fe fe-shopping-cart",
          iconClass: "bg-success-transparent",
        },
        {
          title: "تسجيل عميل جديد",
          time: "منذ 30 دقيقة",
          icon: "fe fe-user-plus",
          iconClass: "bg-info-transparent",
        },
        {
          title: "تم تحديث مخزون المنتجات",
          time: "منذ ساعة",
          icon: "fe fe-refresh-cw",
          iconClass: "bg-warning-transparent",
        },
      ],
      salesStats: null,
      selectedMonth: `${String(currentMonth).padStart(2, "0")}`,
      months: Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return {
          value: `${String(month).padStart(2, "0")}`,
          label: new Date(currentYear, i).toLocaleString("ar-EG", {
            month: "long",
          }),
        };
      }),
      orderStatusLabels: {
        processing: "قيد المعالجة",
        delivered: "تم التوصيل",
        shipped: "تم الشحن",
        cancelled: "ملغي",
        pending: "قيد الانتظار",
        assigned: "تم التعيين",
      },
    };
  },
  methods: {
    async getstatistics() {
      try {
        const res = await crudDataService.getAll("dashboard/statistics");
        this.items = res.data.data;
        this.setupIcons();
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    },
    setupIcons() {
      const iconMap = {
        orders: "si-bag",
        monthly_orders: "si-calendar",
        products: "si-grid",
        offers: "si-star",
        coupons: "si-tag",
        reviews: "si-heart",
        earnings: "si-wallet",
        recent_earnings: "si-cash",
        pending_withdrawals: "si-arrow-up-circle",
      };
      for (const key of this.statisticsOrder) {
        if (iconMap[key]) {
          this.admin[key] = iconMap[key];
        }
      }
    },
    getRandomPercentage() {
      return Math.floor(Math.random() * 80) + 20; // 20-100
    },
    getColorForKey(key) {
      const colorMap = {
        orders: "#ff9b21",
        monthly_orders: "#f7b731",
        products: "#38cb89",
        offers: "#f7b731",
        coupons: "#00b3ff",
        reviews: "#e82646",
        earnings: "#6259ca",
        recent_earnings: "#5b73e8",
        pending_withdrawals: "#ef4b4b",
      };
      return colorMap[key] || "#6259ca";
    },
    getRandomStatus() {
      const statuses = [
        { text: "مكتمل", class: "bg-success" },
        { text: "قيد التنفيذ", class: "bg-warning" },
        { text: "قيد المراجعة", class: "bg-info" },
        { text: "مرفوض", class: "bg-danger" },
      ];
      return statuses[Math.floor(Math.random() * statuses.length)];
    },
    async getSalesStatistics(month = null) {
      this.isSalesStatLoading = true;
      try {
        let periodParam = "";
        if (month) {
          periodParam = `period=${month}`;
        } else if (this.selectedMonth) {
          periodParam = `period=${this.selectedMonth}`;
        }
        const url = `dashboard/sales-statistics?${periodParam}`;

        const res = await crudDataService.getAll(url);
        this.salesStats = res.data.data;
        this.isSalesStatLoading = false;
      } catch (err) {
        this.isSalesStatLoading = false;
        console.error("Error fetching statistics:", err);
      }
    },
    onMonthChange() {
      this.getSalesStatistics(this.selectedMonth);
    },
  },
  mounted() {
    this.getstatistics();
    this.getSalesStatistics(this.selectedMonth);
  },
};
</script>

<style scoped>
.btn {
  width: 73px;
  border-radius: 5px !important;
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}
.dashboard-container {
  margin-bottom: 3rem;
}

.dashboard-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e66239;
}

.icon-wrapper .si {
  font-size: 20px;
}

.loading-container {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-content {
  text-align: center;
}
.dark-theme .text-muted {
  color: initial !important;
}
.chart-placeholder {
  height: 100%;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.activity-item {
  transition: all 0.2s ease;
}

.activity-item:hover {
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 8px;
}
.dark-theme .activity-item:hover {
  color: var(--dark-theme);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
}

.bg-primary-transparent {
  background-color: rgba(98, 89, 202, 0.2);
  color: #6259ca;
}

.bg-success-transparent {
  background-color: rgba(56, 203, 137, 0.2);
  color: #38cb89;
}

.bg-info-transparent {
  background-color: rgba(1, 98, 232, 0.2);
  color: #0162e8;
}

.bg-warning-transparent {
  background-color: rgba(255, 155, 33, 0.2);
  color: #ff9b21;
}

.sales-stats-details .stat-box {
  border-radius: 6px;
  padding: 16px 12px;
  margin-bottom: 8px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #e66239;
}
.sales-stats-details .stat-label {
  display: block;
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
}
.sales-stats-details .stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #e66239;
}

.orders-status-table th,
.orders-status-table td {
  text-align: center;
  font-size: 14px;
}

/* Right-to-left adjustments */
.ms-3 {
  margin-right: 1rem !important;
  margin-left: 0 !important;
}

.me-3 {
  margin-left: 1rem !important;
  margin-right: 0 !important;
}

@media (max-width: 768px) {
  .page-header .col-auto {
    margin-top: 1rem;
  }
}
</style>
