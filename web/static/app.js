document.addEventListener('DOMContentLoaded', function() {
    // ==================== ELEMENTOS DO DOM ====================
    // Telas
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const mainScreen = document.getElementById('main-screen');

    // Formulários
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const signupLink = document.getElementById('link-to-signup');

    // Sidebar
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarUsername = document.getElementById('sidebar-username');
    const sidebarMyPots = document.getElementById('sidebar-my-pots');
    const sidebarAddPot = document.getElementById('sidebar-add-pot');
    const sidebarAccount = document.getElementById('sidebar-account');
    const sidebarProfile = document.getElementById('sidebar-profile');
    const sidebarLogout = document.getElementById('sidebar-logout');

    // Home
    const selectPot = document.getElementById('select-pot');
    const selectPlant = document.getElementById('select-plant');
    const plantImage = document.getElementById('plant-image');
    const humidityValue = document.getElementById('humidity-value');
    const tempValue = document.getElementById('temp-value');
    const humidityLight = document.getElementById('humidity-light');
    const tempLight = document.getElementById('temp-light');
    const plantMessage = document.getElementById('plant-message');
    const potIdDisplay = document.getElementById('pot-id');
    const plantNameDisplay = document.getElementById('plant-name');
    const plantTypeDisplay = document.getElementById('plant-type');
    const backendHumidity = document.getElementById('backend-humidity');
    const backendTimestamp = document.getElementById('backend-timestamp');

    // Chat (IA protótipo)
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Modais
    const addPotModal = document.getElementById('add-pot-modal');
    const closeAddPot = document.getElementById('close-add-pot');
    const addPotForm = document.getElementById('add-pot-form');
    const managPotsModal = document.getElementById('manage-pots-modal');
    const closeManagePots = document.getElementById('close-manage-pots');
    const potsList = document.getElementById('pots-list');
    const emptyPots = document.getElementById('empty-pots');
    const addFirstPot = document.getElementById('add-first-pot');

    // ==================== DADOS DO SISTEMA ====================
    let currentUser = null;
    let userPots = []; // Array de vasos do usuário: {id, name, plantType}

    // Informações das plantas
    const plantInfos = {
        1: {
            name: 'Tulipa',
            img: 'static/tulipa.png',
            humidity: 60,
            temp: 20,
            humidityRange: {min: 40, max: 80, ideal: {min: 50, max: 70}},
            tempRange: {min: 10, max: 30, ideal: {min: 18, max: 24}},
            msg: 'A Tulipa está vibrante!'
        },
        2: {
            name: 'Suculenta',
            img: 'static/suculenta.png',
            humidity: 30,
            temp: 28,
            humidityRange: {min: 20, max: 60, ideal: {min: 25, max: 40}},
            tempRange: {min: 15, max: 35, ideal: {min: 22, max: 30}},
            msg: 'A Suculenta está ótima!'
        },
        3: {
            name: 'Orquídeas',
            img: 'static/orquideas.png',
            humidity: 85,
            temp: 24,
            humidityRange: {min: 40, max: 90, ideal: {min: 60, max: 80}},
            tempRange: {min: 18, max: 32, ideal: {min: 20, max: 28}},
            msg: 'Observe a rega das Orquídeas!'
        }
    };

    // ==================== FUNÇÕES DE NAVEGAÇÃO ====================
    function show(screen) {
        loginScreen.style.display = 'none';
        signupScreen.style.display = 'none';
        mainScreen.style.display = 'none';
        addPotModal.style.display = 'none';
        managPotsModal.style.display = 'none';

        if (screen === mainScreen) {
            screen.style.display = 'block';
        } else if (screen === addPotModal || screen === managPotsModal) {
            screen.style.display = 'flex';
        } else {
            screen.style.display = 'flex';
        }
    }

    // ==================== SIDEBAR ====================
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    sidebarMyPots.addEventListener('click', function() {
        closeSidebar();
        openManagePotsModal();
    });

    sidebarAddPot.addEventListener('click', function() {
        closeSidebar();
        openAddPotModal();
    });

    sidebarAccount.addEventListener('click', function() {
        closeSidebar();
        alert('Configurações da conta (a implementar)');
    });

    sidebarProfile.addEventListener('click', function() {
        closeSidebar();
        alert('Área de perfil do usuário (a implementar)');
    });

    sidebarLogout.addEventListener('click', function() {
        closeSidebar();
        handleLogout();
    });

    // ==================== LOGIN & CADASTRO ====================
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-password').value;

        if(email === 'teste@teste.com' && senha === '123456') {
            const userName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
            currentUser = { name: userName, email: email };
            sidebarUsername.textContent = userName;

            // Carrega vasos do localStorage
            loadUserPots();
            show(mainScreen);
        } else {
            alert('Login ou senha inválidos. Use:\nEmail: teste@teste.com\nSenha: 123456');
        }
    });

    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        show(signupScreen);
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('signup-nome').value;
        const email = document.getElementById('signup-email').value;

        currentUser = { name: nome, email: email };
        sidebarUsername.textContent = nome;

        // Inicia com lista vazia de vasos
        userPots = [];
        saveUserPots();
        show(mainScreen);
    });

    // ==================== LOGOUT ====================
    function handleLogout() {
        currentUser = null;
        userPots = [];
        selectPot.innerHTML = '<option value="">Nenhum vaso cadastrado</option>';
        show(loginScreen);
    }

    // ==================== GERENCIAMENTO DE VASOS ====================
    function loadUserPots() {
        const saved = localStorage.getItem('userPots');
        if (saved) {
            userPots = JSON.parse(saved);
        } else {
            userPots = [];
        }
        updatePotSelect();
    }

    function saveUserPots() {
        localStorage.setItem('userPots', JSON.stringify(userPots));
    }

    function updatePotSelect() {
        selectPot.innerHTML = '';

        if (userPots.length === 0) {
            selectPot.innerHTML = '<option value="">Nenhum vaso cadastrado</option>';
            selectPot.disabled = true;

            // Limpa informações
            potIdDisplay.textContent = '-';
            plantNameDisplay.textContent = '-';
            plantTypeDisplay.textContent = '-';
            plantMessage.textContent = 'Adicione um vaso para começar';
        } else {
            selectPot.disabled = false;
            userPots.forEach(pot => {
                const option = document.createElement('option');
                option.value = pot.id;
                option.textContent = pot.name ? `${pot.id} - ${pot.name}` : pot.id;
                selectPot.appendChild(option);
            });

            // Seleciona o primeiro vaso automaticamente
            if (selectPot.value) {
                updatePlantDisplay();
            }
        }
    }

    function addPot(potId, potName, plantType) {
        // Verifica se ID já existe
        if (userPots.some(pot => pot.id === potId)) {
            alert('Este ID de vaso já está cadastrado!');
            return false;
        }

        userPots.push({
            id: potId,
            name: potName,
            plantType: plantType
        });

        saveUserPots();
        updatePotSelect();
        return true;
    }

    function removePot(potId) {
        if (confirm(`Tem certeza que deseja remover o vaso ${potId}?`)) {
            userPots = userPots.filter(pot => pot.id !== potId);
            saveUserPots();
            updatePotSelect();
            updateManagePotsDisplay();
        }
    }

    // ==================== MODAL: ADICIONAR VASO ====================
    function openAddPotModal() {
        show(addPotModal);
        addPotForm.reset();
    }

    closeAddPot.addEventListener('click', function() {
        addPotModal.style.display = 'none';
        show(mainScreen);
    });

    addFirstPot.addEventListener('click', function() {
        managPotsModal.style.display = 'none';
        openAddPotModal();
    });

    addPotForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const potId = document.getElementById('pot-id-input').value.trim();
        const potName = document.getElementById('pot-name-input').value.trim();
        const plantType = document.getElementById('pot-plant-type').value;

        if (addPot(potId, potName, plantType)) {
            alert('Vaso adicionado com sucesso!');
            addPotModal.style.display = 'none';
            show(mainScreen);
        }
    });

    // ==================== MODAL: GERENCIAR VASOS ====================#
    function openManagePotsModal() {
        show(managPotsModal);
        updateManagePotsDisplay();
    }

    closeManagePots.addEventListener('click', function() {
        managPotsModal.style.display = 'none';
        show(mainScreen);
    });

    function updateManagePotsDisplay() {
        if (userPots.length === 0) {
            potsList.style.display = 'none';
            emptyPots.style.display = 'flex';
        } else {
            potsList.style.display = 'grid';
            emptyPots.style.display = 'none';

            potsList.innerHTML = '';
            userPots.forEach(pot => {
                const plantInfo = plantInfos[pot.plantType];
                const potCard = document.createElement('div');
                potCard.className = 'pot-card';
                potCard.innerHTML = `
                    <div class="pot-card-header">
                        <div class="pot-card-icon">🏺</div>
                        <button class="pot-card-delete" data-pot-id="${pot.id}">✕</button>
                    </div>
                    <div class="pot-card-body">
                        <h3 class="pot-card-id">${pot.id}</h3>
                        ${pot.name ? `<p class="pot-card-name">${pot.name}</p>` : ''}
                        <div class="pot-card-info">
                            <span class="pot-card-label">Planta:</span>
                            <span class="pot-card-value">${plantInfo.name}</span>
                        </div>
                    </div>
                    <button class="pot-card-select btn-secondary" data-pot-id="${pot.id}">
                        Ver Detalhes
                    </button>
                `;
                potsList.appendChild(potCard);
            });

            // Event listeners para botões dos cards
            document.querySelectorAll('.pot-card-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const potId = this.getAttribute('data-pot-id');
                    removePot(potId);
                });
            });

            document.querySelectorAll('.pot-card-select').forEach(btn => {
                btn.addEventListener('click', function() {
                    const potId = this.getAttribute('data-pot-id');
                    selectPot.value = potId;
                    updatePlantDisplay();
                    managPotsModal.style.display = 'none';
                    show(mainScreen);
                });
            });
        }
    }

    // ==================== DISPLAY DE PLANTA ====================#
    selectPot.addEventListener('change', updatePlantDisplay);
    selectPlant.addEventListener('change', updatePlantTypeForCurrentPot);

    function updatePlantDisplay() {
        const selectedPotId = selectPot.value;
        if (!selectedPotId) return;

        const pot = userPots.find(p => p.id === selectedPotId);
        if (!pot) return;

        const plant = plantInfos[pot.plantType];

        // Atualiza imagem e informações
        plantImage.src = plant.img;
        plantMessage.textContent = plant.msg;
        potIdDisplay.textContent = pot.id;
        plantNameDisplay.textContent = pot.name || pot.id;
        plantTypeDisplay.textContent = plant.name;

        // Atualiza seletor de tipo de planta
        selectPlant.value = pot.plantType;

        // Atualiza status
        updateStatus(plant.humidity, plant.temp, plant.humidityRange, plant.tempRange);
    }

    function updatePlantTypeForCurrentPot() {
        const selectedPotId = selectPot.value;
        if (!selectedPotId) return;

        const pot = userPots.find(p => p.id === selectedPotId);
        if (!pot) return;

        // Atualiza o tipo de planta do vaso
        pot.plantType = selectPlant.value;
        saveUserPots();

        // Atualiza display
        updatePlantDisplay();
    }

    function getLightColor(value, min, max, ideal) {
        if (value >= ideal.min && value <= ideal.max) {
            return 'green';
        } else if (value >= min && value <= max) {
            return 'yellow';
        } else {
            return 'red';
        }
    }

    function updateStatus(humidity, temp, humidityRange, tempRange) {
        humidityValue.textContent = humidity + '%';
        tempValue.textContent = temp + '°C';

        humidityLight.className = 'status-light';
        tempLight.className = 'status-light';

        const humidityColor = getLightColor(humidity, humidityRange.min, humidityRange.max, humidityRange.ideal);
        const tempColor = getLightColor(temp, tempRange.min, tempRange.max, tempRange.ideal);

        humidityLight.classList.add(humidityColor);
        tempLight.classList.add(tempColor);
    }

    // ==================== DADOS DO BACKEND ====================
    // Esses valores são preenchidos pelo template (Jinja) e atualizados via meta refresh do Flask
    if (backendHumidity && backendTimestamp) {
        // Apenas garantimos que estejam visíveis se existirem
        backendHumidity.style.display = backendHumidity.textContent.trim() ? 'inline' : 'none';
        backendTimestamp.style.display = backendTimestamp.textContent.trim() ? 'inline' : 'none';
    }

    // ==================== CHAT IA (MOCADO) ====================
    function appendMessage(author, text, isBot) {
        const msg = document.createElement('div');
        msg.className = 'chat-message ' + (isBot ? 'chat-message-bot' : 'chat-message-user');
        msg.innerHTML = `<span class="chat-author">${author}</span><p>${text}</p>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getCurrentPlantContext() {
        const selectedPotId = selectPot.value;
        let selectedPlantType = selectPlant.value;
        let selectedPlantName = 'sua planta';
        let currentHumidity = backendHumidity ? backendHumidity.textContent.replace('%','').trim() : '';

        if (selectedPotId) {
            const pot = userPots.find(p => p.id === selectedPotId);
            if (pot && plantInfos[pot.plantType]) {
                selectedPlantType = pot.plantType;
                selectedPlantName = plantInfos[pot.plantType].name;
            }
        } else if (plantInfos[selectedPlantType]) {
            selectedPlantName = plantInfos[selectedPlantType].name;
        }

        return {
            plantTypeId: selectedPlantType,
            plantName: selectedPlantName,
            humidity: currentHumidity
        };
    }

    // Pequeno banco de dicas mocado por planta
    const plantTips = {
        '1': [ // Tulipa
            'Tulipas gostam de clima mais fresco e solo levemente úmido. Evite deixar a terra encharcada.',
            'Mantenha a tulipa em um local com bastante luz indireta e longe de sol forte da tarde.',
            'Para tulipas, prefira vasos com boa drenagem e coloque uma camada de pedrinhas no fundo.'
        ],
        '2': [ // Suculenta
            'Suculentas preferem pouca água: espere o solo secar totalmente antes de regar novamente.',
            'Dê bastante luz para suas suculentas. Janelas bem iluminadas são ótimas, desde que o sol não seja extremo.',
            'Use um substrato bem drenado para suculentas, com areia ou perlita misturada à terra.'
        ],
        '3': [ // Orquídeas
            'Orquídeas gostam de umidade no ar, mas não de raízes encharcadas. Borrife água nas folhas com moderação.',
            'Coloque sua orquídea em local de luz indireta forte, como perto de uma janela com cortina fina.',
            'Use vasos próprios para orquídeas e substrato com casca de pinus, que permite boa circulação de ar nas raízes.'
        ]
    };

    function getRandomTipForPlant(ctx) {
        const typeKey = String(ctx.plantTypeId || '');
        const tips = plantTips[typeKey];
        if (tips && tips.length) {
            const idx = Math.floor(Math.random() * tips.length);
            return tips[idx];
        }
        // fallback genérico
        return `Para cuidar bem da ${ctx.plantName}, pense em três pilares: luz indireta, rega moderada e adubação leve e regular.`;
    }

    function generateBotReply(question) {
        const q = question.toLowerCase();
        const ctx = getCurrentPlantContext();
        const typeKey = String(ctx.plantTypeId || '');

        // Regras bem simples para protótipo
        if (q.includes('regar') || q.includes('rega')) {
            if (typeKey === '2') {
                return `Para suculentas, o ideal é regar somente quando o solo estiver bem seco. Evite deixar água acumulada no pratinho.`;
            }
            if (typeKey === '3') {
                return `Orquídeas preferem umidade constante, mas sem encharcar. Borrife água nas raízes e folhas 2 a 3 vezes por semana.`;
            }
            // Tulipa ou genérico
            return getRandomTipForPlant(ctx);
        }

        if (q.includes('luz') || q.includes('sol') || q.includes('claridade')) {
            return getRandomTipForPlant(ctx);
        }

        if (q.includes('adubo') || q.includes('fertiliz') || q.includes('nutri')) {
            return `Use um adubo equilibrado (NPK) a cada 30–45 dias em pequena quantidade. Sempre regue um pouco antes de aplicar adubo para não queimar as raízes.`;
        }

        if (q.includes('umidade') || q.includes('seco') || q.includes('molhado')) {
            if (ctx.humidity) {
                return `A última leitura de umidade do solo foi de ${ctx.humidity}%. Se estiver abaixo de 30–40%, geralmente é um sinal de que está na hora de regar, dependendo da espécie.`;
            }
            return `Mantenha o solo levemente úmido, nunca encharcado. É melhor regar um pouco com mais frequência do que exagerar de uma vez só.`;
        }

        // Dica genérica, mas respeitando a planta selecionada
        return getRandomTipForPlant(ctx) + ' Se quiser, pergunte sobre "quando regar", "luz ideal" ou "adubação".';
    }

    if (chatToggle && chatWindow && chatClose && chatForm && chatInput && chatMessages) {
        chatToggle.addEventListener('click', function() {
            const visible = chatWindow.style.display === 'block';
            chatWindow.style.display = visible ? 'none' : 'block';
        });

        chatClose.addEventListener('click', function() {
            chatWindow.style.display = 'none';
        });

        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage('Você', text, false);
            chatInput.value = '';

            // Resposta mocado da "IA"
            setTimeout(function() {
                const reply = generateBotReply(text);
                appendMessage('IA', reply, true);
            }, 400);
        });
    }

    // ==================== INICIALIZAÇÃO ====================
    show(loginScreen);
});


