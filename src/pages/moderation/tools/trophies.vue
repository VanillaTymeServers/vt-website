<template>
    <div>
        <section class="universal-card">
            <div class="header__row">
                <h2 class="header__title text-2xl">Trophies</h2>
                <ButtonStyled color="blue">
                    <nuxt-link to="/moderation/tools/trophy/new"><IconPlus /> Create a trophy</nuxt-link>
                </ButtonStyled>
            </div>
            <p>Trophies can be created and sent to you on the server here.</p>
            <div class="input-group">
                <ButtonStyled>
                    <button :disabled="selectedTrophies.length === 0">
                        <IconWand />
                        Spawn trophies
                    </button>
                </ButtonStyled>
                <div class="push-right">
                    <div class="labeled-control-row">
                        <DropdownSelect
                            v-slot="{ selected }"
                            v-model="currentSortType"
                            class="!w-auto flex-grow md:flex-grow-0"
                            name="Sort by"
                            :options="sortTypes"
                            :display-name="(option) => option?.display"
                        >
                            <span class="font-semibold text-primary">
                                Sort by:
                            </span>
                            <span class="font-semibold text-secondary">
                                {{ selected }}
                            </span>
                        </DropdownSelect>
                        <button
                            v-tooltip="descending ? 'Descending' : 'Ascending'"
                            class="square-button"
                            @click="updateDescending()"
                        >
                            <IconSortDescending v-if="descending" />
                            <IconSortAscending v-else />
                        </button>
                    </div>
                </div>
            </div>
            <div class="grid-table">
                <div class="grid-table__row grid-table__header">
                    <div>
                        <Checkbox
                            :model-value="selectedTrophies === trophies"
                            @update:model-value="
                                selectedTrophies === trophies
                                    ? (selectedTrophies = [])
                                    : (selectedTrophies = trophies)
                            "
                        />
                    </div>
                    <div>Item</div>
                    <div>Name</div>
                    <div>ID</div>
                    <div>Author</div>
                    <div>Date</div>
                    <div />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import {
    IconPlus,
    IconSortAscending,
    IconSortDescending,
    IconWand,
} from "@tabler/icons-vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import DropdownSelect from "~/components/modrinth/ui/base/DropdownSelect.vue";
import Checkbox from "~/components/modrinth/ui/base/Checkbox.vue";

useHead({
    title: "Trophies - Vanilla Tyme",
});

const selectedTrophies = ref<string[]>([]);
const sortBy = ref("Date")
const currentSortType = ref({ display: "Date", name: "date" });


const sortTypes = [
    { display: "Name", name: "name" },
    { display: "Date", name: "date" },
    { display: "Type", name: "type" },
];

</script>

<style lang="scss" scoped>
.grid-table {
    display: grid;
    grid-template-columns:
        min-content min-content minmax(min-content, 2fr)
        minmax(min-content, 1fr) minmax(min-content, 1fr) minmax(
            min-content,
            1fr
        )
        min-content;
    border-radius: var(--size-rounded-sm);
    overflow: hidden;
    margin-top: var(--spacing-card-md);
    outline: 1px solid transparent;

    .grid-table__row {
        display: contents;

        > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: var(--spacing-card-sm);

            // Left edge of table
            &:first-child {
                padding-left: var(--spacing-card-bg);
            }

            // Right edge of table
            &:last-child {
                padding-right: var(--spacing-card-bg);
            }
        }

        &:nth-child(2n + 1) > div {
            background-color: var(--color-table-alternate-row);
        }

        &.grid-table__header > div {
            background-color: var(--color-bg);
            font-weight: bold;
            color: var(--color-text-dark);
            padding-top: var(--spacing-card-bg);
            padding-bottom: var(--spacing-card-bg);
        }
    }

    @media screen and (max-width: 750px) {
        display: flex;
        flex-direction: column;

        .grid-table__row {
            display: grid;
            grid-template: "checkbox icon name type settings" "checkbox icon id status settings";
            grid-template-columns:
                min-content min-content minmax(min-content, 2fr)
                minmax(min-content, 1fr) min-content;

            :nth-child(1) {
                grid-area: checkbox;
            }

            :nth-child(2) {
                grid-area: icon;
            }

            :nth-child(3) {
                grid-area: name;
            }

            :nth-child(4) {
                grid-area: id;
                padding-top: 0;
            }

            :nth-child(5) {
                grid-area: type;
            }

            :nth-child(6) {
                grid-area: status;
                padding-top: 0;
            }

            :nth-child(7) {
                grid-area: settings;
            }
        }

        .grid-table__header {
            grid-template: "checkbox settings";
            grid-template-columns: min-content minmax(min-content, 1fr);

            :nth-child(2),
            :nth-child(3),
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
                display: none;
            }
        }
    }

    @media screen and (max-width: 560px) {
        .grid-table__row {
            display: grid;
            grid-template: "checkbox icon name settings" "checkbox icon id settings" "checkbox icon type settings" "checkbox icon status settings";
            grid-template-columns:
                min-content min-content minmax(min-content, 1fr)
                min-content;

            :nth-child(5) {
                padding-top: 0;
            }
        }

        .grid-table__header {
            grid-template: "checkbox settings";
            grid-template-columns: min-content minmax(min-content, 1fr);
        }
    }
}

.project-title {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-card-xs);

    svg {
        color: var(--color-orange);
    }
}

.status {
    margin-top: var(--spacing-card-xs);
}

.hover-link:hover {
    text-decoration: underline;
}

.labeled-control-row {
    flex: 1;
    display: flex;
    flex-direction: row;
    min-width: 0;
    align-items: center;
    gap: var(--spacing-card-md);
    white-space: nowrap;
}

.small-select {
    width: -moz-fit-content;
    width: fit-content;
}

.label-button[data-active="true"] {
    --background-color: var(--color-red);
    --text-color: var(--color-brand-inverted);
}

.links-modal {
    .links {
        display: grid;
        gap: var(--spacing-card-sm);
        grid-template-columns: 1fr 2fr;

        .input-group {
            flex-wrap: nowrap;
        }

        @media screen and (max-width: 530px) {
            grid-template-columns: 1fr;
            .input-group {
                flex-wrap: wrap;
            }
        }
    }

    ul {
        margin: 0 0 var(--spacing-card-sm) 0;
    }
}
</style>
