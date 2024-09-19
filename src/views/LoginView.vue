<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold">Login to your account</h1>
          </div>
          <form @submit.prevent="login">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div class="relative">
                <input
                  type="email"
                  v-model="email"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="Email address"
                  required
                />
                <label
                  for="email"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Email Address
                </label>
                <p v-if="errors.email" class="text-red-500 text-sm mt-2">{{ errors.email[0] }}</p>
              </div>

              <div class="relative">
                <input
                  type="password"
                  v-model="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="Password"
                  required
                />
                <label
                  for="password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Password
                </label>
                <p v-if="errors" class="text-red-500 text-sm mt-2">{{ errors }}</p>
              </div>

              <div class="relative">
                <button
                  type="submit"
                  class="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-300"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { BASE_URL } from '@/utils/url';
export default {
  data() {
    return {
      email: '',
      password: '',
      errors: ''
    };
  },
  methods: {
    async login() {
      try {
        this.errors = ''
        const response = await axios.post(BASE_URL + '/api/login', {
          email: this.email,
          password: this.password
        });

        const {token, user, isAdmin} = response.data
        localStorage.setItem('token', token);
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('is_admin', isAdmin);
        
        if (isAdmin) {
          this.$router.push('/admin')
        }else {
          this.$router.push('/dashboard')
        }

      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errors = error.response.data.message;
        }
      }
    }
  }
};
</script>
