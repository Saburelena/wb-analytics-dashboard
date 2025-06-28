<template>
  <div id="app">
    <header>
      <div class="header-content">
        <h1>Wildberries Analytics Dashboard</h1>
        <nav>
          <RouterLink to="/">Главная</RouterLink>
          <RouterLink to="/incomes">Доходы</RouterLink>
          <RouterLink to="/orders">Заказы</RouterLink>
          <RouterLink to="/sales">Продажи</RouterLink>
          <RouterLink to="/stocks">Склады</RouterLink>
        </nav>
      </div>
    </header>
    <main>
      <RouterView></RouterView>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 0 auto;
  max-width: 1200px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

header {
  width: 100%;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.header-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  gap: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin: 1rem 0 1rem;
  padding: 0 1rem;
  font-size: 1.5rem;
  white-space: nowrap;
}

nav {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
  flex-wrap: nowrap;
  gap: 1.5rem;
  margin-left: 0;
  align-items: center;
  padding-right: 0;
}

nav a {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem 0;
  position: relative;
  font-weight: 500;
}

nav a.router-link-exact-active {
  color: #42b983;
}

nav a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #42b983;
  border-radius: 3px 3px 0 0;
}

main {
  flex: 1;
  padding: 1.5rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* Глобальные стили для таблиц */
.table-container {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  background: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
  color: #333;
  background: white;
}

th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  z-index: 10;
}

tr:hover {
  background-color: #f5f5f5;
}

/* Стили для фильтров */
.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.filter-group {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #2c3e50;
  min-width: 80px;
  display: inline-block;
}

.filter-group input[type="date"] {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #333;
}

.pagination {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.pagination button {
  padding: 0.4rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.pagination button:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.pagination button:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination span {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 60px;
  text-align: center;
  padding: 0.3rem 0.8rem;
  background: #f8f9fa;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.filters button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.filters button:hover {
  background-color: #3aa876;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: 0;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
  }
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin: 1rem 0 1rem;
  padding: 0 1rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  nav {
    padding: 0.75rem 1rem;
  }
  
  nav a {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  
  main {
    padding: 1.5rem 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin: 0.5rem 0 1.5rem;
  }
}
</style>


