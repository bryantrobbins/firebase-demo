// import Vue from 'vue'
import uuidv4 from 'uuid/v4'

const state = {
  all: {},
  allIds: [],
  allMsgIds: [],
  selected: ''
}

const mutations = {
  SET_CONVERSATION (state, { conversation }) {
    const data = conversation.data()
    state.all = {
      ...state.all,
      [conversation.id]: { users: data.users, created: data.created, messages: [] }
    }
    state.allIds.push(conversation.id)

    if (!state.selected) {
      state.selected = conversation.id
    }
  },

  ADD_MESSAGE (state, { conversationId, message }) {
    if (!state.allMsgIds.includes(message.id)) {
      state.all[conversationId].messages.push(message)
      state.allMsgIds.push(message.id)
    }
  },

  SET_CURRENT_CONVERSATION_ID (state, { conversationId }) {
    state.selected = conversationId
  }

}

const actions = {
  seed ({ rootState }) {
    let convoRef = rootState.db.collection('conversations')

    convoRef.add({
      created: Date.now(),
      users: ['mr_a', 'mr_b'],
      messages: [
        { id: uuidv4(), text: 'Hi there', sender: 'mr_a', created: Date.now() },
        { id: uuidv4(), text: 'Hi to you too!', sender: 'mr_b', created: Date.now() }
      ]
    })

    convoRef.add({
      created: Date.now(),
      users: ['mr_a', 'mr_c'],
      messages: []
    })
  },

  async get ({ commit, rootState }) {
    let convoRef = rootState.db.collection('conversations')
    // TODO: Check for failures here
    let convos = await convoRef.get()

    convos.forEach(conversation => commit('SET_CONVERSATION', { conversation }))
  },

  sendMessage ({ commit, rootState }, { text, created, sender, conversationId }) {
    const convoRef = rootState.db.collection('conversations').doc(conversationId)

    convoRef.update({
      messages: [...state.all[conversationId].messages, { id: uuidv4(), created, sender, text }]
    })
    .then(res => console.log('Message sent.'))
    .catch(err => console.log('Error', err))
  },

  setConverstationId ({ commit, rootState }, { conversationId }) {
    console.log(`Setting selectedConvoId to ${conversationId}`)
    commit('SET_CURRENT_CONVERSATION_ID', { conversationId })
  }

}

export default { namespaced: true, state, mutations, actions }