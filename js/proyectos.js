const STORAGE_KEY_PROYECTOS = 'portal_proyectos';

const modal = document.getElementById('addProjectModal');
const form = document.getElementById('addProjectForm');
const list = document.getElementById('projectsList');
const emptyState = document.getElementById('emptyState');

function isGuest() {
    return localStorage.getItem('rolUsuario') === 'invitado';
}

function getProjects() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_PROYECTOS)) || [];
    } catch {
        return [];
    }
}

function saveProjects(projects) {
    if (isGuest()) return;
    localStorage.setItem(STORAGE_KEY_PROYECTOS, JSON.stringify(projects));
}

function renderProjects() {
    const projects = getProjects();
    const guest = isGuest();
    list.querySelectorAll('[data-project-card]').forEach(el => el.remove());

    if (projects.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'flex';
            const emptyText = document.getElementById('emptyStateText');
            if (emptyText && guest) {
                emptyText.textContent = 'Aún no hay proyectos registrados.';
            }
        }
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    projects.forEach(proj => {
        const cardHTML = `
            <div data-project-card="${proj.id}" class="bg-brand-surface rounded-[24px] p-5 shadow-card group hover:bg-gray-50 transition-colors animate-fade-in relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1.5 bg-brand-beigeDark opacity-50"></div>

                <div class="flex items-start gap-4 mt-2">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${proj.colorClass}">
                        <i data-lucide="briefcase" class="w-5 h-5"></i>
                    </div>
                    
                    <div class="flex-1 ${!guest ? 'pr-6' : ''}">
                        <h3 class="text-sm font-bold text-brand-textMain mb-1 leading-tight">${proj.name}</h3>
                        <p class="text-[11px] font-bold tracking-wider text-brand-textMuted uppercase mb-3">${proj.role}</p>
                        <p class="text-xs text-brand-textMain/80 leading-relaxed line-clamp-2">${proj.desc}</p>
                    </div>

                    ${!guest ? `
                    <button type="button" onclick="deleteProject(${proj.id})" class="absolute right-4 top-6 text-brand-textMuted hover:text-red-500 transition-colors p-1.5" title="Eliminar proyecto">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', cardHTML);
    });

    lucide.createIcons();
}

function deleteProject(id) {
    if (isGuest()) return;
    const filtrados = getProjects().filter(p => p.id !== id);
    saveProjects(filtrados);
    renderProjects();
}

function openModal() {
    if (isGuest()) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => document.getElementById('projectName').focus(), 100);
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

    const name = document.getElementById('projectName').value.trim();
    const role = document.getElementById('projectRole').value.trim();
    const desc = document.getElementById('projectDesc').value.trim();

    if (name && role && desc) {
        const iconBgColors = [
            'bg-blue-100 text-blue-600',
            'bg-emerald-100 text-emerald-600',
            'bg-amber-100 text-amber-600',
            'bg-purple-100 text-purple-600'
        ];
        const randomColorClass = iconBgColors[Math.floor(Math.random() * iconBgColors.length)];

        const projects = getProjects();
        projects.unshift({
            id: Date.now(),
            name,
            role,
            desc,
            colorClass: randomColorClass
        });

        saveProjects(projects);
        renderProjects();
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (isGuest()) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
    renderProjects();
});