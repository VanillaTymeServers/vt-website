<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Dashboard</h1>
        <NavStack>
          <NavStackItem link="/dashboard" label="Overview">
            <IconLayoutDashboard aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/dashboard/notifications" label="Notifications">
            <IconBell aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/dashboard/reports" label="Active reports">
            <IconFlag aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/dashboard/analytics" label="Analytics">
            <IconChartHistogram aria-hidden="true" />
          </NavStackItem>

          <h3>Manage</h3>
          <NavStackItem v-if="true" link="/dashboard/shops" label="Shops">
            <IconListDetails aria-hidden="true" />
          </NavStackItem>
          <NavStackItem v-if="true" link="/dashboard/organizations" label="Organizations">
            <IconBuilding aria-hidden="true" />
          </NavStackItem>
          <NavStackItem
            link="/dashboard/collections"
            label="Collections"
          >
            <IconBooks aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/dashboard/revenue" label="Revenue">
            <IconCurrencyDollar aria-hidden="true" />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtPage :route="route" />
    </div>
  </div>
</template>
<script setup>
import {IconLayoutDashboard, IconCurrencyDollar, IconListDetails, IconFlag, IconBell, IconBuilding, IconBooks, IconChartHistogram} from "@tabler/icons-vue";
import NavStack from "~/components/ui/NavStack.vue";
import NavStackItem from "~/components/ui/NavStackItem.vue";


definePageMeta({
  middleware: "auth",
});

const route = useNativeRoute();
</script>
