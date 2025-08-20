const precos = {
  laje: {
    h08: { nome: "Laje H-08", cartao: 44.90, avista: 42.90 },
    h08_5_16: { nome: "Laje H-08 5/16", cartao: 61.90, avista: 58.90 },
    h08_3_8: { nome: "Laje H-08 3/8", cartao: 67.90, avista: 64.90 },
    h08_1_2: { nome: "Laje H-08 1/2", cartao: 84.90, avista: 81.90 },
    h12: { nome: "Laje H-12", cartao: 54.90, avista: 52.90 },
    h12_5_16: { nome: "Laje H-12 5/16", cartao: 72.90, avista: 69.90 },
    h12_3_8: { nome: "Laje H-12 3/8", cartao: 76.90, avista: 73.90 },
    h12_1_2: { nome: "Laje H-12 1/2", cartao: 88.90, avista: 85.90 },
    h16: { nome: "Laje H-16", cartao: 81.90, avista: 78.90 },
    h16_5_16: { nome: "Laje H-16 5/16", cartao: 86.90, avista: 83.90 },
    h16_3_8: { nome: "Laje H-16 3/8", cartao: 89.90, avista: 86.90 },
    h16_1_2: { nome: "Laje H-16 1/2", cartao: 96.90, avista: 93.90 },
    h20: { nome: "Laje H-20", cartao: 104.90, avista: 101.90 },
    h20_5_16: { nome: "Laje H-20 5/16", cartao: 112.90, avista: 109.90 },
    h20_3_8: { nome: "Laje H-20 3/8", cartao: 122.90, avista: 119.90 },
    h20_1_2: { nome: "Laje H-20 1/2", cartao: 126.90, avista: 123.90 }
  },
  tela: {
    "3.4": { nome: "Tela 3,4 (20x20)", cartao: 7.90, avista: 7.50 },
    "4.2_20": { nome: "Tela 4,2 (20x20)", cartao: 11.90, avista: 11.50 },
    "4.2_15": { nome: "Tela 4,2 (15x15)", cartao: 16.90, avista: 16.50 }
  },
  caixa: { nome: "Caixa de Luz", preco: 15.00 }
};

function calcularSimples() {
  let resultadoHTML = "";
  let totalCartao = 0;
  let totalAvista = 0;

  const tipoLaje = document.getElementById("lajeTipo").value;
  const qtdLaje = parseFloat(document.getElementById("lajeQtd").value) || 0;
  if (tipoLaje && qtdLaje > 0) {
    const precoCartao = precos.laje[tipoLaje].cartao * qtdLaje;
    const precoAvista = precos.laje[tipoLaje].avista * qtdLaje;
    resultadoHTML += `<div>${qtdLaje}m² de ${precos.laje[tipoLaje].nome} — R$${precoCartao.toFixed(2)} (6x) ou R$${precoAvista.toFixed(2)} à vista</div>`;
    totalCartao += precoCartao;
    totalAvista += precoAvista;
  }

  const tipoTela = document.getElementById("telaTipo").value;
  const qtdTela = parseFloat(document.getElementById("telaQtd").value) || 0;
  if (tipoTela && qtdTela > 0) {
    const precoCartao = precos.tela[tipoTela].cartao * qtdTela;
    const precoAvista = precos.tela[tipoTela].avista * qtdTela;
    resultadoHTML += `<div>${qtdTela}m² de ${precos.tela[tipoTela].nome} — R$${precoCartao.toFixed(2)} (6x) ou R$${precoAvista.toFixed(2)} à vista</div>`;
    totalCartao += precoCartao;
    totalAvista += precoAvista;
  }

  const qtdCaixas = parseFloat(document.getElementById("caixasQtd").value) || 0;
  if (qtdCaixas > 0) {
    const precoCaixa = precos.caixa.preco * qtdCaixas;
    resultadoHTML += `<div>${qtdCaixas} ${precos.caixa.nome}${qtdCaixas > 1 ? 's' : ''} — R$${precoCaixa.toFixed(2)}</div>`;
    totalCartao += precoCaixa;
    totalAvista += precoCaixa;
  }

  resultadoHTML += `<div class="mt-2"><strong>Total (6x): R$${totalCartao.toFixed(2)}</strong></div>`;
  resultadoHTML += `<div><strong>Total à vista: R$${totalAvista.toFixed(2)}</strong></div>`;

  document.getElementById("resultadoSimples").innerHTML = resultadoHTML;
}
