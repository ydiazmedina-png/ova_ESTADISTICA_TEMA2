document.addEventListener('DOMContentLoaded', function () {

    // ===== ACT 1: DRAG & DROP =====
    let draggedItem = null;

    document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
        });
        item.addEventListener('dragend', function () { this.classList.remove('dragging'); draggedItem = null; });
    });

    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); e.dataTransfer.dropEffect = 'move'; });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            if (draggedItem) {
                const prev = this.querySelector('.drag-item');
                if (prev) document.getElementById('drag-bank').appendChild(prev);
                this.appendChild(draggedItem);
            }
        });
    });

    const bank = document.getElementById('drag-bank');
    if (bank) {
        bank.addEventListener('dragover', e => { e.preventDefault(); bank.style.borderColor = '#15803d'; });
        bank.addEventListener('dragleave', () => bank.style.borderColor = '');
        bank.addEventListener('drop', e => {
            e.preventDefault(); bank.style.borderColor = '';
            if (draggedItem) bank.appendChild(draggedItem);
        });
    }

    const dragCorrect = {
        'zone-barras-circular': ['var-navegador', 'var-departamento'],
        'zone-barras-orden': ['var-severidad', 'var-prioridad'],
        'zone-histograma': ['var-latencia', 'var-tamano-archivo']
    };
    const dragOriginalOrder = ['var-navegador', 'var-departamento', 'var-severidad', 'var-prioridad', 'var-latencia', 'var-tamano-archivo'];

    document.getElementById('check-drag-btn')?.addEventListener('click', function () {
        let score = 0;
        const fb = document.getElementById('drag-feedback');
        let html = '';
        Object.entries(dragCorrect).forEach(([zoneId, correctIds]) => {
            const zone = document.getElementById(zoneId);
            if (!zone) return;
            const placed = Array.from(zone.querySelectorAll('.drag-item')).map(el => el.dataset.var);
            const zoneLabel = zone.dataset.label || zoneId;
            const isOk = JSON.stringify(placed.slice().sort()) === JSON.stringify(correctIds.slice().sort());
            if (isOk) score += correctIds.length;
            html += `<p class="${isOk ? 'text-green-700' : 'text-red-600'} text-sm">${isOk ? '✔' : '✘'} <strong>${zoneLabel}:</strong> ${isOk ? 'Correcto' : 'Revisa esta categoría'}</p>`;
        });
        const total = Object.values(dragCorrect).flat().length;
        fb.innerHTML = html + `<p class="font-bold mt-2 ${score >= total * 0.7 ? 'text-green-700' : 'text-amber-700'}">Puntuación: ${score}/${total}</p>`;
        fb.classList.remove('hidden');
    });

    document.getElementById('reset-drag-btn')?.addEventListener('click', function () {
        const bankEl = document.getElementById('drag-bank');
        dragOriginalOrder.forEach(varId => {
            const el = document.querySelector(`.drag-item[data-var="${varId}"]`);
            if (el) bankEl.appendChild(el);
        });
        const fb = document.getElementById('drag-feedback');
        fb.innerHTML = '';
        fb.classList.add('hidden');
    });

    // ===== ACT 2: CALCULADORA DE FRECUENCIAS =====
    document.getElementById('calc-frec-btn')?.addEventListener('click', function () {
        const inputs = document.querySelectorAll('.frec-input');
        const valores = Array.from(inputs).map(i => parseFloat(i.value) || 0);
        const n = valores.reduce((a, b) => a + b, 0);
        const nombres = Array.from(document.querySelectorAll('.frec-nombre')).map(i => i.value || 'Categoría');
        let acumulada = 0;
        let html = `<table class="w-full text-sm border-collapse mt-3">
            <thead><tr class="bg-green-800 text-white"><th class="p-2 text-left">Categoría</th><th class="p-2">fᵢ</th><th class="p-2">hᵢ</th><th class="p-2">%ᵢ</th><th class="p-2">Fᵢ</th></tr></thead><tbody>`;
        valores.forEach((v, i) => {
            acumulada += v;
            const h = n > 0 ? (v / n) : 0;
            html += `<tr class="${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}">
                <td class="p-2 font-semibold">${nombres[i]}</td>
                <td class="p-2 text-center">${v}</td>
                <td class="p-2 text-center">${h.toFixed(3)}</td>
                <td class="p-2 text-center">${(h * 100).toFixed(1)}%</td>
                <td class="p-2 text-center">${acumulada}</td>
            </tr>`;
        });
        html += `<tr class="bg-green-100 font-bold"><td class="p-2">Total</td><td class="p-2 text-center">${n}</td><td class="p-2 text-center">1.000</td><td class="p-2 text-center">100%</td><td class="p-2 text-center">—</td></tr>`;
        html += `</tbody></table>`;
        document.getElementById('frec-resultado').innerHTML = html;
        document.getElementById('frec-resultado').classList.remove('hidden');
    });

    document.getElementById('reset-frec-btn')?.addEventListener('click', function () {
        document.querySelectorAll('.frec-input').forEach(i => i.value = '');
        document.getElementById('frec-resultado').innerHTML = '';
        document.getElementById('frec-resultado').classList.add('hidden');
    });

    // ===== ACT 3: VF =====
    const vfAnswers = { vf1: 'F', vf2: 'V', vf3: 'V', vf4: 'F', vf5: 'V', vf6: 'F' };
    document.getElementById('check-vf-btn')?.addEventListener('click', function () {
        let score = 0;
        Object.entries(vfAnswers).forEach(([id, correct]) => {
            const input = document.getElementById(id); if (!input) return;
            const val = input.value.trim().toUpperCase();
            input.classList.remove('correct', 'wrong');
            if (val === correct) { input.classList.add('correct'); score++; }
            else input.classList.add('wrong');
        });
        const total = Object.keys(vfAnswers).length;
        document.getElementById('vf-result').innerHTML =
            `<span class="${score === total ? 'text-green-700' : 'text-amber-700'} font-bold">${score} de ${total} correctas.</span>`;
    });
    document.getElementById('reset-vf-btn')?.addEventListener('click', function () {
        Object.keys(vfAnswers).forEach(id => { const i = document.getElementById(id); if (i) { i.value = ''; i.classList.remove('correct', 'wrong'); } });
        document.getElementById('vf-result').innerHTML = '';
    });
});
