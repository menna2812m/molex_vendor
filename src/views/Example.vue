<template>
  <div>
    <button class="btn btn-primary" @click="openModal">Open Modal</button>

    <base-modal
      v-model="showModal"
      title="إضافة عنصر جديد"
      :loading="loading"
      @submit="submitForm"
    >
      <form-group label="الاسم" :error="getFieldError('name')">
        <input
          type="text"
          class="form-control"
          v-model="formData.name"
          @input="clearFieldError('name')"
        />
      </form-group>

      <form-group label="البريد الإلكتروني" :error="getFieldError('email')">
        <input
          type="email"
          class="form-control"
          v-model="formData.email"
          @input="clearFieldError('email')"
        />
      </form-group>
    </base-modal>
  </div>
</template>

<script>
import BaseModal from "../components/BaseModal.vue";
import FormGroup from "../components/FormGroup.vue";
import { FormErrorMixin } from "../Shared/mixins/FormErrorMixin";

export default {
  name: "Example",
  components: {
    BaseModal,
    FormGroup,
  },
  mixins: [FormErrorMixin],
  data() {
    return {
      showModal: false,
      loading: false,
      formData: {
        name: "",
        email: "",
      },
      // Define which fields should be watched for changes
      watchedFields: ["formData.name", "formData.email"],
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    async submitForm() {
      this.loading = true;

      // Define validation rules
      const rules = {
        name: { required: true, label: "الاسم" },
        email: { required: true, email: true, label: "البريد الإلكتروني" },
      };

      // Validate the form
      if (!this.validateForm(rules)) {
        this.loading = false;
        return;
      }

      try {
        // Example API call
        // await api.post('/items', this.formData);

        // Success message
        this.$toast.success("تم الحفظ بنجاح");
        this.showModal = false;

        // Reset form data
        this.formData = {
          name: "",
          email: "",
        };
      } catch (error) {
        // Handle API errors using the mixin
        this.handleApiErrors(error, this.$toast);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
