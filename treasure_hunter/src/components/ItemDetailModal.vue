<template>
  <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':itemModalFlag}">
    <div class="md-modal-inner">
      <div class="md-top" >
       <button class="md-close" @click="itemModalUpdate">Close</button>
      </div>
      <div class="md-content">
        <div class="pic center">
          <img v-lazy="'/static/'+'6.jpg'" alt="">
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
       
            <span class="text">Time left:</span> 
        
            <span class="value" v-if="expireDisable">
            {{Math.round((expire/(1000*60*60*24)))}} Day
            :
            {{Math.round((expire%(1000*60*60*24)/(1000*60*60)))}} Hour
            :
            {{Math.round((expire%(1000*60*60)/(1000*60)))}} Mintue
            :
            {{Math.round((expire%(1000*60)/1000))}} Seconds
      
          </span>
          <span class="value"  v-else>
           Expired
          </span>
          
        </div>
    
        <div class="description">
          Description:{{description}}
        </div>
        
        <div class="login-wrap" v-if="expireDisable">
          <input type="submit" @click="submitBid" class="btn-login" value="Bid By $5.00"></input>
        </div>
        <div class="login-wrap" v-else>
           <input type="submit" class="btn-login" value="EXPIRED"></input>
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
  .line {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
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
    float: left;
    line-height: 20px;
    color: #d1434a;
    font-size: 1em;  
  }
  .text {
    float: left;
    line-height: 20px;
    color: #605F5F;
    font-size: 1em;  
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
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    itemModalFlag() {
      return this.$store.state.itemModalFlag;
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
    },
    expireDisable() {
      if (this.$store.state.expire <= 0) {
        return false;
      }
      return true;
    }
  },
  sockets: {
    newBid2(item) {
      console.log('newbid2',item.winner);
      this.$store.commit("bid",item);
    }
  },
  methods: {
    submitBid() {
      const bid = 5;
         axios.post("/items/bid",{
            fullname: this.$store.state.nickName,
            productId: this.$store.state.productID,
            bidPrice: this.$store.state.price + bid,
            fullname: this.$store.state.nickName,
        }).then((res)=>{
            if(res.status==200){
                var item = {
                  bid: bid,
                  winner: this.$store.state.nickName,
                  productId: this.$store.state.productID,
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