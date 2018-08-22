<template>
    <div class="home">

      <div class="container">

        <h1 class="title">Orders</h1>
        <h2 class="subtitle is-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h2>
      
      </div>

      <div class="container">
        <div class="columns" v-if="orders">
            <home-order-card v-for="order in orderedOrders" v-bind:key="order.id"
              v-bind:orderData="order"></home-order-card>
        </div>
      </div>

    </div>
</template>

<script>
import HomeOrderCard from "@/components/home-order-card";
import { mapState } from "vuex";
export default {
  name: "home",
  components: {
    "home-order-card": HomeOrderCard
  },
  computed: mapState({
    orders: state => state.orders,
    orderedOrders: state => _.orderBy(state.orders, 'id', 'desc')
  }),
  methods: {}
};
</script>

<style lang="sass" scoped>
@import "../mq"

.container
  margin-top: 20px

.table
  flex-wrap: wrap

.column
  overflow: auto

.columns
  flex-wrap: wrap
</style>