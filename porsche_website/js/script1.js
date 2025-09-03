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
const text_after = document.querySelector('.text-after');
const gallery_with_cars = document.querySelectorAll('.gallery-of-cars section img');
const text_after_gallery = document.querySelectorAll('.gallery-of-cars section p')
const founders_title = document.querySelector('.Founders h1');
const photo_of_founders = document.querySelectorAll('.main-description img');
const description_founders_h1 = document.querySelectorAll('.descriptions h1');
const description_founders_p = document.querySelectorAll('.descriptions p');
const button_with_description_dec = document.querySelector('.dec');
const button_with_description_des = document.querySelector('.des');
toggleClassOnScroll(text_after, 'animate_text_after');
toggleClassOnScroll(founders_title, 'animate_title_founders');
toggleClassOnScroll(button_with_description_dec, 'animated_button_founder');
toggleClassOnScroll(button_with_description_des, 'animated_button_founder');
Array.from(gallery_with_cars).forEach(elements => {
  toggleClassOnScroll(elements, 'animated_photo');
});
Array.from(photo_of_founders).forEach(elements => {
  toggleClassOnScroll(elements, 'animate_title_founders');
});
Array.from(text_after_gallery).forEach(elements => {
  toggleClassOnScroll(elements, 'animated_photo');
});
Array.from(description_founders_h1).forEach(elements => {
  toggleClassOnScroll(elements, 'animated_photo');
});
Array.from(description_founders_p).forEach(elements => {
  toggleClassOnScroll(elements, 'animated_photo');
});
