document.addEventListener('DOMContentLoaded', function () {
    const casos = [
        { nombre: 'Sistema operativo de 200 usuarios (Android, iOS, Windows)', esOrdenada: false, esCategoria: true, resultado: 'Gráfico de barras o circular' },
        { nombre: 'Prioridad de tickets de soporte (P1, P2, P3, P4)', esOrdenada: true, esCategoria: true, resultado: 'Gráfico de barras, respetando el orden' },
        { nombre: 'Tiempos de carga de una página web (segundos, agrupados)', esOrdenada: null, esCategoria: false, resultado: 'Histograma, polígono de frecuencias u ojiva' },
        { nombre: 'Tamaño de archivos subidos al servidor (MB, agrupados)', esOrdenada: null, esCategoria: false, resultado: 'Histograma, polígono de frecuencias u ojiva' },
        { nombre: 'Tipo de error en pruebas de software (Lógico, Sintaxis, Ejecución, Interfaz)', esOrdenada: false, esCategoria: true, resultado: 'Gráfico de barras o circular' },
        { nombre: 'Nivel de severidad de un bug (baja, media, alta, crítica)', esOrdenada: true, esCategoria: true, resultado: 'Gráfico de barras, respetando el orden' },
        { nombre: 'Porcentaje de visitas que carga por debajo de cierto tiempo', esOrdenada: null, esCategoria: false, resultado: 'Ojiva (frecuencias acumuladas)' },
        { nombre: 'Departamento de la empresa (Ventas, Soporte, Desarrollo)', esOrdenada: false, esCategoria: true, resultado: 'Gráfico de barras o circular' }
    ];

    let orden = [];
    let idx = 0;
    let score = 0;
    let total = 0;

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function startGame() {
        orden = shuffle(casos);
        idx = 0; score = 0; total = 0;
        document.getElementById('game-final-result').classList.add('hidden');
        document.getElementById('game-next-btn').classList.add('hidden');
        updateScore();
        loadCaso();
    }

    function updateScore() {
        document.getElementById('game-score').textContent = `Puntaje: ${score} / ${total}`;
    }

    function updateProgress() {
        const pct = Math.round((idx / orden.length) * 100);
        document.getElementById('game-progress-fill').style.width = pct + '%';
    }

    function loadCaso() {
        if (idx >= orden.length) { showGameEnd(); return; }
        updateProgress();
        const c = orden[idx];
        document.getElementById('game-var-name').textContent = c.nombre;
        document.getElementById('game-final-result').classList.add('hidden');
        document.getElementById('game-next-btn').classList.add('hidden');
        renderStep1();
    }

    function renderStep1() {
        const c = document.getElementById('game-question-container');
        c.innerHTML = `
            <div class="game-step">
                <p class="font-semibold text-slate-700 mb-2">Paso 1. ¿La variable es cualitativa (categorías) o cuantitativa (números medidos o agrupados)?</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep1(true)">Cualitativa (categorías)</div>
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep1(false)">Cuantitativa (agrupada)</div>
                </div>
            </div>`;
    }

    window.gameAnswerStep1 = function (userSaysCategoria) {
        const c = orden[idx];
        total++;
        const correct = userSaysCategoria === c.esCategoria;
        markOptions(correct, userSaysCategoria ? 0 : 1);
        if (correct) score++;
        updateScore();
        setTimeout(() => {
            if (c.esCategoria) renderStep2(); else showResult(c);
        }, 900);
    };

    function renderStep2() {
        const c = document.getElementById('game-question-container');
        c.innerHTML += `
            <div class="game-step mt-4">
                <p class="font-semibold text-slate-700 mb-2">Paso 2. Es cualitativa. ¿Las categorías tienen un orden natural?</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep2(true)">Sí, tienen orden</div>
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep2(false)">No, no tienen orden</div>
                </div>
            </div>`;
    }

    window.gameAnswerStep2 = function (userSaysOrden) {
        const c = orden[idx];
        total++;
        const correct = userSaysOrden === c.esOrdenada;
        markOptions(correct, userSaysOrden ? 0 : 1);
        if (correct) score++;
        updateScore();
        setTimeout(() => showResult(c), 900);
    };

    function markOptions(correct, chosenIndex) {
        const steps = document.querySelectorAll('#game-question-container .game-step');
        const lastStep = steps[steps.length - 1];
        const allOpts = lastStep.querySelectorAll('.game-option');
        allOpts.forEach((el, i) => {
            el.classList.add('disabled');
            if (i === chosenIndex) el.classList.add(correct ? 'correct' : 'wrong');
        });
    }

    function showResult(c) {
        const box = document.getElementById('game-final-result');
        box.className = 'mt-4 pop-in bg-green-50 border-2 border-green-600 rounded-xl p-4 text-center';
        box.innerHTML = `
            <p class="text-sm text-slate-600">Gráfico recomendado para "<strong>${c.nombre}</strong>":</p>
            <p class="text-xl font-bold text-green-800 mt-1">${c.resultado}</p>`;
        box.classList.remove('hidden');
        document.getElementById('game-next-btn').classList.remove('hidden');
    }

    function showGameEnd() {
        updateProgress();
        document.getElementById('game-question-container').innerHTML = '';
        document.getElementById('game-var-name').textContent = 'Juego completado';
        const box = document.getElementById('game-final-result');
        const pct = total > 0 ? Math.round((score / total) * 100) : 0;
        box.className = `mt-4 pop-in rounded-xl p-5 text-center border-2 ${pct >= 70 ? 'bg-green-50 border-green-600' : 'bg-amber-50 border-amber-500'}`;
        box.innerHTML = `
            <p class="text-lg font-bold ${pct >= 70 ? 'text-green-800' : 'text-amber-800'}">Juego terminado</p>
            <p class="text-sm text-slate-600 mt-1">Acertaste ${score} de ${total} pasos (${pct}%).</p>`;
        box.classList.remove('hidden');
        document.getElementById('game-next-btn').classList.add('hidden');
    }

    document.getElementById('game-next-btn')?.addEventListener('click', function () {
        idx++;
        loadCaso();
    });
    document.getElementById('game-restart-btn')?.addEventListener('click', startGame);

    if (document.getElementById('game-var-card')) startGame();
});
