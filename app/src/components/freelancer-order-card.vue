<template>
    <div class="column is-one-third">

      <div class="card">
        <header class="card-header">
          <div class="card-header-title">
            <p class="title is-5">{{ title }}</p>
          </div>
        </header>
        <div class="card-content">
          <div class="content is-small">
            <ul class>
              <li><b>Owner address:</b> {{owner_addr}}</li>
              <li><b>Owner email:</b> {{owner_email}}</li>
              <li><b>Owner contact:</b> {{owner_contact}}</li>
              <li><b>Freelancer address:</b> {{freelancer_addr}}</li>
              <li :class="{'has-text-success': (freelancer_email === providedEmail)}">
                  <span><b>Freelancer email:</b> {{freelancer_email}}</span>
                  <span class="icon is-small" v-if="freelancer_email === providedEmail">
                    <i class="fa fa-check"></i>
                  </span>
              </li>
            </ul>
          </div>
          <div class="content">
            <p id="order-card-description">{{ text }}</p>
          </div>
          <div class="content is-small">
            <p><b>Additional information:</b>&emsp;<a v-if="file_hash" :href="`https://ipfs.io/ipfs/${file_hash}`" target="_blank">{{ file_hash }}</a></p>
          </div>
        </div>

        <div class="card-footer">

          <div class="card-footer-item"><b>Budget:</b>&emsp;{{ budget }} Ether</div>
          <div class="card-footer-item"><b>Order id:</b>&emsp;{{ id }}</div>

        </div>

        <div class="card-footer">

           <div class="card-footer-item">

            <span> Owner:&emsp; </span>
            <span class="has-text-danger" v-if="owner_lock">
              <span class="icon is-small" >
                <i class="fa fa-lock"></i>
              </span>
              <span>Locked</span>
            </span>
            <span class="has-text-success" v-else>
              <span class="icon is-small">
                <i class="fa fa-unlock"></i>
              </span>
              <span>Unlocked</span>
            </span>

          </div>

          <div class="card-footer-item">

            <span> Freelancer:&emsp; </span>
            <span class="has-text-danger" v-if="freelancer_lock">
              <span class="icon is-small" >
                <i class="fa fa-lock"></i>
              </span>
              <span>Locked</span>
            </span>
            <span class="has-text-success" v-else>
              <span class="icon is-small">
                <i class="fa fa-unlock"></i>
              </span>
              <span>Unlocked</span>
            </span>

          </div>

        </div>
        
        <div class="card-footer">

          <div class="card-footer-item">

            <div class="field is-grouped">

              <div class="control">
                <button :class="{'button':true,
                                  'is-warning':true,
                                  'is-loading':isProcessing,}"
                        v-on:click="submitUnlock()">
                  <span class="icon is-small">
                    <i class="fa fa-unlock"></i>
                  </span>
                  <span>Unlock</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

  </div>
</template>

<script>
import axious from "axios";
import { mapState } from "vuex";

export default {
  name: "freelancer-order-card",
  props: {
    orderData: {
      type: Object,
      required: true
    },
    providedEmail: {
        type: String,
        required: false
    }
  },
  data() {
    return {
      id: null,
      title: null,
      owner_addr: null,
      owner_email: null,
      owner_contact: null,
      freelancer_addr: null,
      freelancer_email: null,
      text: null,
      file_hash: null,
      budget: null,
      owner_lock: null,
      freelancer_lock: null,

      order: null,
    };
  },
  computed: mapState({
    isProcessing: state => state.web3State.isProcessing,
  }),
  mounted: function() {
    this.setData(this.orderData);
  },
  methods: {
    setData: function(value) {
      this.id = value.id;
      this.title = value.title;
      this.owner_addr = value.owner_addr;
      this.owner_email = value.owner_email;
      this.owner_contact = value.owner_contact;
      this.freelancer_addr = value.freelancer_addr
      this.freelancer_email = value.freelancer_email
      this.getTextFromIpfs(value.text_hash);
      this.file_hash = value.file_hash;
      this.budget = value.budget;
      this.owner_lock = value.owner_lock;
      this.freelancer_lock = value.freelancer_lock;
      this.order = value;
    },
    getTextFromIpfs: async function(ipfs_hash) {
      let url = "https://ipfs.io/ipfs/" + ipfs_hash;
      axious
        .get(url)
        .then(res => {
          //   console.log("[DEBUG] Got response from IPFS:", res);
          this.text = res.data;
          this.order_text = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitUnlock() {
      this.$store.dispatch("setWeb3ProcessingAction", true);
      this.$store.dispatch("unlockOrderFreelancerAction", this.id);
    }
  },
  watch: {
    orderData: function(newValue, oldValue) {
      this.setData(newValue);
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../mq"

#order-card-description
  padding: 5px
  white-space: pre-wrap
  max-height: 350px
  overflow-y: auto

.card-content
  padding: 5px

.card-footer-item
  padding: 5px
</style>