/*--------------------------- Page Loader --------------------------------*/
$(function () {
    setTimeout(() => {
        $('.page-loader').fadeOut('slow');
    }, 500);
});
/*---------------------------- Onboarding Screen ----------------------------*/
$(document).on("click", ".skip_btn_1", function () {
    $("#first").removeClass("active");
    $(".first_slide").removeClass("active");

    $("#second").addClass("active");
    $(".second_slide").addClass("active");
});

$(document).on("click", ".skip_btn_2", function () {
    $("#second").removeClass("active");
    $(".second_slide").removeClass("active");

    $("#third").addClass("active");
    $(".third_slide").addClass("active");
});

/*------------------------- New Password hide show button --------------------------*/
$(document).on("click", ".eye-off", function () {
    const input = $(this).siblings("input");
    const isPassword = input.attr("type") === "password";

    input.attr("type", isPassword ? "text" : "password");
    $(this).attr("src", isPassword ? "assets/images/svg/eye.svg" : "assets/images/svg/eye-off.svg");
});

/*------------------------------ Sticky Header -----------------------------*/
$(window).on("scroll", function () {
    const scrollPosition = $(window).scrollTop();

    if (scrollPosition >= 20) {
        $("#top-header, #top-navbar").addClass("fixed");
        $(".Amigo_img_main").css("padding-top", "70px");
    } else {
        $("#top-header, #top-navbar").removeClass("fixed");
        $(".Amigo_img_main").css("padding-top", "0");
    }
});
/*---------------------------- Confirm OTP Input filed  ------------------------------*/
function validateInput(input) {
    input.value = input.value.replace(/\D/g, "");

    if (input.value.length > 1) {
        input.value = input.value.charAt(0);
    }

    if (input.value !== "") {
        input.classList.add("filled");

        const nextInput = input.nextElementSibling;
        if (nextInput && nextInput.tagName === "INPUT") {
            nextInput.focus();
        }
    } else {
        input.classList.remove("filled");
    }
}
/*-----------------------------  Personal Info Photo Upload -------------------------*/
$(document).on("DOMContentLoaded", function () {
    const readURL = (input) => {
        if (input.files && input.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                $(".profile-pic").attr("src", e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $(document).on("change", ".file-upload", function () {
        readURL(this);
    });

    $(document).on("click", ".upload-button", function () {
        $(".file-upload").click();
    });
});

/*------------------------ Data Collect Buttons --------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".toggle-btn-per-info");
    const sections = document.querySelectorAll("section");
    const continueButtons = document.querySelectorAll(".per-arrow-btn");

    // Function to toggle sections
    function toggleSection(targetSection) {
        sections.forEach((section) => section.classList.remove("active"));

        const targetElement = document.querySelector(`.${targetSection}`);
        if (targetElement) targetElement.classList.add("active");

        toggleButtons.forEach((btn) => btn.classList.remove("active"));
        const targetButton = document.querySelector(`.toggle-btn-per-info[data-section="${targetSection}"]`);
        if (targetButton) targetButton.classList.add("active");
    }

    toggleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetSection = button.dataset.section;
            toggleSection(targetSection);
        });
    });

    continueButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const targetSection = button.dataset.section;
            toggleSection(targetSection);
        });
    });

    toggleSection("personal-info-sec-one");
});

/*------------- Best Sellers Home Screen ---------------------*/
$('.AISlider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    dots: false,
    speed: 1000,
    responsive: [
        {
            breakpoint: 470,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false,
            }
        }
    ]
})

/*------------- Like Heart ---------------------*/
document.addEventListener("click", (event) => {
    const icon = event.target.closest(".heart-icon");
    if (icon) {
        icon.classList.toggle("filled");
    }
});
/*------------------------------------- Tabs -------------------------------------*/
$(document).on("click", ".tab-btn-main a", function (e) {
    e.preventDefault();

    const tabId = $(this).data("tab");
    if (!tabId) return;

    $(".tab-btn-main a, .Tabcondent").removeClass("tab-active");
    $(this).addClass("tab-active");
    $("#" + tabId).addClass("tab-active");
});

/*--------------------------------- Add Text In Card -------------------------------------*/
function updateLokiBox(lokiBoxId, inputField) {
    const lokiBox = document.getElementById(lokiBoxId);
    if (!lokiBox || !inputField) return;

    lokiBox.textContent = inputField.value.trim();
}

// Add Card Number 16 digit
function maskNumber() {
    const inputElement = document.getElementById("cardNumber");
    const outputElement = document.getElementById("lokiCardNumber");

    if (!inputElement || !outputElement) return;

    let inputNumber = inputElement.value.trim();

    let digitsOnly = inputNumber.replace(/\D/g, "");

    let maskedPart = digitsOnly.slice(0, 12).replace(/\d/g, "*"); // Mask first 12 digits
    let lastPart = digitsOnly.slice(12); // Show last 4 digits

    let maskedNumber = maskedPart.replace(/(.{4})/g, "$1 ").trim();

    if (lastPart) {
        maskedNumber += " " + lastPart;
    }

    outputElement.textContent = maskedNumber;
}

// Add CVV Number Only Three
function validateInputcvv(inputField) {
    inputField.value = inputField.value.replace(/\D/g, '');

    if (inputField.value.length > 3) {
        inputField.value = inputField.value.slice(0, 3);
    }
    document.getElementById('lokiCVV').textContent = inputField.value;
}

/*-------------------------------------Personal Info Form DropDown-------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".custom-dropdown");

    if (dropdown) {
        const input = dropdown.querySelector("input");
        const options = dropdown.querySelectorAll(".dropdown-option");

        input.addEventListener("click", () => {
            dropdown.classList.toggle("active");
        });

        options.forEach((option) => {
            option.addEventListener("click", () => {
                const selectedValue = option.getAttribute("data-value");
                input.value = selectedValue;
                dropdown.classList.remove("active");
            });
        });

        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("active");
            }
        });
    }
});

/*------------------------------------- Faq Screen-------------------------------------*/
$(document).ready(function () {
    $('.nested-accordion').find('.comment').slideUp();

    $('.nested-accordion').find('h3').click(function () {
        let $this = $(this);
        let $parentAccordion = $this.closest('.nested-accordion');

        $parentAccordion.siblings().find('.comment').slideUp();
        $parentAccordion.siblings().find('h3').removeClass('selected');

        $this.next('.comment').slideToggle(100);
        $this.toggleClass('selected');

        $parentAccordion.find('.nested-accordion .comment').slideUp();
        $parentAccordion.find('.nested-accordion h3').removeClass('selected');
    });
});

/*--------------------------- Delete Or Deactive Button Check Screen -------------------------------*/
function continueAction() {
    const form = document.getElementById('deleteDeactivateForm');
    const selectedAction = form.querySelector('input[name="action"]:checked');

    if (!selectedAction) {
        showInfoPopup("Por favor, selecione uma opção antes de continuar.");
        return;
    }

    if (selectedAction.value === 'delete') {
        window.location.href = 'delete.html';
    } else if (selectedAction.value === 'deactivate') {
        window.location.href = 'deactivate.html';
    }
}

/*--------------------------- Radio Check Button Check and color chng Screen -------------------------------*/
document.querySelectorAll('.check-radio2').forEach(radio => {
    radio.addEventListener('change', function () {
        document.querySelectorAll('.news-tex').forEach(text => text.style.color = "#0F0F0F");
        this.closest('.your-data-main').querySelector('.news-tex').style.color = "#6218FF";
    });
});
/*-------------------------------------Add Home Screen Pop Up Screen-------------------------------------*/
$(document).ready(function () {
    setTimeout(() => {
        $("#bkgOverlay, #delayedPopup").fadeIn(400);
    }, 4800);

    $("#btnClose").on("click", function (e) {
        e.preventDefault();
        HideDialog();
    });

    function HideDialog() {
        $("#bkgOverlay, #delayedPopup").fadeOut(400);
    }
});


/*------------------------------- In textArea Add text increse hight textarea ---------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector(".textSpeechScreen-input-main textarea");

    if (!textarea) {
        return;
    }

    textarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
});

/*------------------------------- In textArea Add text show music player ---------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector(".textSpeechScreen-input-main textarea");
    const playButton = document.querySelector(".circle-play-btn");
    const pauseButton = document.querySelector(".circle-pause-btn");
    const songTimeSpan = document.querySelector(".play-btn-purple-main span");
    const audioPlayer = new Audio("assets/audio/music1.mp3");

    if (!textarea || !playButton || !pauseButton || !songTimeSpan) {
        return;
    }

    playButton.style.display = "none";
    pauseButton.style.display = "none";
    songTimeSpan.textContent = "0 s"; 

    function checkTextareaContent() {
        if (textarea.value.trim().length > 0) {
            playButton.style.display = "inline-block"; 
        } else {
            playButton.style.display = "none";
            pauseButton.style.display = "none"; 
            audioPlayer.pause();
            audioPlayer.currentTime = 0; 
            songTimeSpan.textContent = "0 s"; 
        }
    }

    // Play button click event
    playButton.addEventListener("click", function () {
        audioPlayer.play();
        playButton.style.display = "none"; 
        pauseButton.style.display = "inline-block"; 
    });

    // Pause button click event
    pauseButton.addEventListener("click", function () {
        audioPlayer.pause();
        pauseButton.style.display = "none"; 
        playButton.style.display = "inline-block"; 
    });

    // Update song time while playing
    audioPlayer.addEventListener("timeupdate", function () {
        songTimeSpan.textContent = Math.floor(audioPlayer.currentTime) + " s";
    });

    // Reset UI when audio ends
    audioPlayer.addEventListener("ended", function () {
        pauseButton.style.display = "none"; 
        playButton.style.display = "inline-block"; 
        songTimeSpan.textContent = "0 s"; 
    });

    // Listen for input in the textarea
    textarea.addEventListener("input", checkTextareaContent);
});

/*------------------------------- Pitch and Speed Range and PopUp ---------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
    const pitchButton = document.getElementById('pitch');
    const speedButton = document.getElementById('speed');
    const pitchPopup = document.getElementById('pitch-popup');
    const speedPopup = document.getElementById('speed-popup');

    if (pitchButton && speedButton && pitchPopup && speedPopup) {
        function showPopup(popup, button) {
            document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
            document.querySelectorAll('.display-value').forEach(btn => btn.classList.remove('active'));
            popup.style.display = 'block';
            button.classList.add('active');
        }

        pitchButton.addEventListener('click', function () {
            showPopup(pitchPopup, pitchButton);
        });

        speedButton.addEventListener('click', function () {
            showPopup(speedPopup, speedButton);
        });

        document.addEventListener('click', function (event) {
            const isClickInsidePopup = event.target.closest('.popup');
            const isClickInsideButton = event.target.closest('.display-value');

            if (!isClickInsidePopup && !isClickInsideButton) {
                document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
                document.querySelectorAll('.display-value').forEach(btn => btn.classList.remove('active'));
            }
        });

        // Initialize sliders
        const sliders = document.querySelectorAll('.slider-container');
        sliders.forEach((sliderContainer) => {
            const slider = sliderContainer.querySelector('.slider');
            const thumb = sliderContainer.querySelector('.slider-thumb');
            const thumbValue = sliderContainer.querySelector('.thumb-value');
            const buttonId = sliderContainer.dataset.button;
            const button = document.getElementById(buttonId);

            if (thumb && slider && thumbValue && button) {
                // Mouse events for desktop
                thumb.addEventListener('mousedown', function (event) {
                    event.preventDefault();
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });

                // Touch events for mobile
                thumb.addEventListener('touchstart', function (event) {
                    event.preventDefault();
                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchend', onTouchEnd);
                });

                function updateThumbPosition(clientX) {
                    const sliderRect = slider.getBoundingClientRect();
                    let newLeft = (clientX - sliderRect.left) / sliderRect.width;
                    newLeft = Math.min(Math.max(newLeft, 0), 1);
                    thumb.style.left = `${newLeft * 100}%`;
                    const value = Math.round((newLeft - 0.5) * 100);
                    const formattedValue = `${value >= 0 ? '+' : ''}${value}%`;
                    thumbValue.textContent = formattedValue;
                    button.textContent = `${buttonId === 'pitch' ? 'Pitch' : 'Speed'} ${formattedValue}`;
                }

                function onMouseMove(event) {
                    updateThumbPosition(event.clientX);
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }

                function onTouchMove(event) {
                    updateThumbPosition(event.touches[0].clientX);
                }

                function onTouchEnd() {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                }
            }
        });
    }
});

/*------------- AudioTon Multi Time Use PopUp ---------------------*/
document.querySelectorAll(".audioTune").forEach((button) => {
    const popup = button.nextElementSibling;

    button.addEventListener("click", function (event) {
        document.querySelectorAll(".audioTunePopup").forEach((pop) => {
            if (pop !== popup) {
                pop.style.display = "none";
                pop.previousElementSibling.classList.remove("active");
            }
        });

        const isVisible = popup.style.display === "block";
        popup.style.display = isVisible ? "none" : "block";
        button.classList.toggle("active", !isVisible);

        event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
        if (popup.style.display === "block" && !popup.contains(event.target) && event.target !== button) {
            popup.style.display = "none";
            button.classList.remove("active");
        }
    });
});

/*------------- Export Audio Modal ---------------------*/
$(document).on("click", ".continue-btn", function () {
    let counter = 1;
    $("#counter-audio").text(counter + "%");
    $(".loader2").fadeIn();

    let interval = setInterval(() => {
        if (counter < 100) {
            counter++;
            $("#counter-audio").text(counter + "%");
        } else {
            clearInterval(interval);
        }
    }, 30); 

    setTimeout(() => {
        $(".loader2").fadeOut();
    }, 3000);

    let targetUrl = $(this).data("url");

    setTimeout(() => {
        window.location.href = targetUrl;
    }, 3000);
});
