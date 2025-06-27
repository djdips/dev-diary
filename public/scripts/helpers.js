// Display loading
export function showLoading(isLoading) {
  const loader = document.getElementById("loading-indicator");
  loader.style.display = isLoading ? "block" : "none";

  if (isLoading) {
    hideMessages(); // hide other messages
  }
}

export function showError(msg) {
  const errorBox = document.getElementById("error-msg");
  errorBox.textContent = msg;
  errorBox.style.display = "block";
  hideMessages("success");
}

export function showSuccess(msg) {
  const successBox = document.getElementById("success-msg");
  successBox.textContent = msg;
  successBox.style.display = "block";
  hideMessages("error");
  setTimeout(() => (successBox.style.display = "none"), 3000);
}

function hideMessages(except = "") {
  if (except !== "success") document.getElementById("success-msg").style.display = "none";
  if (except !== "error") document.getElementById("error-msg").style.display = "none";
}