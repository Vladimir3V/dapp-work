<template>
  <div id="app">
    <hello-web3/>
    <nav-bar/>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HelloWeb3 from "@/components/hello-web3";
import NavBar from "@/components/nav-bar";
export default {
  name: "App",
  components: {
    "hello-web3": HelloWeb3,
    "nav-bar": NavBar
  },
  beforeCreate() {
    console.log("[DEBUG] registerWeb3Action dispatched from App.vue");
    this.$store.dispatch("registerWeb3Action");
  },
  computed: mapState({
    web3Instance: state => state.web3Instance,
    contractInstance: state => state.contractInstance
  }),
  watch: {
    web3Instance: function (newInstance, oldInstance) {
      this.dispatchGetContractAction()
    },
    contractInstance: function(newInstance, oldInstance) {
      this.dispatchGetOrdersListAction()
    }
  },
  methods: {
    dispatchGetContractAction: function () {
      let instance = this.$store.state.web3Instance
      if (instance !== null) {
        console.log("[DEBUG] getContractAction dispatched  from App.vue");
        this.$store.dispatch("getContractAction");
      }
    },
    dispatchGetOrdersListAction: function() {
      console.log("[DEBUG] getOrdersListAction dispatched from App.vue");
      this.$store.dispatch("getOrdersListAction")
    }
  }
};
</script>

<style lang="sass">
@import "../node_modules/bulma/bulma.sass"
@import "mq"
</style>
