<template>
  <div class="home">
    <modal-order-create v-if="showModalOrderCreate" @close="showModalOrderCreate = false"/>
    <div class="container">
      <div class="section">
        <div class="row first">
          <div class="col-sm-1"></div>
          <div class="col-sm-6">
            <h1 class="title">Secure contract platform</h1>
            <h2 class="subtitle">Replace old paper contract with smart contract</h2>

            <ul class="mar">
              <li>supply contracts</li>
              <li>employment contracts</li>
              <li>blockchain secure transactions</li>
              <li>ETH payments</li>
            </ul>
          </div>
          <div class="col-sm-5 title">
            <div class="title">
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
      <h2 class="title text-center">How it works</h2>

      <div class="col-sm-12 text-center">
        <div class="col-sm-12">
          <iframe
            width="640px"
            height="700px"
            src="https://www.youtube.com/embed/xFa2_PVMeDQ"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <div class="col-sm-12 text-center">Quick withdrawals. Fast support. Fair Dispute Resolution.</div>
      </div>

      <h2 class="title text-center">Main Features/Benefits</h2>

      <div class="row">
        <div class="box col-sm-4">
          <h3 class="subtitle">Maximum security</h3>
          <span>
            The platform protects the interests of the parties.
            <br>The employer can not cheat the freelancer and not pay if the work is done.
            <br>Freelancers get payment only if project milestones are completed.
            <br>
          </span>
        </div>
        <div class="box col-sm-4">
          <h3 class="subtitle">Fast withdrawals</h3>
          <span>Platform does not delay payments. Once the work is done, the funds are sent to your account.</span>
        </div>
        <div class="box col-sm-4">
          <h3 class="subtitle">Independent moderator support</h3>
          <span>We resolve conflicts quickly and fairly.</span>
        </div>
      </div>
      <h2 class="title text-center">The process</h2>

      <div class="row">
        <div class="box col-sm-4">
          1) Install a special extension
          <a>Metamask</a>
        </div>
        <div class="box col-sm-4">2) Click Create order</div>
        <div class="box col-sm-4">3) Describe details of project</div>
        <div class="box col-sm-4">4) Add the address of the freelancer</div>
        <div class="box col-sm-4">5) Check result</div>
        <div class="box col-sm-4">6) Accept the payment</div>
      </div>

      <h2 class="title text-center">Frequently asked questions</h2>

      <div>
        <ul>
          <li>Where to find help with a dispute? - Write a letter</li>
          <li>
            Where is the money kept? Money is kept on the account, access to which is available only to the
            customer of the contractor and moderator.
          </li>
          <li>Where to buy Ether? - You can buy directly in Metamask. Here is the instruction.</li>
          <li>Why are you doing this? - We want to make a reliable service and earn a small commission.</li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="columns" v-if="orders">
        <home-order-card
          v-for="order in orderedOrders"
          v-bind:key="order.id"
          v-if="!order.owner_lock && !order.freelancer_lock"
          v-bind:orderData="order"
        ></home-order-card>
      </div>
    </div>
  </div>
</template>
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

<style lang="sass" scoped>
@import "../mq"

.mar
  margin-top: 3em

.first

.container

.title
  margin-top: 2em
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

