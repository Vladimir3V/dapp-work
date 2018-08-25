<template id="modal-template">
    <transition name="modal">
        <div class="modal-mask">
        <div class="modal-wrapper">

            <div class="columns">
              <div class="column is-half-desktop is-offset-one-quarter-desktop is-three-fifths-tablet is-offset-one-fifth-tablet is-10-mobile
is-offset-1-mobile">

                <div class="card">
                  <header class="card-header">
                    <div class="card-header-title">
                      <p class="title is-5">{{ title }}</p>
                    </div>
                    <a class="card-header-icon" v-on:click="$emit('close')">
                      <span class="icon" >
                        <i class="fa fa-times"></i>
                      </span>
                    </a>
                  </header>
                   <div class="card-content">
                    <div class="content">
                      <table class="table is-fullwidth is-narrow is-bordered">
                        <tr>
                          <th>E-mail:</th>
                          <td><a :href="`mailto:${owner_email}`">{{ owner_email }}</a></td>
                        </tr>
                        <tr>
                          <th>Additional:</th>
                          <td>{{ owner_contact }}</td>
                        </tr>
                      </table>
                      <p class="content" id="order-card-description">{{ text }}</p>
                      <p><b>Additional information:</b>&emsp;<a v-if="file_hash" :href="`https://ipfs.io/ipfs/${file_hash}`" target="_blank">{{ file_hash }}</a></p>
                    </div>
                  </div>
                  <div class="card-footer">
                <p class="card-footer-item"><b>Budget:</b>&emsp;{{ budget }} Ether</p>
                <p class="card-footer-item"><b>Order id:</b>&emsp;{{ id }}</p>
                  </div>
                </div>

              </div>
            </div>

        </div>
        </div>
    </transition>
</template>

<script>
import axious from "axios";
import { mapState } from "vuex";
export default {
  name: "modal-order-info",
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
      owner_email: null,
      owner_contact: null,
      text: null,
      file_hash: null,
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
      this.owner_email = value.owner_email;
      this.owner_contact = value.owner_contact;
      this.getTextFromIpfs(value.text_hash);
      this.file_hash = value.file_hash;
      this.budget = value.budget;
      this.order = value;
    },
    getTextFromIpfs: async function(ipfs_hash) {
      let url = "https://ipfs.io/ipfs/" + ipfs_hash;
      axious
        .get(url)
        .then(res => {
          // console.log("[DEBUG] Got response from IPFS:", res);
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

.card-header-icon
  color: #1EC9AC
  &:hover
    color: black

#order-card-description
    white-space: pre-wrap
    max-height: 350px
    overflow-y: auto

.modal-mask 
  position: fixed
  z-index: 9998
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  display: table
  transition: opacity 0.3s ease

.modal-wrapper 
  display: table-cell
  vertical-align: middle

.columns
  transition: all 0.3s ease

.modal-enter 
  opacity: 0

.modal-leave-active 
  opacity: 0

.modal-enter .columns
.modal-leave-active .columns
  -webkit-transform: scale(1.1)
  transform: scale(1.1)
</style>
