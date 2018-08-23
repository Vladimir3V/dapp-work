<template>
    <div class="home">

      <div class="container">

        <h1 class="title">My Orders</h1>
      
      </div>

      <div class="container">
        <div class="columns" v-if="orders">
            <owner-order-card v-for="order in orderedOrders"
                v-bind:key="order.id"
                v-if="order.owner_addr == myAddress"
                v-bind:orderData="order"></owner-order-card>
        </div>
      </div>

    </div>
</template>

<script>
import OwnerOrderCard from "@/components/owner-order-card";
import { mapState } from "vuex";
export default {
  name: "owner-orders",
  components: {
    "owner-order-card": OwnerOrderCard
  },
  computed: mapState({
    orders: state => state.orders,
    orderedOrders(state) { return _.orderBy(this.orders, 'id', 'desc')},
    myAddress: state => state.web3State.coinbase
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