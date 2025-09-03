function toggleClassOnScroll(element, className) {
  window.addEventListener('scroll', () => {
      if (isElementVisible(element.getBoundingClientRect().top)) {
          element.classList.add(className);
      } else {
          element.classList.remove(className);
      }
  });
}
function isElementVisible(elementTop) {
  var windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return elementTop <= windowHeight;
}

const card = document.querySelectorAll('.gallery section img');
const buttonsBuy = document.querySelectorAll('.buttons-buy');
const second_bigimage = document.querySelector('.photo-car-taycan');
const head_text_taycan = document.querySelector('.head-text-taycan');
const add_text_taycan = document.querySelector('.add-text-taycan');
const buttons_after_taycan = document.querySelectorAll('.buttons');
const gallery_cars = document.querySelectorAll('.gallery-cars section img');


Array.from(card).forEach(elem => {
    toggleClassOnScroll(elem, 'animated_photo');
});

Array.from(buttonsBuy).forEach(button => {
    toggleClassOnScroll(button, 'animate_buttons');
});

Array.from(buttons_after_taycan).forEach(eleml => {
  toggleClassOnScroll(eleml, 'animate_buttons_after_taycan');
});
Array.from(gallery_cars).forEach(buttons => {
  toggleClassOnScroll(buttons, 'animated_photo');
});


toggleClassOnScroll(second_bigimage, 'animate_secondimage');
toggleClassOnScroll(head_text_taycan, 'animate_text');
toggleClassOnScroll(add_text_taycan, 'animate_text');