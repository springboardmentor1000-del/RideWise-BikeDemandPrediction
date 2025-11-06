const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend

export async function getPrediction(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return { error: "Failed to fetch prediction" };
  }
}
