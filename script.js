async function analyzeToken() {
  const token = document.getElementById("tokenInput").value;
  const resultDiv = document.getElementById("result");

  resultDiv.classList.remove("hidden");
  resultDiv.innerHTML = `<div class="spinner"></div>`;

  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token}`);
    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      resultDiv.innerHTML = "Token not found.";
      return;
    }

    const pair = data.pairs[0];

    const liquidity = pair.liquidity?.usd || 0;
    const volume = pair.volume?.h24 || 0;

    let score = 0;

    // Liquidity scoring
    if (liquidity > 100000) score += 30;
    else if (liquidity > 50000) score += 20;
    else score += 10;

    // Volume scoring
    if (volume > 100000) score += 30;
    else if (volume > 50000) score += 20;
    else score += 10;

    // Determine score color
    let scoreClass = "";
    if (score >= 50) scoreClass = "score-green";
    else if (score >= 30) scoreClass = "score-yellow";
    else scoreClass = "score-red";

    // Risk warning
    let warningMessage = "";
    if (liquidity < 20000) {
      warningMessage = `<div class="warning">⚠ Low Liquidity Risk</div>`;
    }

    resultDiv.innerHTML = `
      <h2 class="${scoreClass}">Health Score: ${score}/60</h2>
      <p>Liquidity: $${liquidity.toLocaleString()}</p>
      <p>24h Volume: $${volume.toLocaleString()}</p>
      ${warningMessage}
    `;

  } catch (error) {
    resultDiv.innerHTML = "Error fetching data.";
  }
}