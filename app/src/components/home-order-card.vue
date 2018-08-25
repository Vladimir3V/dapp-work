<template>
    <div class="column is-one-third">

        <modal-order-info v-if="showModalOrderInfo" @close="showModalOrderInfo = false"
             v-bind:orderData="order"/>
        
        <div class="card" @click="showModalOrderInfo = true">
            <div class="card-header">
            <div class="card-header-title">
                <p class="title is-5">{{ title }}</p>
            </div>
            </div>
            <div class="card-content">
            <p class="content" id="order-card-description">{{ text }}</p>
            </div>
            <div class="card-footer">
            <p class="card-footer-item"><b>Budget:</b>&emsp;{{ budget }} Ether</p>
            <p class="card-footer-item"><b>Order id:</b>&emsp;{{ id }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axious from "axios";
import ModalOrderInfo from "@/components/modal-order-info";
export default {
  name: "home-order-card",
  components: {
    "modal-order-info": ModalOrderInfo
  },
  props: {
    orderData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: null,
      title: null,
      text: null,
      budget: null,
      order: null,
      showModalOrderInfo: false
    };
  },
  mounted: function() {
    this.setData(this.orderData);
  },
  watch: {
    orderData: function(newValue, oldValue) {
      this.setData(newValue);
    }
  },
  methods: {
    setData: function(value) {
      this.id = value.id;
      this.title = value.title;
      this.getTextFromIpfs(value.text_hash);
      this.budget = value.budget;

      this.order = value;
    },
    getTextFromIpfs: async function(ipfs_hash) {
      let url = "https://ipfs.io/ipfs/" + ipfs_hash;
      axious
        .get(url)
        .then(res => {
        //   console.log("[DEBUG] Got response from IPFS:", res);
          this.text = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../mq"

#order-card-description
    white-space: pre-wrap
    max-height: 350px
    overflow-y: auto

</style>