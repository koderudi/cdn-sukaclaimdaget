// handlernya disini

const githubHtmlUrl = 'https://raw.githubusercontent.com/koderudi/cdn-sukaclaimdaget/main/public/kurirdaget.html';
const version = '1.0.0.1';

function displayContent(htmlContent) {
    document.getElementById('app').innerHTML = htmlContent;
}

function updateContentIfNeeded() {
    const savedVersion = localStorage.getItem('kurirVersion');
    const savedHtml = localStorage.getItem('kurirHtml');

    if (savedVersion !== version || !savedHtml) {
        fetch(githubHtmlUrl)
            .then(response => response.text())
            .then(htmlContent => {
                localStorage.setItem('kurirHtml', htmlContent);
                localStorage.setItem('kurirVersion', version);
                displayContent(htmlContent);
            })
            .catch(error => {
                console.error('Error fetching the HTML content:', error);
                document.getElementById('app').innerText = 'Failed to load content.';
            });
    } else {
        displayContent(savedHtml);
    }
}

updateContentIfNeeded();
