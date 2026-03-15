document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('landmarks-container');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('#filterButtons span');
    
    let allLandmarks = [];

    // Завантаження бази даних
    async function fetchLandmarks() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Помилка завантаження даних');
            allLandmarks = await response.json();
            renderLandmarks(allLandmarks);
        } catch (error) {
            console.error('Помилка:', error);
            container.innerHTML = `<div class="glass-panel" style="text-align:center; width: 100%;">Помилка завантаження даних. Переконайтеся, що ви запускаєте сайт через локальний сервер.</div>`;
        }
    }

    // Відмальовка карток на сторінці
    function renderLandmarks(landmarks) {
        container.innerHTML = ''; 
        if(landmarks.length === 0) {
            container.innerHTML = '<div style="text-align:center; width: 100%; grid-column: 1 / -1;">За вашим запитом нічого не знайдено 😔</div>';
            return;
        }

        landmarks.forEach(place => {
            const card = document.createElement('div');
            card.className = 'card glass-panel';

            let buttonsHtml = '';
            
            if (place.hasAR) {
                buttonsHtml += `<a href="${place.arUrl}" class="btn btn-ar">📷 3D (AR)</a>`;
            }
            // Додаємо кнопку аудіогіда для всіх
            buttonsHtml += `<button class="btn btn-audio" onclick="alert('Аудіогід в розробці 🎧')">🎧 Аудіо</button>`;

            card.innerHTML = `
                <div>
                    <h3>${place.title} ${place.emoji}</h3>
                    <div class="location">📍 ${place.location}</div>
                    <p>${place.description}</p>
                </div>
                <div class="buttons" style="display: flex; gap: 10px; margin-top: 15px;">
                    ${buttonsHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Реалізація пошуку тексту
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        // Візуально скидаємо фільтри категорій на "Всі"
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        const filtered = allLandmarks.filter(place => 
            place.title.toLowerCase().includes(term) || 
            place.description.toLowerCase().includes(term) ||
            place.location.toLowerCase().includes(term)
        );
        renderLandmarks(filtered);
    });

    // Реалізація фільтрації за категоріями
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            searchInput.value = ''; // Очищаємо пошук при кліку на категорію

            const category = button.getAttribute('data-filter');
            if (category === 'all') {
                renderLandmarks(allLandmarks);
            } else {
                const filtered = allLandmarks.filter(place => place.category === category);
                renderLandmarks(filtered);
            }
        });
    });

    // Старт роботи скрипта
    fetchLandmarks();
});
