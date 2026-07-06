import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

// La clé API Claude est stockée comme secret Firebase, jamais exposée au client.
// Définis-la avec :  firebase functions:secrets:set ANTHROPIC_API_KEY
const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

const MODEL = "claude-opus-4-8";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    repas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          jour: { type: "string" },
          type_repas: { type: "string" },
          titre: { type: "string" },
          description: { type: "string" }
        },
        required: ["jour", "type_repas", "titre", "description"]
      }
    },
    listes: {
      type: "object",
      additionalProperties: false,
      properties: {
        boucherie: { type: "array", items: { type: "string" } },
        saq: { type: "array", items: { type: "string" } },
        epicerie: { type: "array", items: { type: "string" } }
      },
      required: ["boucherie", "saq", "epicerie"]
    }
  },
  required: ["repas", "listes"]
};

function buildPrompt(p) {
  const envies = Array.isArray(p.envies) && p.envies.length ? p.envies.join(", ") : "aucune préférence particulière";
  let feedback = "";
  if (p.feedback && String(p.feedback).trim()) {
    feedback = `\n\nRetour du groupe (à prendre en compte) : ${String(p.feedback).trim()}`;
  }
  return `Tu es un assistant de planification de repas pour un séjour entre amis (contexte québécois : SAQ pour l'alcool, "dîner" = midi, "souper" = soir).

Détails du séjour :
- Nombre de personnes : ${p.nbPersonnes || 4}
- Nombre de jours : ${p.nbJours || 3}
- Participants : ${p.participants || "non précisés"}
- Contexte : ${p.contexte || "aucun détail supplémentaire"}
- Envies du moment : ${envies}
- Budget : ${p.budget || "équilibré"}
- Effort en cuisine : ${p.effort || "normal"}${feedback}

Génère un plan de repas complet et cohérent pour tout le séjour (déjeuner, dîner, collation, souper selon les jours et le contexte), en respectant les envies. Puis produis les listes d'achats organisées par magasin : boucherie (viandes), saq (vins, bières, spiritueux), epicerie (tout le reste).

IMPORTANT : ajuste les QUANTITÉS au nombre de personnes (${p.nbPersonnes || 4}) et de jours (${p.nbJours || 3}). Chaque item de liste doit inclure une quantité concrète (ex. "6 poitrines de poulet", "2 bouteilles de vin rouge", "1 douzaine d'œufs"). Réponds en français.`;
}

export const generatePlan = onCall(
  { secrets: [ANTHROPIC_API_KEY], region: "us-central1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY.value(),
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8000,
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
        messages: [{ role: "user", content: buildPrompt(request.data || {}) }]
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new HttpsError("internal", "Erreur API Claude (" + resp.status + ") : " + errText);
    }

    const data = await resp.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    if (!textBlock) {
      throw new HttpsError("internal", "Réponse vide de l'API Claude.");
    }
    return { plan: JSON.parse(textBlock.text) };
  }
);
