document.addEventListener('DOMContentLoaded', function () {
    const questions = [
        { q: "¿Qué representa la frecuencia relativa (hᵢ) de un valor?", opts: ["El número de veces que aparece el valor", "La proporción del total que representa ese valor", "La suma de frecuencias hasta ese valor", "El punto medio del intervalo"], ans: 1 },
        { q: "Si un dato tiene frecuencia absoluta acumulada F₃ = 39 con n = 50, ¿qué significa?", opts: ["39 datos tienen exactamente ese valor", "39 de los 50 datos son menores o iguales al límite de esa clase", "El 39% de los datos son mayores a ese valor", "Hay 39 clases en la tabla"], ans: 1 },
        { q: "La regla de Sturges se usa para calcular:", opts: ["La frecuencia relativa", "El número de clases (k) al agrupar datos", "La marca de clase", "El rango de los datos"], ans: 1 },
        { q: "¿Por qué NO se incluyen frecuencias acumuladas en variables nominales?", opts: ["Porque no tienen suficientes datos", "Porque las categorías nominales no tienen un orden", "Porque las frecuencias serían negativas", "Porque el total no sumaría 100%"], ans: 1 },
        { q: "¿Cuál es la diferencia principal entre un gráfico de barras y un histograma?", opts: ["El histograma usa colores diferentes", "Las barras del histograma van pegadas porque la variable es continua", "El gráfico de barras solo sirve para datos numéricos", "No hay diferencia, son lo mismo"], ans: 1 },
        { q: "Un gráfico circular (torta) es recomendable cuando:", opts: ["Hay más de 15 categorías", "Hay pocas categorías (5 o 6 como máximo) y se quiere mostrar composición del total", "La variable es cuantitativa continua", "Se necesita mostrar frecuencias acumuladas"], ans: 1 },
        { q: "La ojiva es un gráfico que se construye con:", opts: ["Las marcas de clase y las frecuencias absolutas", "El límite superior del intervalo y la frecuencia acumulada", "Las categorías y sus frecuencias porcentuales", "Solo los valores mínimo y máximo"], ans: 1 },
        { q: "¿Qué práctica de visualización es considerada engañosa?", opts: ["Empezar el eje vertical en cero", "Cortar el eje vertical para exagerar diferencias", "Usar histograma para variables continuas", "Etiquetar los ejes con sus unidades"], ans: 1 },
        { q: "La consulta SQL 'GROUP BY ... COUNT(*)' construye esencialmente:", opts: ["Una tabla de frecuencias", "Un histograma automático", "Una regla de Sturges", "Un polígono de frecuencias"], ans: 0 },
        { q: "Para la variable 'severidad del bug' (baja, media, alta, crítica), el gráfico más adecuado es:", opts: ["Histograma", "Ojiva", "Barras, respetando el orden natural de las categorías", "Polígono de frecuencias"], ans: 2 }
    ];

    function buildQuiz() {
        const container = document.getElementById('quiz-container');
        container.innerHTML = '';
        questions.forEach((q, i) => {
            const div = document.createElement('div');
            div.className = 'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200';
            div.innerHTML = `<p class="font-semibold text-slate-800 mb-3">${i + 1}. ${q.q}</p>
            <div class="space-y-2">${q.opts.map((o, j) =>
                `<label class="quiz-option flex items-center p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-green-50 transition-colors">
                    <input type="radio" name="q${i}" value="${j}" class="mr-3 accent-green-600">
                    <span class="text-slate-700">${o}</span></label>`).join('')}</div>
            <div class="feedback-${i} mt-2 text-sm font-medium hidden"></div>`;
            container.appendChild(div);
        });
    }
    buildQuiz();

    document.getElementById('submit-quiz-btn').addEventListener('click', function () {
        let score = 0;
        questions.forEach((q, i) => {
            const sel = document.querySelector(`input[name="q${i}"]:checked`);
            const fb = document.querySelector(`.feedback-${i}`);
            if (sel) {
                const val = parseInt(sel.value);
                if (val === q.ans) { score++; fb.textContent = '✅ ¡Correcto!'; fb.className = `feedback-${i} mt-2 text-sm font-medium text-green-700`; }
                else { fb.textContent = `❌ Incorrecto. Respuesta: "${q.opts[q.ans]}"`; fb.className = `feedback-${i} mt-2 text-sm font-medium text-red-700`; }
                fb.classList.remove('hidden');
            }
        });
        const pct = Math.round((score / questions.length) * 100);
        document.getElementById('quiz-result').innerHTML =
            `<div class="p-4 rounded-lg ${pct >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            Obtuviste <strong>${score} de ${questions.length}</strong> correctas (${pct}%).
            ${pct >= 70 ? '🎉 ¡Excelente dominio del tema!' : '📚 Revisa el contenido e inténtalo de nuevo.'}</div>`;
        document.getElementById('submit-quiz-btn').classList.add('hidden');
        document.getElementById('reset-quiz-btn').classList.remove('hidden');
    });
    document.getElementById('reset-quiz-btn').addEventListener('click', function () {
        document.getElementById('quiz-result').innerHTML = '';
        document.getElementById('submit-quiz-btn').classList.remove('hidden');
        document.getElementById('reset-quiz-btn').classList.add('hidden');
        buildQuiz();
    });
});
