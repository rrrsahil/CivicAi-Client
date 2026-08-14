document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     ELEMENTS
  ========================================================= */

  const editButton = document.getElementById("editProfileButton");
  const saveButton = document.getElementById("saveProfileButton");
  const cancelButton = document.getElementById("cancelProfileButton");

  const valueElements = document.querySelectorAll(".civicai-profile-value");

  const inputElements = document.querySelectorAll(
    ".civicai-profile-edit-input",
  );

  const summaryName = document.getElementById("profileSummaryName");

  const summaryEmail = document.getElementById("profileSummaryEmail");

  const summaryPhone = document.getElementById("profileSummaryPhone");

  const summaryLocation = document.getElementById("profileSummaryLocation");

  /* =========================================================
     STORAGE
  ========================================================= */

  const STORAGE_KEY = "civicaiProfile";

  /* =========================================================
     DEFAULT PROFILE
  ========================================================= */

  const defaultProfile = {
    fullName: "Rakesh Sharma",
    email: "rakesh.sharma@email.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 91234 56789",
    dob: "1990-08-15",
    gender: "Male",
    address: "B-123, Civic Center, Near Sayaji Garden",
    city: "Vadodara",
    state: "Gujarat",
    pin: "390001",
  };

  /* =========================================================
     EDIT STATE
  ========================================================= */

  let originalValues = {};

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  /* =========================================================
     GET PROFILE
     Local GET = localStorage.getItem()
  ========================================================= */

  function getProfile() {
    const savedProfile = localStorage.getItem(STORAGE_KEY);

    if (!savedProfile) {
      return { ...defaultProfile };
    }

    try {
      const parsedProfile = JSON.parse(savedProfile);

      return {
        ...defaultProfile,
        ...parsedProfile,
      };
    } catch (error) {
      console.error("CivicAI: Invalid saved profile data.", error);

      localStorage.removeItem(STORAGE_KEY);

      return { ...defaultProfile };
    }
  }

  /* =========================================================
     POST / SAVE PROFILE
     Local POST-like save = localStorage.setItem()
  ========================================================= */

  function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  /* =========================================================
     UPDATE PROFILE SUMMARY
  ========================================================= */

  function updateSummary(profile) {
    if (summaryName) {
      summaryName.textContent = profile.fullName;
    }

    if (summaryEmail) {
      const value = summaryEmail.querySelector("[data-summary-value]");

      if (value) {
        value.textContent = profile.email;
      }
    }

    if (summaryPhone) {
      const value = summaryPhone.querySelector("[data-summary-value]");

      if (value) {
        value.textContent = profile.phone;
      }
    }

    if (summaryLocation) {
      const value = summaryLocation.querySelector("[data-summary-value]");

      if (value) {
        value.textContent = `${profile.city}, ${profile.state}, India`;
      }
    }
  }

  /* =========================================================
     UPDATE DISPLAY VALUE
  ========================================================= */

  function updateDisplay(field, value) {
    const element = document.querySelector(
      `.civicai-profile-value[data-field="${field}"]`,
    );

    if (!element) {
      return;
    }

    if (field === "dob") {
      element.textContent = formatDate(value);
    } else {
      element.textContent = value || "";
    }
  }

  /* =========================================================
     UPDATE INPUT VALUE
  ========================================================= */

  function updateInput(field, value) {
    const input = document.querySelector(
      `.civicai-profile-edit-input[data-field="${field}"]`,
    );

    if (!input) {
      return;
    }

    input.value = value || "";
  }

  /* =========================================================
     APPLY PROFILE
  ========================================================= */

  function applyProfile(profile) {
    inputElements.forEach((input) => {
      const field = input.dataset.field;

      if (Object.prototype.hasOwnProperty.call(profile, field)) {
        input.value = profile[field] || "";
      }
    });

    valueElements.forEach((element) => {
      const field = element.dataset.field;

      if (Object.prototype.hasOwnProperty.call(profile, field)) {
        updateDisplay(field, profile[field]);
      }
    });

    updateSummary(profile);
  }

  /* =========================================================
     ENTER EDIT MODE
  ========================================================= */

  function enterEditMode() {
    originalValues = {};

    inputElements.forEach((input) => {
      const field = input.dataset.field;

      originalValues[field] = input.value;

      input.hidden = false;

      const row = input.closest(".civicai-profile-info-row");

      if (row) {
        row.classList.add("is-editing");
      }
    });

    valueElements.forEach((element) => {
      element.hidden = true;
    });

    editButton.hidden = true;
    saveButton.hidden = false;
    cancelButton.hidden = false;

    const firstInput = document.querySelector(
      ".civicai-profile-edit-input:not([hidden])",
    );

    if (firstInput) {
      firstInput.focus();
    }
  }

  /* =========================================================
     EXIT EDIT MODE
  ========================================================= */

  function exitEditMode() {
    inputElements.forEach((input) => {
      input.hidden = true;

      const row = input.closest(".civicai-profile-info-row");

      if (row) {
        row.classList.remove("is-editing");
      }
    });

    valueElements.forEach((element) => {
      element.hidden = false;
    });

    editButton.hidden = false;
    saveButton.hidden = true;
    cancelButton.hidden = true;
  }

  /* =========================================================
     CANCEL
  ========================================================= */

  function cancelEdit() {
    Object.keys(originalValues).forEach((field) => {
      updateInput(field, originalValues[field]);

      updateDisplay(field, originalValues[field]);
    });

    exitEditMode();
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  function validateProfile(profile) {
    if (!profile.fullName) {
      alert("Full Name is required.");
      return false;
    }

    if (!profile.email) {
      alert("Email Address is required.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(profile.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!profile.phone) {
      alert("Phone Number is required.");
      return false;
    }

    if (profile.pin && !/^\d{6}$/.test(profile.pin)) {
      alert("PIN Code must contain exactly 6 digits.");

      return false;
    }

    return true;
  }

  /* =========================================================
     COLLECT FORM DATA
  ========================================================= */

  function collectProfile() {
    const profile = {};

    inputElements.forEach((input) => {
      profile[input.dataset.field] = input.value.trim();
    });

    return profile;
  }

  /* =========================================================
     SAVE HANDLER
  ========================================================= */

  function handleSave() {
    const updatedProfile = collectProfile();

    if (!validateProfile(updatedProfile)) {
      return;
    }

    /* Local POST-like persistence */

    saveProfile(updatedProfile);

    /* Immediately update page */

    applyProfile(updatedProfile);

    /* Exit edit mode */

    exitEditMode();

    /* Optional confirmation */

    alert("Profile updated successfully.");
  }

  /* =========================================================
     EVENTS
  ========================================================= */

  if (editButton) {
    editButton.addEventListener("click", enterEditMode);
  }

  if (saveButton) {
    saveButton.addEventListener("click", handleSave);
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", cancelEdit);
  }

  /* =========================================================
     INITIAL LOAD
     Local GET
  ========================================================= */

  const initialProfile = getProfile();

  applyProfile(initialProfile);

  /* =========================================================
     PAGE SAFETY
  ========================================================= */

  if (!editButton || !saveButton || !cancelButton) {
    console.error("CivicAI: Profile action buttons are missing from HTML.");
  }
});
