<template>
  <div class="cart-list" >
    <scroll class="content" ref="scroll">
      <div>
      <cart-list-item  v-for="(item,index) in cartList" 
            :key="index" 
            :item-info='item'>
            </cart-list-item>
            <div class="tag"></div>
            </div>
    </scroll>
    
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import {mapGetters} from 'vuex'

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .cart-list {
    height: calc(100vh - 44px -49px -40px);
  }
  .content {
    /* position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0; */
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    /* height: 100%;
    overflow: hidden; */
  }
  .tag {
    height: 40px;
  }
</style>
