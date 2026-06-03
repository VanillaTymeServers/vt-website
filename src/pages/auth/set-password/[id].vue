<template>
    <div>
        <h1>Set password</h1>
        <section class="auth-form">
            <div class="iconified-input">
                <label for="username" hidden>Username</label>
                <img
                    :src="`https://minotar.net/helm/${user.username}/32.png`"
                    alt="User Skin"
                    class="rounded"
                    width="32"
                    height="32"
                />
                <input
                    id="username"
                    type="text"
                    autocomplete="username"
                    class="auth-form__input w-full"
                    placeholder="Username"
                    :value="user.username"
                    disabled
                />
            </div>
            <div class="iconified-input">
                <label for="password" hidden>Password</label>
                <IconKey />
                <input
                    id="password"
                    v-model="password"
                    class="auth-form__input"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Password"
                />
            </div>

            <div class="iconified-input">
                <label for="confirm-password" hidden>Confirm password</label>
                <IconKey />
                <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    class="auth-form__input"
                    placeholder="Confirm password"
                />
            </div>
            <p>
                By creating a password, you agree with Vanilla Tyme's
                <NuxtLink to="/legal/terms" class="text-link">Terms</NuxtLink>
                and
                <NuxtLink to="/legal/privacy" class="text-link"
                    >Privacy Policy</NuxtLink
                >.
            </p>
            <HCaptcha ref="captcha" v-model="token" />
            <button
                class="btn btn-primary continue-btn centered-btn"
                :disabled="!token"
                @click="createAccount"
            >
                Set password
                <IconArrowRight />
            </button>
        </section>
    </div>
</template>

<script setup>
import { IconArrowRight, IconKey, IconUser } from "@tabler/icons-vue";
import HCaptcha from "~/components/ui/HCaptcha.vue";

useHead({
    title() {
        return `Set password - Vanilla Tyme`;
    },
});

const auth = await useAuth();
const route = useNativeRoute();

if (auth.value.user) {
    await navigateTo("/dashboard");
}

const captcha = ref();

const password = ref("");
const confirmPassword = ref("");
const token = ref("");

async function createAccount() {
    startLoading();
    try {
        if (confirmPassword.value !== password.value) {
            addNotification({
                group: "main",
                title: "An error occurred",
                text: "Passwords do not match!",
                type: "error",
            });
            captcha.value?.reset();
        }

        const res = await useBaseFetch("auth/set-password", {
            method: "POST",
            body: {
                id: user.value.id,
                password: password.value,
                challenge: token.value,
            },
        });

        await useAuth(res.session);
        await useUser();

        let redirectPath = "/dashboard";
        if (route.query.redirect) {
            redirectPath = route.query.redirect;
        } else if (res.redirect) {
            redirectPath = res.redirect;
        } else {
            redirectPath = "/auth/welcome?new_account=true";
        }
        await navigateTo(redirectPath);
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

const { data: user } = await useAsyncData(
    "user",
    async () => {
        return await $fetch(`/api/auth/password-check`, {
            query: { id: route.params.id },
        });
    },
    { server: true },
);

if (!user.value || !user.value.id) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "Link expired or invalid",
    });
}
</script>
