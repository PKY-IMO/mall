import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 500)
    this.itemImgListener = () => {this.newRefresh()}
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
} 

// 封装回到顶部按钮
export const backTopMixin = {
  data () {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backTop () {
      this.$refs.scroll.scrollTo(0,0)
    }
  }
}