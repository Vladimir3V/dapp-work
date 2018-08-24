<template>
    <div class="home">

      <div class="container">

        <h1 class="title">Available Orders</h1>
        <div class="subtitle box is-6">
          <ul>
            <li>Click on the order to get a detailed description.</li>
            <li>Contact with the order owner to ask him to add you as a freelancer for his order (contact information you will find in the detailed description).</li>
            <li>You can check orders assigned to you on "Assigned Order" page.</li>
          </ul>
        </div>

        <div class="subtitle box is-6">

            <nav class="level subtitle">

                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">By ID</p>
                        <input class="input is-small" type="text" v-model="idFilter">
                    </div>
                </div>

                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">By Title</p>
                        <input class="input is-small" type="text" v-model="titleFilter">
                    </div>
                </div>
            
                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">By Email</p>
                        <input class="input is-small" type="email" v-model="emailFilter">
                    </div>
                </div>

                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">By Address</p>
                        <input class="input is-small" type="text" v-model="addressFilter">
                    </div>
                </div>
                
            </nav>

        </div>
      
      </div>

      <div class="container">
        <div class="columns" v-if="orders">
            <home-order-card v-for="order in orderedOrders"
                v-bind:key="order.id"
                v-if="!order.owner_lock && !order.freelancer_lock"
                v-bind:orderData="order"></home-order-card>
        </div>
      </div>

    </div>
</template>

<script>
import HomeOrderCard from "@/components/home-order-card";
import { mapState } from "vuex";
export default {
  name: "home",
  components: {
    "home-order-card": HomeOrderCard
  },
  data() { 
      return {
          idFilter: null,
          titleFilter: null,
          emailFilter: null,
          addressFilter: null
      }
  },
  computed: mapState({
    orders: state => state.orders,
        filteredOrders(state) {
        let filtered_orders = Object.assign({}, this.orders)

        let id_filter = this.idFilter
        let title_filter = this.titleFilter
        let email_filter = this.emailFilter
        let address_filter = this.addressFilter

        for (let key in filtered_orders) {
            let delete_flag = false
            if (id_filter && (key !== id_filter)) {
                delete_flag = true
            }
            else if (!delete_flag && title_filter) {
                let title_lowercase = filtered_orders[key].title.toLowerCase()
                let filter_lowercase = title_filter.toLowerCase()
                if (!title_lowercase.includes(filter_lowercase)) {
                    delete_flag = true                
                }
            } 
            else if (!delete_flag && email_filter) {
                let owner_lowercase = filtered_orders[key].owner_email.toLowerCase()
                let freelancer_lowercase = filtered_orders[key].freelancer_email.toLowerCase()
                let filter_lowercase = email_filter.toLowerCase()
                if (owner_lowercase !== filter_lowercase && freelancer_lowercase !== filter_lowercase) {
                    delete_flag = true                
                }
            } 
            else if (!delete_flag && address_filter) {
                let owner_lowercase = filtered_orders[key].owner_addr.toLowerCase()
                let freelancer_lowercase = filtered_orders[key].freelancer_addr.toLowerCase()
                let filter_lowercase = address_filter.toLowerCase()
                if (owner_lowercase !== filter_lowercase && freelancer_lowercase !== filter_lowercase) {
                    delete_flag = true                
                }
            } 

            if (delete_flag) delete filtered_orders[key]
        }
        return filtered_orders
    },
    orderedOrders(state) { return _.orderBy(this.filteredOrders, 'id', 'desc')}
  }),
  methods: {}
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

ul
  list-style: circle
  margin-left: 1.1em  

.table
  flex-wrap: wrap

.column
  overflow: auto

.columns
  flex-wrap: wrap
</style>