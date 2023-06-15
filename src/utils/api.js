import firebase from './firebase'
import { getFirestore, collection, getDocs, addDoc, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore/lite';

const db = getFirestore(firebase);

let defaultDecision = '';

async function dbList (decision, type) {
  const snap = await getDocs(collection(db, 'decisions', decision || defaultDecision, type))
  return { data: sortBy(snap.docs.map(doc => doc.data())) }
}

async function dbCreate (decision, type, data) {
  const docRef = await addDoc(collection(db, 'decisions', decision || defaultDecision, type), data)
  setDoc(docRef, { _id: docRef.id }, { merge: true })
  return { data: { _id: docRef.id } }
}

async function dbFind (decision, type, key) {
  const snap = await getDoc(doc(db, 'decisions', decision || defaultDecision, type, key))
  return { data: snap.data() }
}

async function dbUpdate (decision, type, key, data) {
  await setDoc(doc(db, 'decisions', decision || defaultDecision, type, key), data, { merge: true })
}

async function dbDelete (decision, type, key) {
  await deleteDoc(doc(db, 'decisions', decision || defaultDecision, type, key))
}

function sortBy(arr, key = 'name') {
  return arr.sort((a, b) => a[key] && a[key].localeCompare(b[key]))
}

const API = {
  user: {
    me: async function () {
      return {
        data: {
          username: 'Josh'
        }
      }
    }
  },

  decision: {
    list: async () => {
      const snap = await getDocs(collection(db, 'decisions'))
      return { data: sortBy(snap.docs.map(doc => doc.data())) }
    },
    
    create: async (data) => {
      const docRef = await addDoc(collection(db, 'decisions'), data)
      setDoc(docRef, { _id: docRef.id }, { merge: true })
      return { data: { _id: docRef.id } }
    },

    find: async (decision) => {
      const snap = await getDoc(doc(db, 'decisions', decision || defaultDecision))
      if (snap.exists()) {
        const out = snap.data()
        out.options = (await API.option.list(decision)).data
        out.factors = (await API.factor.list(decision)).data
        out.moods = (await API.mood.list(decision)).data.map(mood => ({
          ...mood,
          option: out.options.find(option => option._id === mood.option),
          factor: out.factors.find(factor => factor._id === mood.factor)
        }))
        out.moods.filter(mood => !mood.option || !mood.factor).forEach(mood => {
          API.mood.delete(decision, mood._id)
        })
        out.moods = out.moods
          .filter(mood => mood.option && mood.factor)
          .sort((a, b) => a.factor.name.localeCompare(b.factor.name))
          .sort((a, b) => a.option.name.localeCompare(b.option.name))

        return { data: out }
      } else {
        throw new Error('Decision not found.')
      }
    },

    update: async (decision, data) => {
      await setDoc(doc(db, 'decisions', decision || defaultDecision), data, { merge: true })
    },

    delete: async (decision) => {
      await deleteDoc(doc(db, 'decisions', decision || defaultDecision))
    },

    use: function(decision) { defaultDecision = decision }
  },

  option: {
    list:   async (decision)               => await dbList(  decision, 'options'),
    create: async (decision, data)         => {
      const res = await dbCreate(decision, 'options', data)
      const factors = (await API.factor.list(decision)).data
      factors.forEach(factor => {
        API.mood.create(decision, {
          option: res.data._id,
          factor: factor._id
        })
      })
      return res
    },
    find:   async (decision, option)       => await dbFind(  decision, 'options', option),
    update: async (decision, option, data) => await dbUpdate(decision, 'options', option, data),
    delete: async (decision, option)       => await dbDelete(decision, 'options', option)
  },

  factor: {
    list:   async (decision)               => await dbList(  decision, 'factors'),
    create: async (decision, data)         => {
      const res = await dbCreate(decision, 'factors', data)
      const options = (await API.option.list(decision)).data
      options.forEach(option => {
        API.mood.create(decision, {
          factor: res.data._id,
          option: option._id
        })
      })
      return res
    },
    find:   async (decision, factor)       => await dbFind(  decision, 'factors', factor),
    update: async (decision, factor, data) => await dbUpdate(decision, 'factors', factor, data),
    delete: async (decision, factor)       => await dbDelete(decision, 'factors', factor)
  },

  mood: {
    list:   async (decision)               => await dbList(  decision, 'moods'),
    create: async (decision, data)         => await dbCreate(decision, 'moods', data),
    find:   async (decision, mood)         => await dbFind(  decision, 'moods', mood),
    update: async (decision, mood, data)   => await dbUpdate(decision, 'moods', mood, data),
    delete: async (decision, mood)         => await dbDelete(decision, 'moods', mood)
  }
}

export default API
