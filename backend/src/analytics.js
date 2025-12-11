import fetch from "node-fetch";

export async function sendGAEvent(eventName, params = {}) {
  try {
    await fetch(
      "https://www.google-analytics.com/mp/collect?measurement_id=G-YHXYD6VR5R&api_secret=" + process.env.GA_SECRET,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: params.userId || "server",
          events: [
            {
              name: eventName,
              params,
            },
          ],
        }),
      }
    );
  } catch (err) {
    console.error("GA Event Error:", err);
  }
}
