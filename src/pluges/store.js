import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import common from '../common'

export default data => {
    return new Vuex.Store(Object.assign({}, {
        strict: process.env.NODE_ENV !== 'production',
        ...common,
        modules: data
    }, process.env.NODE_ENV === 'production' ? {} : {
    plugins: [createLogger()]
    }))
}