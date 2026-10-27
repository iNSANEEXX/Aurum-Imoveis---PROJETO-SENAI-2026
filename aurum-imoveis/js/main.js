// ============================================================
//  AURUM | main.js
//  Autor: Desenvolvedor Aurum
//  Funcionalidades: catálogo dinâmico, filtros com URL params,
//  busca por texto, ordenação, modal de detalhes e formulário
// ============================================================

// ----- BANCO DE DADOS DOS IMÓVEIS -----
const IMOVEIS = [
  {
    id: "AU-101",
    title: "Mansão com Vista Panorâmica",
    type: "casas",
    city: "rj",
    price: 38500000,
    priceFormatted: "R$ 38.500.000",
    area: 1250,
    quartos: 5,
    vagas: 8,
    badge: "Exclusivo",
    location: "Joá, Rio de Janeiro",
    image: "assets/images/hero-mansion.jpg",
    desc: "Mansão com linhas contemporâneas sobre o oceano Atlântico. Piscina de borda infinita, adega climatizada e automação residencial completa."
  },
  {
    id: "AU-202",
    title: "Penthouse Triplex no Itaim",
    type: "penthouses",
    city: "sp",
    price: 29000000,
    priceFormatted: "R$ 29.000.000",
    area: 840,
    quartos: 4,
    vagas: 6,
    badge: "Vista 360°",
    location: "Itaim Bibi, São Paulo",
    image: "assets/images/penthouse.jpg",
    desc: "Penthouse triplex com pé-direito duplo, lareira em mármore Calacatta, terraço privativo com jacuzzi e elevador privativo."
  },
  {
    id: "AU-303",
    title: "Residência nos Jardins",
    type: "casas",
    city: "sp",
    price: 24500000,
    priceFormatted: "R$ 24.500.000",
    area: 920,
    quartos: 4,
    vagas: 6,
    badge: "Design Premiado",
    location: "Jardim Paulistano, São Paulo",
    image: "assets/images/villa-garden.jpg",
    desc: "Arquitetura brutalista em concreto aparente com jardim tropical e espelho d'água. Projeto paisagístico maduro e rua fechada com guarita."
  },
  {
    id: "AU-404",
    title: "Apartamento Frontal Mar no Leblon",
    type: "apartamentos",
    city: "rj",
    price: 19800000,
    priceFormatted: "R$ 19.800.000",
    area: 420,
    quartos: 4,
    vagas: 4,
    badge: "Frontal Mar",
    location: "Leblon, Rio de Janeiro",
    image: "assets/images/leblon-balcony.jpg",
    desc: "Varanda panorâmica com vista para o Morro Dois Irmãos e todo o azul do mar. Planta circular com acabamentos impecáveis."
  },
  {
    id: "AU-505",
    title: "Villa na Fazenda Boa Vista",
    type: "campo",
    city: "campo",
    price: 32000000,
    priceFormatted: "R$ 32.000.000",
    area: 1600,
    quartos: 6,
    vagas: 10,
    badge: "Refúgio de Campo",
    location: "Fazenda Boa Vista, Porto Feliz, SP",
    image: "assets/images/fazenda-residence.jpg",
    desc: "Terreno de 3.500 m² com piscina aquecida, fire pit externo e acesso ao campo de golfe e centro hípico."
  },
  {
    id: "AU-606",
    title: "Duplex com Adega nos Jardins",
    type: "apartamentos",
    city: "sp",
    price: 15900000,
    priceFormatted: "R$ 15.900.000",
    area: 510,
    quartos: 3,
    vagas: 4,
    badge: "Design Contemporâneo",
    location: "Jardins, São Paulo",
    image: "assets/images/jardins-duplex.jpg",
    desc: "Escada helicoidal em madeira maciça, adega climatizada em vidro piso-teto e projeto de iluminação assinado."
  }
];

// ============================================================
//  INICIALIZAÇÃO — aguarda o DOM estar completamente carregado
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Detecta a página atual pelo ID de elementos únicos
  if (document.getElementById("home-grid")) {
    initHomePage();
  }

  if (document.getElementById("catalog-grid")) {
    initCatalogPage();
  }

  initModal();
  initNavHighlight();
});

