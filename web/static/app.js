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

    // Pequeno banco de dicas mocado por planta (mais completo)
    const plantTips = {
        '1': [ // Tulipa
            'Tulipas gostam de clima mais fresco e solo levemente úmido: regue quando os 2–3 cm de superfície estiverem secos, evitando encharcar.',
            'Mantenha a tulipa em um local com bastante luz indireta e, se pegar sol, que seja o da manhã, mais fraco.',
            'Para tulipas, use um vaso com boa drenagem, furos no fundo e, se possível, uma camada de pedrinhas ou argila expandida.',
            'Durante os períodos mais quentes, verifique o solo com mais frequência: tulipas sofrem com calor excessivo e solo seco por muito tempo.',
            'Após a floração, reduza a rega aos poucos e deixe as folhas secarem naturalmente para que o bulbo recarregue energia.'
        ],
        '2': [ // Suculenta
            'Suculentas preferem pouca água: só regue quando o solo estiver completamente seco, geralmente a cada 10–20 dias, dependendo do clima.',
            'Dê bastante luz para suas suculentas. Janelas bem iluminadas são ótimas; se o sol for muito forte, introduza aos poucos para evitar queimaduras.',
            'Use um substrato super drenado para suculentas, misturando terra com areia grossa ou perlita para não acumular água nas raízes.',
            'Se as folhas da suculenta estiverem muito alongadas e finas, é sinal de pouca luz: tente aproximar de uma janela mais clara.',
            'Retire sempre o excesso de água do pratinho após a rega. Raízes de suculentas apodrecem com facilidade em solo encharcado.'
        ],
        '3': [ // Orquídeas
            'Orquídeas gostam de umidade no ar, mas não de raízes encharcadas: regue quando as raízes estiverem mais claras e o substrato quase seco.',
            'Coloque sua orquídea em local de luz indireta forte, como perto de uma janela com cortina fina; folhas muito escuras indicam pouca luz.',
            'Use vasos próprios para orquídeas e substrato com casca de pinus ou fibra de coco, que permitem boa circulação de ar nas raízes.',
            'Evite deixar água acumulada no “miolo” das folhas da orquídea após borrifar, pois isso pode favorecer fungos e apodrecimento.',
            'Adube a orquídea em pequenas doses, porém com regularidade (por exemplo, a cada 15 dias), sempre seguindo a diluição indicada no rótulo.'
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

        // ==================== REGA ====================
        if (q.includes('regar') || q.includes('rega')) {
            if (typeKey === '1') {
                return `Ótima pergunta! Para tulipas, você deve regar quando os 2 a 3 centímetros superiores do solo estiverem secos ao toque. Enfie o dedo na terra para testar! As tulipas gostam de solo levemente úmido, mas tome cuidado: encharcar demais pode apodrecer o bulbo. Em geral, regue 2-3 vezes por semana, mas sempre verifique antes.`;
            }
            if (typeKey === '2') {
                return `Suculentas são campeãs da sobrevivência! Elas armazenam água nas folhas, então precisam de muito pouca rega. A regra de ouro: só regue quando o solo estiver COMPLETAMENTE seco - isso pode levar de 10 a 20 dias dependendo do clima. E o mais importante: nunca deixe água parada no pratinho, senão as raízes apodrecem rapidinho!`;
            }
            if (typeKey === '3') {
                return `Orquídeas são um pouquinho mais exigentes com a água! Elas gostam de umidade, mas odeiam raízes encharcadas. Observe as raízes pelo vaso transparente: se estiverem esbranquiçadas ou prateadas, é hora de regar. Se estão verdes, ainda têm água suficiente. Você também pode borrifar água nas folhas e raízes aéreas 2-3 vezes por semana para manter a umidade.`;
            }
            return `A dica geral é regar quando a camada superficial do solo estiver seca ao toque. Teste com o dedo! E sempre evite deixar água parada no pratinho ou encharcar demais a planta.`;
        }

        // ==================== LUZ / SOL ====================
        if (q.includes('luz') || q.includes('sol') || q.includes('claridade')) {
            if (typeKey === '1') {
                return `Tulipas adoram bastante luz, mas preferen algo mais suave! O ideal é colocá-las em um lugar com luz indireta ou sol da manhã, que é mais fraquinho. Evite o sol forte da tarde, principalmente no verão, pois pode queimar as folhas e estressar a planta. Uma janela voltada para leste ou norte costuma ser perfeita!`;
            }
            if (typeKey === '2') {
                return `Suculentas são fãs de luz! Quanto mais luz, melhor (dentro do razoável, claro). Coloque-as em janelas bem iluminadas - até sol direto funciona bem. Mas atenção: se você acabou de comprar a planta ou ela estava em um lugar escuro, introduza ao sol aos poucos para evitar queimaduras. Se as folhas começarem a ficar alongadas e finas, é sinal de que precisam de mais luz!`;
            }
            if (typeKey === '3') {
                return `Orquídeas gostam de muita luz, mas de forma indireta! O ideal é perto de uma janela com cortina fina ou em locais bem iluminados sem sol direto. Dica prática: observe as folhas. Se estiverem verde-escuras, precisam de mais luz. Se ficarem amareladas ou com manchas marrons, pode ser sol demais. Verde-claro é o tom ideal!`;
            }
            return `A maioria das plantas prefere luz indireta. Uma dica: observe as folhas! Se ficarem muito escuras ou a planta começar a se alongar demais, ela precisa de mais luz. Se amarelarem ou aparecerem manchas, pode ser excesso de sol direto.`;
        }

        // ==================== ADUBAÇÃO / NUTRIÇÃO ====================
        if (q.includes('adubo') || q.includes('fertiliz') || q.includes('nutri')) {
            if (typeKey === '1') {
                return `Para tulipas, o segredo está na época certa! Durante a floração, use um adubo com mais fósforo (o "P" do NPK) e menos nitrogênio - algo como NPK 10-20-10 funciona bem. Aplique a cada 15-20 dias enquanto ela está florida. Depois que as flores caem, vá reduzindo aos poucos para o bulbo descansar e recarregar energia para a próxima floração.`;
            }
            if (typeKey === '2') {
                return `Suculentas são bem tranquilas com adubo - na verdade, elas precisam de pouquinho! Use um adubo NPK equilibrado (tipo 10-10-10) mas SEMPRE dilua na metade da dose recomendada. Aplique a cada 45 a 60 dias na primavera e verão, que é quando crescem mais. No inverno, pode até pausar a adubação, pois elas ficam mais "dormentes".`;
            }
            if (typeKey === '3') {
                return `Orquídeas amam o ditado "pouco e sempre"! Elas se beneficiam muito de adubação frequente, mas em doses bem pequenas. Use um NPK 20-20-20 bem diluído (tipo 1/4 da dose) a cada 15 dias. Super importante: sempre regue a planta uns 30 minutos ANTES de aplicar o adubo, para proteger as raízes delicadas. Existem também adubos específicos para orquídeas que são ótimos!`;
            }
            return `No geral, use um adubo equilibrado (NPK) a cada 30 a 45 dias durante a época de crescimento (primavera e verão). A dica de ouro: sempre regue a planta um pouquinho antes de aplicar o adubo - isso evita queimar as raízes. E nunca exagere na dose!`;
        }

        // ==================== UMIDADE DO SOLO ====================
        if (q.includes('umidade') || q.includes('seco') || q.includes('molhado')) {
            if (ctx.humidity) {
                if (typeKey === '2') {
                    return `Vi aqui que a última leitura do sensor foi de ${ctx.humidity}%! Para suculentas, essa é uma informação super útil: você deve regar quando estiver abaixo de 20-25%. Se estiver acima de 40%, ainda está úmido demais - aguarde mais uns dias! Lembre-se: suculentas preferem passar sede do que ter excesso de água.`;
                }
                if (typeKey === '3') {
                    return `Legal, o sensor está marcando ${ctx.humidity}%! Para orquídeas, a faixa ideal é entre 40-60% de umidade no substrato. Se está acima de 60%, espere mais um pouco antes de regar. Se está abaixo de 40%, pode ir regando! Uma dica: além do substrato, orquídeas adoram umidade no AR, então borrifar água ao redor ajuda bastante.`;
                }
                return `O sensor está registrando ${ctx.humidity}% de umidade no solo! Para a maioria das plantas, incluindo tulipas, o ideal é regar quando estiver entre 30-40%. Abaixo disso, é hora de regar. Acima de 50-60%, ainda tem água suficiente. Tulipas gostam de solo levemente úmido, então não deixe secar completamente!`;
            }
            return `Uma boa forma de checar é o teste do dedo: enfie o dedo uns 2-3 cm na terra. Se estiver seco, pode regar; se ainda está úmido, espere mais um pouco. O segredo é: melhor pecar pela falta do que pelo excesso! Solo encharcado é um dos maiores problemas para plantas em vaso.`;
        }

        // ==================== VASO / SUBSTRATO ====================
        if (q.includes('vaso') || q.includes('substrato') || q.includes('terra') || q.includes('drenagem')) {
            if (typeKey === '1') {
                return `Tulipas são exigentes com drenagem! Use sempre vasos com furos no fundo - isso é essencial. Uma dica legal: coloque uma camada de pedrinhas, argila expandida ou até cacos de telha no fundo antes de colocar a terra. Isso ajuda a drenar melhor e evita que o bulbo fique encharcado. O substrato ideal é leve e aerado, tipo uma mistura de terra vegetal com um pouco de areia.`;
            }
            if (typeKey === '2') {
                return `Suculentas odeiam água parada! Então o substrato precisa ser SUPER drenante. A receita caseira é: misture terra comum com areia grossa (de construção, bem lavada) ou perlita, na proporção de 1:1. Vasos com furos no fundo são obrigatórios - nada de cachepôs fechados! Vasos de barro são ótimos porque "respiram" e ajudam a secar mais rápido.`;
            }
            if (typeKey === '3') {
                return `Orquídeas são bem diferentes das outras plantas! Elas não gostam de terra comum. Use vasos TRANSPARENTES (para as raízes fazerem fotossíntese!) com furos na lateral e no fundo. O substrato ideal é casca de pinus, fibra de coco ou carvão vegetal - materiais que seguram um pouco de umidade mas deixam as raízes respirarem. Nunca plante orquídea em terra normal!`;
            }
            return `A regra número 1 para qualquer planta em vaso: sempre use vasos com furos no fundo! Isso evita que a água fique acumulada e apodreça as raízes. O substrato deve ser leve e bem drenante - você pode adicionar perlita ou areia grossa à terra comum para melhorar a drenagem.`;
        }

        // ==================== PRAGAS / PROBLEMAS ====================
        if (q.includes('praga') || q.includes('bicho') || q.includes('mancha') || q.includes('folha amarela') || q.includes('apodrecendo')) {
            if (typeKey === '1') {
                return `Eita, tulipa com problemas? Vamos investigar! Folhas amareladas geralmente indicam excesso de água - reduza a rega. Se aparecerem manchas escuras ou mofo, pode ser fungo, que adora umidade. Nesse caso: remova as folhas doentes, melhore a ventilação do local e evite molhar as folhas ao regar. Se o bulbo estiver mole, infelizmente apodreceu e é melhor descartar.`;
            }
            if (typeKey === '2') {
                return `Suculentas têm dois problemas principais: apodrecimento (por excesso de água) e cochonilhas (aqueles bichinhos brancos). Se a base está mole e escura, é podridão - corte a parte saudável, deixe cicatrizar por 2-3 dias e replante em substrato seco. Para cochonilhas, use um cotonete com álcool 70% para remover uma por uma, ou borrife óleo de neem diluído. Funciona super bem!`;
            }
            if (typeKey === '3') {
                return `Orquídeas podem ter alguns probleminhas! Manchas escuras nas folhas geralmente são fungos - evite deixar água acumulada no "coração" da planta. Limpe as folhas com água e, se piorar, use fungicida específico. Cochonilhas e pulgões adoram orquídeas: limpe as folhas com um pano úmido com sabão neutro diluído. Se as raízes ficarem marrons e moles, estão apodrecendo - corte as ruins e reduza a rega.`;
            }
            return `Problemas nas plantas podem ter várias causas! Folhas amarelas geralmente = excesso de água ou falta de luz. Manchas escuras = fungos (reduza umidade). Bichinhos brancos = cochonilhas (use álcool 70%). Primeira medida: isole a planta das outras, remova partes muito afetadas e ajuste rega/luz. A maioria se recupera bem com cuidado!`;
        }

        // ==================== CLIMA / TEMPERATURA ====================
        if (q.includes('calor') || q.includes('frio') || q.includes('temperatura') || q.includes('clima')) {
            if (typeKey === '1') {
                return `Tulipas são plantas de clima mais fresquinho! Elas se dão melhor em temperaturas entre 15-20°C. Se você mora em lugar quente, não desanime: coloque-as em ambientes mais frescos da casa (ar condicionado ajuda!), aumente um pouco a frequência de rega nos dias muito quentes e evite sol forte da tarde. Em clima frio (abaixo de 10°C), elas até gostam, mas proteja de geadas.`;
            }
            if (typeKey === '2') {
                return `Suculentas são guerreiras do calor! Elas aguentam bem temperaturas altas, até 35°C tranquilamente. Mas se passar muito disso, dê uma sombra nas horas mais quentes (meio-dia às 15h). Já no frio, cuidado: abaixo de 5°C podem sofrer danos, então se mora em lugar que gela, leve para dentro ou proteja com plástico nas noites mais frias. A maioria das suculentas prefere entre 15-30°C.`;
            }
            if (typeKey === '3') {
                return `Orquídeas gostam de temperatura agradável, entre 18-28°C - tipo clima de primavera! Elas não gostam de extremos: evite correntes de ar frio (cuidado com ar-condicionado muito forte) e também calor excessivo. Uma dica importante: em climas muito secos ou com ar-condicionado, a umidade do ar cai bastante. Borrife água ao redor da planta (não nas flores!) ou coloque uma bandeja com pedrinhas e água embaixo do vaso.`;
            }
            return `A maioria das plantas de interior prefere temperaturas amenas, entre 18-26°C - o conforto humano é parecido com o delas! Proteja do frio intenso (abaixo de 10°C) e também do sol forte nas horas mais quentes. Mudanças bruscas de temperatura também estressam as plantas, então evite colocá-las perto de aquecedores ou ar-condicionado direto.`;
        }

        // ==================== DICA GENÉRICA ====================
        return `Claro, posso te ajudar! ${getRandomTipForPlant(ctx)} Se quiser saber mais, pode perguntar sobre "quando regar", "que tipo de luz", "como adubar", "que vaso usar" ou "problemas com a planta". Estou aqui para ajudar! 🌱`;
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


