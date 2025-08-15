document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('website-builder-form');
    const buildButton = document.getElementById('build-button');
    const buttonText = buildButton.querySelector('.button-text');
    const spinner = buildButton.querySelector('.spinner');
    const previewArea = document.getElementById('preview-area');
    const websitePreview = document.getElementById('website-preview');
    const loadingOverlay = previewArea.querySelector('.loading-overlay');
    const placeholder = previewArea.querySelector('.placeholder');



    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        buildButton.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'block';
        placeholder.style.display = 'none';
        loadingOverlay.style.display = 'flex';
        websitePreview.style.display = 'none';
        previewArea.classList.add('loading');

        const description = document.getElementById('description').value;
        const industry = document.getElementById('industry').value;
        const tone = document.getElementById('tone').value;
        const features = document.getElementById('features').value;

        try {
            const response = await fetch("http://localhost:3000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description, industry, tone, features })
            });

            const data = await response.json();
            // Assume first HTML file in AI response is the main page
            const mainFile = data.code;

            function Download(file, text) {

                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', file);
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
            if (mainFile) {
                websitePreview.srcdoc = mainFile;
                websitePreview.style = "display:block;border:none;height:100vh;width=100vw;";
                document.querySelector('.btnsection').style.display = "flex";
                document.getElementById('fullscreen-btn').onclick = () => {
                    const newTab = window.open('', '_blank');
                    newTab.document.open();
                    newTab.document.write(mainFile);
                    newTab.document.close();
                };
                document.getElementById("cpy").onclick = async () => {
                    try {
                        await navigator.clipboard.writeText(mainFile);
                        document.getElementById("cpy").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
  <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
</svg>`;
                        setTimeout(() => {
                            document.getElementById("cpy").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                            class="bi bi-clipboard-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2" />
                        </svg>`;
                        }, 2000);
                    } catch (error) {
                        alert(`Failed to Copy:${error}`);
                    }
                }
                document.getElementById("download").onclick = () => {
                    Download("index.html", mainFile);
                }
            }
        } catch (err) {
            console.error("Error:", err);
        }

        loadingOverlay.style.display = 'none';
        previewArea.classList.remove('loading');
        buildButton.disabled = false;
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
    });

});