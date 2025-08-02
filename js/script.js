  const app = document.getElementById("app");
  const loader = document.getElementById("loader");
  const chat = document.getElementById("chat");
  const saldoEl = document.getElementById("saldo");
  const btnPerguntar = document.getElementById("btnPerguntar");
  const areaPergunta = document.getElementById("areaPergunta");
  const areaSaque = document.getElementById("areaSaque");
  const saquePage = document.getElementById("paginaSaque");
  const saqueValor = document.getElementById("valorSaque");
  const tipoChave = document.getElementById("tipoChave");
  const inputPix = document.getElementById("chavePix");
  const notificacao = document.getElementById("notificacao");
  const saqueNotificacoes = document.getElementById("saqueNotificacoes");
  const audioDinheiro = document.getElementById("audio-dinheiro");

  let saldo = 0; let respostaEmAberto = false;
  let mensagensEnviadas = 0;
  const maxPerguntas = 5;
  let mask = null;

  const perguntas = [
    { pergunta: "Qual é a capital da França?", resposta: "Paris é a capital da França." },
    { pergunta: "Quem escreveu Dom Casmurro?", resposta: "Machado de Assis escreveu Dom Casmurro." },
    { pergunta: "O que é HTML?", resposta: "HTML é a linguagem usada para estruturar páginas web." },
    { pergunta: "Qual a fórmula da água?", resposta: "H2O é a fórmula da água." },
    { pergunta: "O que significa CPU?", resposta: "CPU significa Unidade Central de Processamento." },
    { pergunta: "Qual planeta é conhecido como planeta vermelho?", resposta: "Marte é conhecido como o planeta vermelho." },
    { pergunta: "Quem pintou a Mona Lisa?", resposta: "A Mona Lisa foi pintada por Leonardo da Vinci." },
    { pergunta: "Em que ano o homem pisou na Lua?", resposta: "1969 foi o ano da chegada do homem à Lua." },
    { pergunta: "Qual é o maior oceano da Terra?", resposta: "O Oceano Pacífico é o maior da Terra." },
    { pergunta: "Quem descobriu o Brasil?", resposta: "Pedro Álvares Cabral descobriu o Brasil." },
    { pergunta: "O que é um algoritmo?", resposta: "Algoritmo é um conjunto de instruções para resolver um problema." },
    { pergunta: "Qual é a capital do Japão?", resposta: "Tóquio é a capital do Japão." },
    { pergunta: "Quem criou a teoria da relatividade?", resposta: "Albert Einstein criou a teoria da relatividade." },
    { pergunta: "Quantos planetas existem no sistema solar?", resposta: "Existem 8 planetas no sistema solar." },
    { pergunta: "Qual é o menor país do mundo?", resposta: "O Vaticano é o menor país do mundo." },
    { pergunta: "Quem foi Shakespeare?", resposta: "William Shakespeare foi um famoso dramaturgo inglês." },
    { pergunta: "Qual é a moeda dos EUA?", resposta: "A moeda dos EUA é o dólar americano." },
    { pergunta: "O que é um software?", resposta: "Software é um conjunto de instruções que controlam um computador." },
    { pergunta: "Qual é o maior animal terrestre?", resposta: "O elefante africano é o maior animal terrestre." },
    { pergunta: "Qual é a língua mais falada do mundo?", resposta: "O mandarim é a língua mais falada do mundo." },
    { pergunta: "Quem foi Leonardo da Vinci?", resposta: "Leonardo da Vinci foi um polímata renascentista." },
    { pergunta: "O que é energia renovável?", resposta: "É a energia obtida de fontes naturais e sustentáveis." }
  ];

  window.onload = () => {
    setTimeout(() => {
      loader.style.display = "none";
      app.classList.remove("hidden");
    }, 2000);
  };

  function enviarPergunta() {
  if (mensagensEnviadas >= maxPerguntas || perguntas.length === 0) return;

  if (respostaEmAberto) {
    alert("Você precisa avaliar a resposta anterior antes de continuar.");
    return;
  }


  const index = Math.floor(Math.random() * perguntas.length);
  const item = perguntas.splice(index, 1)[0];

  adicionarMensagem(item.pergunta, 'user');

  const pensandoDiv = document.createElement("div");
  pensandoDiv.className = "p-3 rounded-lg shadow bg-gray-800 self-start max-w-[80%] animate-fadein";
  pensandoDiv.textContent = "Pensando...";
  chat.appendChild(pensandoDiv);
  chat.scrollTop = chat.scrollHeight;

  btnPerguntar.disabled = true;
  btnPerguntar.classList.add("opacity-50", "cursor-not-allowed");

  setTimeout(() => {
    pensandoDiv.remove();
        adicionarMensagem(item.resposta, 'bot', true);
    respostaEmAberto = true;

  }, 3000);
}


  function adicionarMensagem(texto, tipo, comEstrelas = false) {
    const div = document.createElement("div");
    div.className = `p-3 rounded-lg shadow ${tipo === 'user' ? 'bg-gray-700 self-end ml-auto' : 'bg-gray-800 self-start'} max-w-[80%] animate-fadein`;
    div.textContent = texto;
    chat.appendChild(div);

    if (comEstrelas) {
  const container = document.createElement("div");
  container.className = "flex gap-1 mt-1 justify-center";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "estrela";
    star.dataset.valor = i;
    star.onclick = () => avaliar(container, i);
    star.onmouseover = () => highlight(container, i);
    star.onmouseleave = () => highlight(container, 0);
    container.appendChild(star);
  }

  const legenda = document.createElement("p");
  legenda.textContent = "Avalie essa resposta";
  legenda.className = "text-xs text-gray-400 mt-1 text-center";

  const blocoEstrelas = document.createElement("div");
  blocoEstrelas.className = "flex flex-col items-center";
  blocoEstrelas.appendChild(container);
  blocoEstrelas.appendChild(legenda);

  chat.appendChild(blocoEstrelas);
}


    chat.scrollTop = chat.scrollHeight;
  }

  function avaliar(container, nota) {
  // Impede reavaliação
  if (container.dataset.avaliado === "true") return;

  container.dataset.avaliado = "true";

  container.querySelectorAll(".estrela").forEach((s, i) => {
    s.classList.toggle("selecionada", i < nota);
    s.style.pointerEvents = "none"; // desativa clique após avaliação
  });

  respostaEmAberto = false;

  const ganho = gerarValor();
  saldo += ganho;
  atualizarSaldo();
  mostrarNotificacao(ganho);
  try { audioDinheiro.play(); } catch(e) {}
  mensagensEnviadas++;

  // Remove bloco de avaliação após 1s
  setTimeout(() => {
    container.parentElement.remove(); // remove o bloco de avaliação inteiro
  }, 1000);

  // Libera o botão
  btnPerguntar.disabled = false;
  btnPerguntar.classList.remove("opacity-50", "cursor-not-allowed");

  if (mensagensEnviadas >= maxPerguntas) {
    areaPergunta.classList.add("hidden");
    areaSaque.classList.remove("hidden");
  }
}



  function highlight(container, nota) {
    container.querySelectorAll(".estrela").forEach((s, i) => {
      s.classList.toggle("hover", i < nota);
    });
  }

  function gerarValor() {
    return parseFloat((Math.random() * (42 - 20) + 50).toFixed(2));
  }

  function atualizarSaldo() {
    saldoEl.textContent = 'R$ ' + saldo.toFixed(2).replace('.', ',');
    saqueValor.textContent = saldoEl.textContent;
    saldoEl.classList.add("animate-scale");
    setTimeout(() => saldoEl.classList.remove("animate-scale"), 400);
  }

  function mostrarNotificacao(valor) {
    notificacao.textContent = `+R$${valor.toFixed(2).replace('.', ',')} adicionado à sua carteira`;
    notificacao.style.display = "block";
    setTimeout(() => notificacao.style.display = "none", 2500);
  }

  function abrirTelaSaque() {
  app.classList.add("hidden");
  saquePage.classList.remove("hidden");
  iniciarSaqueFake();

  iniciarContadorPix(); // ✅ Aqui é o lugar certo!
}


  const saqueNomes = [
  "João Silva", "Carla Mendes", "Lucas Pereira", "Ana Souza", "Fernando Lima",
  "Juliana Rocha", "Pedro Santos", "Beatriz Almeida", "Rafael Costa", "Larissa Gomes",
  "Bruno Martins", "Camila Dias", "André Barbosa", "Letícia Moraes", "Diego Henrique",
  "Natália Castro", "Thiago Fernandes", "Isabela Ribeiro", "Marcos Vinícius", "Aline Ferreira",
  "Ricardo Melo", "Débora Nogueira", "Eduardo Camargo", "Vanessa Luz", "Fábio Teixeira",
  "Sabrina Duarte", "Gustavo Araujo", "Patrícia Menezes", "Daniel Souza", "Fernanda Lopes",
  "César Antunes", "Amanda Prado", "Murilo Bernardes", "Bianca Sampaio", "Alexandre Costa",
  "Elaine Figueiredo", "Renato Mello", "Tainá Ramos", "Douglas Vieira", "Paola Martins"
];


