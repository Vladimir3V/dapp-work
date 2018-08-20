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
                      <p class="title is-5">{{ order.title }}</p>
                    </div>
                    <a class="card-header-icon" @click="$emit('close')">
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
                          <td><a :href="`mailto:${order.owner_email}`">{{ order.owner_email }}</a></td>
                        </tr>
                        <tr>
                          <th>Additional:</th>
                          <td>{{ order.owner_contact }}</td>
                        </tr>
                      </table>
                      <p>
                        {{ order.text_hash }}
                      </p>
                      <p><b>Additional information:</b>&emsp;<a :href="`${order.file_hash}`">{{order.file_hash}}</a></p>
                    </div>
                  </div>
                  <div class="card-footer">
                    <p class="card-footer-item"><b>Budget:</b></p>
                    <p class="card-footer-item">{{ order.budget }} Ether</p>
                  </div>
                </div>

              </div>
            </div>

        </div>
        </div>
    </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "modal-order-info",
  computed: mapState({
    order: state => state.modalOrderInfo
  })
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
