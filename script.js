document.getElementById("codigoInput").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  let formatado = value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = formatado;
});

async function verificarCodigo() {
  const entrada = document.getElementById("codigoInput").value.replace(/\D/g, "");
  const container = document.querySelector(".container");

  if (entrada.length !== 11) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Digite um CPF válido com 11 dígitos.</p>";
    return;
  }

  try {
    const response = await fetch("dados.csv");
    const csv = await response.text();
    const linhas = csv.trim().split("\n").slice(1);

    for (let linha of linhas) {
      const partes = linha.split(",");

      const cpfBruto = partes[0]?.trim();
      const nome = partes[1]?.trim();
      const metaPdv = partes[2]?.trim() || "--";
      const realPdv = partes[3]?.trim() || "--";
      const metaHecto = partes[4]?.trim() || "--";
      const realHecto = partes[5]?.trim() || "--";
      const metaTracking = partes[6]?.trim() || "--";
      const realTracking = partes[7]?.trim() || "--";
      const metaDisp = partes[8]?.trim() || "--";
      const realDisp = partes[9]?.trim() || "--";

      const cpfLimpo = cpfBruto.replace(/\D/g, "");

      if (cpfLimpo === entrada) {
        const bloco = (titulo, meta, real) => `
          <div class="bloco">
            <div class="titulo-indicador">${titulo}</div>
            <div class="tabela-bloco">
              <div class="coluna-bloco">
                <div class="cabecalho-bloco">Meta</div>
                <div class="valor-bloco">${formatarValor(meta)}</div>
              </div>
              <div class="coluna-bloco">
                <div class="cabecalho-bloco">Real</div>
                <div class="valor-bloco">${formatarValor(real)}</div>
              </div>
            </div>
          </div>`;

        container.innerHTML = `
          <img src="logo.png" alt="Logo Incobel" class="logo" style="max-width: 200px; margin-bottom: 20px;">
          <div class="dados-pessoais">
            <p><strong>Nome Completo:</strong> <span class="valor-texto">${nome}</span></p>
            <p><strong>CPF:</strong> <span class="valor-texto">${cpfBruto}</span></p>
          </div>

          ${bloco("Devolução por PDV", metaPdv, realPdv)}
          ${bloco("Devolução por HECTOLITRO", metaHecto, realHecto)}
          ${bloco("Aderência ao TRACKING", metaTracking, realTracking)}
          ${bloco("Dispersão de KM", metaDisp, realDisp)}
        `;
        return;
      }
    }

    document.getElementById("resultado").innerHTML = "<p style='color:red'>CPF não encontrado.</p>";
  } catch (error) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Erro ao acessar o banco de dados.</p>";
  }
}

function formatarValor(valor) {
  if (valor === "--" || valor === "") return "--";
  const num = parseFloat(valor.replace(",", "."));
  if (isNaN(num)) return "--";
  return num.toFixed(2).replace(".", ",") + "%";
}
