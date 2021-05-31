import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCart(state, payload) {
    //1.查找原数组中是否有该商品
    let oldProduct = null
    for(let item of state.cartList){ // 遍历数组中的元素
      if(item.iid === payload.iid){
        oldProduct = item // 将此时传入的元素暂时等于oldProduct，方便后面的比较
      }
    }
    //2.判断oldProduct
    if(oldProduct){
      oldProduct.count += 1 // oldProduct表示现目前的已有商品
    }else {
      payload.count = 1
      state.cartList.push(payload)
      //被添加的商品元素为payload，如果payload的iid与已有商品的iid一致，则已有商品的数量加1
    }
    }
  }
})

export default store