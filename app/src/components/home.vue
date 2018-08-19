<template>
    <div class="home">
      
      <div class="container">

        <h1 class="title">Orders</h1>
        <h2 class="subtitle is-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h2>
      
      </div>

      <div class="container">
        <div class="columns">
          <div class="column is-one-third">
            <div class="card">
              <div class="card-content">
                <p class="title">My title</p>
                <p class="answer">My description</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style lang="sass" scoped>
@import "../mq"

.container
  margin: 20px
  
.columns
  flex-warp: warp
</style>