let nomesDisponiveis = [...saqueNomes];

function iniciarSaqueFake() {
  setInterval(() => {
    if (nomesDisponiveis.length === 0) return; // Evita erro ao esgotar lista

    // Remove notificação anterior
    saqueNotificacoes.innerHTML = "";

    // Sorteia nome único
    const index = Math.floor(Math.random() * nomesDisponiveis.length);
    const nome = nomesDisponiveis.splice(index, 1)[0]; // Remove da lista
    const valor = (Math.random() * (500 - 250) + 400).toFixed(2).replace(".", ",");

    const div = document.createElement("div");
    div.className = "bg-green-600 text-white px-4 py-2 rounded-full shadow-lg animate-fadein text-sm";
    div.textContent = `${nome} acabou de sacar R$ ${valor}`;

    saqueNotificacoes.appendChild(div);

    // Remove após 3 segundos (sincronizado com o próximo)
    setTimeout(() => {
      if (div.parentElement) {
        div.remove();
      }
    }, 3900);
  }, 4000);
}


function irParaCheckout() {
  const btn = document.getElementById("btnPagar");
  const texto = document.getElementById("btnPagarTexto");
  const spinner = document.getElementById("btnSpinner");

  // Inicia loading
  spinner.classList.remove("hidden");
  texto.textContent = "Redirecionando...";
  btn.disabled = true;
  btn.classList.add("opacity-60", "cursor-not-allowed");

  // Simula tempo de redirecionamento
  setTimeout(() => {
    window.location.href = "https://pay.br-pagamentoseguro.site/65XDZB8QqK7gVJw"; // ⬅️ coloque o seu link real aqui
  }, 1200);
}


  function iniciarVideo() {
    const video = document.getElementById('video');
    const capa = document.getElementById('videoCover');

    capa.style.display = 'none'; // Esconde a capa
    video.play(); // Dá play no vídeo
  }

  function iniciarContadorPix() {
  let tempo = 300; // 5 minutos

  function atualizarContador() {
    const contador = document.getElementById('contadorPix'); // pega sempre na hora
    if (!contador) return; // evita erro se elemento ainda não existir

    const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
    const segundos = String(tempo % 60).padStart(2, '0');
    contador.textContent = `${minutos}:${segundos}`;
    tempo--;

    if (tempo >= 0) {
      setTimeout(atualizarContador, 1000);
    } else {
      contador.textContent = "00:00"; // ou “Expirado”
    }
  }

  atualizarContador(); // inicia
}



