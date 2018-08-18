<template>
    <div class="casino">
        <hello-web3/>
    </div>
</template>

<script>
import HelloWeb3 from "@/components/hello-web3";
export default {
  name: "dapp-work",
  components: {
    "hello-web3": HelloWeb3
  },
  beforeCreate() {
    console.log("registerWeb3Action dispatched from casino-dapp.vue");
    this.$store.dispatch("registerWeb3Action");
  }
};
</script>

<style scoped>
* {
  color: #444444;
}
</style>