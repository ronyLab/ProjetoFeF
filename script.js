 //carrocel
 document.addEventListener("DOMContentLoaded", function() {
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        moveSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        moveSlide();
    }

    function moveSlide() {
        const itemWidth = carouselInner.clientWidth;
        carouselInner.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    // Adicionar eventos de clique aos botões de próxima e anterior
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    // Carrossel automático
    setInterval(nextSlide, 5000); // Muda de slide a cada 5 segundos
});


// busca do site 

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchResults = document.getElementById("searchResults");

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let productFound = false; // Variável para rastrear se o produto foi encontrado

        if (searchTerm.length >= 3) {
            searchResults.innerHTML = ""; // Limpa os resultados anteriores

            const products = document.querySelectorAll(".product h2"); // Seleciona todos os títulos de produtos

            products.forEach(function (product) {
                const productName = product.textContent.toLowerCase(); // Obtém o texto do produto em letras minúsculas

                if (productName.includes(searchTerm)) { // Verifica se o termo de pesquisa está incluído no nome do produto
                    const listItem = document.createElement("li");
                    const productLink = document.createElement("a");
                    productLink.href = "#" + productName; // Define o link para o produto usando o texto do título
                    productLink.textContent = productName;
                    listItem.appendChild(productLink);
                    searchResults.appendChild(listItem);

                    // Verifica se o produto foi encontrado e rola até ele
                    if (!productFound) {
                        product.closest(".product").scrollIntoView({ behavior: "smooth", block: "start" });
                        productFound = true; // Define como verdadeiro para evitar rolar para outros produtos
                    }
                }
            });
        } else {
            searchResults.innerHTML = ""; // Limpa os resultados se o termo de pesquisa for menor que três caracteres
        }
    }

    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") { // Verifica se o usuário pressionou Enter
            event.preventDefault();
            performSearch();
        }
    });

    searchButton.addEventListener("click", function () {
        performSearch();
    });

    // Adiciona um manipulador de eventos para rolar até o produto correspondente quando um link de sugestão é clicado
    searchResults.addEventListener("click", function (event) {
        event.preventDefault(); // Evita o comportamento padrão do link
        if (event.target.tagName === "A") { // Verifica se o elemento clicado é um link
            const productName = event.target.textContent.trim().toLowerCase(); // Obtém o texto do título do produto clicado
            const product = [...document.querySelectorAll(".product h2")].find(product => product.textContent.toLowerCase() === productName);
            if (product) {
                product.closest(".product").scrollIntoView({ behavior: "smooth", block: "start" }); // Rola suavemente até o produto correspondente
            }
        }
    });
});










// Script do carrinho de compras

window.onload = function() {
    displayCartData();
};

function displayCartData() {
    const urlParams = new URLSearchParams(window.location.search);
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = '';

    const products = [];
    const entries = [...urlParams.entries()];
    let totalCart = 0;

    for (let i = 0; i < entries.length; i += 3) {
        const productName = entries[i][1];
        const pricePerKg = parseFloat(entries[i + 1][1]); // Preço por kg
        const quantity = parseInt(entries[i + 2][1]);

        const totalProduct = pricePerKg * quantity;

        products.push({
            name: productName,
            price: pricePerKg,
            quantity: quantity,
            total: totalProduct
        });

        totalCart += totalProduct;
    }

    products.forEach(product => {
        const newRow = `
            <tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>R$ ${product.price.toFixed(2)}</td>
                <td>R$ ${product.total.toFixed(2)}</td>
            </tr>
        `;
        cartBody.innerHTML += newRow;
    });

    // Atualiza o total do carrinho
    const cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = `R$ ${totalCart.toFixed(2)}`;
}


// Script dos protutos no site principal

let totalCartValue = 0;

        function changeQuantity(inputId, increment) {
            const input = document.getElementById(inputId);
            const currentValue = parseInt(input.value);
            const newValue = currentValue + increment;
            if (newValue >= 1) {
                input.value = newValue;
            }
        }

        function addToCart(productName, pricePerKg, inputId) {
            const quantity = parseInt(document.getElementById(inputId).value);
            const totalPrice = pricePerKg * quantity;
            totalCartValue += totalPrice;

            const cartLink = document.getElementById('cart-link');
            let currentHref = cartLink.getAttribute('href');
            let urlParams = new URLSearchParams(currentHref.split('?')[1] || '');

            // Append new product parameters
            urlParams.append('product', productName);
            urlParams.append('price', pricePerKg.toFixed(2)); // Passa o preço por kg
            urlParams.append('quantity', quantity);

            // Update the cart link with the new parameters
            cartLink.setAttribute('href', 'carrinho.html?' + urlParams.toString());

            // Update total cart value
            document.getElementById('cart-total').textContent = `R$ ${totalCartValue.toFixed(2)}`;

           

        }



// Script para esconder e aparecer as redes sociais

let prevScrollpos = window.pageYOffset;

window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    const socialStrip = document.querySelector(".social-strip");
    if (prevScrollpos > currentScrollPos) {
        socialStrip.classList.remove("hidden");
    } else {
        socialStrip.classList.add("hidden");
    }
    prevScrollpos = currentScrollPos;
};



//anuncie

const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');

selectImage.addEventListener('click', function () {
	inputFile.click();
})

inputFile.addEventListener('change', function () {
	const image = this.files[0]
	if(image.size < 2000000) {
		const reader = new FileReader();
		reader.onload = ()=> {
			const allImg = imgArea.querySelectorAll('img');
			allImg.forEach(item=> item.remove());
			const imgUrl = reader.result;
			const img = document.createElement('img');
			img.src = imgUrl;
			imgArea.appendChild(img);
			imgArea.classList.add('active');
			imgArea.dataset.img = image.name;
		}
		reader.readAsDataURL(image);
	} else {
		alert("Image size more than 2MB");
	}
})

 // Função para rolar ao topo da página


 // Função para rolar ao topo da página
 function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Adiciona um observador de eventos de rolagem para mostrar ou ocultar o botão "voltar ao topo"
window.addEventListener('scroll', function() {
    var btnTopo = document.getElementById('btnTopo');
    if (window.pageYOffset > 100) { // Exibe o botão quando a página é rolada para baixo
        btnTopo.classList.add('mostrar-btn');
    } else { // Oculta o botão quando a página é rolada para o topo
        btnTopo.classList.remove('mostrar-btn');
    }
});