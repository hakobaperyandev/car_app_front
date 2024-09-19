<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Page Header -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-semibold text-gray-800">Car Listings</h1>
      <div v-if="user">
        <p class="text-gray-600">Logged in as: {{ user }} </p>
        <button @click="logout" class="ml-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <!-- Brand Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Brand</label>
          <select v-model="filters.brand_id" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm">
            <option value="">All Brands</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          </select>
        </div>

        <!-- Year Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Year from</label>
          <input type="number" v-model="filters.year_from" placeholder="Year from" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Year to</label>
          <input type="number" v-model="filters.year_to" placeholder="Year to" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm" />
        </div>

        <!-- Price Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Price</label>
          <div class="flex space-x-2">
            <input type="number" v-model="filters.price_min" placeholder="Min" min="1000" max="1000000" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm" />
            <input type="number" v-model="filters.price_max" placeholder="Max" min="1000" max="1000000" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm" />
          </div>
        </div>

        <!-- Engine Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Engine Type</label>
          <select v-model="filters.engine_id" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm">
            <option value="">All</option>
            <option v-for="engineType in engineTypes" :key="engineType.id" :value="engineType.id">{{ engineType.type }}</option>
          </select>
        </div>

        <!-- Transmission Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Transmission</label>
          <select v-model="filters.transmission_id" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm">
            <option value="">All</option>
            <option v-for="transmissionType in transmissionTypes" :key="transmissionType.id" :value="transmissionType.id">{{ transmissionType.type }}</option>
          </select>
        </div>

        <!-- Exterior Color Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Exterior Color</label>
          <select v-model="filters.exterior_color" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm">
            <option value="">All Colors</option>
            <option v-for="color in exteriorColors" :key="color" :value="color">{{ color }}</option>
          </select>
        </div>

        <!-- Interior Color Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Interior Color</label>
          <select v-model="filters.interior_color" class="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm">
            <option value="">All Colors</option>
            <option v-for="color in interiorColors" :key="color" :value="color">{{ color }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 text-right">
        <button @click="applyFilters" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Apply Filters</button>
        <button @click="clearFilters" class="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300">Clear</button>
      </div>
    </div>

    <!-- Car Listings -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Cars List</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="car in filteredCars" :key="car.id" class="bg-white border rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ car.brand.name }}</h3>
          <p class="text-gray-700">Year: {{ car.year }}</p>
          <p class="text-gray-700">Price: ${{ car.price }}</p>
          <p class="text-gray-700">Engine: {{ car.engine.type }}</p>
          <p class="text-gray-700">Transmission: {{ car.transmission.type }}</p>
          <p class="text-gray-700">Exterior Color: {{ car.exterior_color }}</p>
          <p class="text-gray-700">Interior Color: {{ car.interior_color }}</p>
        </div>
      </div>
    </div>
    <!-- Pagination -->
    <div class="flex justify-center items-center mt-6">
      <div class="flex space-x-2">
        <button
          v-for="link in paginationLinks"
          :key="link.label"
          @click="fetchCars(link.url)"
          :disabled="link.active"
          :class="['px-4 py-2 ', link.active ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600']"
        >
          {{ link.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from '@/utils/url';
import axios from 'axios'
export default {
  data() {
    return {
      filters: {
        brand_id: '',
        year_from: '',
        year_to: '',
        price_min: '',
        price_max: '',
        engine_id: '',
        transmission_id: '',
        exterior_color: '',
        interior_color: '',
      },
      brands: [], 
      models: [], 
      exteriorColors: [], 
      interiorColors: [], 
      filteredCars: [], 
      engineTypes: [],
      transmissionTypes:[],
      user: null,
      token: ''
    };
  },
  methods: {
    async fetchCars(url = 'http://127.0.0.1:8000/api/cars') {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.cars = response.data.data.data || [];
        this.nextPageUrl = response.data.data.next_page_url;
        this.prevPageUrl = response.data.data.prev_page_url;
        this.paginationLinks = response.data.data.links;
        this.filteredCars = [...this.cars];
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    },
    async fetchBrands() {
      try {
        const response = await axios.get(BASE_URL + '/api/brands', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.brands = response.data.data;      
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async fetchEngineTypes() {
      try {
        const response = await axios.get(BASE_URL + '/api/engines-list', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.engineTypes = response.data.data;      
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async fetchTransmissionTypes() {
      try {
        const response = await axios.get(BASE_URL+'/api/transmissions-list', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.transmissionTypes = response.data.data;      
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async fetchInteriorColors() {
      try {
        const response = await axios.get(BASE_URL+'/api/interior-colors', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.interiorColors = response.data.data;      
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async fetchExteriorColors() {
      try {
        const response = await axios.get(BASE_URL+'/api/exterior-colors', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.exteriorColors = response.data.data; 
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async applyFilters() {
      try {
          const response = await axios.post(BASE_URL+'/api/filter/cars', {
            brand_id: this.filters.brand_id,
            year_from: this.filters.year_from,
            year_to: this.filters.year_to,
            price_min: this.filters.price_min,
            price_max: this.filters.price_max,
            engine_id: this.filters.engine_id,
            transmission_id: this.filters.transmission_id,
            exterior_color: this.filters.exterior_color,
            interior_color: this.filters.interior_color
          }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
          
          this.cars = response.data.data.data || [];
          this.nextPageUrl = response.data.data.next_page_url;
          this.prevPageUrl = response.data.data.prev_page_url;
          this.paginationLinks = response.data.data.links;
          this.filteredCars = [...this.cars];
        } catch (error) {
          console.error("Error fetching cars:", error);
        }
    
    },
    clearFilters() {
      this.filters = {
        brand: '',
        model: '',
        year: '',
        price_min: '',
        price_max: '',
        engine_type: '',
        transmission: '',
        exterior_color: '',
        interior_color: '',
      };
      this.fetchCars()
    },
    checkLoggedInUser() {
      const storedUser = localStorage.getItem('user_name');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        this.user = storedUser;
        this.token = storedToken;
      } else {
        console.log('No logged-in user found');
      }
    },
    async logout() {
      

      if (!this.token) {
        return;
      }

      try {
        await axios.post(BASE_URL+'/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('is_admin');
        
        this.$router.push({ name: 'login' });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  },
  
  created(){
    this.checkLoggedInUser();
    this.fetchCars();
    this.fetchBrands();
    this.fetchEngineTypes();
    this.fetchTransmissionTypes();
    this.fetchExteriorColors();
    this.fetchInteriorColors()
  },
};

  </script>