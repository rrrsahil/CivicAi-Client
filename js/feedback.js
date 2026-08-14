const ratingButtons = document.querySelectorAll(
    ".civicai-rating-stars button"
  );

  const ratingHint = document.querySelector(
    ".civicai-rating-hint"
  );

  ratingButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const rating = index + 1;

      ratingButtons.forEach((btn, btnIndex) => {
        const icon = btn.querySelector("i");

        if (btnIndex < rating) {
          btn.classList.add("active");

          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        } else {
          btn.classList.remove("active");

          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      });

      ratingHint.textContent = `${rating} out of 5 selected`;
    });
  });