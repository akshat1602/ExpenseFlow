// Very small, deterministic predictor: linear trend using least squares on monthly data
export function predictNextMonth(monthlySpending = []) {
  // monthlySpending: [{ month: 'Jan', amount: Number }, ...]
  if (!monthlySpending || monthlySpending.length < 2) return { prediction: 0, confidence: 0 };

  const n = monthlySpending.length;
  // x will be 0..n-1
  const xs = monthlySpending.map((_, i) => i);
  const ys = monthlySpending.map(m => Number(m.amount) || 0);

  const meanX = xs.reduce((a,b) => a+b,0)/n;
  const meanY = ys.reduce((a,b) => a+b,0)/n;

  let num = 0, den = 0;
  for (let i=0;i<n;i++){
    num += (xs[i]-meanX)*(ys[i]-meanY);
    den += (xs[i]-meanX)*(xs[i]-meanX);
  }

  const slope = den === 0 ? 0 : num/den;
  const intercept = meanY - slope*meanX;

  const nextX = n; // predict next index
  const prediction = Math.max(0, Math.round(intercept + slope*nextX));

  // crude confidence: based on R-squared
  let ssTot = 0, ssRes = 0;
  for (let i=0;i<n;i++){
    const yPred = intercept + slope*xs[i];
    ssTot += (ys[i]-meanY)*(ys[i]-meanY);
    ssRes += (ys[i]-yPred)*(ys[i]-yPred);
  }
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes/ssTot);

  return { prediction, confidence: Math.round(r2*100) };
}
