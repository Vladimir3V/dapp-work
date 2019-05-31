<template>
  <div class="home">
    <modal-order-create v-if="showModalOrderCreate" @close="showModalOrderCreate = false"/>
    <div class="container">
      <div class="section section_first">
        <div class="row first">
          <div class="col-sm-1"></div>
          <div class="col-sm-6">
            <h1 class="title">Pay to contractor secure</h1>
            <h2
              class="subtitle"
            >Service for secure contracting. Replace the paper contract with a smart contract.</h2>
            <ul class="mar">
              <li>Marketing and development contracts</li>
              <li>Blockchain secure transactions</li>
              <li>ETH payments</li>
            </ul>
          </div>
          <div class="col-sm-5 title">
            <div class="title">
              <p class="control">
                <a class="button button-create  is-primary is-outlined" v-on:click="showModalOrderCreate = true">
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
          <iframe width="640px" height="700px" src frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="col-sm-12 text-center">Quick withdrawals. Fast support. Fair Dispute Resolution.</div>
      </div>

      <h2 class="title text-center">Main Features/Benefits</h2>

      <div class="row">
        <div class="col-sm-1"></div>
        <div class="box col-sm-3">
          <div class="text-center">
            <img :src="'./static/img/' + 'icon1' + '.png'" width="80" height="80" alt>
            <h3 class="subtitle subtitle-feature">Maximum security</h3>
          </div>

          <span>
            The platform protects the interests of the parties.
            <br>Contractor gets payment only if project milestones are completed.
            <br>The employer can not cheat the contractor and not pay if the work is done.
            <br>
          </span>
        </div>
        <div class="box col-sm-3 box-fetures">
          <div class="text-center">
            <img :src="'./static/img/' + 'icon2' + '.png'" width="80" height="80" alt>
            <h3 class="subtitle subtitle-feature">Fast withdrawals</h3>
          </div>
          <span>Platform does not delay payments. Once the work is done, the funds are sent to contractor account.</span>
        </div>
        <div class="box col-sm-3 box-fetures">
          <div class="text-center">
            <img :src="'./static/img/' + 'icon3' + '.png'" width="80" height="80" alt>
            <h3 class="subtitle subtitle-feature">Independent moderator support</h3>
          </div>
          <span>We resolve conflicts quickly and fairly.</span>
        </div>
        <div class="col-sm-1"></div>
      </div>
      <h2 class="title text-center">The process</h2>

      <div class="row">
        <div class="box col-sm-4">
          1) Install a special extension
          <a src="https://metamask.io/">Metamask</a>
        </div>
        <div class="box col-sm-4">2) Click Create order</div>
        <div class="box col-sm-4">3) Describe details of project</div>
        <div class="box col-sm-4">4) Add the address of the freelancer</div>
        <div class="box col-sm-4">5) Check result</div>
        <div class="box col-sm-4">6) Accept the payment</div>
      </div>

      <h2 class="title text-center">Frequently asked questions</h2>
      <div class="col-sm-2"></div>
      <div class="col-sm-10">
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

    <div class="section text-center">
        LaborX 2019
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

.section_first
  background: URL('https://vladimir3v.github.io/dapp-work-lx/static/img/ruki2.png') no-repeat
  background-position: center
  background-size: 60%

.mar
  margin-top: 3em

.title
  margin-top: 2em
  margin-bottom: 1.1em

.box
  margin-bottom: 1.1em

.box-fetures
  margin-left: 2rem
ul
  list-style: circle
  margin-left: 1.1em  

.table
  flex-wrap: wrap

.subtitle-feature
    margin: 1rem 0

.column
  overflow: auto

.columns
  flex-wrap: wrap

.button-create:hover
    background-color: white!important
    color: blue!important
    border-color: blue!important


.button-create
    color: white!important
    margin-top: 6rem
    background-color: blue!important
    width: 14rem
    padding: 1,5rem
    border-color: blue!important





</style>

