<template>
  <section class="loading-container" v-if="loading">
    <section class="cate"></section>
    <progress class="pure-material-progress-circular" />
  </section>
  <section v-else class="orders-container">
    <div class="header-section">
      <div class="header-left">
        <label class="mb-0 fw-semibold fs-6 mb-3">
          احدث الطلبات
          <span class="order-count"> ({{ myList.length }}) </span>
        </label>
      </div>

      <div class="header-right">
        <div class="view-toggle">
          <button
            class="view-button"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="typcn typcn-th-large"></i>
          </button>
          <button
            class="view-button"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <i class="typcn typcn-th-list"></i>
          </button>
        </div>

        <Multiselect
          label="name"
          :searchable="true"
          :options="type"
          placeholder="اختر النوع"
          @change="handleTypeChange($event)"
          class="filter-select"
        />
      </div>
    </div>

    <section
      :class="['orders-list', viewMode === 'list' ? 'list-view' : '']"
      v-if="iscomplete"
    >
      <div
        v-for="(item, index) in myList"
        :key="index"
        class="order-card"
        @click="gotopage(item.id)"
      >
        <div class="order-header">
          <div class="order-id">
            <strong>رقم الطلب:</strong> {{ item.order_id }}
          </div>
          <div :class="['order-status', item.status]">
            {{ item.status_translated }}
          </div>
        </div>

        <div class="order-details">
          <div class="order-user">
            <img :src="userimg" alt="User" class="user-avatar" />
            <div class="order-address">
              <i class="typcn typcn-location location-icon"></i>
              {{
                item.address
                  ? item.address.address +
                    (item.address.city ? ", " + item.address.city : " ")
                  : "لا يوجد عنوان"
              }}
            </div>
          </div>

          <div class="order-info">
            <div class="order-total">{{ item.total }}</div>
            <div class="order-date">{{ item.updated_at.split("T")[0] }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="empty-orders" v-else>
      <div class="empty-message">لا يوجد 'طلبات' حتي الان</div>
    </section>
    <b-pagination
      v-model="page"
      :total-rows="last"
      :per-page="1"
      @click="paginag(page)"
    ></b-pagination>
  </section>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import crudDataService from "../../Services/crudDataService";
import userimg from "../../assets/img/user.png";

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      userimg,
      type: [
        { value: "", name: "الكل " },
        { value: "waitingForPayment", name: "انتظار الدفع " },
        { value: "pending", name: "قيد المراجعة" },
        { value: "assigned", name: "مخصص" },
        { value: "processing", name: "قيد المعالجة" },
        { value: "withDelivery", name: "مع التوصيل" },
        { value: "completed", name: "مكتمل" },
        { value: "cancelled", name: "ملغى" },
        { value: "hasProblem", name: "يوجد مشكلة" },
      ],
      myList: [],
      iscomplete: false,
      loading: false,
      page: 1,
      last: 2,
      viewMode: "grid", // 'grid' or 'list'
    };
  },
  methods: {
    async handleTypeChange(e) {
      let res = await crudDataService
        .getAll(`orders?filter[status]=${e}`)
        .then((res) => {
          this.myList = res.data.data.data;
          this.last = res.data.data.last_page;
          if (this.myList.length > 0) {
            this.iscomplete = true;
          } else {
            this.iscomplete = false;
          }
        });
    },
    async paginag(p) {
      let res = await crudDataService.getAll(`orders?page=${this.page}`);
      this.myList = res.data.data.data;
    },
    gotopage(id) {
      this.$router.push({ name: "SingleOrder", params: { id } });
    },
    async allorders() {
      this.loading = true;
      let res = await crudDataService.getAll("orders").then((res) => {
        this.myList = res.data.data.data;
        this.last = res.data.data.last_page;
        this.loading = false;
        if (this.myList.length > 0) {
          this.iscomplete = true;
        } else {
          this.iscomplete = false;
        }
      });
    },
    loadViewPreference() {
      const savedView = localStorage.getItem("viewMode");
      if (savedView === "grid" || savedView === "list") {
        this.viewMode = savedView;
      }
    },
  },
  watch: {
    viewMode(newValue) {
      localStorage.setItem("viewMode", newValue);
    },
  },
  mounted() {
    this.allorders();
    this.loadViewPreference();
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables";

.orders-container {
  padding: 20px;
  border: 1px solid $primary;
  border-radius: 8px;
  min-height: 100vh;
  color: $color;
  transition: all 0.3s ease;
}

.loading-container {
  height: 100vh;
  display: grid;
  place-items: center;
  position: relative;

  transition: all 0.3s ease;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background-color: $white;

  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px $black-05;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.view-toggle {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
}

.view-button {
  background: transparent;
  border: 1px solid $border;
  padding: 8px 12px;
  cursor: pointer;
  color: $gray-500;
  transition: all 0.2s;

  &:first-child {
    border-radius: 8px 0 0 8px;
  }

  &:last-child {
    border-radius: 0 8px 8px 0;
  }

  &.active {
    background-color: $primary;
    color: $white;
    border-color: $primary;
  }

  i {
    font-size: 1.2rem;
  }
}

.order-count {
  color: $primary;
  font-weight: normal;
}

.filter-select {
  width: 250px;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &.list-view {
    grid-template-columns: 1fr;

    .order-card {
      display: flex;
      flex-direction: column;

      .order-details {
        flex-direction: row;
      }

      .order-header {
        flex-direction: row;
      }
    }
  }
}

.order-card {
  background-color: $white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px $black-05;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px $black-1;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid $border;
}

.order-status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;

  &.pending {
    background-color: #e3e6ff;
    color: #7e87f7;
  }

  &.processing {
    background-color: #fff8e5;
    color: #ffa940;
  }

  &.delivered {
    background-color: #e6fff0;
    color: $success;
  }

  &.shipped {
    background-color: $gray-100;
    color: $gray-600;
  }

  &.cancelled {
    background-color: #ffebeb;
    color: $danger;
  }
  &.assigned {
    background-color: #eddca0;
    color: $danger;
  }
}

.order-details {
  display: flex;
  justify-content: space-between;
}

.order-user {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 3;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.order-address {
  font-size: 0.9rem;
  color: $gray-500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-icon {
  margin-right: 5px;
}

.order-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
}

.order-total {
  font-weight: 600;
  color: $primary;
  font-size: 1.1rem;
}

.order-date {
  color: $gray-400;
  font-size: 0.8rem;
  margin-top: 5px;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  :deep(.page-item) {
    margin: 0 2px;

    .page-link {
      border-radius: 5px;
      color: $primary;
      border-color: $primary-border;
      background-color: $white;
    }

    &.active .page-link {
      background-color: $primary;
      border-color: $primary-border;
      color: $white;
    }
  }
}

.empty-orders {
  height: 50vh;
  display: grid;
  place-items: center;
}

.empty-message {
  background: $primary;
  padding: 30px;
  font-size: 20px;
  width: 50%;
  text-align: center;
  color: $white;
  border-radius: 10px;
  box-shadow: 0 5px 15px $primary-03;
}

// Dark theme styling is now handled through CSS variables automatically
.dark-theme {
  .order-card,
  .header-section {
    background-color: $dark-theme;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-color: $dark-border;
    color: $white;
  }

  .order-address,
  .view-button {
    color: $dark-color;
  }

  .order-total {
    color: $primary;
  }

  .order-date {
    color: rgba(255, 255, 255, 0.7);
  }

  .custom-pagination {
    :deep(.page-item) {
      .page-link {
        background-color: $dark-theme;
        color: $primary;
      }
    }
  }
}
</style>
