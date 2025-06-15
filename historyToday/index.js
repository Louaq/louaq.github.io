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
      // 请求历史上的今天API
      getHistoryList() {
        fetch('https://api.aa1.cn/doc/todayls.html', {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log('API返回数据:', data);
            
            // 根据API文档的数据结构处理
            if (data && data.code === 1 && data.data && Array.isArray(data.data)) {
              this.content = data.data.map(item => ({
                title: item.title || "历史事件",
                desc: item.desc || item.content || "",
                year: item.year || item.date || ""
              }));
              
              // 限制显示数量，避免数据过多
              if (this.content.length > 10) {
                this.content = this.content.slice(0, 10);
              }
              
              if (this.content.length === 0) {
                this.content = [
                  { 
                    title: "暂无历史数据", 
                    desc: "今天暂无历史数据记录", 
                    year: new Date().getFullYear().toString()
                  }
                ];
              }
            } else {
              // 处理其他可能的数据格式
              if (data && Array.isArray(data)) {
                this.content = data.map(item => ({
                  title: item.title || item.event || "历史事件",
                  desc: item.desc || item.content || item.detail || "",
                  year: item.year || item.date || item.time || ""
                })).slice(0, 10);
              } else {
                this.content = [
                  { 
                    title: "数据格式错误", 
                    desc: "返回的数据格式不正确", 
                    year: new Date().getFullYear().toString()
                  }
                ];
              }
            }
            
            console.log('处理后的数据:', this.content);
          })
          .catch((err) => {
            console.error("请求历史数据失败:", err);
            this.content = [
              { 
                title: "获取数据失败", 
                desc: "无法连接到历史数据服务，请检查网络连接或稍后重试", 
                year: new Date().getFullYear().toString()
              }
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
              <h3 class="history-title">
                <span v-if="item.year" class="history-year">{{ item.year }}年</span>
                {{ item.title }}
              </h3>
              <p class="history-desc">{{ item.desc }}</p>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    `
  });
