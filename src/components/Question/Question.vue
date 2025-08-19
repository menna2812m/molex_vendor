<template>
  <div class="question-container">
    <!-- Loading state -->
    <section class="loading-container" v-if="loading">
      <div class="loading-spinner">
        <progress class="pure-material-progress-circular" />
      </div>
    </section>

    <!-- Content section -->
    <section class="content-section" v-else>
      <div class="section-header">
        <h3 class="section-title">أسئلة العملاء</h3>
      </div>

      <!-- Questions list -->
      <section v-if="myList.length > 0" class="question-list">
        <div class="question-card" v-for="(item, index) in myList" :key="index">
          <div class="question-header">
            <div class="product-info">
              <img
                :src="item.product.cover_image"
                class="product-image"
                v-if="item.product"
              />
              <div class="product-details">
                <h5 class="product-name">
                  {{ item.product ? item.product.name.ar : "" }}
                </h5>
              </div>
            </div>
            <div class="question-date">
              {{ item.created_at }}
            </div>
          </div>

          <div class="question-content">
            <div class="user-section">
              <img :src="user" class="user-avatar" />
              <div class="user-details">
                <h4 class="user-name">
                  {{ item.user ? item.user.fname : "" }}
                </h4>
                <rate
                  :length="5"
                  :value="item.rating"
                  :disabled="true"
                  class="rating"
                />
                <p class="question-text">{{ item.comment }}</p>
              </div>
            </div>
            <div class="action-row">
              <label class="custom-switch">
                <input
                  type="checkbox"
                  name="custom-switch-checkbox"
                  class="custom-switch-input"
                  :checked="item.is_approved"
                  @change="toggleactive(item.id)"
                />
                <span class="custom-switch-description"></span>
                <span class="custom-switch-indicator"></span>
              </label>
            </div>
            <button
              class="delete-btn"
              @click="del(item.id, index, item.comment)"
            >
              <i class="fe fe-trash-2"></i>
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-container">
          <b-pagination
            v-model="page"
            :total-rows="last"
            :per-page="1"
            @click="getAllData(page)"
          ></b-pagination>
        </div>
      </section>

      <!-- Empty state -->
      <section class="empty-state" v-else>
        <div class="empty-message">لا يوجد اسئلة حتي الان</div>
      </section>
    </section>
  </div>
</template>

<script>
import user from "../../assets/img/user.png";
import { useToast } from "vue-toastification";
import crudDataService from "../../Services/crudDataService";
export default {
  data() {
    return {
      page: 1,
      last: 2,
      user,
      myList: [],
      selectedRating: 0,
      loading: false,
    };
  },
  methods: {
    // async paginag(p) {
    //   console.log(p);
    //   let res = await crudDataService.getAll(`reviews?page=${this.page}`);
    //   this.myList = res.data.data.data;
    // },
    async toggleactive(id) {
      let res = await crudDataService.create(`reviews/${id}/toggle`, "");
      const toast = useToast();
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "top-center",
          timeout: 5000,
        });
      }
    },
    async getAllData(p) {
      this.loading = true; // Start loading

      try {
        let res = await crudDataService.getAll(`reviews?page=${this.page}`);
        this.myList = res.data.data.data;
        this.last = res.data.data.last_page;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error
      } finally {
        this.loading = false; // End loading regardless of success or failure
      }
    },
    del(data, index, name) {
      this.$swal
        .fire({
          title: ` ؟"${name}" هل تريد حذف `,
          showCancelButton: true,
          confirmButtonText: "Yes",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$swal.fire("Deleted successfully!", "", "success");
            crudDataService.delete("reviews", `${data}`).then((response) => {
              console.log(response);
              this.myList.splice(index, 1);
              this.getAllData();
            });
          }
        });
    },
  },
  mounted() {
    this.getAllData();
  },
};
</script>

<style scoped lang="scss">
.question-container {
  padding: 20px;
  min-height: 80vh;
}

.loading-container {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  display: flex;
  justify-content: center;
}

.content-section {
  padding-top: 20px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-weight: bold;
  font-size: 1.5rem;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
}
.dark-theme .question-card {
  background-color: var(--dark-theme);
  border: 1px solid #444;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  margin-right: 12px;
}

.product-name {
  margin: 0;
  font-weight: 500;
}

.question-date {
  color: #8a8a8a;
  font-size: 0.85rem;
}

.question-content {
  display: flex;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.user-section {
  display: flex;
  flex: 1;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 12px;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.rating {
  margin-bottom: 8px;
}

.question-text {
  margin-bottom: 12px;
  line-height: 1.5;
}

.action-row {
  display: flex;
  align-items: center;
}

.delete-btn {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    color: #ff6060;
    background: #ffe7e7;
    padding: 10px;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-message {
  background: #e66239;
  padding: 30px;
  font-size: 20px;
  width: 50%;
  text-align: center;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(230, 98, 57, 0.2);
}
</style>
