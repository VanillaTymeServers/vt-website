<template>
    <div>
        <section class="universal-card">
            <div class="flex w-full flex-col gap-6">
                <!-- Product -->
                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">
                        Item <span class="text-red">*</span>
                    </span>
                    <ItemPicker
                        v-model="product.item"
                        :items="allItemsList"
                        name="product-item"
                        placeholder="Select an item..."
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">Custom name</span>
                    <span class="label__description">
                        Override the item's default display name. Leave blank to
                        use the default.
                    </span>
                    <input
                        v-model="product.customName"
                        type="text"
                        placeholder="e.g. Enchanted Diamond Sword"
                        autocomplete="off"
                        maxlength="256"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">
                        Item amount <span class="text-red">*</span>
                    </span>
                    <input
                        v-model.number="product.amount"
                        type="number"
                        min="1"
                        step="1"
                    />
                </div>

                <!-- Price -->
                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">
                        Currency <span class="text-red">*</span>
                    </span>
                    <ItemPicker
                        v-model="price.currency"
                        :items="allItemsList"
                        :pinnedItems="['diamond', 'diamond_block']"
                        name="price-currency"
                        placeholder="Select a currency..."
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">
                        Price amount <span class="text-red">*</span>
                    </span>
                    <input
                        v-model.number="price.amount"
                        type="number"
                        min="0"
                        step="1"
                    />
                </div>

                <!-- Details -->
                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">
                        Status <span class="text-red">*</span>
                    </span>
                    <Chips
                        v-model="status"
                        :items="['active', 'draft', 'unlisted']"
                        :never-empty="true"
                        :capitalize="true"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">
                        Availability <span class="text-red">*</span>
                    </span>
                    <Chips
                        v-model="availability"
                        :items="[
                            'in_stock',
                            'restocked',
                            'limited_stock',
                            'out_of_stock',
                        ]"
                        :never-empty="true"
                        :capitalize="false"
                        :formatLabel="formatAvailabilityLabel"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast">Item subtitle</span>
                    <input
                        id="item-subtitle"
                        v-model="note"
                        placeholder="Enter subtitle"
                        type="text"
                        autocomplete="off"
                        maxlength="256"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="font-semibold text-contrast"
                        >Item description</span
                    >
                    <div class="w-full">
                        <MarkdownEditor
                            v-model="body"
                            :disabled="false"
                            :headingButtons="true"
                        />
                    </div>
                </div>
            </div>

            <div class="button-group">
                <button
                    type="button"
                    class="iconified-button brand-button"
                    :disabled="saving"
                    @click="saveAll"
                >
                    <IconDeviceFloppy />
                    Save changes
                </button>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { IconDeviceFloppy } from "@tabler/icons-vue";
import MarkdownEditor from "~/components/modrinth/ui/base/MarkdownEditor.vue";
import Chips from "~/components/modrinth/ui/base/Chips.vue";
import ItemPicker from "~/components/modrinth/ui/inventory/ItemPicker.vue";

const route = useRoute();

if (!route.params.itemId) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "The page could not be found.",
    });
}

const itemId = computed(() => route.params.itemId as string);
const shopId = ref("");
const note = ref("");
const body = ref("");
const badge = ref<String[]>([]);
const created = ref("");
const updated = ref("");
const published = ref("");
const sale = ref({
    enabled: false,
    amount: 0,
});
const popular = ref<Boolean>(false);
const status = ref("");
const availability = ref("");
const saving = ref(false);

const availabilityLabels: Record<string, string> = {
    in_stock: "Available",
    restocked: "Restocked",
    discontinued: "Discontinued",
    limited_stock: "Limited",
    out_of_stock: "Sold out",
};
const formatAvailabilityLabel = (value: string) =>
    availabilityLabels[value] ?? value.replaceAll("_", " ");

const product = ref({
    item: null as { id: string; label: string; icon: any } | null,
    customName: "",
    amount: 1,
});
const price = ref({
    currency: null as { id: string; label: string; icon: any } | null,
    amount: 0,
});

const { data: inventoryItem, error } = await useAsyncData(
    () => `item-${itemId.value}`,
    () =>
        useBaseFetch(`inventory/${itemId.value}`, {
            method: "GET",
        }),
    {
        watch: [itemId],
    },
);

const { data: allItems } = await useAsyncData("minecraft-items", () =>
    useBaseFetch("data/items", { method: "GET" }),
);

const allItemsList = computed(() => (allItems.value as any[]) ?? []);

const raiseFetchError = (value: any) => {
    if (!value) return;
    throw createError({
        fatal: true,
        statusCode: value.statusCode || 500,
        statusMessage:
            value.statusMessage ||
            "An error occurred while fetching the inventory item.",
    });
};

raiseFetchError(error.value);
watch(error, (value) => {
    raiseFetchError(value);
});

watch(
    inventoryItem,
    (value) => {
        if (!value) return;
        const item = value as any;
        shopId.value = item.shop_id;
        note.value = item.note || "";
        body.value = item.body || "";
        badge.value = item.badge || [];
        created.value = item.created;
        updated.value = item.updated;
        published.value = item.published;
        sale.value = {
            enabled: item.sale?.enabled || false,
            amount: item.sale?.amount || 0,
        };
        popular.value = item.popular || false;
        status.value = item.status;
        availability.value = item.availability;
        product.value = {
            item: {
                id: item.product.item.id,
                label: item.product.item.label,
                icon: item.product.item.icon,
            },
            customName: item.product.custom_name || "",
            amount: item.product.amount,
        };
        price.value = {
            currency: {
                id: item.price.currency.id,
                label: item.price.currency.label,
                icon: item.price.currency.icon,
            },
            amount: item.price.amount,
        };
    },
    { immediate: true },
);

async function saveAll() {
    saving.value = true;
    try {
        await useBaseFetch(`inventory/${itemId.value}`, {
            method: "PATCH",
            body: {
                product: {
                    item: product.value.item?.id,
                    custom_name: product.value.customName || null,
                    amount: product.value.amount,
                },
                price: {
                    currency: price.value.currency?.id,
                    amount: price.value.amount,
                },
                note: note.value,
                body: body.value,
                status: status.value,
                availability: availability.value,
            },
        });
    } finally {
        saving.value = false;
    }
}
</script>

<style></style>
