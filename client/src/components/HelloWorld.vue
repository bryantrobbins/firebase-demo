<template>
  <div class="hello">
    <h1>{{ header }}</h1>
    <button v-on:click="logout">Sign Out</button> <button @click="init">Initialize app base state</button>
    <br />
    User:
    <select v-model="localUserId" @change="changeUser(localUserId)">
      <option v-for="user in users">{{ user.id }}</option>
    </select>
    Conversation:
    <select v-model="localConvoId" @change="changeConversationId(localConvoId)">
      <option v-for="id in convoIds" :id="id">{{ id }}</option>
    </select>
    <ConversationContainer
      :conversation="conversations[selectedConvoId]"
      :id="selectedConvoId"
      :key="selectedConvoId"
    />
  </div>
</template>

<script>
import ConversationContainer from './ConversationContainer'
import firebase from 'firebase'

import { mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  components: {
    ConversationContainer
  },

  data () {
    return {
      header: 'This is Bryan\'s firebase demo app in Vue.js',
      localConvoId: '',
      localUserId: ''
    }
  },
  computed: {
    ...mapState({
      conversations: state => state.conversations.all,
      convoIds: state => state.conversations.allIds,
      selectedConvoId: state => state.conversations.selected,
      users: state => state.users.all,
      selectedUserId: state => state.users.currentUser
    })
  },

  mounted () {
    this.get()
    this.localUserId = this.selectedUserId
    this.localConvoId = this.selectedConvoId
  },

  methods: {
    init () {
      this.$store.dispatch('users/seed')
      this.$store.dispatch('conversations/seed')
    },

    get () {
      this.$store.dispatch('users/get')
      this.$store.dispatch('conversations/get')
    },

    changeConversationId (conversationId) {
      console.log(`In changeConversationId calling store, conversationId is ${conversationId}`)
      this.$store.dispatch('conversations/setConverstationId', {conversationId})
    },

    changeUser (userId) {
      this.$store.dispatch('users/setCurrentUser', {userId})
    },

    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
