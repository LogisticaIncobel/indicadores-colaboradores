async function verificarCodigo() {
  const entrada = document.getElementById("codigoInput").value.trim().replace(/[^0-9A-Za-z]/g, "");
  const container = document.querySelector(".container");

  if (!entrada) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Digite um código válido.</p>";
    return;
  }

  try {
    const response = await fetch("dados.csv");
    const csv = await response.text();

    const linhas = csv.trim().split("\n").slice(1);

    for (let linha of linhas) {
      const [cod, nome, dispersao] = linha.split(",").map(item => item.trim().toString().replace(/[^0-9A-Za-zÀ-ÿ ,]/g, ""));

      if (cod === entrada) {
        container.innerHTML = `
          <img src="logo.png" alt="Logo Incobel" class="logo" style="max-width: 240px; margin-bottom: 20px;">
          <h2 style="color: #004aad; margin-bottom: 30px;">Bem-vindo, ${nome.split(" ")[0]}!</h2>
          <div class="painel">
            <p><strong>Código:</strong> ${cod}</p>
            <p><strong>Nome completo:</strong> ${nome}</p>
            <p><strong>Dispersão KM:</strong> ${dispersao}</p>
          </div>
        `;
        return;
      }
    }

    document.getElementById("resultado").innerHTML = "<p style='color:red'>Código não encontrado.</p>";
  } catch (error) {
    document.getElementById("resultado").innerHTML = "<p style='color:red'>Erro ao acessar o banco de dados.</p>";
  }
}
