<template>
    <div class="loader-container">
        <div class="scoop-row">
            <div class="scoop" />
            <div class="scoop" />
            <div class="scoop" />
        </div>
        <div v-if="label" class="loading-text">{{ label }}</div>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
    },
});
</script>

<style scoped>
.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: .75rem;
}

.scoop-row {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 8px;
}

.scoop {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;
    animation: wave 0.7s infinite ease-in-out;
    background-color: var(--color-brand);
}

.scoop:nth-child(1) { animation-delay: 0s; }
.scoop:nth-child(2) { animation-delay: 0.1s; }
.scoop:nth-child(3) { animation-delay: 0.2s; }


.loading-text {
    color: var(--color-brand);
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 14px;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
}

@keyframes wave {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
}

@media (prefers-reduced-motion) {
    .scoop {
        animation-play-state: paused;
    }
}
</style>
