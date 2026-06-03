<template>
    <div>
        <section class="card">
            <h2 class="text-2xl">Profile information</h2>
            <p class="mb-4">
                Your profile information is publicly viewable on Vanilla Tyme and
                through the
                <a
                    href="https://docs.vanillatymeservers.com/"
                    target="_blank"
                    class="text-link"
                >
                    Vanilla Tyme API
                </a>
                .
            </p>
            <label>
                <span class="label__title">Profile picture</span>
                <span class="label__description">
                    Profile pictures are tied to your minecraft account skin. Therefore, they cannot be changed.
                </span>
            </label>
            <div class="avatar-changer">
                <Avatar
                    :src="avatarUrl"
                    size="md"
                    circle
                    :alt="auth.user.username"
                />
            </div>
            <label for="username-field">
                <span class="label__title">Username</span>
                <span class="label__description">
                    Your minecraft account username.
                </span>
            </label>
            <input id="username-field" v-model="username" type="text" disabled/>
            <label for="bio-field">
                <span class="label__title">Bio</span>
                <span class="label__description">
                    A short description to tell everyone a little bit about you.
                </span>
            </label>
            <textarea id="bio-field" v-model="bio" type="text" />
            <div v-if="hasUnsavedChanges" class="input-group">
                <Button color="primary" :action="() => saveChanges()">
                    <IconDeviceFloppy />
                    Save changes
                </Button>
                <Button :action="() => cancel()">
                    <IconX /> Cancel
                </Button>
            </div>
            <div v-else class="input-group">
                <Button disabled color="primary" :action="() => saveChanges()">
                    <IconDeviceFloppy />
                    {{
                        saved
                            ? 'Changes saved'
                            : 'Save changes'
                    }}
                </Button>
                <Button :link="`/user/${auth.user.username}`">
                    <IconUser />
                    Visit your profile
                </Button>
            </div>
        </section>
    </div>
</template>

<script setup>
import {
    IconUser,
    IconDeviceFloppy,
    IconUpload,
    IconArrowBackUp,
    IconX,
    IconTrash,
} from "@tabler/icons-vue";
import Avatar from "~/components/ui/Avatar.vue";
import FileInput from "~/components/ui/FileInput.vue";
import Button from "~/components/modrinth/ui/base/Button.vue";

useHead({
    title: "Profile settings - Vanilla Tyme",
});

definePageMeta({
    middleware: "auth",
});


const auth = await useAuth();

const username = ref(auth.value.user.username);
const bio = ref(auth.value.user.bio);
const avatarUrl = ref(auth.value.user.avatar_url);
const icon = shallowRef(null);
const previewImage = shallowRef(null);
const pendingAvatarDeletion = ref(false);
const saved = ref(false);

const hasUnsavedChanges = computed(
    () =>
        username.value !== auth.value.user.username ||
        bio.value !== auth.value.user.bio ||
        previewImage.value,
);

function showPreviewImage(files) {
    const reader = new FileReader();
    icon.value = files[0];
    reader.readAsDataURL(icon.value);
    reader.onload = (event) => {
        previewImage.value = event.target.result;
    };
}

function removePreviewImage() {
    pendingAvatarDeletion.value = true;
    previewImage.value = "https://cdn.modrinth.com/placeholder.png";
}

function cancel() {
    icon.value = null;
    previewImage.value = null;
    pendingAvatarDeletion.value = false;
    username.value = auth.value.user.username;
    bio.value = auth.value.user.bio;
}

async function saveChanges() {
    startLoading();
    try {
        if (pendingAvatarDeletion.value) {
            await useBaseFetch(`user/${auth.value.user.id}/icon`, {
                method: "DELETE",
            });
            pendingAvatarDeletion.value = false;
            previewImage.value = null;
        }

        if (icon.value) {
            await useBaseFetch(
                `user/${auth.value.user.id}/icon?ext=${
                    icon.value.type.split("/")[
                        icon.value.type.split("/").length - 1
                    ]
                }`,
                {
                    method: "PATCH",
                    body: icon.value,
                },
            );
            icon.value = null;
            previewImage.value = null;
        }

        const body = {};

        if (auth.value.user.username !== username.value) {
            body.username = username.value;
        }

        if (auth.value.user.bio !== bio.value) {
            body.bio = bio.value;
        }

        await useBaseFetch(`user/${auth.value.user.id}`, {
            method: "PATCH",
            body,
        });
        await useAuth(auth.value.token);
        avatarUrl.value = auth.value.user.avatar_url;
        saved.value = true;
    } catch (err) {
        addNotification({
            group: "main",
            title: "An error occurred",
            text: err
                ? err.data
                    ? err.data.description
                        ? err.data.description
                        : err.data
                    : err
                : "aaaaahhh",
            type: "error",
        });
    }
    stopLoading();
}
</script>
<style lang="scss" scoped>
.avatar-changer {
    display: flex;
    gap: var(--gap-lg);
    margin-top: var(--gap-md);
}

textarea {
    height: 6rem;
    width: 40rem;
    margin-bottom: var(--gap-lg);
}
</style>
