// engine.js — scoring skeleton (canonical)
// ensure every vector has all dims
function ensureVector(v){
  const out = {};
  dims.forEach(d => out[d] = v[d] || 0);
  return out;
}

function normalizeVector(raw, layerMax = 100){
  const norm = {};
  dims.forEach(d => {
    const max = layerMax || 100;
    norm[d] = max === 0 ? 0 : (raw[d] || 0) / max * 100;
  });
  return norm;
}

function computeFinalDNA(element, archetype, state, environment){
  const e = ensureVector(element);
  const a = ensureVector(archetype);
  const s = ensureVector(state);
  const env = ensureVector(environment);
  const finalDNA = {};
  dims.forEach(d => {
    finalDNA[d] =
      (e[d] || 0) * scoringWeights.element +
      (a[d] || 0) * scoringWeights.archetype +
      (s[d] || 0) * scoringWeights.state +
      (env[d] || 0) * scoringWeights.environment;
  });
  return finalDNA;
}

function cosineSimilarity(vecA, vecB){
  let dot=0, magA=0, magB=0;
  dims.forEach(d => {
    const a = vecA[d] || 0;
    const b = vecB[d] || 0;
    dot += a*b;
    magA += a*a;
    magB += b*b;
  });
  if(magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function matchSoulScent(finalDNA){
  let best=null, second=null;
  const scores = {};
  Object.keys(soulScents).forEach(name => {
    const scentVec = ensureVector(soulScents[name]);
    const sim = cosineSimilarity(finalDNA, scentVec);
    scores[name] = sim;
    if(best === null || sim > scores[best]) {
      second = best;
      best = name;
    } else if(second === null || sim > scores[second]) {
      second = name;
    }
  });
  const confidence = best && second ? Math.max(0, scores[best] - scores[second]) : 0;
  return { soulScent: best, similarityScores: scores, confidence, top: best, runnerUp: second };
}

// Example helper: element from birthdate (simple)
function elementFromZodiac(sign){
  return zodiacElements[sign] || null;
}
