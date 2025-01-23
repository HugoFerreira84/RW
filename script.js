document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const carousels = document.querySelectorAll('.carousel');

    let isDragging = false;
    let startX, scrollLeft;

    // Alternar entre carrosséis
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const project = button.dataset.project;

            // Remover 'active' de todos os botões e carrosséis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            carousels.forEach(carousel => carousel.classList.remove('active'));

            // Adicionar 'active' ao botão e carrossel correspondente
            button.classList.add('active');
            document.querySelector(`.carousel[data-project="${project}"]`).classList.add('active');
        });
    });

    // Função de clique e arraste para carrosséis
    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            container.classList.add('dragging');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5; // Ajuste de precisão do scroll
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('mouseup', () => {
            isDragging = false;
            container.classList.remove('dragging');
        });

        container.addEventListener('mouseleave', () => {
            isDragging = false;
            container.classList.remove('dragging');
        });

        // Suporte para dispositivos móveis
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 1.2; // Ajuste de precisão do scroll para telas menores
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Zoom nas imagens ao clicar
        container.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', () => {
                openImageInModal(img.src);
            });
        });
    });

    // Função para abrir a imagem em uma modal (ampliação)
    const openImageInModal = (src) => {
        // Criar o modal
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <img src="${src}" alt="Imagem ampliada">
        </div>
      `;
        document.body.appendChild(modal);

        // Fechar o modal ao clicar no botão de fechar
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Fechar o modal ao clicar fora da imagem
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    };
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('projectCanvas');
    const ctx = canvas.getContext('2d');
    const buttons = document.querySelectorAll('.scene-btn');

    // Definir dimensões do canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Mapeamento dos botões para as imagens
    const images = {
        'scene-btn1': 'img/projeto1.jpg', // Caminho para a imagem 1
        'scene-btn2': 'img/portifolio1.jpg', // Caminho para a imagem 2
        'scene-btn3': 'img/portifolio3.jpg', // Caminho para a imagem 3
    };

    // Função para carregar e desenhar a imagem no canvas com transição
    const loadAndDrawImage = (imageSrc) => {
        // Iniciar fade-out
        canvas.style.transition = 'opacity 0.5s ease';
        canvas.style.opacity = 0; // Tornar o canvas invisível

        setTimeout(() => {
            const img = new Image();
            img.src = imageSrc;

            img.onload = () => {
                // Limpar o canvas antes de desenhar a nova imagem
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Desenhar a imagem no canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Iniciar fade-in
                canvas.style.opacity = 1; // Tornar o canvas visível novamente
            };

            img.onerror = () => {
                console.error('Erro ao carregar a imagem:', imageSrc);
                canvas.style.opacity = 1; // Restaurar visibilidade em caso de erro
            };
        }, 500); // Tempo do fade-out (em ms)
    };

    // Adicionar evento de clique para cada botão
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const imageSrc = images[button.id]; // Obtém o caminho da imagem correspondente
            if (imageSrc) {
                loadAndDrawImage(imageSrc); // Carrega e desenha a imagem no canvas
            }
        });
    });

    // Carregar a primeira imagem como padrão
    loadAndDrawImage(images['scene-btn1']);
});

document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.video-item video');
    const modal = document.getElementById('videoModal');
    const modalContent = modal.querySelector('.modal-content');
    const expandedVideo = document.getElementById('expandedVideo');
    const closeModalButton = modal.querySelector('.close-modal');

    // Abre o modal ao clicar em um vídeo
    videoItems.forEach(video => {
        video.addEventListener('click', () => {
            const source = video.querySelector('source').src;
            expandedVideo.src = source; // Define a fonte do vídeo no modal
            modal.classList.add('active');
        });
    });

    // Fecha o modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.remove('active');
        expandedVideo.pause(); // Pausa o vídeo ao fechar o modal
        expandedVideo.src = ''; // Limpa a fonte do vídeo
    });

    // Fecha o modal clicando fora do vídeo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            expandedVideo.pause();
            expandedVideo.src = '';
        }
    });
});


