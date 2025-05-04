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
      // 获取百度日历API的历史上的今天数据
      getHistoryList() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        fetch(`https://baike.baidu.com/api/calendar/get?resource_id=6018&date=${month}-${day}`, {
          method: "GET", 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data && data.data && data.data.length > 0) {
              // 处理百度日历API的数据
              let historyEvents = [];
              
              // 从almanac中提取历史事件数据
              if (data.data[0].festival && data.data[0].festival.almanac) {
                historyEvents = data.data[0].festival.almanac;
              }
              
              // 如果almanac没有数据，尝试从other中获取
              if (historyEvents.length === 0 && data.data[0].festival && data.data[0].festival.other) {
                historyEvents = data.data[0].festival.other;
              }
              
              // 如果上述都没有数据，尝试使用百科数据
              if (historyEvents.length === 0 && data.data[0].history) {
                historyEvents = data.data[0].history.map(item => {
                  return {
                    year: item.year,
                    title: item.title,
                    desc: item.desc
                  };
                });
              }
              
              // 如果还是没有数据，使用一些默认数据
              if (historyEvents.length === 0) {
                historyEvents = [
                  { year: "1949", title: "中华人民共和国成立" },
                  { year: "1969", title: "阿波罗11号成功登月" },
                  { year: "1978", title: "中国改革开放政策开始实施" },
                  { year: "1997", title: "香港回归中国" },
                  { year: "2008", title: "北京奥运会开幕" }
                ];
              }
              
              this.content = historyEvents;
            } else {
              // 如果API无法获取数据，使用默认数据
              this.content = [
                { year: "1949", title: "中华人民共和国成立" },
                { year: "1969", title: "阿波罗11号成功登月" },
                { year: "1978", title: "中国改革开放政策开始实施" },
                { year: "1997", title: "香港回归中国" },
                { year: "2008", title: "北京奥运会开幕" }
              ];
            }
          })
          .catch((err) => {
            console.log("err", err);
            // 请求出错，使用默认数据
            this.content = [
              { year: "1949", title: "中华人民共和国成立" },
              { year: "1969", title: "阿波罗11号成功登月" },
              { year: "1978", title: "中国改革开放政策开始实施" },
              { year: "1997", title: "香港回归中国" },
              { year: "2008", title: "北京奥运会开幕" }
            ];
          });
      },
    },
    template: `
      <div class="swiper-container" 
           @mouseenter="stopAutoPlay" 
           @mouseleave="startAutoPlay">
        <swiper ref="myhistoryswiper" :options="swiperOption">
          <swiper-slide v-for="(item, index) in content" :key="index">
            <div class="history-item">
              <h3>{{ item.year }}年</h3>
              <p>{{ item.title }}</p>
              <p v-if="item.desc">{{ item.desc }}</p>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    `
  });
  