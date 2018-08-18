<template>
  <div class='web3-info'>
    <p v-if="isInjected" id="has-web3"><i aria-hidden="true" class="fa fa-check"></i> Web3 installed</p>
    <p v-else id="no-web3"><i aria-hidden="true" class="fa fa-times"></i> Web3 not found</p>
    <p>Network: {{ network }}</p>
    <p>Account: {{ coinbase }}</p>
    <p>Balance: {{ balance }} Ether </p>
  </div>
</template>

<script>
import { NETWORKS } from "../utils/constants/networks";
import { mapState } from "vuex";
export default {
  name: "hello-web3",
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkId],
    coinbase: state => state.web3.coinbase,
    balance: state => state.web3.balance
  })
};
</script>

<style scoped>
#has-web3 {
  color: green;
}
#no-web3 {
  color: red;
}
</style>