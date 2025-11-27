document.getElementById("generateBtn").addEventListener("click", startGeneration);

function startGeneration() {
    const prompt = document.getElementById("prompt").value;
    const status = document.getElementById("status");
    const resultWrapper = document.getElementById("resultWrapper");
    const resultImage = document.getElementById("resultImage");

    if (!prompt) {
        status.innerText = "Введите текст!";
        return;
    }

    status.innerText = "Генерация...";
    resultWrapper.style.display = "none";

    const formData = new FormData();
    formData.append("prompt", prompt);

    fetch("/generate", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            checkStatus(data.task_id);
        });
}

function checkStatus(task_id) {
    fetch("/status/" + task_id)
        .then(res => res.json())
        .then(data => {
            if (data.status === "DONE") {
                const resultWrapper = document.getElementById("resultWrapper");
                const resultImage = document.getElementById("resultImage");

                resultImage.src = "data:image/jpeg;base64," + data.image;
                resultWrapper.style.display = "flex";

                document.getElementById("status").innerText = "Готово!";

            } else if (data.status === "FAIL") {
                document.getElementById("status").innerText = "Ошибка: " + data.error;

            } else {
                setTimeout(() => checkStatus(task_id), 1000);
            }
        });
}
