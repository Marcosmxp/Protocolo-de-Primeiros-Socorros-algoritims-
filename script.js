// Definição dos passos do protocolo
const protocolSteps = [
    {
        id: 'seguranca',
        title: 'Passo 1: Avaliar condições de segurança',
        description: 'Equipar com EPI (Bata, Máscara FFP2, Proteção ocular e Luvas de nitrilo)',
        bodyParts: ['head', 'torso', 'left-arm', 'right-arm'],
        options: {
            correct: ['Verificar área segura', 'Vestir EPI completo'],
            incorrect: ['Ignorar segurança', 'Aproximar sem equipamento']
        }
    },
    {
        id: 'consciencia', 
        title: 'Passo 2: Avaliar estado de consciência',
        description: 'Verificar se a vítima responde a estímulos',
        bodyParts: ['head'],
        options: {
            correct: ['Chamar a vítima', 'Verificar resposta'],
            incorrect: ['Sacudir a vítima', 'Ignorar verificação']
        }
    },
    {
        id: 'sinais-vitais',
        title: 'Passo 3: Verificar sinais vitais',
        description: 'Observar movimento, tosse ou respiração normal',
        bodyParts: ['head', 'torso'],
        options: {
            correct: ['Verificar respiração', 'Procurar movimentos'],
            incorrect: ['Assumir que está bem', 'Ignorar verificação']
        }
    },
    {
        id: 'posicao-lateral',
        title: 'Passo 4: Posição Lateral de Segurança',
        description: 'Colocar a vítima de lado se estiver inconsciente mas respirando',
        bodyParts: ['torso', 'left-arm', 'right-arm'],
        options: {
            correct: ['Apoiar cabeça', 'Manter coluna alinhada'],
            incorrect: ['Mover bruscamente', 'Deixar obstruído']
        }
    },
    {
        id: 'rcr',
        title: 'Passo 5: Iniciar RCR',
        description: '30 compressões torácicas se não houver respiração',
        bodyParts: ['torso'],
        options: {
            correct: ['Posicionar mãos corretamente', 'Manter ritmo de 100-120/min'],
            incorrect: ['Comprimir fraco', 'Interromper muito']
        }
    }
];

// Elementos da interface
const stepTitleEl = document.getElementById('step-title');
const stepDescriptionEl = document.getElementById('step-description');
const optionsEl = document.getElementById('options');
const correctDropEl = document.getElementById('correct-drop');
const incorrectDropEl = document.getElementById('incorrect-drop');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');

// Variáveis de estado
let currentStepIndex = 0;
let draggedOption = null;
let hasCorrectAnswer = false;

// Inicialização
function init() {
    loadStep(currentStepIndex);
    setupEventListeners();
}

// Carrega um passo do protocolo
function loadStep(index) {
    const step = protocolSteps[index];
    
    // Atualiza a interface
    stepTitleEl.textContent = step.title;
    stepDescriptionEl.textContent = step.description;
    
    // Reseta o estado
    hasCorrectAnswer = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    // Carrega as opções
    loadOptions(step.options);
    
    // Destaca partes do corpo
    highlightBodyParts(step.bodyParts);
}

// Carrega as opções de resposta
function loadOptions(options) {
    optionsEl.innerHTML = '';
    
    // Combina e embaralha as opções
    const allOptions = [
        ...options.correct.map(text => ({ text, correct: true })),
        ...options.incorrect.map(text => ({ text, correct: false }))
    ].sort(() => Math.random() - 0.5);
    
    // Cria os elementos das opções
    allOptions.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.textContent = option.text;
        optionEl.draggable = true;
        optionEl.dataset.correct = option.correct;
        
        optionEl.addEventListener('dragstart', handleDragStart);
        
        optionsEl.appendChild(optionEl);
    });
}

// Destaca partes do corpo no SVG
function highlightBodyParts(parts) {
    // Remove destaque de todas as partes
    document.querySelectorAll('.body-part').forEach(part => {
        part.classList.remove('active');
    });
    
    // Adiciona destaque nas partes especificadas
    parts.forEach(partId => {
        const part = document.getElementById(partId);
        if (part) part.classList.add('active');
    });
}

// Configura os listeners de eventos
function setupEventListeners() {
    // Drag and Drop
    correctDropEl.addEventListener('dragover', handleDragOver);
    correctDropEl.addEventListener('drop', handleDrop);
    incorrectDropEl.addEventListener('dragover', handleDragOver);
    incorrectDropEl.addEventListener('drop', handleDrop);
    
    // Botões
    nextBtn.addEventListener('click', goToNextStep);
    resetBtn.addEventListener('click', resetProtocol);
}

// Handlers de Drag and Drop
function handleDragStart(e) {
    draggedOption = this;
    e.dataTransfer.setData('text/plain', this.textContent);
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('highlight');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('highlight');
    
    if (!draggedOption) return;
    
    const isCorrect = draggedOption.dataset.correct === 'true';
    const isCorrectZone = this.id === 'correct-drop';
    
    // Verifica se a resposta está correta
    const isRightAnswer = (isCorrect && isCorrectZone) || (!isCorrect && !isCorrectZone);
    
    // Feedback visual
    if (isRightAnswer) {
        feedbackEl.textContent = '✓ Resposta Correta!';
        feedbackEl.className = 'feedback correct';
        hasCorrectAnswer = true;
    } else {
        feedbackEl.textContent = '✗ Resposta Incorreta!';
        feedbackEl.className = 'feedback incorrect';
    }
    
    // Remove a opção arrastada
    draggedOption.remove();
    draggedOption = null;
}

// Navegação
function goToNextStep() {
    if (!hasCorrectAnswer && protocolSteps[currentStepIndex].options) {
        feedbackEl.textContent = 'Complete a verificação antes de prosseguir!';
        feedbackEl.className = 'feedback incorrect';
        return;
    }
    
    currentStepIndex++;
    
    if (currentStepIndex >= protocolSteps.length) {
        currentStepIndex = 0;
    }
    
    loadStep(currentStepIndex);
}

function resetProtocol() {
    currentStepIndex = 0;
    loadStep(currentStepIndex);
}

// Inicia o protocolo
init();
