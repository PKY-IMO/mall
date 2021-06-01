<template>
  <div class="wrapper" ref="wrapper">
    <div class="content"><slot></slot></div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      observeDOM: {
        type: Boolean,
        default: false,
      },
      observeImage: {
        type: Boolean,
        default:false
      },
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    //组件创造完后调用
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true, /* div等元素想要被点击，必须设置click */
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        observeDOM: this.observeDOM,
        // 等页面图片加载完之后，刷新content高度
        observeImage: this.observeImage,
        disableTouch: false
      })
       
      // 监听滚动位置
      if(this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
        this.$emit('scroll', position)
        })
      }
      
      //监听滚动底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>
</style>
