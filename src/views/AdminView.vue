<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg">
      <p>Car created successfully!</p>
      <button @click="closeToast" class="absolute top-1 right-1 text-white font-bold">x</button>
    </div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-lg font-medium">Welcome {{ user }} </p>
      <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
    </div>

    <!-- Car Form -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-2xl font-semibold mb-4">Create New Car</h2>
      <form @submit.prevent="submitCarForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Brand -->
          <div>
            <label for="brand_id" class="block text-sm font-medium text-gray-700">Brand</label>
            <select v-model="car.brand_id" id="brand_id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Select a brand</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
            </select>
            <p v-if="errors.brand_id" class="text-red-500 text-sm mt-1">{{ errors.brand_id[0] }}</p>
          </div>

          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input v-model="car.price" min="1000" max="2000000" type="number" id="price" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price[0] }}</p>
          </div>

          <!-- Year -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
            <input v-model="car.year" min="2000" type="number" id="year" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            <p v-if="errors.year" class="text-red-500 text-sm mt-1">{{ errors.year[0] }}</p>
          </div>

          <!-- Engine -->
          <div>
            <label for="engine_id" class="block text-sm font-medium text-gray-700">Engine</label>
            <select v-model="car.engine_id" id="engine_id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Select an engine</option>
              <option v-for="engine in engineTypes" :key="engine.id" :value="engine.id">{{ engine.type }}</option>
            </select>
            <p v-if="errors.engine_id" class="text-red-500 text-sm mt-1">{{ errors.engine_id[0] }}</p>
          </div>

          <!-- Transmission -->
          <div>
            <label for="transmission_id" class="block text-sm font-medium text-gray-700">Transmission</label>
            <select v-model="car.transmission_id" id="transmission_id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Select a transmission</option>
              <option v-for="transmission in transmissionTypes" :key="transmission.id" :value="transmission.id">{{ transmission.type }}</option>
            </select>
            <p v-if="errors.transmission_id" class="text-red-500 text-sm mt-1">{{ errors.transmission_id[0] }}</p>
          </div>

          <!-- Exterior Color -->
          <div>
            <label for="exterior_color" class="block text-sm font-medium text-gray-700">Exterior Color</label>
            <input v-model="car.exterior_color" type="text" id="exterior_color" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            <p v-if="errors.exterior_color" class="text-red-500 text-sm mt-1">{{ errors.exterior_color[0] }}</p>
          </div>

          <!-- Interior Color -->
          <div>
            <label for="interior_color" class="block text-sm font-medium text-gray-700">Interior Color</label>
            <input v-model="car.interior_color" type="text" id="interior_color" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            <p v-if="errors.interior_color" class="text-red-500 text-sm mt-1">{{ errors.interior_color[0] }}</p>
          </div>
        </div>

        <div class="mt-4">
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create Car</button>
        </div>
      </form>
    </div>

    <!-- Cars List -->
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Cars List</h2>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engine</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transmission</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exterior Color</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interior Color</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="car in cars" :key="car.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ car.brand.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ car.price }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ car.year }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ car.engine.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ car.transmission.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ car.exterior_color }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ car.interior_color }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from '@/utils/url';
import axios from 'axios';
export default {
  data() {
    return {
      car: {
        brand_id: null,
        price: '',
        year: '',
        engine_id: null,
        transmission_id: null,
        exterior_color: '',
        interior_color: '',
      },
      brands: [],
      engineTypes: [],
      transmissionTypes: [],
      cars: [],
      errors: {},
      showToast: false,
      user: null,
      token: ''
    };
  },
  created() {
    this.checkLoggedInUser();
    this.fetchCars();
    this.fetchBrands();
    this.fetchEngineTypes();
    this.fetchTransmissionTypes();
    
  },
  methods: {
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
        const response = await axios.get(BASE_URL + '/api/engines', {
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
        const response = await axios.get(BASE_URL + '/api/transmissions', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.transmissionTypes = response.data.data;      
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async fetchCars() {
      try {
        const response = await axios.get(BASE_URL + '/api/cars', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.cars = response.data.data;
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    },
    async submitCarForm() {
      try {
        
        let response = await axios.post(BASE_URL + '/api/cars', this.car, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        
        this.showToast = true;
        this.car = {
          brand_id: null,
          price: '',
          year: '',
          engine_id: null,
          transmission_id: null,
          exterior_color: '',
          interior_color: '',
        };
        this.errors = {}
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        this.fetchCars(); 
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          console.error('Error creating car model:', error);
        }
      }
    },
    closeToast() {
      this.showToast = false;
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
};
</script>