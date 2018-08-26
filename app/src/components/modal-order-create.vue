<template id="modal-template">
    <transition name="modal">
        <div class="modal-mask">
        <div class="modal-wrapper">
          <form novalidate="true">

            <div class="columns">
              <div class="column is-half-desktop is-offset-one-quarter-desktop is-three-fifths-tablet is-offset-one-fifth-tablet is-10-mobile
is-offset-1-mobile">

                <div class="card">
                  <header class="card-header">
                    <div class="card-header-title">
                      <p class="title is-5">Create Order</p>
                    </div>
                    <a class="card-header-icon is-primary" v-on:click="$emit('close')">
                      <span class="icon" >
                        <i class="fa fa-times"></i>
                      </span>
                    </a>
                  </header>
                   <div class="card-content">
                    <div class="content">

                        <div class="field">
                          <label class="label">Title</label>
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
                          <label class="label">Email</label>
                          <div class="control has-icons-left has-icons-right">
                            <input :class="{'input':true, 'is-danger':email_invalid_flag}" type="email" v-model="email_main" placeholder="example@mail.com">
                            <span class="icon is-small is-left">
                              <i class="fa fa-envelope"></i>
                            </span>
                            <span class="icon is-small is-right" v-if="email_invalid_flag">
                              <i class="fa fa-exclamation-triangle"></i>
                            </span>
                          </div>
                          <div v-if="email_invalid_flag">
                            <p class="help is-danger">{{email_invalid_str}}</p>
                          </div>
                        </div>

                        <div class="field">
                          <label class="label">Repeat Email</label>
                          <div class="control has-icons-left has-icons-right">
                            <input :class="{'input':true, 'is-danger':email_different_flag}" type="email" v-model="email_repeat" placeholder="example@mail.com">
                            <span class="icon is-small is-left">
                              <i class="fa fa-envelope"></i>
                            </span>
                            <span class="icon is-small is-right" v-if="email_different_flag">
                              <i class="fa fa-exclamation-triangle"></i>
                            </span>
                          </div>
                          <div v-if="email_different_flag">
                            <p class="help is-danger">{{email_different_str}}</p>
                          </div>
                        </div>

                        <div class="field">
                          <label class="label">Additional contact information</label>
                          <div class="control has-icons-left has-icons-right">
                            <input :class="{'input': true, 'is-danger':additional_contact_error_flag}" type="text" v-model="additional_contact" placeholder="skype: username / telegram: @username">
                            <span class="icon is-small is-left">
                              <i class="fa fa-font"></i>
                            </span>
                            <span class="icon is-small is-right" v-if="additional_contact_error_flag">
                              <i class="fa fa-exclamation-triangle"></i>
                            </span>

                          </div>
                          <div v-if="additional_contact_error_flag">
                            <p class="help is-danger">{{additional_contact_error_str}}</p>
                          </div>
                        </div>

                        <div class="field">
                          <label class="label">Order Description</label>
                          <div class="control">
                            <textarea class="textarea" v-model="description" placeholder="The detailed description of my awesome order!" ></textarea>
                          </div>
                        </div>

                        <div class="field">
                          <label class="label">File with details</label>
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
                                  <p  v-if="file">{{file.name}}</p>
                                </span>
                              </label>
                              <div class="button is-light" v-on:click="file=null">
                                <span class="icon">
                                  <i class="fa fa-times"></i>
                                </span>
                                <span>Clean</span>
                              </div>                        
                            </div>
                          </div>
                        </div>

                        <div class="field ">
                          <label class="label">Budget</label>
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

                        <div class="field is-grouped">
                          <div class="control">
                            <div :class="{'button':true,
                                          'is-success':true,
                                          'is-loading':isProcessing}" 
                                    v-on:click="submitForm()">
                              <span class="icon is-small">
                                <i class="fa fa-check"></i>
                              </span>
                              <span>Submit</span>
                            </div>
                          </div>
                          <div class="control">
                            <div :class="{'button': true,
                                          'is-danger': true,
                                          'is-loading': isProcessing}"
                                  v-on:click="$emit('close')">
                              <span class="icon is-small">
                                <i class="fa fa-times"></i>
                              </span>
                              <span>Close</span>
                            </div>
                          </div>
                        </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>
          
          </form>
        </div>
        </div>
    </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "modal-order-create",
  data() {
    return {
      title: "",
      email_main: "",
      email_repeat: "",
      additional_contact: "",
      description: "",
      file: null,
      budget: 0,
      title_error_flag: true,
      title_error_str: "Title required",
      email_invalid_flag: true,
      email_invalid_str: "Valid email required",
      email_different_flag: true,
      email_different_str: "Emails are different",
      additional_contact_error_flag: false,
      additional_contact_error_str: "The length must be less than 33 characters",
      budget_error_flag: true,
      budget_error_str: "Must be a number and more than 0"
    }
  },
  computed: mapState({
    isProcessing: state => state.web3State.isProcessing,
  }),
  methods: {
    submitForm() {
      if (this.title_error_flag || this.email_invalid_flag 
          || this.email_different_flag || this.additional_contact_error_flag
          || this.budget_error_flag || this.isProcessing) {
        console.log("[DEBUG] createOrder() canceled: one of flags is up or processing another transaction!")
        return
      }

      this.$store.dispatch('setWeb3ProcessingAction', true)

      if(this.file) {
        let reader = new window.FileReader()
        reader.onloadend = () => this.submitFormContinue(reader)
        reader.readAsArrayBuffer(this.file)
      }
      else {
        this.submitFormContinue(null)
      }
    },
    submitFormContinue(reader) {
      let file_buffer = null
      if (reader) file_buffer = reader.result

      let payload = {
        "title": this.title,
        "email_contact": this.email_main,
        "additional_contact": this.additional_contact,
        "description": this.description,
        file_buffer,
        "budget": this.budget
      }
      console.log("[DEBUG] createOrderAction dispatched from modal-order-create.vue")
      this.$store.dispatch("createOrderAction", payload)
      this.$emit("close")
    },
    handleFileUpload(event) {
      console.log("[DEBUG] handleFileUpload event:", event)
      this.file = event.target.files[0]
    },
    validLength: function (str) {
      if (str.length > 32) { return false }
      else { return true }
    },
    validEmail: function (email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  },
  watch: {
    title: function (newValue, oldValue) {
      if (!newValue) {
        this.title_error_str = "Title required"
        this.title_error_flag = true
      }
      else if (!this.validLength(newValue)) {
        this.title_error_str = "The title length must be less than 33 characters"
        this.title_error_flag = true
      } 
      else {
        this.title_error_flag = false
      }
    },
    email_main: function (newValue, oldValue) {
      if (!this.validLength(newValue)) {
        this.email_invalid_str = "The email length must be less than 33 characters"
        this.email_invalid_flag = true
      } 
      else if (!this.validEmail(newValue)) {
        this.email_invalid_str = "Valid email required"
        this.email_invalid_flag = true
      }
      else {
        this.email_invalid_flag = false
      }

      if (newValue !== this.email_repeat) {
        this.email_different_flag = true
      }
      else {
        this.email_different_flag = false
      }
    },
    email_repeat: function (newValue, oldValue) {
      if (newValue !== this.email_main) {
        this.email_different_flag = true
      }
      else {
        this.email_different_flag = false
      }
    },
    additional_contact: function (newValue, oldValue) {
      if (!this.validLength(newValue)) {
        this.additional_contact_error_flag = true
      }
      else {
        this.additional_contact_error_flag = false
      }
    },
    budget: function (newValue, oldValue) {
      if (isNaN(newValue) || newValue <= 0) {
        this.budget_error_flag = true
      }
      else {
        this.budget_error_flag = false
      }
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
