
addEventListener("load", getAct());
function getAct() {
    var links = Array.from(document.querySelectorAll(".nav-memu-act"))
    for (let i = 0; i < links.length; i++) {
        window.location.href == links[i].href ? links[i].classList.add("active") : links[i].classList.remove("active")
    }
}

document.addEventListener("DOMContentLoaded", function() {
  const html = document.getElementsByTagName("html")[0];
  const modal = document.getElementById("myModal");
  const modal2 = document.getElementById("myModal2");
  const btn = document.getElementById("myBtn");
  const btn2 = document.getElementById("myBtn2");
  const btn3 = document.querySelectorAll('#myBtn3');
  const span = document.getElementsByClassName("close")[0];
  const span2 = document.getElementsByClassName("close2")[0];
  const page = document.querySelector(".main-main-page");

  const hamburger = document.querySelector(".hamburger");
const points = document.querySelector(".points");
hamburger.addEventListener("click", ()=>{
    hamburger.classList.toggle("active-hamburger");
    points.classList.toggle("active-hamburger");
    html.classList.toggle("noscroll");
})

document.querySelectorAll(".nav-memu-act").forEach(n => n.addEventListener("click", ()=>{
    hamburger.classList.remove("active-hamburger")
    points.classList.remove("active-hamburger");
    html.classList.remove("noscroll");
}))

  function openModal(modalElement) {
      modalElement.style.display = "block";
      html.classList.add("noscroll");
  }

  function closeModal(modalElement) {
      modalElement.style.display = "none";
      html.classList.remove("noscroll");
  }

  btn.onclick = function() {
      openModal(modal);
  }
  span.onclick = function() {
      closeModal(modal);
  }
  btn2.onclick = function() {
      openModal(modal2);
  }
  span2.onclick = function() {
      closeModal(modal2);
  }

  btn3.forEach(btn => {
      btn.onclick = function() {
          openModal(modal2);
      }
  });

  page.onclick = function(event) {
      if (!event.target.matches('.main-main-page') && !event.target.matches('#myBtn3') && !event.target.matches('#myBtn') && !event.target.matches('#myBtn2')) {
          closeModal(modal2);
          closeModal(modal);
      }
  }

  document.querySelectorAll(".mybtn, .mybtn2").forEach(btn => {
      btn.addEventListener("click", function() {
          openModal(modal);
          openModal(modal2);
      });
  });

  document.querySelectorAll(".close-modal").forEach(closeBtn => {
      closeBtn.addEventListener("click", function() {
          closeModal(modal);
          closeModal(modal2);
      });
  });
});
