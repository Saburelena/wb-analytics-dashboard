<template>
  <div class="home">
    <div class="welcome">
      <h1>Добро пожаловать в Wildberries Analytics Dashboard</h1>
      <p class="subtitle">Используйте навигационное меню выше для перехода к интересующим разделам:</p>
      
      <div class="features">
        <div class="feature-card">
          <h3>Доходы</h3>
          <p>Анализ доходов по датам и категориям</p>
          <router-link to="/incomes" class="btn">Перейти</router-link>
        </div>
        
        <div class="feature-card">
          <h3>Заказы</h3>
          <p>Просмотр и анализ заказов</p>
          <router-link to="/orders" class="btn">Перейти</router-link>
        </div>
        
        <div class="feature-card">
          <h3>Продажи</h3>
          <p>Анализ продаж и динамики</p>
          <router-link to="/sales" class="btn">Перейти</router-link>
        </div>
        
        <div class="feature-card">
          <h3>Склады</h3>
          <p>Учет остатков на складах</p>
          <router-link to="/stocks" class="btn">Перейти</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
}

.welcome {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.btn {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #3aa876;
}

/* Адаптивность */
@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
