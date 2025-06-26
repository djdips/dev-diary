// Display loading
export function showLoading(isLoading) {
  const loader = document.getElementById("loading-indicator");
  loader.style.display = isLoading ? "block" : "none";
}

export function showError(msg) {
  const errorBox = document.getElementById("error-message");
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}

export function showSuccess(msg) {
  const successBox = document.getElementById("success-message");
  successBox.textContent = msg;
  successBox.style.display = "block";
  setTimeout(() => (successBox.style.display = "none"), 3000);
}