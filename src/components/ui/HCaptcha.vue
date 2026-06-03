<script setup>
import { ref, onMounted, defineExpose } from "vue";

const token = defineModel();
const id = ref(null);

function hCaptchaUpdateToken(newToken) {
  token.value = newToken;
}

function hCaptchaReady() {
  if (!window.hcaptcha || id.value !== null) return; // prevent double init
  id.value = window.hcaptcha.render("h-captcha", {
    sitekey: "ca281a76-062a-478a-be9c-adf00858f5b4",
    theme: document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
    callback: hCaptchaUpdateToken,
  });
}

function injectHcaptchaScript() {
  console.log("injectHcaptchaScript called");
  // Only inject ONCE globally
  if (window.__hcaptcha_script_injected__) {
    // Script already injected → just wait for it
    if (window.hcaptcha) {
      hCaptchaReady();
    } else {
      window.hCaptchaReady = hCaptchaReady;
    }
    return;
  }

  window.__hcaptcha_script_injected__ = true;
  window.hCaptchaReady = hCaptchaReady;

  const script = document.createElement("script");
  script.src =
    "https://hcaptcha.com/1/api.js?render=explicit&onload=hCaptchaReady";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

onMounted(() => {
  injectHcaptchaScript();
});

defineExpose({
  reset: () => {
    token.value = null;
    if (window.hcaptcha && id.value !== null) {
      window.hcaptcha.reset(id.value);
    }
  },
});
</script>

<template>
  <div id="h-captcha" class="h-captcha"></div>
</template>

<style lang="scss">
.h-captcha {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-button-bg);
  height: 78px;
}
</style>
