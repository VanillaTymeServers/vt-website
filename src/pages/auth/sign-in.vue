<template>
  <div>
    <template v-if="flow">
      <label for="two-factor-code">
        <span class="label__title"> Enter two-factor code </span>
        <span class="label__description">
          Please enter a two-factor code to proceed.
        </span>
      </label>
      <input
        id="two-factor-code"
        v-model="twoFactorCode"
        maxlength="11"
        type="text"
        placeholder="Enter code..."
        autocomplete="one-time-code"
        autofocus
        @keyup.enter="begin2FASignIn"
      />
      <button class="btn btn-primary continue-btn" @click="begin2FASignIn">
        Sign in <IconArrowRight />
      </button>
    </template>
    <template v-else>
      <h1>Sign in</h1>

      <section class="auth-form">
        <div class="iconified-input">
          <label for="username" hidden>Minecraft username</label>
          <img
            :src="`https://minotar.net/helm/${username.trim() || 'MHF_Steve'}/32.png`"
            alt="User Skin"
            class="rounded"
            width="32"
            height="32"
          />
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            class="auth-form__input"
            placeholder="Minecraft username"
            @keydown.space.prevent
          />
        </div>

        <div class="iconified-input">
          <label for="password" hidden>password</label>
          <IconKey />
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="auth-form__input"
            placeholder="Password"
          />
        </div>

        <MyHCaptcha ref="captcha" v-model="token" />

        <button
          class="btn btn-primary continue-btn centered-btn"
          :disabled="!token"
          @click="beginPasswordSignIn()"
        >
          Sign in <IconArrowRight />
        </button>

        <div class="auth-form__additional-options">
          <NuxtLink
            class="text-link"
            :to="{
              path: '/auth/reset-password',
              query: route.query,
            }"
          >
            Forgot password?
          </NuxtLink>
          •
          <NuxtLink
            class="text-link"
            :to="{
              path: '/auth/sign-up',
              query: route.query,
            }"
          >
            Create an account
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { IconArrowRight, IconKey, IconUser } from "@tabler/icons-vue";
import MyHCaptcha from "~/components/ui/HCaptcha.vue";

useHead({
  title() {
    return `Sign In - Vanilla Tyme`;
  },
});

const auth = await useAuth();
const route = useNativeRoute();

const redirectTarget = route.query.redirect || "";

if (route.query.code && !route.fullPath.includes("new_account=true")) {
  await finishSignIn();
}

if (auth.value.user) {
  await finishSignIn();
}

const captcha = ref();

const username = ref("");
const password = ref("");
const token = ref("");

const flow = ref(route.query.flow);

async function beginPasswordSignIn() {
  startLoading();
  try {
    const res = await useBaseFetch("auth/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
        challenge: token.value,
      },
    });

    if (res.flow) {
      flow.value = res.flow;
    } else {
      await finishSignIn(res.session);
    }
  } catch (err) {
    addNotification({
      group: "main",
      title: "An error occurred",
      text: err.data ? err.data.description : err,
      type: "error",
    });
    captcha.value.reset();
  }
  stopLoading();
}

const twoFactorCode = ref(null);
async function begin2FASignIn() {
  startLoading();
  try {
    const res = await useBaseFetch("auth/login/2fa", {
      method: "POST",
      body: {
        flow: flow.value,
        code: twoFactorCode.value
          ? twoFactorCode.value.toString()
          : twoFactorCode.value,
      },
    });

    await finishSignIn(res.session);
  } catch (err) {
    addNotification({
      group: "main",
      title: "An error occurred",
      text: err.data ? err.data.description : err,
      type: "error",
    });
    captcha.value?.reset();
  }
  stopLoading();
}
async function finishSignIn(token) {
  //   if (route.query.launcher) {
  //     await navigateTo(`https://launcher-files.modrinth.com/?code=${token}`, { external: true });
  //     return;
  //   }

  if (token) {
    await useAuth(token);
    await useUser();
  }

  if (route.query.redirect) {
    const redirect = decodeURIComponent(route.query.redirect);
    await navigateTo(redirect, {
      replace: true,
    });
  } else {
    await navigateTo("/dashboard");
  }
}
</script>

<style></style>
