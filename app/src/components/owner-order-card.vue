<template>
    <div class="column is-one-third">

<!-- ############ -->
<!-- EDITING CARD -->
<!-- ############ -->

      <div class="card" v-if="mode === 1">

            <div class="card-content">

              <div class="field">
                <div class="control has-icons-left has-icons-right">
                  <input :class="{'input':true, 'is-danger':title_error_flag}" type="text" v-model="title" placeholder="Order title">
                  <span class="icon is-small is-left">
                    <i class="fa fa-font"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="title_error_flag">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>

                </div>
                <div v-if="title_error_flag">
                  <p class="help is-danger">{{title_error_str}}</p>
                </div>
              </div>

              <div class="field">
                <div class="control has-icons-left has-icons-right">
                  <input :class="{'input':true, 'is-danger':email_error_flag}" type="email" v-model="owner_email" placeholder="Your email">
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="email_error_flag">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                </div>
                <div v-if="email_error_flag">
                  <p class="help is-danger">{{email_error_str}}</p>
                </div>
              </div>

              <div class="field">
                <div class="control has-icons-left has-icons-right">
                  <input :class="{'input': true, 'is-danger':contact_error_flag}" type="text" v-model="owner_contact" placeholder="Additional contact information">
                  <span class="icon is-small is-left">
                    <i class="fa fa-font"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="contact_error_flag">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>

                </div>
                <div v-if="contact_error_flag">
                  <p class="help is-danger">{{contact_error_str}}</p>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <textarea class="textarea" v-model="text" placeholder="The detailed description of my awesome order!" ></textarea>
                </div>
              </div>

              <div class="field">
                <label class="label">New file with details (if needed)</label>
                <div class="control">
                  <div class="file has-name is-fullwidth has-addons">
                    <label class="file-label">
                      <input class="file-input" type="file" v-on:change="handleFileUpload($event)">
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fa fa-upload"></i>
                        </span>
                        <span class="file-label">
                          Choose a file…
                        </span>
                      </span>
                      <span class="file-name">
                        <p  v-if="file_new">{{file_new.name}}</p>
                      </span>
                    </label>
                    <div class="button is-light" v-on:click="file_new=null">
                      <span class="icon">
                        <i class="fa fa-times"></i>
                      </span>
                      <span>Clean</span>
                    </div>                        
                  </div>
                </div>
              </div>

              <div class="field ">
                <label class="label">New budget (if needed)</label>
                <div class="field has-addons">
                  <div class="control has-icons-left has-icons-right has-addons">
                    <input :class="{'input':true, 'is-danger':budget_error_flag}" type="text" v-model="budget">
                    <span class="icon is-small is-left">
                      <i class="fa fa-money"></i>
                    </span>
                    <span class="icon is-small is-right" v-if="budget_error_flag">
                      <i class="fa fa-exclamation-triangle"></i>
                    </span>
                  </div>
                  <div class="control">
                    <div class="button is-static">Ether</div>
                  </div>
                </div>
                <div v-if="budget_error_flag">
                  <p class="help is-danger">{{budget_error_str}}</p>
                </div>
              </div>

            </div>
            <div class="card-footer">

              <div class="card-footer-item">

                <div class="field is-grouped">
                  <div class="control">
                    <button :class="{'button':true,
                                      'is-success':true,
                                      'is-loading':isProcessing,}" 
                            v-on:click="submitEditing()">
                      <span class="icon is-small">
                        <i class="fa fa-check"></i>
                      </span>
                      <span>Submit</span>
                    </button>
                  </div>
                  <div class="control">
                    <button :class="{'button':true,
                                      'is-danger':true,
                                      'is-loading':isProcessing,}"
                            v-on:click="cancelEditing()">
                      <span class="icon is-small">
                        <i class="fa fa-times"></i>
                      </span>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

              </div>

              <p class="card-footer-item"><b>Order id:</b>&emsp;{{ id }}</p>

            </div>

      </div>

