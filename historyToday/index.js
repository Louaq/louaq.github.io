new Vue({
    el: "#myHistorySwiper", // el不要是最外面的id_name，应该是html: ''里的div的id
    data: function () {
      return {
        swiperOption: {
          effect: "cube", // 轮播特效
          loop: true, // 循环
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        },
        content: [],
      };
    },
    computed: {
      swiper() {
        return this.$refs.myhistoryswiper.$swiper;
      },
    },
    created() {
      this.getHistoryList();
    },
    methods: {
      // 鼠标移入停止轮播
      stopAutoPlay() {
        this.swiperOption.autoplay && this.swiper.autoplay.stop();
      },
      // 鼠标移出开始轮播
      startAutoPlay() {
        this.swiperOption.autoplay && this.swiper.autoplay.start();
      },
      // 请求开源api, 获取历史上的今天数据
      getHistoryList() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        fetch(`https://api.oick.cn/lishi/api.php?m=${month}&d=${day}`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data && data.result && Array.isArray(data.result)) {
              this.content = data.result.map(item => ({
                title: item.title || "历史事件",
                desc: item.event || "",
                year: item.date || ""
              }));
              
              if (this.content.length === 0) {
                this.content = [
                  { title: "暂无历史数据", desc: "今天暂无历史数据", year: "" }
                ];
              }
            } else {
              this.content = [
                { title: "获取数据失败", desc: "无法获取历史上的今天数据", year: "" }
              ];
            }
          })
          .catch((err) => {
            console.log("err", err);
            this.content = [
              { title: "获取数据失败", desc: "请求历史数据时发生错误", year: "" }
            ];
          });
      },
    },
    template: `
      <div class="history-today-container">
        <swiper 
          ref="myhistoryswiper" 
          :options="swiperOption" 
          @mouseenter.native="stopAutoPlay" 
          @mouseleave.native="startAutoPlay">
          <swiper-slide v-for="(item, index) in content" :key="index">
            <div class="history-item">
              <h3 class="history-title">{{ item.year }} {{ item.title }}</h3>
              <p class="history-desc">{{ item.desc }}</p>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    `
  });
  