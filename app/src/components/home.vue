<template>
    <div class="home">

      <div class="container">

        <h1 class="title">Available Orders</h1>
        <div class="subtitle box is-6">
          <ul>
            <li>Click on the order to get a detailed description.</li>
            <li>Contact with the order owner to ask him to add you as a freelancer for his order (contact information you will find in the detailed description).</li>
            <li>You can check orders assigned to you on "Assigned Order" page.</li>
          </ul>
        </div>
      
      </div>

      <div class="container">
        <div class="columns" v-if="orders">
            <home-order-card v-for="order in orderedOrders"
                v-bind:key="order.id"
                v-if="!order.owner_lock && !order.freelancer_lock"
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
  margin-top: 1.1em

.title
  margin-bottom: 1.1em

.box
  margin-bottom: 1.1em

ul
  list-style: circle
  margin-left: 1.1em  

.table
  flex-wrap: wrap

.column
  overflow: auto

.columns
  flex-wrap: wrap
</style>