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
    console.log("[DEBUG] registerWeb3Action & registerIpfsAction dispatched from App.vue")
    this.$store.dispatch("registerWeb3Action")
    this.$store.dispatch("registerIpfsAction")
  },
  data() {
    return {
      logModerAddedEvent: null,
      logModerRemovedEvent: null,
      logOrderCreatedEvent: null,
      logOrderModifiedEvent: null,
      logOrderStartedEvent: null,
      logOrderUnlockedByOwnerEvent: null,
      logOrderUnlockedByFreelancerEvent: null,
      logOrderCompletedEvent: null,
      logOrderRemovedEvent: null,
      logOrderFreelancerAddedEvent: null
    }
  },
  computed: mapState({
    web3Instance: state => state.web3Instance,
    contractInstance: state => state.contractInstance,
    LogModerAdded: state => state.contractEvents.LogModerAdded,
    LogModerRemoved: state => state.contractEvents.LogModerRemoved,
    LogOrderCreated: state => state.contractEvents.LogOrderCreated,
    LogOrderModified: state => state.contractEvents.LogOrderModified,
    LogOrderStarted: state => state.contractEvents.LogOrderStarted,
    LogOrderUnlockedByOwner: state => state.contractEvents.LogOrderUnlockedByOwner,
    LogOrderUnlockedByFreelancer: state => state.contractEvents.LogOrderUnlockedByFreelancer,
    LogOrderCompleted: state => state.contractEvents.LogOrderCompleted,
    LogOrderRemoved: state => state.contractEvents.LogOrderRemoved,
    LogOrderFreelancerAdded: state => state.contractEvents.LogOrderFreelancerAdded
  }),
  watch: {
    web3Instance: function (newInstance, oldInstance) {
      this.dispatchGetContractAction()
    },
    contractInstance: function(newInstance, oldInstance) {
      this.dispatchGetOrdersListAction()
    },
    LogModerAdded: function(newInstance, oldInstance) {
      if (this.logModerAddedEvent) this.logModerAddedEvent.stopWatching()
      this.logModerAddedEvent = newInstance()
    },
    LogModerRemoved: function(newInstance, oldInstance) {
      if (this.logModerRemovedEvent) this.logModerRemovedEvent.stopWatching()
      this.logModerRemovedEvent = newInstance()
    },
    LogOrderCreated: function(newInstance, oldInstance) {
      if (this.logOrderCreatedEvent) this.logOrderCreatedEvent.stopWatching()
      this.logOrderCreatedEvent = newInstance()
      this.logOrderCreatedEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderCreatedEvent:", err)
        else this.dispatchUpdateSingleOrderAction(res.args.id)
      })
    },
    LogOrderModified: function(newInstance, oldInstance) {
      if (this.logOrderModifiedEvent) this.logOrderModifiedEvent.stopWatching()
      this.logOrderModifiedEvent = newInstance()
      this.logOrderModifiedEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderModifiedEvent:", err)
        else this.dispatchUpdateSingleOrderAction(res.args.id)
      })
    },
    LogOrderStarted: function(newInstance, oldInstance) {
      if (this.logOrderStartedEvent) this.logOrderStartedEvent.stopWatching()
      this.logOrderStartedEvent = newInstance()
      this.logOrderStartedEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderStartedEvent:", err)
        else this.dispatchUpdateSingleOrderAction(res.args.id)
      })
    },
    LogOrderUnlockedByOwner: function(newInstance, oldInstance) {
      if (this.logOrderUnlockedByOwnerEvent) this.logOrderUnlockedByOwnerEvent.stopWatching()
      this.logOrderUnlockedByOwnerEvent = newInstance()
      this.logOrderUnlockedByOwnerEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderUnlockedByOwnerEvent:", err)
        else this.dispatchUpdateSingleOrderAction(res.args.id)
      })
    },
    LogOrderUnlockedByFreelancer: function(newInstance, oldInstance) {
      if (this.logOrderUnlockedByFreelancerEvent) this.logOrderUnlockedByFreelancerEvent.stopWatching()
      this.logOrderUnlockedByFreelancerEvent = newInstance()
      this.logOrderUnlockedByFreelancerEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderUnlockedByFreelancerEvent:", err)
        else this.dispatchUpdateSingleOrderAction(res.args.id)
      })
    },
    LogOrderCompleted: function(newInstance, oldInstance) {
      if (this.logOrderCompletedEvent) this.logOrderCompletedEvent.stopWatching()
      this.logOrderCompletedEvent = newInstance()
      this.logOrderCompletedEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderCompletedEvent:", err)
        else this.dispatchRemoveSingleOrderAction(res.args.id)
      })
    },
    LogOrderRemoved: function(newInstance, oldInstance) {
      if (this.logOrderRemovedEvent) this.logOrderRemovedEvent.stopWatching()
      this.logOrderRemovedEvent = newInstance()
      this.logOrderRemovedEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderRemovedEvent:", err)
        else this.dispatchRemoveSingleOrderAction(res.args.id)
      })
    },
    LogOrderFreelancerAdded: function(newInstance, oldInstance) {
      if (this.logOrderFreelancerAddedEvent) this.logOrderFreelancerAddedEvent.stopWatching()
      this.logOrderFreelancerAddedEvent = newInstance()
      this.logOrderFreelancerAddedEvent.watch((err, res) => {
        if (err) console.error("[ERROR] App.vue logOrderFreelancerAddedEvent:", err)
        else this.dispatchUpdateSingleOrderAction(res.args.id)
      })
    }
  },
  methods: {
    dispatchGetContractAction: function () {
      console.log("[DEBUG] getContractAction dispatched  from App.vue");
      this.$store.dispatch("getContractAction");
    },
    dispatchUpdateSingleOrderAction: function(id) {
      this.$store.dispatch("updateSingleOrderAction", id)
    },
    dispatchRemoveSingleOrderAction: function(id) {
      this.$store.dispatch("removeSingleOrderAction", id)
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
