function getData() {
    return fetch("https://dummyjson.com/products")
        .then((response) => {
            if (!response.ok) {
                throw new Error("NETWORK RESPONSE ERROR");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("FETCH ERROR:", error);
            throw error;
        });
}

function createList(products) {
    const mainDiv = document.getElementById('productContainer'); 
    mainDiv.innerHTML = ""; 

    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <img src="${product.thumbnail}" alt="${product.title}" style="width:100px;height:auto; margin-right: 10px;">
                <b style="margin-right: 10px;">${product.title}</b>: ${product.description}
            </div>`;
        mainDiv.appendChild(productDiv); 
    });
}

function sortDecreasingly(products) {
    var sortedProducts = products.toSorted((a, b) => b.title.localeCompare(a.title)); 
    createList(sortedProducts);
}

function sortIncreasingly(products) {
    var sortedProducts = products.toSorted((a, b) => a.title.localeCompare(b.title)); 
    createList(sortedProducts);
}

const sortBySubstring = (products, match) => {
    products.sort((a, b) => {
        const aMatch = a.title.toLowerCase().includes(match.toLowerCase()) ? a.title.toLowerCase().indexOf(match.toLowerCase()) : Infinity;
        const bMatch = b.title.toLowerCase().includes(match.toLowerCase()) ? b.title.toLowerCase().indexOf(match.toLowerCase()) : Infinity;
        return aMatch - bMatch;
    });
    createList(products);
};

document.addEventListener("DOMContentLoaded", () => {
    getData()
        .then((data) => {
            const products = data.products;

            createList(products);

            document.getElementById("sortOptions").addEventListener("change", (event) => {
                const value = event.target.value;
                if (value === "ascending") {
                    sortIncreasingly(products);
                } else if (value === "descending") {
                    sortDecreasingly(products);
                } else {
                    createList(products); 
                }
            });

            document.getElementById("substringButton").addEventListener("click", () => {
                const substring = document.getElementById("substringInput").value;
                sortBySubstring(products, substring);
            });
        })
        .catch((error) => console.error("Failed to initialize products:", error));
});
