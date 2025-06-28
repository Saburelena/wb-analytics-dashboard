<template>
  <div class="incomes">
    <h1>Доходы</h1>
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
            <th>ID</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Валюта</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in incomes" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.currency }}</td>
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
import { Chart } from 'chart.js/auto';
import axios from 'axios';

export default {
  name: 'IncomesView',
  setup() {
    const incomes = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const chart = ref(null);
    let chartInstance = null;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const filters = ref({
      dateFrom: format(new Date(), 'yyyy-MM-01'),
      dateTo: format(yesterday, 'yyyy-MM-dd')
    });
    
    const fetchData = async () => {
      try {
        const response = await axios.get('http://109.73.206.144:6969/api/incomes', {
          params: {
            ...filters.value,
            page: currentPage.value,
            key: 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
          }
        });
        incomes.value = response.data.data;
        updateChart();
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    
    const updateChart = () => {
      if (chart.value) {
        const ctx = chart.value.getContext('2d');
        
        // Уничтожаем предыдущий график, если он существует
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Группируем доходы по дате
        const incomesByDate = incomes.value.reduce((acc, income) => {
          try {
            const date = format(new Date(income.date), 'dd.MM.yyyy');
            if (!acc[date]) {
              acc[date] = 0;
            }
            acc[date] += parseFloat(income.amount) || 0;
          } catch (e) {
            console.error('Ошибка при обработке дохода:', income, e);
          }
          return acc;
        }, {});
        
        // Сортируем даты для правильного отображения на графике
        const sortedDates = Object.keys(incomesByDate).sort((a, b) => {
          return new Date(a.split('.').reverse().join('-')) - new Date(b.split('.').reverse().join('-'));
        });
        
        const chartData = {
          labels: sortedDates,
          datasets: [{
            label: 'Сумма доходов',
            data: sortedDates.map(date => incomesByDate[date]),
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };
        
        chartInstance = new Chart(ctx, {
          type: 'bar',
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
      return format(new Date(dateString), 'dd.MM.yyyy');
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
      incomes,
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
