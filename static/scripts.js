document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('input[type="search"]');
    const suggestionBox = document.createElement('div');
    suggestionBox.classList.add('suggestion-box');
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.top = '100%';
    suggestionBox.style.left = '0';
    suggestionBox.style.right = '0';
    suggestionBox.style.background = 'white';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.zIndex = '1000';
    suggestionBox.style.display = 'none'; // Hide initially
    searchInput.parentNode.appendChild(suggestionBox);

    searchInput.addEventListener('input', async function () {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            const response = await fetch(`/search?query=${query}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const products = await response.json();
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'block'; // Show the suggestion box
            if (products.length > 0) {
                products.forEach(product => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item');
                    suggestionItem.innerHTML = `
                        <a href="/products/${product._id}">
                            ${product.name}
                        </a>
                    `;
                    suggestionBox.appendChild(suggestionItem);
                });
            } else {
                suggestionBox.innerHTML = '<div class="suggestion-item">No matches</div>';
            }
        } else {
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none'; // Hide the suggestion box when input is empty
        }
    });

    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none'; // Hide the suggestion box when clicking outside
        }
    });
});

function scrollSection(sectionId, distance) {
    const container = document.querySelector(`#${sectionId} .featured-products`);
    container.scrollBy({
        left: distance,
        behavior: 'smooth'
    });
}

function removeItem(productId) {
    fetch(`/cart/remove/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            alert('Failed to remove item from cart');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
