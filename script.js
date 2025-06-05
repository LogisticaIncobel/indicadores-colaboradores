async function verificarCodigo() {
  const codigo = document.getElementById("codigoInput").value.trim();
  const resultadoDiv = document.getElementById("resultado");

  if (!codigo) {
    resultadoDiv.innerHTML = "<p style='color:red'>Digite um código válido.</p>";
    return;
  }

  try {
    const response = await fetch("dados.csv");
    const csv = await response.text();

    const linhas = csv.trim().split("\n").slice(1);

    for (let linha of linhas) {
      const [cod, nome, status] = linha.split(",").map(item => item.trim());

      if (cod === codigo) {
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
