export async function trackEvent(eventType, metadata = {}) {
  try {
    const res = await fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, metadata }),
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to track event:", eventType, error);
    return null;
  }
}
