// --- Constantes ---
const AREA_VIGOTE_POR_METRO_LINEAR = 0.43;
const PERCENTUAL_FOLGA_TELA = 1.2;
const METRAGEM_PAINEL_TELA = 6;

const CAPAS_POR_M2 = 13;

const FATOR_EPS_1M_PROPORCAO = 2.2;
const FATOR_EPS_1M_FARDOS_POR_M2 = 11;

const FATOR_EPS_1_2M_PROPORCAO = 1.9;
const FATOR_EPS_1_2M_FARDOS_POR_M2 = 6;

// --- Variáveis globais ---
let vigotes = []; // [{v, c, qv}]
let relatorio = [];
let total_m = 0;

// --- Funções auxiliares ---
function formatarData(dataStr) {
  if (dataStr.length === 8 && /^\d+$/.test(dataStr)) {
    return `${dataStr.slice(0, 2)}/${dataStr.slice(2, 4)}/${dataStr.slice(4)}`;
  }
  return dataStr;
}

function validarData(dataStr) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dataStr)) return false;
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const data = new Date(`${ano}-${mes}-${dia}`);
  return data && data.getDate() === dia && data.getMonth() + 1 === mes && data.getFullYear() === ano;
}

function arredondarPersonalizado(valor) {
  const inteiro = Math.floor(valor);
  const decimal = valor - inteiro;
  if (decimal <= 0.2) return inteiro;
  else if (decimal <= 0.7) return inteiro + 0.5;
  else return inteiro + 1;
}

function arredondarCobertura(valor) {
  const decimal = valor - Math.floor(valor);
  return decimal > 0.5 ? Math.ceil(valor) : Math.floor(valor);
}

function arredondarTela(valor) {
  const inteiro = Math.floor(valor);
  const decimal = valor - inteiro;
  return decimal <= 0.2 ? inteiro : inteiro + 1;
}

// --- Funções de cálculo ---
function calcularVigotes(v, c) {
  let qv = c / AREA_VIGOTE_POR_METRO_LINEAR;
  const parteDecimal = qv - Math.floor(qv);
  qv = parteDecimal > 0.2 ? Math.floor(qv) + 1 : Math.floor(qv);
  const m = v * qv * AREA_VIGOTE_POR_METRO_LINEAR;
  return { qv, m };
}

function calcularQuantidadeTela(total) {
  const totalComFolga = total * PERCENTUAL_FOLGA_TELA;
  const arredondado = arredondarPersonalizado(totalComFolga);
  return arredondarTela(arredondado / METRAGEM_PAINEL_TELA);
}

function calcularQuantidadeCapas(m) {
  return arredondarCobertura(m * CAPAS_POR_M2);
}

function calcularQuantidadeFardosEPS(m, tipo) {
  let resultado = 0;
  if (tipo === "1") {
    resultado = (FATOR_EPS_1M_PROPORCAO * m) / FATOR_EPS_1M_FARDOS_POR_M2;
  } else if (tipo === "1.2") {
    resultado = (FATOR_EPS_1_2M_PROPORCAO * m) / FATOR_EPS_1_2M_FARDOS_POR_M2;
  }
  return arredondarCobertura(resultado);
}

// --- Ações do usuário ---
function adicionarVigote() {
  const v = parseFloat(document.getElementById("tamanhoVigote").value);
  const c = parseFloat(document.getElementById("comprimentoVigote").value);

  if (isNaN(v) || isNaN(c) || v <= 0 || c <= 0) {
    alert("Informe valores válidos para o vigote.");
    return;
  }

  const { qv, m } = calcularVigotes(v, c);
  vigotes.push({ v, c, qv });
  total_m += m;

  for (let i = 0; i < qv; i++) relatorio.push(v);

  const item = document.createElement("li");
  item.className = "list-group-item";
  item.textContent = `Adicionado: 1 vigote de ${v}m (total de ${qv} necessários)`;
  document.getElementById("listaVigotes").appendChild(item);

  document.getElementById("tamanhoVigote").value = "";
  document.getElementById("comprimentoVigote").value = "";
  document.getElementById("tamanhoVigote").focus();
}

function calcularOrcamento() {
  const cliente = document.getElementById("cliente").value.trim();
  let data = formatarData(document.getElementById("data").value.trim());

  if (!cliente || !validarData(data)) {
    alert("Preencha corretamente o nome do cliente e a data no formato DDMMAAAA.");
    return;
  }

  if (relatorio.length === 0) {
    alert("Adicione ao menos um vigote.");
    return;
  }

  const usarTela = document.querySelector('input[name="tela"]:checked')?.value || "2";
  const tipoCapa = document.querySelector('input[name="cobertura"]:checked')?.value || "";
  const tipoEPS = document.querySelector('input[name="tipoEps"]:checked')?.value || "";

  const m_arredondado = arredondarPersonalizado(total_m);
  const tamanhos = {};
  relatorio.forEach(v => tamanhos[v] = (tamanhos[v] || 0) + 1);

  const linhas = [];
  linhas.push(`Cliente: ${cliente}`);
  linhas.push(`Data: ${data}`);
  linhas.push("Vigotes necessários:");

  Object.keys(tamanhos)
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach(v => {
      const qtd = tamanhos[v];
      linhas.push(`${qtd}v ${parseFloat(v) % 1 === 0 ? parseInt(v) : v}m`);
    });

  linhas.push(`Metragem total (arredondada): ${m_arredondado.toFixed(2)} m²`);

  if (usarTela === "1") {
    const qTela = calcularQuantidadeTela(total_m);
    linhas.push("Cálculo de Tela:");
    linhas.push(`Painéis de tela: ${qTela}`);
    linhas.push(`Metragem total: ${qTela * METRAGEM_PAINEL_TELA} m²`);
  }

  if (tipoCapa === "capa") {
    const qCapas = calcularQuantidadeCapas(m_arredondado);
    linhas.push("Capa de cerâmica:");
    linhas.push(`Quantidade de capas: ${qCapas}`);
  } else if (tipoCapa === "eps") {
    const qFardos = calcularQuantidadeFardosEPS(m_arredondado, tipoEPS);
    linhas.push("EPS:");
    linhas.push(`Fardos de EPS de ${tipoEPS}m: ${qFardos}`);
  }

  document.getElementById("relatorio").value = linhas.join("\n");
}

