const STORAGE_KEY_EXPERIENCIA = 'portal_experiencia';

const modal = document.getElementById('addExperienceModal');
const form = document.getElementById('addExperienceForm');
const inputTitle = document.getElementById('jobTitle');
const listaLaboral = document.getElementById('lista-laboral');
const listaPracticas = document.getElementById('lista-practicas');

function isGuest() {
    return localStorage.getItem('rolUsuario') === 'invitado';
}

function getExperiencias() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_EXPERIENCIA)) || [];
    } catch {
        return [];
    }
}

function saveExperiencias(lista) {
    if (isGuest()) return;
    localStorage.setItem(STORAGE_KEY_EXPERIENCIA, JSON.stringify(lista));
}

function renderExperiencias() {
    const experiencias = getExperiencias();
    const guest = isGuest();
    listaLaboral.innerHTML = '';
    listaPracticas.innerHTML = '';

    experiencias.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'bg-brand-surface/60 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-sm animate-fade-in flex items-center justify-between group';

        const iconBg = exp.type === 'laboral' ? 'bg-blue-100/50 text-blue-600' : 'bg-green-100/50 text-green-600';
        const iconName = exp.type === 'laboral' ? 'briefcase' : 'graduation-cap';

        card.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0">
                    <i data-lucide="${iconName}" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="font-bold text-brand-textMain text-sm leading-tight mb-1">${exp.title}</h3>
                    <p class="text-xs font-medium text-brand-textMuted">${exp.company}</p>
                    <p class="text-[10px] font-semibold text-brand-textMuted/70 mt-1 flex items-center gap-1">
                        <i data-lucide="calendar" class="w-3 h-3"></i> ${exp.periodo}
                    </p>
                </div>
            </div>
            ${!guest ? `
            <button type="button" onclick="deleteExperiencia(${exp.id})" class="text-brand-textMuted hover:text-red-500 transition-colors p-1.5" title="Eliminar">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
            ` : ''}
        `;

        if (exp.type === 'laboral') {
            listaLaboral.appendChild(card);
        } else {
            listaPracticas.appendChild(card);
        }
    });

    lucide.createIcons();
}

function deleteExperiencia(id) {
    if (isGuest()) return;
    const filtradas = getExperiencias().filter(e => e.id !== id);
    saveExperiencias(filtradas);
    renderExperiencias();
}

function openModal() {
    if (isGuest()) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => inputTitle.focus(), 100);
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    form.reset();
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (isGuest()) return;

    const title = inputTitle.value.trim();
    const company = document.getElementById('companyName').value.trim();
    const type = document.querySelector('input[name="expType"]:checked').value;

    const startDate = document.getElementById('startDate').value.trim();
    let endDate = document.getElementById('endDate').value.trim();
    if (!endDate) endDate = 'Presente';
    const periodo = `${startDate} - ${endDate}`;

    if (title && company && startDate) {
        const experiencias = getExperiencias();
        experiencias.unshift({
            id: Date.now(),
            title,
            company,
            type,
            periodo
        });
        saveExperiencias(experiencias);
        renderExperiencias();
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (isGuest()) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
    renderExperiencias();
});