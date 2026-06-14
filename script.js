const carousels = document.querySelectorAll(".carousel-wrapper");

carousels.forEach(wrapper => {

  const cards = wrapper.querySelectorAll(".flip-card");
  const bg = wrapper.querySelector(".section-bg");

  const prevBtn = wrapper.querySelector(".prevBtn");
  const nextBtn = wrapper.querySelector(".nextBtn");

  const isFeatured = wrapper.closest("#projects") !== null;
  const panel = isFeatured ? document.getElementById("projectDetail") : null;

  let index = 0;
  let interval;
  let userInteracting = false;
  let isFlipped = false;

  const spacing = 300;

  function updateBackground() {
    if (!bg) return;
    bg.style.backgroundImage = `url('${cards[index].dataset.bg}')`;
  }

  function resetFlips() {
    cards.forEach(c => c.classList.remove("flipped"));
  }

  function openPanel(card) {
    if (!panel) return;

    document.getElementById("detailTitle").textContent = card.dataset.title || "";
    document.getElementById("detailRole").textContent = card.dataset.role || "";
    document.getElementById("detailOverview").textContent = card.dataset.overview || "";

    panel.classList.add("active");
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove("active");
  }

  function positionCards() {

    const total = cards.length;

    cards.forEach((card, i) => {

      let offset = i - index;

      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const x = offset * spacing;
      const scale = Math.max(0.75, 1 - Math.abs(offset) * 0.15);
      const z = -Math.abs(offset) * 180;

      card.style.transform =
        `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) scale(${scale})`;

      card.style.zIndex = 100 - Math.abs(offset);
      card.classList.toggle("visible", Math.abs(offset) <= 2);
    });

    resetFlips();
    updateBackground();

    if (isFeatured) 
	{
      isFlipped = false;
    }
  }

  function next() {
    index = (index + 1) % cards.length;
    positionCards();
	cards[index].classList.toggle("flipped");
    if (cards[index].classList.contains("flipped")) 
	{
		if (isFeatured) 
		{
		isFlipped = true;
		openPanel(cards[index]);
		}
	}
  }

  function prev() {
    index = (index - 1 + cards.length) % cards.length;
    positionCards();
	cards[index].classList.toggle("flipped");
	if (cards[index].classList.contains("flipped")) 
	{
        if (isFeatured) 
		{
          isFlipped = true;
          openPanel(cards[index]);
        }
	}
  }

  function restartAuto() {
    clearInterval(interval);
    startAuto();
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      next();
      restartAuto();
    });

    prevBtn.addEventListener("click", () => {
      prev();
      restartAuto();
    });
  }

  cards.forEach((card, i) => {

    card.addEventListener("click", () => {

      restartAuto();

      if (i !== index) {

        index = i;
        positionCards();

        setTimeout(() => {
          card.classList.add("flipped");

          if (isFeatured) {
            isFlipped = true;
            openPanel(card);
          }

        }, 100);

        return;
      }

      card.classList.toggle("flipped");

      if (card.classList.contains("flipped")) {

        if (isFeatured) {
          isFlipped = true;
          openPanel(card);
        }

      } else {

        if (isFeatured) {
          isFlipped = false;
          closePanel();
        }
      }

    });

    card.addEventListener("mouseenter", () => userInteracting = true);
    card.addEventListener("mouseleave", () => userInteracting = false);
  });

  function startAuto() {
    interval = setInterval(() => {
      if (!userInteracting && !isFlipped) {
        next();
      }
    }, 4500);
  }

  positionCards();
  startAuto();

});