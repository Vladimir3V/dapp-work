<template>
  <div id="navigation-bar">
    <div class="navbar has-shadow">
      <div class="container">
        <div class="navbar-brand">
            <router-link to="/" class="navbar-item is-primary">DappWork</router-link>

            <span class="navbar-burger" v-on:click="toggleNav" v-bind:class="{ 'is-active': isActive }">
                <span/>
                <span/>
                <span/>
            </span>
        </div>
        
        <div class="navbar-menu navbar-end" v-bind:class="{ 'is-active': isActive }">
          
          <router-link to="/" class="navbar-item r-item">Home</router-link>
          <router-link to="/" class="navbar-item r-item">Home</router-link>
          <router-link to="/" class="navbar-item r-item">Home</router-link>

          <div class="navbar-item">
            <p class="control">
              <a class="button is-primary is-outlined">
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
export default {
  name: "nav-bar",
  data() {
      return {
        isActive: false
      };
  },
  methods: {
      toggleNav() {
          this.isActive = !this.isActive;
      }
  }
};
</script>

<style lang="sass">
@import "../mq"

.navbar
    background-color: #383838
    a:hover
        color: gray

.navbar-brand a
    color: #1EC9AC
    font-weight: bold
    &:hover
        color: #1EC9AC

a.r-item
    color: #c1c1c1
    padding: 0.5rem 1.75rem
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
