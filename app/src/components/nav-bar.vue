<template>
  <div id="navigation-bar">
    <modal-order-create v-if="showModalOrderCreate" @close="showModalOrderCreate = false"/>
    <div class="navbar has-shadow">
      <div class="container">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item is-primary">
            <img
              :src="'./static/img/' + 'laborX-blue' + '.png'"
              alt="LaborX"
              height="100"
              width="100"
            >
          </router-link>

          <span
            class="navbar-burger"
            v-on:click="toggleNav"
            v-bind:class="{ 'is-active': isActive }"
          >
            <span/>
            <span/>
            <span/>
          </span>
        </div>

        <div class="navbar-menu navbar-end" v-bind:class="{ 'is-active': isActive }">
          <router-link to="/" class="navbar-item r-item">Home</router-link>
          <router-link to="/available-orders" class="navbar-item r-item">Available Orders</router-link>
          <router-link to="/owner-orders" class="navbar-item r-item">Own Orders</router-link>
          <router-link to="/freelancer-orders" class="navbar-item r-item">Assigned Orders</router-link>
          <router-link to="/moder-orders" class="navbar-item r-item" v-if="isModer">Moder Panel</router-link>
          <router-link
            to="/contract-owner-panel"
            class="navbar-item r-item"
            v-if="isOwner"
          >Owner Panel</router-link>
          <router-link to="/contacts" class="navbar-item r-item">Contacts</router-link>

          <div class="navbar-item">
            <p class="control">
              <a class="button is-primary is-outlined" v-on:click="showModalOrderCreate = true">
                <span class="icon">
                  <i class="fa fa-plus-circle"></i>
                </span>
                <span>Create Order</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalOrderCreate from "@/components/modal-order-create";
import { mapState } from "vuex";
export default {
  name: "nav-bar",
  components: {
    "modal-order-create": ModalOrderCreate
  },
  data() {
    return {
      isActive: false,
      showModalOrderCreate: false
    };
  },
  computed: mapState({
    isModer: state => state.contractModer,
    isOwner: state => state.contractOwner
  }),
  methods: {
    toggleNav() {
      this.isActive = !this.isActive;
    }
  }
};
</script>

  <!-- Jquery and Js Plugins -->


<style lang="sass">
@import "../mq"

.navbar
    
    a:hover
        color: gray

.navbar-brand a
    color: #1EC9AC
    font-weight: bold
    &:hover
        color: #1EC9AC

a.r-item
    color: #c1c1c1
    padding: 0.5rem 1rem
    +tablet
        color: gray
        &:hover
            background-color: #f1f1f1
    +mobile
        color: gray
        &:hover
            background-color: #f1f1f1

.navbar-burger span
    background-color: #c1c1c1
</style>
