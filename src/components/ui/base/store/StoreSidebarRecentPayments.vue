<template>
    <div class="card flex-card experimental-styles-within flex flex-col gap-3">
        <h2 class="m-0 text-lg">Recent Payments</h2>
        <div class="flex flex-col gap-3 font-semibold">
            <div
                v-for="(payment, index) in payments as Payment[]"
                :key="index"
                class="group flex w-fit items-center gap-2 leading-[1.2] text-primary"
            >
                <nuxt-link :to="`/user/${payment.player.name}`">
                    <Avatar
                        :src="`https://minotar.net/helm/${payment.player.uuid}/64`"
                        :alt="payment.player.name"
                        size="32px"
                        circle
                    />
                </nuxt-link>
                <div class="flex flex-col">
                    <span class="flex flex-row flex-nowrap items-center gap-1">
                        <nuxt-link
                            :to="`/user/${payment.player.name}`"
                            class="hover:underline"
                        >
                            {{ payment.player.name }}
                        </nuxt-link>
                        -
                        <div v-tooltip="`${payment.currency.iso_4217}`">
                            {{ payment.currency.symbol + payment.amount }}
                        </div>
                    </span>
                    <span class="text-sm font-medium text-secondary">
                        <nuxt-link
                            :to="`/store/package/${payment.packages[0].id}`"
                            class="hover:underline"
                        >
                            {{ payment.packages[0].name }}
                        </nuxt-link>
                        | <span v-tooltip="dayjs(payment.date).format('MMMM D, YYYY [at] h:mm A')">{{ dayjs(payment.date).fromNow() }}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Avatar from "~/components/modrinth/ui/base/Avatar.vue";
import dayjs from "dayjs";
interface Payment {
    date: any;
    player: {
        name: string;
        uuid: string;
    };
    packages: {
        id: string;
        name: string;
    }[];
    amount: number;
    currency: {
        symbol: number;
        iso_4217: string;
    };
}

const payments = await useBaseFetch("tebex/payments") || [];
</script>

<style></style>
