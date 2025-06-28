<template>
  <div class="orders">
    <h1>Заказы</h1>
    <div class="filters">
      <div class="filter-group">
        <label for="dateFrom">Дата с:</label>
        <input type="date" id="dateFrom" v-model="filters.dateFrom" />
      </div>
      <div class="filter-group">
        <label for="dateTo">Дата по:</label>
        <input type="date" id="dateTo" v-model="filters.dateTo" />
      </div>
      <button @click="fetchData">Применить фильтры</button>
    </div>
    
    <div class="chart-container">
      <canvas ref="chart"></canvas>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID заказа</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.price }} {{ item.currency }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
      <span>Страница {{ currentPage }}</span>
      <button @click="nextPage">Вперед</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

export default {
  name: 'OrdersView',
  setup() {
    const orders = ref([]);
    const currentPage = ref(1);
    const chart = ref(null);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const filters = ref({
      dateFrom: format(new Date(), 'yyyy-MM-01'),
      dateTo: format(yesterday, 'yyyy-MM-dd')
    });
    
    const fetchData = async () => {
      try {
        const response = await axios.get('http://109.73.206.144:6969/api/orders', {
          params: {
            ...filters.value,
            page: currentPage.value,
            key: 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
          }
        });
        orders.value = response.data.data;
        updateChart();
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };
    
    let chartInstance = null;
    
    const updateChart = () => {
      if (chart.value) {
        const ctx = chart.value.getContext('2d');
        
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Агрегируем данные для графика: сумма заказов по датам
        const ordersByDate = orders.value.reduce((acc, order) => {
          try {
            const date = format(new Date(order.date), 'dd.MM.yyyy');
            if (!acc[date]) {
              acc[date] = 0;
            }
            acc[date] += parseFloat(order.price) || 0;
          } catch (e) {
            console.error('Ошибка при обработке заказа:', order, e);
          }
          return acc;
        }, {});
        
        // Сортируем даты в хронологическом порядке
        const labels = Object.keys(ordersByDate).sort((a, b) => 
          new Date(a.split('.').reverse().join('-')) - new Date(b.split('.').reverse().join('-'))
        );
        const data = labels.map(date => ordersByDate[date]);
        
        const chartData = {
          labels,
          datasets: [{
            label: 'Сумма заказов',
            data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };
        
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    };
    
    const formatDate = (dateString) => {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
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
      orders,
      filters,
      currentPage,
      chart,
      fetchData,
      formatDate,
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
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.chart-container {
  margin: 30px 0;
  height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

button {
  padding: 5px 15px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
