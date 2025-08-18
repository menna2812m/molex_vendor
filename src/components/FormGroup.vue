<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" :for="id">{{ label }}</label>
    <slot></slot>
    <div v-if="error" class="invalid-feedback d-block">
      {{ error }}
    </div>
    <small v-if="hint && !error" class="form-text text-muted">{{ hint }}</small>
  </div>
</template>

<script>
export default {
  name: "FormGroup",
  props: {
    id: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    hint: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.has-error input,
.has-error select,
.has-error textarea {
  border-color: #f16d75;
}

.invalid-feedback {
  color: #f16d75;
  font-size: 85%;
  margin-top: 0.25rem;
}
</style>
