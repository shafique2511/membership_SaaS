export async function safeFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  
  if (!res.ok) {
    // Attempt to parse error as JSON
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    throw new Error(`Request failed with status ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  
  // If not JSON but request was successful, this might be an issue depending on expectation
  // but we should fail gracefully if we expected JSON.
  const text = await res.text();
  console.error("Expected JSON but got:", text.substring(0, 500));
  throw new Error("Invalid response format (expected JSON)");
}