function limparTudo() {
  document.getElementById("cliente").value = "";
  document.getElementById("data").value = "";
  document.getElementById("tamanhoVigote").value = "";
  document.getElementById("comprimentoVigote").value = "";
  document.getElementById("relatorio").value = "";
  document.getElementById("listaVigotes").innerHTML = "";

  vigotes = [];
  relatorio = [];
  total_m = 0;

  document.getElementById("telaNao").checked = true;
  document.querySelectorAll('input[name="cobertura"]').forEach(e => e.checked = false);
  document.querySelectorAll('input[name="tipoEps"]').forEach(e => e.checked = false);
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  if (vigotes.length === 0) {
    alert("Calcule o orçamento antes de salvar o PDF.");
    return;
  }

  const cliente = document.getElementById("cliente").value.trim();
  const dataOriginal = document.getElementById("data").value.trim();
  const dataFormatada = formatarData(dataOriginal);
  const clienteArquivo = cliente.replace(/\s+/g, "_");
  const dataArquivo = dataFormatada.replace(/\//g, "-");

  // --- Cabeçalho ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Relatório de Orçamento", 105, 20, { align: "center" });

  let y = 35;
  doc.setFontSize(14);
  doc.text(`Cliente: ${cliente}`, 20, y);
  y += 10;
  doc.text(`Data: ${dataFormatada}`, 20, y);
  y += 15;

  // --- Vigotes necessários ---
  doc.setFontSize(14);
  doc.text("Vigotes necessários:", 20, y);
  y += 10;

  const tamanhos = {};
  relatorio.forEach(v => tamanhos[v] = (tamanhos[v] || 0) + 1);

  Object.keys(tamanhos)
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach(v => {
      const qtd = tamanhos[v];
      const valor = parseFloat(v) % 1 === 0 ? parseInt(v) : v;
      doc.setFont("helvetica", "normal");
      doc.text(`${qtd}v ${valor}m`, 20, y);
      y += 8;
    });

  // --- Metragem total ---
  y += 5;
  const total_m_arredondado = arredondarPersonalizado(total_m);
  doc.setFont("helvetica", "bold");
  doc.text(`Metragem total (arredondada): ${total_m_arredondado.toFixed(2)} m²`, 20, y);
  y += 12;

  // --- Cálculo de tela ---
  const usarTela = document.querySelector('input[name="tela"]:checked')?.value || "2";
  if (usarTela === "1") {
    const qTela = calcularQuantidadeTela(total_m);
    doc.setFont("helvetica", "bold");
    doc.text("Cálculo de Tela:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Painéis de tela: ${qTela}`, 20, y);
    y += 8;
    doc.text(`Metragem total: ${qTela * METRAGEM_PAINEL_TELA} m²`, 20, y);
    y += 12;
  }

  // --- Cobertura ---
  const tipoCapa = document.querySelector('input[name="cobertura"]:checked')?.value || "";
  const tipoEPS = document.querySelector('input[name="tipoEps"]:checked')?.value || "";
  if (tipoCapa === "capa") {
    const qCapas = calcularQuantidadeCapas(total_m_arredondado);
    doc.setFont("helvetica", "bold");
    doc.text("Capa de cerâmica:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Quantidade de capas: ${qCapas}`, 20, y);
    y += 12;
  } else if (tipoCapa === "eps") {
    const qFardos = calcularQuantidadeFardosEPS(total_m_arredondado, tipoEPS);
    doc.setFont("helvetica", "bold");
    doc.text("EPS:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Fardos de EPS de ${tipoEPS}m: ${qFardos}`, 20, y);
    y += 12;
  }

  // --- Tabela de vigotes ---
  doc.setFont("helvetica", "bold");
  doc.text("Tabela de Vigotes:", 20, y);
  y += 5;

  const dadosTabela = [["V", "C"], ...vigotes.map(v => [String(v.v), String(v.c)])];
  doc.autoTable({
    head: [dadosTabela[0]],
    body: dadosTabela.slice(1),
    startY: y,
    styles: { font: "helvetica", halign: "center" },
    headStyles: { fillColor: [100, 100, 100], textColor: 255, fontStyle: "bold" },
    theme: "grid"
  });

  // --- Agradecimento ---
  y = doc.autoTable.previous.finalY + 15;
  doc.setFont("helvetica", "normal");
  doc.text("Obrigado por usar nosso sistema de orçamento!", 20, y);

  // --- Salvar arquivo ---
  doc.save(`Relatorio_${clienteArquivo}_${dataArquivo}.pdf`);
}
