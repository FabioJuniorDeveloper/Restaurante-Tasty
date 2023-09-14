let modalQt = 1;
let modalKey;
let selectedExtras = [];
let pratoPriceMaximo = [];
let cart = [];
let itemExtras = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

function TirarMenuCell() {
    if (window.screen.width >= 300 && window.screen.width <= 769) {
        document.querySelector("nav ul").style.opacity = 0;
        setTimeout(() => {
            document.querySelector("nav ul").style.display = 'none';
        }, 200)
    } else {
        document.querySelector('nav ul').style = 'flex';
    }

}

window.addEventListener('scroll', TirarMenuCell)


function atualizarPrice(modalKey, modalQt) {
    let pratoPriceMaximoValue = pratoPriceMaximo[modalKey];
    let pratoPriceExtras = 0;

    selectedExtras.forEach((extra) => {
        pratoPriceExtras += extra.item.price;
    })

    const novoPrecoTotal = (modalQt * pratoPriceMaximoValue) + pratoPriceExtras;
    // Atualiza o preço total na interface do usuário
    c('.productInfo .productInfo--actualPrice').innerHTML = `R$ ${novoPrecoTotal.toFixed(2)}`;


}

productJson.map((item, index) => {
    let pratoItem = c('.cardapio-container').cloneNode(true);
    pratoPriceMaximo.push(item.price)
    pratoItem.setAttribute('chave-key', index)

    pratoItem.querySelector('.cardapio--img img').src = item.img;
    pratoItem.querySelector('.cardapio--name h3').innerHTML = item.name;
    pratoItem.querySelector('.cardapio--descripition p').innerHTML = item.description[0].descriptionInicical;
    pratoItem.querySelector('.cardapio--price span').innerHTML = `R$ ${item.price.toFixed(2)}`;


    pratoItem.querySelector('.btn').addEventListener('click', (e) => {
        e.preventDefault()
        let key = e.target.closest('.cardapio-container').getAttribute('chave-key');
        modalKey = key;
        modalQt = 1;
        let extrasContainer = c('.productInfo--extra--additional');
        let extrasAnteriores = extrasContainer.querySelectorAll('.productInfo-extras-itens')
        Array.from(extrasAnteriores).forEach((item) => { // Transforma o extrasAnteriores em um Array para usar o ForEach
            extrasContainer.removeChild(item)
        })

        c('.productBig img').src = productJson[modalKey].img;
        c('.productInfo h1').innerHTML = productJson[modalKey].name;
        c('.productInfo .productInfo--descripition').innerHTML = productJson[modalKey].description[1].descriptionModal;
        c('.productInfo .productInfo--actualPrice').innerHTML = `R$ ${productJson[modalKey].price.toFixed(2)}`;

        productJson[modalKey].extras.forEach((item) => {

            let extraItem = c('.productInfo-extras-itens').cloneNode(true);

            extraItem.querySelector('.extra-name').innerHTML = item.ingredient;
            extraItem.querySelector('.extra-price').innerHTML = `R$ ${item.price.toFixed(2)}`;
            c('.productInfo--qt').innerHTML = modalQt;



            let inputCheckbox = extraItem.querySelector('.inputCheckbox');


            inputCheckbox.addEventListener('change', () => {
                if (inputCheckbox.checked) {
                    if (!selectedExtras.includes(item)) {
                        selectedExtras.push({ item });
                        atualizarPrice(modalKey, modalQt); // Atualize o preço total
                    }
                } else {
                    const index = selectedExtras.findIndex((selected) => {
                        console.log(selected)
                        return selected.item === item
                    });
                    if (index !== -1) {
                        selectedExtras.splice(index, 1); // apartir do elemento do index, retira 1, ou seja ele
                        atualizarPrice(modalKey, modalQt); // Atualize o preço total
                    }
                }
            });



            c('.productInfo--extra--additional').appendChild(extraItem)
        })
        console.log('apertou' + modalKey)

        c('.RestauranteWindowArea').style.opacity = 0;
        c('.RestauranteWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.RestauranteWindowArea').style.opacity = 1;
        }, 200)
    })



    c('.cardapio-text').appendChild(pratoItem)

})



// Evento de modal

c('.productInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.productInfo--qt').innerHTML = modalQt;
        atualizarPrice(modalKey, modalQt);


    } else {
        modalQt = 1;
    }

})

