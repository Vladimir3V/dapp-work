<template>
    <div class="home">

      <modal-order-info v-if="showModalOrderInfo" @close="showModalOrderInfo = false"/>
      
      <div class="container">

        <h1 class="title">Orders</h1>
        <h2 class="subtitle is-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h2>
      
      </div>

      <div class="container">
        <div class="columns" v-if="orders">
          <div class="column is-one-third" v-for="order in orders" v-bind:key="order.id" >
            <div class="card" @click="setNshowModalOrderInfo(order)">
              <div class="card-header">
                <div class="card-header-title">
                  <p class="title is-5">{{ order.title }}</p>
                </div>
              </div>
              <div class="card-content">
                <p class="content"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
              </div>
              <div class="card-footer">
                <p class="card-footer-item"><b>Budget:</b></p>
                <p class="card-footer-item">{{ order.budget }} Ether</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import ModalOrderInfo from "@/components/modal-order-info"
import { mapState } from "vuex";
export default {
  name: "home",
  components: {
    "modal-order-info": ModalOrderInfo,
  },
  data() {
    return {
      showModalOrderInfo: false
    }
  },
  computed: mapState({
    orders: state => state.orders
  }),
  methods: {
    setNshowModalOrderInfo: function(order) {
      console.log("[DEBUG] Showing order #", order.id, "in modal window")
      this.$store.dispatch("setModalOrderInfoAction", order)
      this.showModalOrderInfo = true
    }
  }
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