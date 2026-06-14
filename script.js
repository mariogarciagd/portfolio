const items = document.querySelectorAll(".card, h1, h2, p, .video");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });

items.forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});