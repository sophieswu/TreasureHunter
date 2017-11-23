<template>
  <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':sellModalFlag}">
    <div class="md-modal-inner">



        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">Add</div>
            <button class="md-close" @click="registerModalFlag=closeForm()">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show" v-if="errorTip">{{errorMsg}}</span>
              </div>

              <ul>
                <li class="regi_form_input">
                  <i class="icon IconPeople"></i>
                  <input type="text" tabindex="1" name="name" v-model="name" class="regi_login_input regi_login_input_left" placeholder="Name" data-type="loginname" required>
                </li>

                <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="text" tabindex="2" name="price" v-model="price" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Price" >
              </li>

                <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="text" tabindex="3" name="description" v-model="description" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Des" >
              </li>

                <li class="regi_form_input noMargin">
                  <i class="icon IconPwd"></i>
                  <input type="text" tabindex="4" name="id" v-model="id" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Id" >
                </li>
              </ul>
            </div>
            <div class="login-wrap">
              <input type="submit" class="btn-login" @keyup.enter="addSell" @click="addSell" value="Add"></input>
            </div>
          </div>
        </div>

    </div>
  </div>

</template>

<style>
  .md-modal {
    width: 450px;
  }
</style>

<script>
    import './../assets/css/login.css'
    import axios from 'axios'
export default {
  data() {
    return {
        name : '',
        price: '',
        errorTip : false,
        errorMsg : '',
        description: '',
        id:''


    }
  },
  computed: {

    sellModalFlag() {
      return this.$store.state.sellModalFlag;
    },

  },
  methods: {
    messageModalUpdate() {
      this.$store.commit("messageModalUpdate",  "");
    },
      clearOutForm() {
          this.name = '',
          this.price= '',
              this.errorTip = false,
              this.errorMsg = '',
              this.description= '',
              this.id=''
      },
      addSell() {
          if (!(this.name && this.price ) ) {
              this.errorTip = true;
              this.errorMsg = "form missing or incorrect";
              return;
          }

          let param = {
              name: this.name,
              price: this.price,
              owner: this.$store.state.nickName,
              productDescription: this.description,
              productId: this.id
          };

          axios.post("/items/addSell", param).then((response) => {
              let res = response.data;
              this.$store.commit("sellModalUpdate",);
              this.clearOutForm();
          }).catch((err) => {
              this.errorTip = true;
              this.errorMsg = err.message;
          });
      },
      clearOutFom() {
          this.name = '',
          this.price =  0,
          this.errorMsg = '';
          this.errorTip = false;
      },

      closeForm(){
          this.clearOutFom();
          this.$store.commit("sellModalUpdate",);
      },
  },
  components: {
  }
}
</script>