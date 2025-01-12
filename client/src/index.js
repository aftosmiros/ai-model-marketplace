import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Стили вашего приложения
import App from './App'; // Главный компонент приложения

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
