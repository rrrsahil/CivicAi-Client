document.addEventListener("DOMContentLoaded", () => {

    const uploadArea = document.getElementById("civicaiUploadArea");
    const fileInput = document.getElementById("civicaiFileInput");
    const chooseButton = document.getElementById("civicaiChooseFiles");
    const selectedFilesContainer =
        document.getElementById("civicaiSelectedFiles");

    if (
        !uploadArea ||
        !fileInput ||
        !chooseButton ||
        !selectedFilesContainer
    ) {
        return;
    }


    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 20 * 1024 * 1024;

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "video/mp4"
    ];


    let selectedFiles = [];


    /* =====================================================
       CHOOSE FILES BUTTON
    ===================================================== */

    chooseButton.addEventListener("click", (event) => {

        event.stopPropagation();

        fileInput.click();

    });


    /* =====================================================
       CLICK UPLOAD AREA
    ===================================================== */

    uploadArea.addEventListener("click", () => {

        fileInput.click();

    });


    /* =====================================================
       FILE INPUT CHANGE
    ===================================================== */

    fileInput.addEventListener("change", (event) => {

        addFiles(event.target.files);

        fileInput.value = "";

    });


    /* =====================================================
       DRAG ENTER
    ===================================================== */

    uploadArea.addEventListener("dragenter", (event) => {

        event.preventDefault();

        uploadArea.classList.add("civicai-drag-active");

    });


    /* =====================================================
       DRAG OVER
    ===================================================== */

    uploadArea.addEventListener("dragover", (event) => {

        event.preventDefault();

        event.dataTransfer.dropEffect = "copy";

        uploadArea.classList.add("civicai-drag-active");

    });


    /* =====================================================
       DRAG LEAVE
    ===================================================== */

    uploadArea.addEventListener("dragleave", (event) => {

        if (!uploadArea.contains(event.relatedTarget)) {

            uploadArea.classList.remove(
                "civicai-drag-active"
            );

        }

    });


    /* =====================================================
       DROP
    ===================================================== */

    uploadArea.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadArea.classList.remove(
            "civicai-drag-active"
        );

        addFiles(event.dataTransfer.files);

    });


    /* =====================================================
       ADD FILES
    ===================================================== */

    function addFiles(files) {

        const incomingFiles = Array.from(files);

        clearError();


        if (!incomingFiles.length) {
            return;
        }


        for (const file of incomingFiles) {

            if (selectedFiles.length >= MAX_FILES) {

                showError(
                    `You can upload a maximum of ${MAX_FILES} files.`
                );

                break;
            }


            if (!allowedTypes.includes(file.type)) {

                showError(
                    `${file.name} is not a supported file type.`
                );

                continue;
            }


            if (file.size > MAX_FILE_SIZE) {

                showError(
                    `${file.name} exceeds the 20MB file size limit.`
                );

                continue;
            }


            const alreadyExists = selectedFiles.some(
                selectedFile =>
                    selectedFile.name === file.name &&
                    selectedFile.size === file.size
            );


            if (alreadyExists) {
                continue;
            }


            selectedFiles.push(file);

        }


        renderFiles();

    }


    /* =====================================================
       RENDER FILES
    ===================================================== */

    function renderFiles() {

        selectedFilesContainer.innerHTML = "";


        selectedFiles.forEach((file, index) => {

            const fileItem =
                document.createElement("div");

            fileItem.className =
                "civicai-selected-file";


            const fileIcon =
                document.createElement("span");

            fileIcon.className =
                "civicai-selected-file-icon";


            fileIcon.innerHTML =
                file.type.startsWith("video/")
                    ? '<i class="fa-solid fa-video"></i>'
                    : '<i class="fa-regular fa-image"></i>';


            const fileInfo =
                document.createElement("div");

            fileInfo.className =
                "civicai-selected-file-info";


            const fileName =
                document.createElement("span");

            fileName.className =
                "civicai-selected-file-name";

            fileName.textContent =
                file.name;


            const fileSize =
                document.createElement("span");

            fileSize.className =
                "civicai-selected-file-size";

            fileSize.textContent =
                formatFileSize(file.size);


            fileInfo.appendChild(fileName);
            fileInfo.appendChild(fileSize);


            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.className =
                "civicai-remove-file";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${file.name}`
            );


            removeButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';


            removeButton.addEventListener(
                "click",
                () => {

                    selectedFiles.splice(index, 1);

                    renderFiles();

                    clearError();

                }
            );


            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeButton);


            selectedFilesContainer.appendChild(
                fileItem
            );

        });

    }


    /* =====================================================
       FILE SIZE
    ===================================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024 * 1024) {

            return `${(bytes / 1024).toFixed(1)} KB`;

        }


        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError(message) {

        clearError();


        const error =
            document.createElement("div");

        error.className =
            "civicai-upload-error";

        error.textContent =
            message;


        uploadArea.insertAdjacentElement(
            "afterend",
            error
        );

    }


    function clearError() {

        const existingError =
            document.querySelector(
                ".civicai-upload-error"
            );


        if (existingError) {
            existingError.remove();
        }

    }

});