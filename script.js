function formatarValor(valor) {
  if (!valor || valor.trim() === "--") return "--";
  let num = parseFloat(valor.replace(",", "."));
  if (isNaN(num)) return "--";
  if (num <= 1) num *= 100;
  return `${num.toFixed(2).replace(".", ",")}%`;
}

async function verificarCodigo() {
  const entrada = document.getElementById("codigoInput").value.replace(/\D/g, "");

  if (entrada.length !== 11) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Digite um CPF válido.</p>";
    return;
  }

  try {
    const response = await fetch("dados.csv");
    const csv = await response.text();
    const linhas = csv.trim().split("\n").slice(1);

    for (let linha of linhas) {
      const partes = linha.split(";"); // <- AGORA COM ; COMO DELIMITADOR
      const cpf = partes[0]?.replace(/\D/g, "");
      const nome = partes[1]?.trim();

      if (cpf === entrada) {
        const metaPdv = partes[2];
        const realPdv = partes[3];
        const metaHecto = partes[4];
        const realHecto = partes[5];
        const metaTracking = partes[6];
        const realTracking = partes[7];
        const metaDispersao = partes[8];
        const realDispersao = partes[9];

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

        document.querySelector(".container").innerHTML = `
          <img src="logo.png" alt="Logo Incobel" class="logo">
          <div class="dados-pessoais">
            <p><strong style="color:black;">Nome Completo:</strong> <span style="color:black;font-weight:normal">${nome}</span></p>
            <p><strong style="color:black;">CPF:</strong> <span style="color:black;font-weight:normal">${partes[0]}</span></p>
          </div>
          ${bloco("Devolução por PDV", metaPdv, realPdv)}
          ${bloco("Devolução por HECTOLITRO", metaHecto, realHecto)}
          ${bloco("Aderência ao TRACKING", metaTracking, realTracking)}
          ${bloco("Dispersão de KM", metaDispersao, realDispersao)}
        `;
        return;
      }
    }

    document.getElementById("resultado").innerHTML = "<p style='color:red'>CPF não encontrado.</p>";
  } catch (error) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Erro ao acessar dados.</p>";
  }
}
