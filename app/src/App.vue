<template>
  <div id="app">
    <hello-web3/>
    <nav-bar/>
    <router-view/>
  </div>
</template>

<script>
import HelloWeb3 from "@/components/hello-web3";
import NavBar from "@/components/nav-bar";
export default {
  name: "App",
  components: {
    "hello-web3": HelloWeb3,
    "nav-bar": NavBar
  },
  beforeCreate() {
    console.log("registerWeb3Action dispatched from App.vue");
    this.$store.dispatch("registerWeb3Action");
  }
};
</script>

<style lang="sass">
@import "../node_modules/bulma/bulma.sass"
@import "mq"
</style>