// ============================================================
//  NAVEGAÇÃO — destaca o link ativo e adiciona scroll suave
// ============================================================
function initNavHighlight() {
  // Scroll suave para âncoras (#contato, #sobre, etc.)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Deixa o cabeçalho com uma sombra ao rolar a página
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.4)";
    } else {
      header.style.boxShadow = "none";
    }
  });
}

// ============================================================
//  PÁGINA INICIAL — renderiza os 3 imóveis em destaque
// ============================================================
function initHomePage() {
  const grid = document.getElementById("home-grid");
  // Seleciona os 3 primeiros imóveis para o destaque
  const destaques = IMOVEIS.slice(0, 3);
  grid.innerHTML = destaques.map(criarCardHTML).join("");
}

// ============================================================
//  PÁGINA DE CATÁLOGO — filtros, busca e ordenação
// ============================================================
function initCatalogPage() {
  // Lê os parâmetros passados pela URL (ex: imoveis.html?type=casas)
  const params = new URLSearchParams(window.location.search);

  const fType     = document.getElementById("f-type");
  const fLoc      = document.getElementById("f-location");
  const fPrice    = document.getElementById("f-price");
  const fKeyword  = document.getElementById("f-keyword");
  const fSort     = document.getElementById("f-sort");
  const btnReset  = document.getElementById("btn-reset");

  // Aplica os parâmetros da URL nos filtros, se existirem
  if (params.get("type") && fType)    fType.value    = params.get("type");
  if (params.get("location") && fLoc) fLoc.value     = params.get("location");

  // Adiciona os event listeners de cada filtro
  fType?.addEventListener("change", renderCatalog);
  fLoc?.addEventListener("change", renderCatalog);
  fPrice?.addEventListener("change", renderCatalog);
  fSort?.addEventListener("change", renderCatalog);

  // Busca por texto com pequeno delay para não filtrar a cada tecla
  let searchTimer;
  fKeyword?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderCatalog, 300);
  });

  // Botão "Limpar filtros" — reseta tudo
  btnReset?.addEventListener("click", () => {
    if (fType)    fType.value    = "todos";
    if (fLoc)     fLoc.value     = "todos";
    if (fPrice)   fPrice.value   = "todos";
    if (fSort)    fSort.value    = "padrao";
    if (fKeyword) fKeyword.value = "";
    renderCatalog();
  });

  // Primeira renderização ao carregar a página
  renderCatalog();
}

// ============================================================
//  RENDERIZAÇÃO DO CATÁLOGO — aplica todos os filtros
// ============================================================
function renderCatalog() {
  const type    = document.getElementById("f-type")?.value    || "todos";
  const city    = document.getElementById("f-location")?.value || "todos";
  const price   = document.getElementById("f-price")?.value   || "todos";
  const keyword = document.getElementById("f-keyword")?.value.toLowerCase().trim() || "";
  const sort    = document.getElementById("f-sort")?.value    || "padrao";

  const countEl = document.getElementById("results-count");
  const grid    = document.getElementById("catalog-grid");

  // Filtragem sequencial da lista de imóveis
  let lista = IMOVEIS.filter(im => {
    if (type !== "todos" && im.type !== type) return false;
    if (city !== "todos" && im.city !== city) return false;

    if (price === "ate20"   && im.price > 20000000)                              return false;
    if (price === "20a30"   && (im.price < 20000000 || im.price > 30000000))     return false;
    if (price === "acima30" && im.price <= 30000000)                              return false;

    // Busca por texto no título, localização e descrição
    if (keyword) {
      const textos = `${im.title} ${im.location} ${im.desc}`.toLowerCase();
      if (!textos.includes(keyword)) return false;
    }

    return true;
  });

  // Ordenação
  if (sort === "menor-preco")   lista.sort((a, b) => a.price - b.price);
  if (sort === "maior-preco")   lista.sort((a, b) => b.price - a.price);
  if (sort === "maior-area")    lista.sort((a, b) => b.area  - a.area);

  // Atualiza o contador de resultados
  if (countEl) {
    countEl.textContent = lista.length === 0
      ? "Nenhum imóvel encontrado."
      : `${lista.length} imóvel(is) encontrado(s)`;
  }

  // Renderiza os cards ou mensagem de vazio
  if (lista.length === 0) {
    grid.innerHTML = `<p style="color:#888; padding:40px 0; grid-column:1/-1;">
      Nenhum imóvel corresponde aos filtros selecionados.
    </p>`;
    return;
  }

  grid.innerHTML = lista.map(criarCardHTML).join("");
}

