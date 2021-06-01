<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import {mapGetters} from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar 
  },
  computed: {
    //   1.普通写法
    // cartLength () {
    // //   return this.$store.state.cartLish.length  将方法封装到getters之前的写法
    //   return this.$store.getters.cartLength   封装到getters之后的写法
    // }
    // 2.利用mapGetters解构 ， 还可用 mapState , mapActions
    // ...mapGetters(['cartLength']) //一一对应，下面是修改名称以对象形式，getter映射成组件的属性
    ...mapGetters({
      length: 'cartLength'
    })
  }
}
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

</style>