// Máscara automática enquanto digita
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
    const linhas = csv.trim().split("\n").slice(1); // Remove cabeçalho

    for (let linha of linhas) {
      const partes = linha.split(",");
      const cpfBruto = partes[0].trim(); // CPF vem na primeira coluna
      const nome = partes[1]?.trim() || "";
      const dispersao = partes.slice(2).join(",").trim(); // Junta tudo que sobra

      const cpfLimpo = cpfBruto.replace(/\D/g, ""); // Remove pontos e traços do CSV também

      if (cpfLimpo === entrada) {
        container.innerHTML = `
          <img src="logo.png" alt="Logo Incobel" class="logo" style="max-width: 240px; margin-bottom: 20px;">
          <h2 style="color: #004aad; margin-bottom: 30px;">Bem-vindo, ${nome.split(" ")[0]}!</h2>
          <div class="painel">
            <p><strong>CPF:</strong> ${cpfBruto}</p>
            <p><strong>Nome completo:</strong> ${nome}</p>
            <p><strong>Dispersão KM:</strong> ${dispersao}</p>
          </div>
        `;
        return;
      }
    }

    document.getElementById("resultado").innerHTML = "<p style='color:red'>CPF não encontrado.</p>";
  } catch (error) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Erro ao acessar o banco de dados.</p>";
  }
}
