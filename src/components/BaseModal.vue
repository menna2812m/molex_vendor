<template>
  <div
    class="modal fade"
    :class="{ show: isOpen }"
    tabindex="-1"
    role="dialog"
    :style="{ display: isOpen ? 'block' : 'none', paddingRight: '15px' }"
    aria-modal="true"
  >
    <div
      class="modal-dialog modal-dialog-centered"
      :class="modalSizeClass"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="close"
            @click="closeModal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
        <div class="modal-footer" v-else>
          <button type="button" class="btn btn-secondary" @click="closeModal">
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitModal"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm mr-1"
            ></span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isOpen" class="modal-backdrop fade show"></div>
</template>

<script>
import { FormErrorMixin } from "../Shared/mixins/FormErrorMixin";

export default {
  name: "BaseModal",
  mixins: [FormErrorMixin],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Modal Title",
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
    },
    confirmText: {
      type: String,
      default: "حفظ",
    },
    cancelText: {
      type: String,
      default: "إلغاء",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: this.value,
    };
  },
  computed: {
    modalSizeClass() {
      return {
        "modal-sm": this.size === "sm",
        "modal-lg": this.size === "lg",
        "modal-xl": this.size === "xl",
      };
    },
  },
  watch: {
    value(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        document.body.classList.add("modal-open");
        this.listenForEscape();
      } else {
        document.body.classList.remove("modal-open");
        this.removeEscapeListener();
        this.clearAllErrors(); // Clear all form errors when modal closes
      }
    },
  },
  methods: {
    closeModal() {
      this.isOpen = false;
      this.$emit("input", false);
      this.$emit("close");
    },
    submitModal() {
      this.$emit("submit");
    },
    listenForEscape() {
      document.addEventListener("keydown", this.handleEscapeKey);
    },
    removeEscapeListener() {
      document.removeEventListener("keydown", this.handleEscapeKey);
    },
    handleEscapeKey(e) {
      if (e.key === "Escape") {
        this.closeModal();
      }
    },
  },
  beforeUnmount() {
    // Cleanup for Vue 3
    document.body.classList.remove("modal-open");
    this.removeEscapeListener();
  },
  beforeDestroy() {
    // Cleanup for Vue 2
    document.body.classList.remove("modal-open");
    this.removeEscapeListener();
  },
};
</script>

<style scoped>
.modal {
  overflow-y: auto;
}
</style>
