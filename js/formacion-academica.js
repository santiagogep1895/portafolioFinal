const STORAGE_KEY_ACADEMICA = 'portal_formacion_academica';

const isGuest = () => localStorage.getItem('rolUsuario') === 'invitado';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('add-modal');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('form-formacion');
    const timelineItemsContainer = document.getElementById('timeline-items');
    const emptyState = document.getElementById('emptyState');

    if (isGuest()) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    const getEstudios = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY_ACADEMICA)) || [];
        } catch {
            return [];
        }
    };

    const saveEstudios = (lista) => {
        if (isGuest()) return;
        localStorage.setItem(STORAGE_KEY_ACADEMICA, JSON.stringify(lista));
    };

    const renderEstudios = () => {
        const estudios = getEstudios();
        const guest = isGuest();
        timelineItemsContainer.querySelectorAll('[data-estudio-item]').forEach(el => el.remove());

        if (estudios.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
                const emptyText = document.getElementById('emptyStateText');
                if (emptyText && guest) {
                    emptyText.textContent = 'Aún no hay estudios registrados.';
                }
            }
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        estudios.forEach(item => {
            const itemHTML = `
                <div data-estudio-item="${item.id}" class="relative pl-6 animate-fade-in">
                    <div class="absolute left-[-5px] top-4 w-3 h-3 bg-brand-btnBg rounded-full border-2 border-brand-bgMid shadow-sm"></div>
                    <div class="bg-brand-surface rounded-[20px] p-4 shadow-card border border-white/40 hover:shadow-md transition-shadow">
                        <h3 class="text-sm font-bold text-brand-textMain leading-tight mb-1">${item.titulo}</h3>
                        <p class="text-xs text-brand-textMuted font-medium mb-3">${item.institucion}</p>
                        
                        <div class="flex justify-between items-center">
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-[10px] font-semibold text-brand-textMuted">
                                <i data-lucide="calendar" class="w-3 h-3"></i>
                                ${item.periodo}
                            </span>
                            
                            ${!guest ? `
                            <button type="button" data-delete-id="${item.id}" class="text-brand-textMuted hover:text-red-500 transition-colors p-1" title="Eliminar registro">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            timelineItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        if (!guest) {
            timelineItemsContainer.querySelectorAll('[data-delete-id]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (isGuest()) return;
                    const id = Number(btn.getAttribute('data-delete-id'));
                    const filtrados = getEstudios().filter(e => e.id !== id);
                    saveEstudios(filtrados);
                    renderEstudios();
                });
            });
        }

        lucide.createIcons();
    };

    const openModal = () => {
        if (isGuest()) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => document.getElementById('titulo').focus(), 100);
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isGuest()) return;

        const titulo = document.getElementById('titulo').value.trim();
        const institucion = document.getElementById('institucion').value.trim();
        const fechaInicio = document.getElementById('fecha_inicio').value.trim();
        const fechaFin = document.getElementById('fecha_fin').value.trim();

        let periodo = 'Presente';
        if (fechaInicio && fechaFin) periodo = `${fechaInicio} - ${fechaFin}`;
        else if (fechaInicio) periodo = `Desde ${fechaInicio}`;
        else if (fechaFin) periodo = `Hasta ${fechaFin}`;
        else periodo = 'Fecha no especificada';

        const estudios = getEstudios();
        estudios.unshift({
            id: Date.now(),
            titulo,
            institucion,
            periodo
        });

        saveEstudios(estudios);
        renderEstudios();
        closeModal();
    });

    renderEstudios();
});