// ============================================================
//  CRIAR HTML DO CARD
// ============================================================
function criarCardHTML(im) {
  return `
    <article class="property-card" data-id="${im.id}">
      <div class="card-img" onclick="abrirModal('${im.id}')">
        <img src="${im.image}" alt="${im.title}" loading="lazy">
        <span class="card-badge">${im.badge}</span>
      </div>
      <div class="card-body">
        <p class="card-location">${im.location}</p>
        <h3 class="card-title" onclick="abrirModal('${im.id}')">${im.title}</h3>
        <div class="card-specs">
          <span>${im.area} m²</span>
          <span>${im.quartos} quartos</span>
          <span>${im.vagas} vagas</span>
        </div>
        <div class="card-footer">
          <span class="card-price">${im.priceFormatted}</span>
          <button class="btn-outline" onclick="abrirModal('${im.id}')"
            style="padding:8px 16px; font-size:0.82rem;">
            Ver Detalhes
          </button>
        </div>
      </div>
    </article>
  `;
}

// ============================================================
//  MODAL DE DETALHES DO IMÓVEL
// ============================================================
function initModal() {
  const overlay  = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");

  // Fecha clicando no botão X
  closeBtn?.addEventListener("click", fecharModal);

  // Fecha clicando fora da caixa do modal
  overlay?.addEventListener("click", e => {
    if (e.target === overlay) fecharModal();
  });

  // Fecha pressionando Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") fecharModal();
  });
}

function abrirModal(id) {
  const im = IMOVEIS.find(i => i.id === id);
  if (!im) return;

  // Preenche os campos do modal com os dados do imóvel
  document.getElementById("modal-img").src       = im.image;
  document.getElementById("modal-img").alt       = im.title;
  document.getElementById("modal-badge").textContent    = im.badge;
  document.getElementById("modal-title").textContent    = im.title;
  document.getElementById("modal-location").textContent = im.location;
  document.getElementById("modal-desc").textContent     = im.desc;
  document.getElementById("modal-price").textContent    = im.priceFormatted;

  document.getElementById("modal-specs").innerHTML = `
    <span>${im.area} m²</span>
    <span>${im.quartos} quartos</span>
    <span>${im.vagas} vagas</span>
  `;

  // Monta a mensagem pré-formatada para o WhatsApp
  const msgWhats = encodeURIComponent(
    `Olá! Vi o imóvel "${im.title}" (Cód: ${im.id}) no valor de ${im.priceFormatted} e gostaria de mais informações.`
  );
  document.getElementById("modal-whats").href = `https://wa.me/5511998724011?text=${msgWhats}`;

  // Abre o modal
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  document.getElementById("modal-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

// ============================================================
//  FORMULÁRIO DE CONTATO
// ============================================================
function handleForm(e) {
  e.preventDefault();

  const nome  = document.getElementById("name")?.value.trim()  || "Cliente";
  const email = document.getElementById("email")?.value.trim() || "";

  // Validação simples antes de enviar
  if (!nome || !email) {
    showToast("Por favor, preencha nome e e-mail.");
    return;
  }

  showToast(`Obrigado, ${nome}! Entraremos em contato em breve.`);
  e.target.reset();
}

// ============================================================
//  NOTIFICAÇÃO TIPO TOAST (mensagem temporária)
// ============================================================
function showToast(mensagem) {
  // Cria o container de toasts se ainda não existir
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensagem;
  container.appendChild(toast);

  // Remove o toast após 4 segundos
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
