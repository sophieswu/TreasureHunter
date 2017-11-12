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
        <div class="line text">Current Bid: <span class="value">${{price}}</span></div>
        <br/>
        <div class="price text line" >
          <span >Time left:</span> 
          <countdown class="value" :time="24 * 60 * 60 * 1000">
            <template slot-scope="props">{{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}.</template>
          </countdown>
        </div>
    
        <div class="description">
          Description:{{description}}
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
  .text {
    color: #666;
  }
  .price {
  
    clear:both;
    color: #333
 

  }
  .line {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    float: left;
    line-height: 8px;
    font-size: 1.25em;
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
  }


</style>

<script>
import countdown from '@xkeshi/vue-countdown';


export default {
  data() {
    var now = new Date();
    var newYear = new Date(now.getFullYear() + 1, 0, 1);
    return {
      time: newYear - now,
    }
  },
  computed: {
    message() {
      // return this.$store.state.message;
    },
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
      return this.$store.state.name;
    }
    

  },
  methods: {
    submitBid() {

    },
    click() {

    },
    itemModalUpdate() {
      this.$store.commit("itemModalUpdate");
      this.$store.commit("closePop");
    }
  },
  components: {
    countdown
  }
}
</script>