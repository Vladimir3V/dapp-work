<template>
    <div class="freelancer-orders">

      <div class="container">

        <h1 class="title">Assigned Orders</h1>

        <div class="subtitle box is-6">
            <ul>
                <li>If you are going to unlock the order, it means that you are going to abandon it without the ability to receive funds.</li>
                <li>But with the goodwill of the customer, you can still get the funds if he still decides to complete the order.</li>
                <li>If you have a dispute with the customer and you want to get your funds for the order being complete, please contact moderators under "Contacts" section.</li>
            </ul>
        </div>

        <div class="field">
            <label class="label">Provide your email here to automatically check emails in your assigned orders</label>
            <div class="control">
                <input class="input" type="email" v-model="email" placeholder="example@mail.com">
            </div>
        </div>

      </div>

      <div class="container">
        <div class="columns" v-if="orders">
            <freelancer-order-card v-for="order in orderedOrders"
                v-bind:key="order.id"
                v-if="(order.freelancer_addr == myAddress) && order.freelancer_lock"
                v-bind:orderData="order" v-bind:providedEmail="email"></freelancer-order-card>
        </div>
      </div>

    </div>
</template>

<script>
import FreelancerOrderCard from "@/components/freelancer-order-card";
import { mapState } from "vuex";
export default {
  name: "freelancer-orders",
  components: {
    "freelancer-order-card": FreelancerOrderCard
  },
  data() {
      return {
          email: null
      }
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