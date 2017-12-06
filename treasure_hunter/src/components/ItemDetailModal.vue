<template>
  <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':itemModalFlag}">
    <div class="md-modal-inner">
      <div class="md-top" >
       <button class="md-close" @click="itemModalUpdate">Close</button>
      </div>
      <div class="md-content">
        <div class="pic center">
          <img v-lazy="productImg" alt="">
        </div>
        <div class="name">{{name}}</div>
        <div class="line">
          <span class="text">Current Bid:</span>
          <span class="value">${{price}}</span>
        </div>
        <div class="line">
          <span class="text">Current Winner:</span>
          <span class="value">{{winner}}</span>
        </div>
 
        

        <div class="line">
          Time Left:     {{day}}:{{hr}}:{{min}}:{{sec}}
        </div>
        <div class="description">
          Description:{{description}}+{{day}}+{{hr}}+{{min}}+{{sec}}
        </div>
      
        
        <div class="login-wrap">
          <input type="submit" @click="submitBid" class="btn-login" value="Bid By $5.00"></input>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md-modal {
    width: 600px;
  }
  .name {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    height: 1em;
    font-size: 1.5em;
    line-height: 1em;
    font-family: "moderat", sans-serif;
    font-weight: bold;
    overflow: hidden;
  }

  .price {

    color: #333
  }
  .line {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    float: left;
    line-height: 8px;
    font-size: 1.25em;
    clear:both;
  }
  .description{
    overflow: hidden;
    float: left;
    clear: both;
    margin-bottom: 1.25em;
    margin-top:0.5em;
  }
  .value {
    color: #d1434a;
    float: left;
    font-size: 1.25em;
  }
  .text {
    color: #666;
    float: left;
    font-size: 1.25em;
  }
  .v-center {
    padding-top: 0.25em;
    padding-bottom: 0.25em;
  }

</style>

<script>
import countdown from 'vuejs-countdown';
import axios from 'axios';

export default {
  data() {
    return {
      time:  '',
      day: 0, hr: 0, min: 0, sec: 0

    }
  },
  mounted(){
    this.countdown()
  },
  computed: {
    itemModalFlag() {
      return this.$store.state.itemModalFlag;
    },
    productImg() {
      return this.$store.state.productImg;
    },
    name(){
      return this.$store.state.name;
    },
    price(){
      return this.$store.state.price;
    },
    description() {
      return this.$store.state.description;
    },
    expire(){
      return this.$store.state.expire;
    },
    winner(){
      return this.$store.state.winner;
    }

  },
    sockets: {
        newBid2(item) {
            console.log('newbid2',item.winner);
            this.$store.commit("bid",item);

        }
    },
  methods: {
        countdown: function () {
      const end = Date.parse(new Date(this.$store.state.expire))
      const now = Date.parse(new Date())
      const msec = end - now
      let day = parseInt(msec / 1000 / 60 / 60 / 24)
      let hr = parseInt(msec / 1000 / 60 / 60 % 24)
      let min = parseInt(msec / 1000 / 60 % 60)
      let sec = parseInt(msec / 1000 % 60)
      this.day = day
      this.hr = hr > 9 ? hr : '0' + hr
      this.min = min > 9 ? min : '0' + min
      this.sec = sec > 9 ? sec : '0' + sec
      const that = this
      setTimeout(function () {
        that.countdown()
      }, 1000)
    },
    submitBid() {
      let bid = 50;

         axios.post("/items/bid",{
            fullname: this.$store.state.nickName,
            productId: this.$store.state.productID,
            bidPrice: this.$store.state.price + bid,
            fullname: this.$store.state.nickName,
        }).then((res)=>{
            if(res.status==200){
                var item = {
                    bid:bid,
                    winner:this.$store.state.nickName
                }
              this.$store.commit("bid", item);
                this.$socket.emit('newBid', item);
            } else {
              console.log('fail');
            }
        });
    },

    itemModalUpdate() {
      this.$store.commit("itemModalUpdate");
      this.$store.commit("closePop");
    }
  },
  components: {
    countdown
  },



}
</script>