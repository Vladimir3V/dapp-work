<template>
    <div class="contract-owner-panel">

      <div class="container">

        <h1 class="title">Contract Owner Panel</h1>
        <div class="subtitle box is-6">

            <div class="field is-horizontal">
                <div class="field has-addons">
                    <p class="control">
                        <a class="button is-static">
                        Contract Profit
                        </a>
                    </p>
                    <p class="control">
                        <input class="input" type="text"  v-model="contractProfit" readonly>
                    </p>
                </div>
                &emsp;
                <div class="field is-horizontal is-grouped">
                    <p class="control">
                        <a class="button is-info" v-on:click="updateContractProfit()">
                        Refresh
                        </a>
                    </p>
                </div>
            </div>

            <div class="field is-horizontal">
                <div class="field has-addons">
                    <p class="control">
                        <a class="button is-static">
                        Withdraw Profit
                        </a>
                    </p>
                    <p class="control">
                        <input class="input" type="text"  v-model="withdrawProfitValue">
                    </p>
                </div>
                &emsp;
                <div class="field is-horizontal is-grouped">
                    <p class="control">
                        <a class="button is-success" v-on:click="withdrawContractProfit()">
                        Withdraw
                        </a>
                    </p>
                </div>
            </div>

            <div class="field is-horizontal">
                <div class="field has-addons">
                    <p class="control">
                        <a class="button is-static">
                        Moderator Address
                        </a>
                    </p>
                    <p class="control">
                        <input class="input" type="text" v-model="moderAddress">
                    </p>
                </div>
                &emsp;
                <div class="field is-horizontal is-grouped">
                    <p class="control">
                        <a class="button is-success" v-on:click="addModer()">
                        Add
                        </a> 
                    </p>
                    <p class="control">
                        <a class="button is-danger" v-on:click="removeModer()">
                        Remove
                        </a>
                    </p>
                </div>
            </div>

            <div class="field is-horizontal">
                <div class="field has-addons">
                    <p class="control">
                        <a class="button is-static">
                        Contract Pause
                        </a>
                    </p>
                    <p class="control">
                        <input :class="{'input': true,
                                    'is-danger':isPaused,
                                    'is-success':!isPaused}"
                                type="text" readonly v-model="pauseStatus">
                    </p>
                </div>
                &emsp;
                <div class="field is-horizontal is-grouped">
                    <p class="control" v-on:click="unpause()">
                        <a class="button is-warning">
                        Unpause
                        </a>
                    </p>
                    <p class="control" v-on:click="pause()">
                        <a class="button is-danger">
                        Pause
                        </a>
                    </p>
                </div>
            </div>

        </div>
      
      </div>

    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "contract-owner-panel",
  data() {
      return {
          withdrawProfitValue: 0,
          moderAddress: null
      }
  },
  computed: mapState({
      contractProfit: state => state.contractProfit + " Ether",
      isPaused: state => state.contractPaused,
      pauseStatus: state => (state.contractPaused) ? "PAUSED" : "UNPAUSED"
  }),
  methods: {
    updateContractProfit: function () {
      this.$store.dispatch("updateContractProfitAction");
    },
    withdrawContractProfit: function () {
      this.$store.dispatch("withdrawContractProfitAction", this.withdrawProfitValue);
    },
    addModer: function() {
        this.$store.dispatch("addModerAction", this.moderAddress)
    },
    removeModer: function() {
        this.$store.dispatch("removeModerAction", this.moderAddress)
    },
    pause: function() {
        this.$store.dispatch("pauseAction")
    },
    unpause: function() {
        this.$store.dispatch("unpauseAction")
    },
  }
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

.table
  flex-wrap: wrap

.column
  overflow: auto

.columns
  flex-wrap: wrap
</style>