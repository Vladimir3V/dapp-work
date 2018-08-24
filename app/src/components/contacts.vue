<template>
    <div class="contacts">

      <div class="container">

        <h1 class="title">Contacts</h1>
        <div class="subtitle box is-6">
            <p>Feel free to ask me any questions: <a href="mailto:krotpv@gmail.com">krotpv@gmail.com</a></p>
            <p>But please, add "[DappWork]" in front of your title.</p>
            <p>Thank you!</p>
        </div>

      </div>

     </div>
</template>

<script>
export default {
  name: "contacts",
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

.table
  flex-wrap: wrap

.column
  overflow: auto

.columns
  flex-wrap: wrap
</style>