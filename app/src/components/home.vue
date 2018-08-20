<template>
    <div class="home">
      
      <div class="container">

        <h1 class="title">Orders</h1>
        <h2 class="subtitle is-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h2>
      
      </div>

      <div class="container">
        <div class="columns" v-if="orders">
          <div class="column is-one-third" v-for="order in orders" v-bind:key="order.id" >
            <div class="card">
              <div class="card-content">
                <p class="title is-4">{{ order.title }}</p>
                <p class="subtitle is-6"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
                <p class="subtitle is-6"> <b>Budget: </b> {{ order.budget }} Ether</p>
                <!-- <table class="table is-bordered is-fullwidth is-narrow">
                  <thead>
                    <th colspan="2"><p class="has-text-centered">Contact information</p></th>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Email:</th>
                      <td> {{ order.owner_email}} </td>
                    </tr>
                    <tr>
                      <th>Additional:</th>
                      <td> {{ order.owner_contact }} </td>
                    </tr>
                  </tbody>
                </table> -->
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home",
  computed: mapState({
    orders: state => state.orders
  })
};
</script>

<style lang="sass" scoped>
@import "../mq"

.container
  margin-top: 20px

.table
  flex-wrap: wrap

.column
  overflow: auto

.columns
  flex-wrap: wrap
</style>