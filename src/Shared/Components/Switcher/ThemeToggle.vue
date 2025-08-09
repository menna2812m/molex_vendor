<template>
  <div class="theme-toggle">
    <button
      @click="toggleTheme"
      class="btn btn-icon btn-sm"
      :class="isDark ? 'btn-light' : 'btn-dark'"
      :title="isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
    >
      <i :class="isDark ? 'fe fe-sun' : 'fe fe-moon'"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "ThemeToggle",
  data() {
    return {
      isDark: false,
    };
  },
  mounted() {
    // Initial check
    this.checkCurrentTheme();

    // Listen for changes from other pages/tabs
    window.addEventListener("storage", this.handleThemeChange);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.handleThemeChange);
  },
  methods: {
    checkCurrentTheme() {
      this.isDark = document.body.classList.contains("dark-theme");
    },
    handleThemeChange(e) {
      if (e.key === "Spruhadark" || e.key === "SpruhaLighttheme") {
        this.applyThemeFromStorage();
      }
    },
    applyThemeFromStorage() {
      if (localStorage.getItem("Spruhadark")) {
        this.setDarkTheme(false);
      } else if (localStorage.getItem("SpruhaLighttheme")) {
        this.setLightTheme(false);
      }
      this.checkCurrentTheme();
    },
    toggleTheme() {
      if (this.isDark) {
        this.setLightTheme(true);
      } else {
        this.setDarkTheme(true);
      }
      this.checkCurrentTheme();
    },
    setDarkTheme(updateStorage = true) {
      document.body.classList.add("dark-theme", "dark-menu", "header-dark");
      document.body.classList.remove(
        "light-theme",
        "light-menu",
        "header-light",
        "color-menu",
        "color-header"
      );
      if (updateStorage) {
        localStorage.setItem("Spruhadark", "true");
        localStorage.removeItem("SpruhaLighttheme");
      }
    },
    setLightTheme(updateStorage = true) {
      document.body.classList.add("light-theme");
      document.body.classList.remove(
        "dark-theme",
        "dark-menu",
        "header-dark",
        "color-menu",
        "color-header"
      );
      if (updateStorage) {
        localStorage.setItem("SpruhaLighttheme", "true");
        localStorage.removeItem("Spruhadark");
      }
    },
  },
};
</script>

<style scoped>
.theme-toggle {
  display: inline-block;
}

.theme-toggle .btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle .btn:hover {
  transform: scale(1.1);
}

.theme-toggle .btn i {
  font-size: 16px;
}
</style>
