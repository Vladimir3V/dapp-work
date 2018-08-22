<template>
  <div class='web3-info'>
    <div class="mbox">
      <nav class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Web3</p>
            <div class="subheading" v-if="isProcessing">
              <p id="is-processing"><i aria-hidden="true" class="fa fa-spinner fa-spin"></i> Processing...</p>
            </div>
            <div class="subheading" v-else>
              <p v-if="isInjected" id="has-web3"><i aria-hidden="true" class="fa fa-check"></i> Installed</p>
              <p v-else id="no-web3"><i aria-hidden="true" class="fa fa-times"></i> Not found</p>
            </div>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Network</p>
            <p class="subheading">{{ network }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Account</p>
            <p class="subheading">{{ coinbase }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Balance</p>
            <p class="subheading">{{ balance }} Ether</p>
          </div>
        </div>
      </nav>   
    </div> 
  </div>
</template>

<script>
import { NETWORKS } from "../utils/constants/networks";
import { mapState } from "vuex";
export default {
  name: "hello-web3",
  computed: mapState({
    isInjected: state => state.web3State.isInjected,
    isProcessing: state => state.web3State.isProcessing,
    network: state => NETWORKS[state.web3State.networkId],
    coinbase: state => state.web3State.coinbase.slice(0, 6) + "..." + state.web3State.coinbase.slice(-4),
    balance: state => state.web3State.balance.toFixed(6)
  })
};
</script>

<style lang="sass" scoped>
.mbox
  background-color: #e6e6e6
  border-bottom: 3px solid #91eede
  padding-bottom: 5px

.heading
  font-weight: bold

.subheading
  font-size: 0.9em

#is-processing
  color: darkblue

#has-web3 
  color: green

#no-web3 
  color: red

</style>