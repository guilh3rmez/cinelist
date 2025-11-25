/**
 * ============================================================
 * 🎬 PROJETO: CINELIST (BUSCADOR DE SÉRIES)
 * Conceitos: Fetch API, Async/Await, Manipulação de Arrays, LocalStorage
 * ============================================================
 */

// ============================================================
// 1. ESTADO DA APLICAÇÃO
// ============================================================

// Guarda os resultados temporários da busca (vinda da API)
let listaBusca = [];

// Guarda os favoritos do usuário (vinda do LocalStorage)
let listaFavoritos = [];


// ============================================================
// 2. BUSCA DE DADOS (API)
// ============================================================

/**
 * Função assíncrona que vai até o servidor do TVMaze buscar as séries.
 */
async function buscarSeries() {
    const inputBusca = document.getElementById("busca-input");
    const termo = inputBusca.value;

    // Faz a requisição para a API
    const resposta = await fetch(`https://api.tvmaze.com/search/shows?q=${termo}`);
    
    // Converte a resposta para JSON (Lista de Objetos)
    const dados = await resposta.json();
    
    // Salva na variável global para usarmos depois (no favoritar)
    listaBusca = dados;

    // Limpa a área de resultados antes de desenhar
    const containerResultados = document.getElementById("lista-resultados");
    containerResultados.innerHTML = "";

    // Percorre a lista e desenha cada cartão
    dados.forEach(item => {
        // Truque: ?. verifica se a imagem existe antes de tentar acessar o .medium
        // Se não existir, usa a imagem placeholder.
        const imagem = item.show.image?.medium || 'https://via.placeholder.com/210x295?text=Sem+Imagem';

        containerResultados.innerHTML += `
            <div class="filme-card">
                <img src="${imagem}" alt="${item.show.name}">
                <div class="filme-info">
                    <div class="filme-titulo">${item.show.name}</div>
                    <!-- O botão chama a função salvarFavorito passando o ID da série -->
                    <button class="btn-fav" onclick="salvarFavorito('${item.show.id}')">❤️ Favoritar</button>
                </div>
            </div>
        `;
    });
}


// ============================================================
// 3. GERENCIAMENTO DE FAVORITOS
// ============================================================

/**
 * Adiciona uma série aos favoritos se ela ainda não estiver lá.
 */
function salvarFavorito(idSerie) {
    // 1. Encontra o objeto completo da série na lista de busca
    // (Usamos == dois iguais porque o ID pode vir como texto ou número)
    const serieEncontrada = listaBusca.find(item => item.show.id == idSerie);

    // 2. Verifica se já existe na lista de favoritos para evitar duplicatas
    const jaExiste = listaFavoritos.some(item => item.show.id == idSerie);

    if (jaExiste) {
        alert("Esta série já está nos seus favoritos!");
        return;
    } 
    
    // 3. Se não existe, adiciona e salva
    listaFavoritos.push(serieEncontrada);
    atualizarFavoritos(); // Redesenha a tela
    salvarNavegador();    // Salva no HD
}

/**
 * Remove uma série dos favoritos (Usada pelo botão vermelho)
 */
function removerFavorito(idSerie) {
    // Filtra a lista mantendo apenas quem NÃO tem esse ID
    listaFavoritos = listaFavoritos.filter(item => item.show.id != idSerie);
    
    atualizarFavoritos();
    salvarNavegador();
}


// ============================================================
// 4. VISUALIZAÇÃO (DOM)
// ============================================================

/**
 * Desenha a lista de favoritos na tela.
 */
function atualizarFavoritos() {
    const containerFavoritos = document.getElementById("lista-favoritos");
    containerFavoritos.innerHTML = ""; // Limpa antes de desenhar

    listaFavoritos.forEach(item => {
        const imagem = item.show.image?.medium || 'https://via.placeholder.com/210x295?text=Sem+Imagem';

        containerFavoritos.innerHTML += `
            <div class="filme-card">
                <img src="${imagem}" alt="${item.show.name}">
                <div class="filme-info">
                    <div class="filme-titulo">${item.show.name}</div>
                    <!-- Botão vermelho que chama removerFavorito -->
                    <button class="btn-fav" style="background: #e50914;" onclick="removerFavorito('${item.show.id}')">Remover</button>
                </div>
            </div>
        `;
    });
}


// ============================================================
// 5. PERSISTÊNCIA (LocalStorage)
// ============================================================

function salvarNavegador() {
    localStorage.setItem("cine-favoritos", JSON.stringify(listaFavoritos));
}

function carregarNavegador() {
    const dados = localStorage.getItem("cine-favoritos");
    if (dados != null) {
        listaFavoritos = JSON.parse(dados);
        atualizarFavoritos(); // Desenha assim que carrega
    }
}

// Inicia o carregamento ao abrir a página
carregarNavegador();