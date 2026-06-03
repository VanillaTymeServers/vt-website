<template>
  <div>
    <h1>Welcome to Vanilla Tyme!</h1>

    <section class="auth-form">
      <p>
        Thank you for creating an account. You can now follow and create shops, receive updates about your favorite shops, and more!
      </p>

      <button class="btn btn-primary continue-btn centered-btn" @click="continueSignUp">
        Continue <IconArrowRight />
      </button>

      <p>
        By creating and account, you have agreed to Vanilla Tyme's
        <NuxtLink to="/legal/terms" class="text-link">Terms</NuxtLink>
        and
        <NuxtLink to="/legal/privacy" class="text-link">Privacy Policy</NuxtLink>.
      </p>
    </section>
  </div>
</template>
<script setup>
import { IconArrowRight } from "@tabler/icons-vue";

useHead({
  title: () => `Welcome - Modrinth`,
});

async function continueSignUp() {
  const route = useRoute();

  await useAuth(route.query.authToken);
  await useUser();

  if (route.query.redirect) {
    await navigateTo(route.query.redirect);
  } else {
    await navigateTo("/dashboard");
  }
}
</script>
