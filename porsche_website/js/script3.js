function getModelInfo(modelName) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            if (!xmlDoc) {
                console.error("Не удалось загрузить XML файл");
                return;
            }
            var product = Array.from(xmlDoc.getElementsByTagName("product")).find(product => product.querySelector("name").textContent === modelName);
            if (!product) {
                console.error("Не найден продукт с именем " + modelName);
                return;
            }

            var modelElements = product.getElementsByTagName("model");
            if (modelElements.length !== 2) {
                console.error("Неверное количество моделей для продукта " + modelName);
                return;
            }

            for (var i = 0; i < 2; i++) {
                var model = modelElements[i];
                var modelNameElement = model.getElementsByTagName("name")[0].textContent;
                var modelDescription = model.getElementsByTagName("description")[0].textContent;
                var modelImage = model.getElementsByTagName("image")[0].textContent;
                var modelPrice = model.getElementsByTagName("price")[0].textContent;

                document.getElementById("smallh" + (i+1)).innerText = modelNameElement;
                document.getElementById("description" + (i+1)).innerText = modelDescription;
                document.getElementById("smallimg" + (i+1)).src = modelImage;
                document.getElementById("price" + (i+1)).innerText = modelPrice;
            }

            var productName = product.getElementsByTagName("name")[0].textContent;
            var productDescription = product.getElementsByTagName("description")[0].textContent;
            var productImage = product.getElementsByTagName("image")[0].textContent;

            document.getElementById("smallh").innerText = productName;
            document.getElementById("description").innerText = productDescription;
            document.getElementById("bigimg").src = productImage;
        }
    };
    xhttp.open("GET", "xml_page/thirdPage.xml", true);
    xhttp.send();
}

function modelTaycan() {
    getModelInfo("Тайкан");  
    getActive()  
}

function model911() {
    getModelInfo("Порше 911");
    getActive()

}
function modelPanamera(){
    getModelInfo("Порше Панамера")
    getActive()
}
function modelGT3(){
    getModelInfo("Порше GT3 RS")
    getActive()
}


function getActive(){
    let modelButtons=document.getElementsByClassName('button-car');
    for(let i=0; i<modelButtons.length; i++){
        modelButtons[i].classList.remove('active_for_cars')
    }
    event.target.classList.add('active_for_cars');
}


function toggleClassOnScroll(element, className) {
    window.addEventListener('scroll', () => {
        if (isElementVisible(element)) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    });
}

function isElementVisible(element) {
    var rect = element.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight && rect.bottom >= 0;
}

function toggleClassOnScroll(element, className) {
    window.addEventListener('scroll', function() {
        if (isElementVisible(element)) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    });
}

const description_of_machine_models_p1_car = document.querySelectorAll('.description_of_machine_models_p1_car');
const card = document.querySelectorAll('.card img');
const buttonsBuy = document.querySelectorAll('.buttonsBuy');

Array.from(description_of_machine_models_p1_car).forEach(element => {
    toggleClassOnScroll(element, 'animated');
});

Array.from(card).forEach(elem => {
    toggleClassOnScroll(elem, 'animated_photo');
});

Array.from(buttonsBuy).forEach(buttons => {
    toggleClassOnScroll(buttons, 'animate_buttons');
});

