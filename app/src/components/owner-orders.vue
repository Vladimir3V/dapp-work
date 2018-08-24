<template>
    <div class="owner-orders">

      <div class="container">

        <h1 class="title">Own Orders</h1>
        <div class="subtitle box is-6">
          <ul>
            <li>You can't Edit \ Remove \ Set Freelancer if the order is locked by you or freelancer.</li>
            <li>To fully unlock the order you have to ask freelancer to unlock the order (i.e. unsubscribe from the order)</li>
            <li>You can't complete the fully unlocked order. Set the freelancer first and then complete the order.</li>
            <li>If you have a dispute with the freelancer and you want to return your funds back or unlock the order, please contact moderators under "Contacts" section.</li>
          </ul>
        </div>
      
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