<!-- ############### -->
<!-- FREELANCER CARD -->
<!-- ############### -->

      <div class="card" v-else-if="mode==2">
        <header class="card-header">
          <div class="card-header-title">
            <p class="title is-5">{{title}}</p>
          </div>
        </header>
          <div class="card-content">
          <div class="content">

              <div class="field">
                <label class="label">Freelancer Address</label>
                <div class="control has-icons-left has-icons-right">
                  <input :class="{'input':true, 'is-danger':freelancer_addr_error_flag}" type="text" v-model="freelancer_addr" placeholder="0x0000000000000000000000000000000000000000">
                  <span class="icon is-small is-left">
                    <i class="fa fa-user"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="freelancer_addr_error_flag">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>

                </div>
                <div v-if="freelancer_addr_error_flag">
                  <p class="help is-danger">{{freelancer_addr_error_str}}</p>
                </div>
              </div>

              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                  <input :class="{'input':true, 'is-danger':freelancer_email_invalid_flag}" type="email" v-model="freelancer_email" placeholder="example@mail.com">
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="freelancer_email_invalid_flag">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                </div>
                <div v-if="freelancer_email_invalid_flag">
                  <p class="help is-danger">{{freelancer_email_invalid_str}}</p>
                </div>
              </div>

              <div class="field">
                <label class="label">Repeat Email</label>
                <div class="control has-icons-left has-icons-right">
                  <input :class="{'input':true, 'is-danger':freelancer_email_different_flag}" type="email" v-model="freelancer_email_repeat" placeholder="example@mail.com">
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="freelancer_email_different_flag">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                </div>
                <div v-if="freelancer_email_different_flag">
                  <p class="help is-danger">{{freelancer_email_different_str}}</p>
                </div>
              </div>

          </div>
          </div>
          
          <div class="card-footer">

            <div class="card-footer-item">

              <div class="field is-grouped">
                <div class="control">
                  <button :class="{'button':true,
                                    'is-success':true,
                                    'is-loading':isProcessing,}" 
                          v-on:click="submitFreelancer()">
                    <span class="icon is-small">
                      <i class="fa fa-check"></i>
                    </span>
                    <span>Submit</span>
                  </button>
                </div>
                <div class="control">
                  <button class="button is-danger" v-on:click="mode=0">
                      <span class="icon is-small">
                        <i class="fa fa-times"></i>
                      </span>
                      <span>Cancel</span>
                  </button>
                </div>
              </div>

          </div>

          <p class="card-footer-item"><b>Order id:</b>&emsp;{{ id }}</p>

        </div>

      </div>

