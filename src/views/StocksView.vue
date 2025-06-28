<template>
  <div class="stocks">
    <h1>Склады</h1>
    <div class="filters">
      <div class="filter-group">
        <label for="dateFrom">Дата:</label>
        <input type="date" id="dateFrom" v-model="filters.dateFrom" @change="fetchData" />
      </div>
      <div class="filter-group">
        <label for="search">Поиск:</label>
        <input type="text" id="search" v-model="searchQuery" placeholder="Поиск по названию" @input="applySearch" />
      </div>
    </div>
    
    <div class="chart-container">
      <canvas ref="chart"></canvas>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Название</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>Склад</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredStocks" :key="item.id">
            <td>{{ item.barcode }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }} {{ item.currency }}</td>
            <td>{{ item.warehouseName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
      <span>Страница {{ currentPage }}</span>
      <button @click="nextPage" :disabled="!hasMore">Вперед</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

export default {
  name: 'StocksView',
  setup() {
    const stocks = ref([]);
    const filteredStocks = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 20;
    const chart = ref(null);
    const searchQuery = ref('');
    const hasMore = ref(true);
    
    const filters = ref({
      dateFrom: format(new Date(), 'yyyy-MM-01'), // Первое число текущего месяца
      dateTo: format(new Date(), 'yyyy-MM-dd')
    });
    
    const fetchData = async () => {
      try {
        // Используем вчерашнюю дату, так как API не принимает сегодняшнюю
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const response = await axios.get('/api/stocks', {
          params: {
            dateFrom: format(yesterday, 'yyyy-MM-dd')
          }
        });
        
        console.log('Ответ сервера:', response.data);
        
        if (response.data && response.data.data) {
          stocks.value = response.data.data;
          applySearch();
          updateChart();
          
          // Проверяем, есть ли еще страницы с данными
          hasMore.value = response.data.data && response.data.data.length === itemsPerPage;
        } else {
          console.error('Неверный формат ответа от сервера:', response.data);
          stocks.value = [];
          filteredStocks.value = [];
        }
      } catch (error) {
        console.error('Полная информация об ошибке:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
            data: error.config?.data
          }
        });
        
        // Очищаем данные при ошибке
        stocks.value = [];
        filteredStocks.value = [];
        hasMore.value = false;
      }
    };
    
    const applySearch = () => {
      if (!searchQuery.value.trim()) {
        filteredStocks.value = [...stocks.value];
      } else {
        const query = searchQuery.value.toLowerCase();
        filteredStocks.value = stocks.value.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.barcode.toString().includes(query)
        );
      }
    };
    
    let chartInstance = null;
    
    const updateChart = () => {
      if (chart.value && filteredStocks.value.length > 0) {
        const ctx = chart.value.getContext('2d');
        
        // Уничтожаем предыдущий график, если он существует
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Группируем по складам
        const warehouseData = filteredStocks.value.reduce((acc, item) => {
          if (!acc[item.warehouseName]) {
            acc[item.warehouseName] = 0;
          }
          acc[item.warehouseName] += item.quantity;
          return acc;
        }, {});
        
        // Сортируем по убыванию количества
        const sortedWarehouses = Object.entries(warehouseData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10); // Берем топ-10
        
        chartInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: sortedWarehouses.map(([name]) => name),
            datasets: [{
              data: sortedWarehouses.map(([_, count]) => count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(199, 199, 199, 0.7)',
                'rgba(83, 102, 255, 0.7)',
                'rgba(40, 159, 64, 0.7)',
                'rgba(210, 99, 132, 0.7)'
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Распределение товаров по складам'
              }
            }
          }
        });
      }
    };
    
    const nextPage = () => {
      currentPage.value++;
      fetchData();
    };
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchData();
      }
    };
    
    onMounted(() => {
      fetchData();
    });
    
    // Уничтожаем график при размонтировании компонента
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });
    
    return {
      stocks: filteredStocks,
      filteredStocks,
      filters,
      currentPage,
      chart,
      searchQuery,
      hasMore,
      fetchData,
      applySearch,
      nextPage,
      prevPage
    };
  }
};
</script>

<style scoped>
.filters {
  margin: 20px 0;
  display: flex;
  gap: 15px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input[type="text"] {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chart-container {
  margin: 30px 0;
  height: 400px;
  max-width: 600px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  position: sticky;
  top: 0;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  align-items: center;
}

button {
  padding: 5px 15px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #3aa876;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.table-container {
  max-height: 500px;
  overflow-y: auto;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
