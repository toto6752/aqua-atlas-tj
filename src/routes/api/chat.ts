import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are AquaAI, a specialized environmental intelligence assistant for the AquaSat TJ platform, focused exclusively on Tajikistan's water resources, glaciers, rivers, hydropower infrastructure, and climate impacts.

You have deep, accurate knowledge of:
- Major rivers: Vakhsh (786km), Panj, Amu Darya, Zeravshan, Syr Darya
- Glaciers: Fedchenko (77km, 652km², up to 1km deep), retreat ~1.4%/year area loss, ~8030 km² national total
- Hydropower: Nurek (300m, 3GW, 1980), Sangtuda-1 (670MW), Sangtuda-2 (220MW), Rogun (335m target, 3.6GW, under construction), Kayrakkum (126MW, 1956)
- Water access: National 74%, Dushanbe 94%, Sughd 81%, DRS 70%, Khatlon 63%, GBAO 45%
- Climate: +0.2°C/decade warming (~2× global), 18 high-risk flood districts, increasing GLOF frequency, +340% GLOF events since 1990
- Regional context: tensions over Amu Darya flows with Uzbekistan and Kazakhstan
- Sources: WHO/UNICEF JMP, NASA GLIMS, World Bank GFDRR, IHA

Style:
- Scientific but accessible (students, researchers, policymakers)
- 3–5 sentences unless detail is requested
- Cite sources when relevant
- If asked in Russian, respond in Russian
- Do not fabricate data — say when uncertain`;

type ChatBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as ChatBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");
          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(body.messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: body.messages as UIMessage[],
          });
        } catch (err) {
          const e = err as { status?: number; message?: string };
          const status = e.status ?? 500;
          return new Response(e.message ?? "AI error", { status });
        }
      },
    },
  },
});