c('.productInfo--qtmais').addEventListener('click', (event) => {
    modalQt++;
    c('.productInfo--qt').innerHTML = modalQt;

    atualizarPrice(modalKey, modalQt);
})

let closeModal = () => {
    c('.RestauranteWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.RestauranteWindowArea').style.display = 'none';
    }, 500)

    selectedExtras = [];

}
c('.buttonCellCancell').addEventListener('click', (() => {
    c('.show-menu').style.opacity = 0;
    setTimeout(() => {
        c('.show-menu').style.display = 'none';
    }, 500)
}))
c('.productInfo--cancelButton').addEventListener('click', closeModal)


// Carrinho de Compras 

c('.productInfo--addButton').addEventListener('click', () => {


    let identifier = productJson[modalKey].id + '@';

    let chave = cart.findIndex((item) => {
        return item.identifier === identifier
    })

    if (chave > -1) {
        cart[chave].qt += modalQt;
        cart[chave].extras = cart[chave].extras.concat(selectedExtras.map((extra) => extra.item)) // 

    } else {
        cart.push({
            identifier,
            id: productJson[modalKey].id,
            qt: modalQt,
            extras: selectedExtras.map((extra) => extra.item),
            price: productJson[modalKey].price,
        })
    }
    selectedExtras = [];
    updateCart()
    closeModal()

})

let updateCart = () => {
    if (cart.length > 0) {
        c('.show-menu').style.opacity = 1;
        c('.show-menu').style.display = 'flex';
        c('.cart-item-count').innerHTML = cart.length;

        let total = 0;
        let subtotal = 0;
        let desconto = 0;
        c('.cart-item-area').innerHTML = ''

        cart.forEach((item) => {
            let pratoItem = productJson.find((itemPrato) => {
                return itemPrato.id === item.id
            })

            let cartItem = c('.cart--item').cloneNode(true);

            cartItem.querySelector('.cart-item-img--name img').src = pratoItem.img;
            cartItem.querySelector('.cart-item-img--name h3').innerHTML = pratoItem.name;
            cartItem.querySelector('.cart-item--qtarea .cart-item--qt').innerHTML = item.qt;
            cartItem.querySelector('.cart-item--qtarea .cart-item--qtmenos').addEventListener('click', () => {
                if (item.qt > 1) {
                    item.qt--;
                } else {
                    let index = cart.indexOf(item)
                    cart.splice(index, 1)
                }
                updateCart()

            })
            cartItem.querySelector('.cart-item--qtarea .cart-item--qtmais').addEventListener('click', () => {
                item.qt++;
                updateCart()
            })

            itemExtras = 0; // Isso serve para que quando aumentar o modalQt no carrinho, ele nao irá somar os mesmo ingredientes novamente, e assim aumentando o preço

            item.extras.forEach((item) => {
                itemExtras += item.price;
                console.log(itemExtras + 'totalExtras')
            })

            console.log(itemExtras + ' total Valor')

            subtotal += (item.price * item.qt) + itemExtras;
            desconto = (subtotal * 0.1);
            total = subtotal - desconto;

            c('.cart-details').querySelector('.price--subtotal').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.cart-details').querySelector('.price--desconto').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.cart-details').querySelector('.price--total').innerHTML = `R$ ${total.toFixed(2)}`
            c('.cart-item-area').appendChild(cartItem)
        })
    } else {
        c('.show-menu').style.opacity = 0;
        setTimeout(() => {
            c('.show-menu').style.display = 'none';
        }, 500)
        itemExtras = 0;
        c('.cart-item-count').innerHTML = cart.length;
    }
}

c('.cart-icon').addEventListener('click', (() => {
    if (cart.length >= 1) {
        c('.show-menu').style.opacity = 0;
        c('.show-menu').style.display = 'flex';
        setTimeout(() => {
            c('.show-menu').style.opacity = 1;
        }, 0)
    }
}))

c('.btnFinalizarCompra').addEventListener('click', ((e) => {
    e.preventDefault()
    c('.modal-compra').style.display = 'flex';
    setTimeout(() => {
        c('.modal-compra').style.opacity = 1;
    }, 0)

    cart = [];
    updateCart()

}))

c('.modal-compra').addEventListener('click', () => {
    c('.modal-compra').style.opacity = 0;
    setTimeout(() => {
        c('.modal-compra').style.display = 'none';
    }, 300)
})