<!-- ######### -->
<!-- MAIN CARD -->
<!-- ######### -->

      <div class="card" v-else>
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
              <li><b>Freelancer email:</b> {{freelancer_email}}</li>
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
                                  'is-link':true,
                                  'is-loading':isProcessing}"
                        :disabled="isLocked"
                        v-on:click="mode=2">
                  <span class="icon is-small">
                    <i class="fa fa-user-circle"></i>
                  </span>
                  <span>Set Freelancer</span>
                </button>
              </div>

              <div class="control">
                <button :class="{'button':true,
                                  'is-warning':true,
                                  'is-loading':isProcessing,}"
                        :disabled="!owner_lock" 
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

        <div class="card-footer">
          
          <div class="card-footer-item">

            <div class="field is-grouped">

              <div class="control">
                <button :class="{'button':true,
                                  'is-success':true,
                                  'is-loading':isProcessing,}"
                        :disabled="!isLocked" 
                        v-on:click="submitComplete()">
                  <span class="icon is-small">
                    <i class="fa fa-check"></i>
                  </span>
                  <span>Complete</span>
                </button>
              </div>

              <div class="control">
                <button :class="{'button':true,
                                  'is-info':true,
                                  'is-loading':isProcessing}" 
                        :disabled="isLocked"
                        v-on:click="mode=1">
                  <span class="icon is-small">
                    <i class="fa fa-edit"></i>
                  </span>
                  <span>Edit</span>
                </button>
              </div>

              <div class="control">
                <button :class="{'button':true,
                                  'is-danger':true,
                                  'is-loading':isProcessing}" 
                        :disabled="isLocked"
                        v-on:click="submitRemove()">
                  <span class="icon is-small">
                    <i class="fa fa-times"></i>
                  </span>
                  <span>Remove</span>
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
  name: "owner-order-card",
  props: {
    orderData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mode: 0,

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
      order_text: null,
      file_new: null,
      freelancer_email_repeat: null,

      title_error_flag: true,
      title_error_str: "Title required",
      email_error_flag: true,
      email_error_str: "Valid email required",
      contact_error_flag: false,
      contact_error_str: "The length must be less than 33 characters",
      budget_error_flag: true,
      budget_error_str: "Must be a number and more than 0",
      freelancer_addr_error_flag: true,
      freelancer_addr_error_str: "Valid address required",
      freelancer_email_invalid_flag: true,
      freelancer_email_invalid_str: "Valid email required",
      freelancer_email_different_flag: true,
      freelancer_email_different_str: "Emails are different",

      zero_address: "0x0000000000000000000000000000000000000000"
    };
  },
  computed: mapState({
    isProcessing: state => state.web3State.isProcessing,
    isLocked(state) {
      return this.owner_lock || this.freelancer_lock;
    }
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
      this.freelancer_addr = (value.freelancer_addr === this.zero_address) ? null : value.freelancer_addr
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
    submitEditing() {
      if (
        this.title_error_flag ||
        this.email_error_flag ||
        this.contact_error_flag ||
        this.budget_error_flag ||
        this.isProcessing
      ) {
        console.log(
          "[DEBUG] submitEditing() canceled: one of flags is up or processing another transaction!"
        );
        return;
      }

      this.$store.dispatch("setWeb3ProcessingAction", true);

      if (this.file_new) {
        let reader = new window.FileReader();
        reader.onloadend = () => this.submitEditingContinue(reader);
        reader.readAsArrayBuffer(this.file_new);
      } else {
        this.submitEditingContinue(null);
      }
    },
    submitEditingContinue(reader) {
      let file_buffer = null;
      if (reader) file_buffer = reader.result;

      let new_description = this.text === this.order_text ? null : this.text;
      let new_budget = this.budget === this.order.budget ? null : this.budget;

      let payload = {
        id: this.id,
        title: this.title,
        email_contact: this.owner_email,
        additional_contact: this.owner_contact,
        text_hash: this.order.text_hash,
        description: new_description,
        file_hash: this.file_hash,
        file_buffer,
        budget: new_budget
      };
      this.$store.dispatch("modifyOrderAction", payload);
      this.mode = 0;
    },
    submitRemove() {
      this.$store.dispatch("setWeb3ProcessingAction", true);
      this.$store.dispatch("removeOrderAction", this.id);
    },
    submitFreelancer() {
      if (
        this.freelancer_addr_error_flag ||
        this.freelancer_email_invalid_flag ||
        this.freelancer_email_different_flag ||
        this.isProcessing
      ) {
        console.log(
          "[DEBUG] submitFreelancer() canceled: one of flags is up or processing another transaction!"
        );
        return;
      }

      this.$store.dispatch("setWeb3ProcessingAction", true);

      let payload = {
        id: this.id,
        freelancer_addr: this.freelancer_addr,
        freelancer_email: this.freelancer_email
      };

      this.$store.dispatch("setFreelancerAction", payload);
      this.mode = 0
    },
    submitComplete() {
      this.$store.dispatch("setWeb3ProcessingAction", true);
      this.$store.dispatch("completeOrderAction", this.id);
    },
    submitUnlock() {
      this.$store.dispatch("setWeb3ProcessingAction", true);
      this.$store.dispatch("unlockOrderOwnerAction", this.id);
    },
    cancelEditing() {
      this.setData(this.order);
      this.mode = 0;
    },
    handleFileUpload(event) {
      console.log("[DEBUG] handleFileUpload event:", event);
      this.file_new = event.target.files[0];
    },
    validLength(str) {
      if (str.length > 32) {
        return false;
      } else {
        return true;
      }
    },
    validEmail: function(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validAddress: function(address) {
      let re = /^0x[a-fA-F0-9]{40}$/;
      return re.test(address);
    }
  },
  watch: {
    orderData: function(newValue, oldValue) {
      this.setData(newValue);
    },
    title: function(newValue, oldValue) {
      if (!newValue) {
        this.title_error_str = "Title required";
        this.title_error_flag = true;
      } else if (!this.validLength(newValue)) {
        this.title_error_str =
          "The title length must be less than 33 characters";
        this.title_error_flag = true;
      } else {
        this.title_error_flag = false;
      }
    },
    owner_email: function(newValue, oldValue) {
      if (!this.validLength(newValue)) {
        this.email_error_str =
          "The email length must be less than 33 characters";
        this.email_error_flag = true;
      } else if (!this.validEmail(newValue)) {
        this.email_error_str = "Valid email required";
        this.email_error_flag = true;
      } else {
        this.email_error_flag = false;
      }
    },
    owner_contact: function(newValue, oldValue) {
      if (!this.validLength(newValue)) {
        this.contact_error_flag = true;
      } else {
        this.contact_error_flag = false;
      }
    },
    budget: function(newValue, oldValue) {
      if (isNaN(newValue) || newValue <= 0) {
        this.budget_error_flag = true;
      } else {
        this.budget_error_flag = false;
      }
    },
    freelancer_addr: function(newValue, oldValue) {
      if (!this.validAddress(newValue)) this.freelancer_addr_error_flag = true;
      else this.freelancer_addr_error_flag = false;
    },
    freelancer_email: function(newValue, oldValue) {
      if (!this.validLength(newValue)) {
        this.freelancer_email_invalid_str =
          "The email length must be less than 33 characters";
        this.freelancer_email_invalid_flag = true;
      } else if (!this.validEmail(newValue)) {
        this.freelancer_email_invalid_str = "Valid email required";
        this.freelancer_email_invalid_flag = true;
      } else this.freelancer_email_invalid_flag = false;

      if (newValue !== this.freelancer_email_repeat)
        this.freelancer_email_different_flag = true;
      else this.freelancer_email_different_flag = false;
    },
    freelancer_email_repeat: function(newValue, oldValue) {
      if (newValue !== this.freelancer_email)
        this.freelancer_email_different_flag = true;
      else this.freelancer_email_different_flag = false;
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