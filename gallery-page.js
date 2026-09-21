const albumLinks = Array.from(document.querySelectorAll("[data-album-photo]"));
const albumDialog = document.querySelector(".album-lightbox");
const requestedCategory = new URLSearchParams(window.location.search).get("category");
const categoryAnchors = { treatment: "patienten", room: "raeume", diagnostics: "roentgen" };

if (Object.hasOwn(categoryAnchors, requestedCategory) && !window.location.hash) {
  requestAnimationFrame(() => {
    document.getElementById(categoryAnchors[requestedCategory])?.scrollIntoView({ behavior: "instant", block: "start" });
  });
}

if (albumDialog && typeof albumDialog.showModal === "function" && albumLinks.length) {
  const dialogImage = albumDialog.querySelector(".album-dialog-image");
  const dialogTitle = albumDialog.querySelector(".album-dialog-caption h2");
  const dialogDescription = albumDialog.querySelector(".album-dialog-caption p");
  const dialogCount = albumDialog.querySelector(".album-dialog-count");
  const closeButton = albumDialog.querySelector(".album-dialog-close");
  const previousButton = albumDialog.querySelector(".album-dialog-previous");
  const nextButton = albumDialog.querySelector(".album-dialog-next");
  let activePhotoIndex = 0;
  let openingLink = null;
  let savedScrollPosition = { top: 0, left: 0 };

  function renderPhoto(photoIndex) {
    activePhotoIndex = (photoIndex + albumLinks.length) % albumLinks.length;
    const photoLink = albumLinks[activePhotoIndex];
    const photo = photoLink.querySelector("img");
    const caption = photoLink.closest("figure").querySelector("figcaption");
    dialogImage.src = photoLink.href;
    dialogImage.alt = photo.alt;
    dialogTitle.textContent = caption.querySelector("h3").textContent;
    dialogDescription.textContent = caption.querySelector("p").textContent;
    dialogCount.textContent = `Foto ${activePhotoIndex + 1} von ${albumLinks.length}`;
  }

  albumLinks.forEach((photoLink, photoIndex) => {
    photoLink.setAttribute("aria-haspopup", "dialog");
    photoLink.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openingLink = photoLink;
      savedScrollPosition = { top: window.scrollY, left: window.scrollX };
      renderPhoto(photoIndex);
      document.body.classList.add("album-lightbox-open");
      albumDialog.showModal();
      closeButton.focus({ preventScroll: true });
    });
  });

  closeButton.hidden = false;
  previousButton.hidden = albumLinks.length < 2;
  nextButton.hidden = albumLinks.length < 2;
  closeButton.addEventListener("click", () => albumDialog.close());
  previousButton.addEventListener("click", () => renderPhoto(activePhotoIndex - 1));
  nextButton.addEventListener("click", () => renderPhoto(activePhotoIndex + 1));

  albumDialog.addEventListener("keydown", (event) => {
    if (!albumDialog.open) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      renderPhoto(activePhotoIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });

  albumDialog.addEventListener("click", (event) => {
    const dialogBounds = albumDialog.getBoundingClientRect();
    const clickedOutside = event.clientX < dialogBounds.left || event.clientX > dialogBounds.right || event.clientY < dialogBounds.top || event.clientY > dialogBounds.bottom;
    if (event.target === albumDialog && clickedOutside) albumDialog.close();
  });

  albumDialog.addEventListener("close", () => {
    document.body.classList.remove("album-lightbox-open");
    window.scrollTo({ ...savedScrollPosition, behavior: "instant" });
    openingLink?.focus({ preventScroll: true });
  });
}
