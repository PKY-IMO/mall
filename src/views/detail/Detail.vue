<template>
  <div id="detail">
    <detail-nav-bar ref='nav' class="detail-nav" @titleClick='titleClick'/>
    <scroll class="content" ref="scroll" @scroll='contentScroll' :probe-type='3'>
      <detail-swiper :top-images='topImages'/>
      <detail-base-info :goods='goods'/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info='detailInfo' @imgLoad='imgLoad'/>
      <detail-param-info ref="params" :param-info='paramsInfo' />
      <detail-comment-info ref="comment" :comment-info='commentInfo' />
      <goods-list ref="recommend" :goods='recommends' />
    </scroll>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'

  import {itemListenerMixin, backTopMixin} from 'common/mixin'

  import {debounce} from 'common/utils'


  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramsInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() { //不能获取元素
      //保存iid
      this.iid = this.$route.params.iid

      //请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result
        //1.获取顶部轮播数据
        this.topImages = data.itemInfo.topImages
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //3.创建商家信息
        this.shop = new Shop(data.shopInfo)
        
        //4.保存商品详情数据
        this.detailInfo = data.detailInfo

        //5.商品参数信息
        this.paramsInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //6.评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
        
        //1.在这里值不对：this.$refs.params.$el DOM没有渲染

        // this.$nextTick(() => {
        //   //2.值不对：DOM渲染完，图片还没有加载完
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //   console.log(this.themeTopYs)
        // })

        // 4. 为topYs设置防抖
        this.getThemeTopY = debounce(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE) // 在数组末尾增加一个无限大的值，为了之后对数组做遍历
        }, 100)
      })

      //请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    },
    mounted() { //不能获取数据
      //1.图片加载完成的事件监听

    },
    updated() {
      
    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    methods: {
      imgLoad() {
        this.newRefresh()

        //3.图片加载完确定组件高度
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index])
      },
      contentScroll(position) {
        // 1.获取y值
        const positionY = - position.y
        // 2.将y值与组件内容高度做对比
        // console.log(this.topYs[0]); // 这里是undefined，得不到它的值，并且即使得到了也应该为负值，
        // console.log(positionY);
        let length = this.themeTopYs.length
        // for(let i in this.topYs)  此方法获取的 i为字符串 要用parseInt(i) 或者 i*1 的方法将其转为数值
        // for(let i=0;i<length;i++){
        // if(this.topYs[i].positionY >=0 && this.topYs[i].positionY < this.topYs[i+1].positionY)
        //   console.log(this.topYs[i]);
        // console.log(this.topYs.length);
        // 1.普通做法
          // if(this.currentIndex !== i && ((i < length -1 && positionY >= this.topYs[i] && positionY < this.topYs[i+1]) || (i === length -1 && positionY >= this.topYs[i]))){
          // 2.hack做法，在数组后面加一个无限大的值，并且遍历时只遍历到 i<length-1
          for(let i = 0;i < length-1; i++){
            if(this.currentIndex !== i && (i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
              this.currentIndex = i
            //console.log(i); // 因为此时打印非常频繁，所以将当前index保存为一个变量，this.currentIndex !== i  在两个不等的情况下才打印，就不会很频繁
            //console.log(this.themeTopYs[i]); // 此处的值是正值
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        // 是否显示回到底部按钮的判断
        this.isShowBackTop = positionY > 1000
      },
      addToCart() {
        //1.获取购物车信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        

        //添加到购物车
       // 2.将商品添加到购物车里
      // this.$store.commit('addCart',product) commit是将product提交到store中mutations里的方法addCart
      this.$store.dispatch('addCart',product)  // dispatch是提交到actions里去，再由actions分发commit到mutations里不同的方法中去
      .then(res => {
        this.$toast.show(res,1000)
      })
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 10;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
