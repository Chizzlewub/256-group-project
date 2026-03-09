fetch("data/articles.json")
.then(response => response.json())
.then(data => {

    const container = document.getElementById("articleContainer");

    data.forEach(article => {

        const div = document.createElement("div");

        div.innerHTML = `
            <h2>${article.title}</h2>
            <p><strong>Sport:</strong> ${article.sport}</p>
            <p><strong>Author:</strong> ${article.author}</p>
            <p>${article.summary}</p>
            <hr>
        `;

        container.appendChild(div);

    });

});
