export async function generateImage(prompt, settings) {
  const resp = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, settings }),
  });
  return resp.json();
}

export async function checkStatus(taskId) {
  const resp = await fetch(`/status/${taskId}`);
  return resp.json();
}
