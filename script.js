async function verificarCodigo() {
  const entrada = document.getElementById("codigoInput").value.trim().replace(/[^0-9A-Za-z]/g, "");
  const resultadoDiv = document.getElementById("resultado");

  if (!entrada) {
    resultadoDiv.innerHTML = "<p style='color:red'>Digite um código válido.</p>";
    return;
  }

  try {
    const response = await fetch("dados.csv");
    const csv = await response.text();

    const linhas = csv.trim().split("\n").slice(1);

    for (let linha of linhas) {
      const [cod, nome, status] = linha.split(",").map(item => item.trim().replace(/[^0-9A-Za-z]/g, ""));

      if (cod === entrada) {
        resultadoDiv.innerHTML = `
          <h2>Bem-vindo!</h2>
          <p><strong>Código:</strong> ${cod}</p>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Status:</strong> ${status}</p>
        `;
        return;
      }
    }

    resultadoDiv.innerHTML = "<p style='color:red'>Código não encontrado.</p>";
  } catch (error) {
    resultadoDiv.innerHTML = "<p style='color:red'>Erro ao acessar o banco de dados.</p>";
  }
}
