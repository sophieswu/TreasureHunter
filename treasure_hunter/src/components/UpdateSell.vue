<template>
  <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':updateModalFlag}">
    <div class="md-modal-inner">
      <div class="md-top">
        <div class="md-title">Edit Listing</div>
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
              <input type="text" tabindex="1" name="name" v-model="name" class="regi_login_input regi_login_input_left" v-bind:placeholder="product ? product.productName: ''" data-type="loginname" required>
            </li>

            <li class="regi_form_input noMargin">
            <i class="icon IconPwd"></i>
            <input type="text" tabindex="2" name="price" v-model="price" class="regi_login_input regi_login_input_left login-input-no input_text" v-bind:placeholder="product ? product.productPrice: ''">
          </li>

            <li class="regi_form_input noMargin">
            <i class="icon IconPwd"></i>
            <input type="text" tabindex="3" name="description" v-model="description" class="regi_login_input regi_login_input_left login-input-no input_text" v-bind:placeholder="product ? product.productDescription: ''">
            <li class="regi_form_input noMargin">
              <i class="icon IconPwd"></i>
              <input type="file" tabindex="4" name="image" id="image-upload" @change="onFileChange" multiple class="regi_login_input regi_login_input_left login-input-no input_text">
            </li>
          </ul>
        </div>
        <div class="login-wrap">
          <input type="submit" class="btn-login" @keyup.enter="updateSell" @click="updateSell" value="Update"></input>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md-modal {
    width: 450px;
  }
 .radio {
    border: none;
  }
</style>

<script>
  import FormData from 'form-data'
  import './../assets/css/login.css'
  import axios from 'axios'
export default {
  props:['product'] ,
  data() {
    return {
      editproduct: product,
      name : '',
      price: '',
      description: '',
      file: null,
      isAuction: '',
      expire: 0,
      errorTip : false,
      errorMsg : '',
    }
  },
  computed: {
    updateModalFlag() {
      return this.$store.state.updateModalFlag;
    },
  },
  methods: {
    messageModalUpdate() {
      this.$store.commit("messageModalUpdate",  "");
    },
    clearOutForm() {
      this.name = '';
      this.price= '';
      this.description = '',
      this.file = null,
      this.errorTip = false;
      this.errorMsg = '';
    },

    updateSell() {
        if (!(this.name && this.price ) ) {
          this.errorTip = true;
          this.errorMsg = "form missing or incorrect";
          return;
      }

      let data = new FormData();
      data.append('file', this.file);
      data.append('name', this.name);
      data.append('price', this.price);
      data.append('productDescription', this.description);

      axios.post("/items/updateSell", data, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
        }).then((response) => {
              let res = response.data;
              this.$store.commit("sellModalUpdate",);
              this.clearOutForm();
        }).catch((err) => {
            this.errorTip = true;
            this.errorMsg = err.message;
        });
      },
 
      onFileChange(event) {
        this.file = event.target.files[0]
      },

      closeForm(){
          this.clearOutForm();
          this.$store.commit("updateModalUpdate");
          return true;
      },
  },
  components: {
  }
}
</script>