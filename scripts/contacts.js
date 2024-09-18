/** @format */

var armyMsg = "<br/><br/>All U.S. Army personnel must send any additional correspondence directly to <a href='mailto:usarmy.jbsa.imcom-hq.mbx.g1-aces@mail.mil' title='Email Army'>usarmy.jbsa.imcom-hq.mbx.g1-aces@mail.mil</a> rather than this DoD SkillBridge help site.<br/><br/>You should have a verification email in your inbox. If you don't immediately see it, check your spam folder."
var qpTimeout
var qpRedirect
var redirectDelay = 5000
var currentDelay = 0

//const emailRegex = new RegExp('^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', '');
const valid = "isValid";
const invalid = "isInvalid";
const els = {
    dropDownMenuButtons: document.querySelectorAll('button.dropdown-menu'),
    emails: document.querySelectorAll('input[type="email"]'),
    emailsIns: document.querySelectorAll('.email'),
    emailVerifys: document.querySelectorAll('.email-verify'),
    phoneNumbers: document.querySelectorAll('.phone-input'),
    recaptchas: document.querySelectorAll('.g-recaptcha'),
    resets: document.querySelectorAll('button[type="reset"]'),
    submits: document.querySelectorAll('button[type="submit"]'),
    successBanners: document.querySelectorAll('.badge-success')
}

$(document).ready(function () {
    // Dropdown for forms

    $(".dropdown-menu button").click(function () {
        CloseAllForms();
        var target = $(this).val();
        //console.log("target: " + target);
        $(target).addClass("show");
    });

    $('#form2-specific-training').click(function () {
        $('#form2-personnel-description').removeAttr('disabled')
        if (!$(this).prop('checked')) {
            $('#form2-personnel-description').attr('disabled', '')
        }
    })

    els.emails.forEach((eml) => {
        //eml.pattern = emailRegex;
        eml.setAttribute('placeholder', (eml.classList.contains("email-verify") ? "Verify " : "") + "Work Address");
        eml.required = true;
    });

    ['blur'].forEach(evt =>
        els.emailVerifys.forEach((emlv) =>
            emlv.addEventListener(evt, function () {
                emlv.classList.remove(valid, invalid);
                var emlname = emlv.getAttribute("name").replace("-verify", "");
                var eml = document.querySelector("input[name=" + emlname + "]");
                if (eml.value !== emlv.value) {
                    console.log(evt + ' says the emails dont match');
                    emlv.classList.remove(valid);
                    emlv.classList.add(invalid);
                    Array.from(emlv.closest('div').children).forEach(d => {
                        if (d.classList.contains('invalid-feedback')) {
                            d.classList.add("display-important");
                        }
                    });
                } else {
                    emlv.classList.add(valid);
                    emlv.classList.remove(invalid);
                    var di = document.querySelector('.display-important');
                    if (di) { di.classList.remove('display-important'); }
                }
            })
        )
    );

    $('#form4-contact-type').change(function (e) {
        var contactType = $('#form4-contact-type').val()

        if (contactType == 'Provider') {
            $('#form4-provider-name-row').removeClass('d-none')
            $('#form4-provider-name').val('')
            $('#form4-provider-name').attr('required', true)
            $('#provider-update-option').removeAttr('disabled')
            $('#provider-update-option').removeClass('d-none')
        } else {
            $('#form4-provider-name-row').removeClass('d-none').addClass('d-none')
            $('#form4-provider-name').val('N/A')
            $('#form4-provider-name').removeAttr('required')

            // If we had update information selected, select the default now since it should be disabled
            if ($('#form4-contact-purpose').val() == 'Update Provider/Opportunity Information') {
                $('#form4-contact-purpose').val('General Question')
            }
            $('#provider-update-option').attr('disabled', true)
            $('#provider-update-option').addClass('d-none')
        }
    })

    els.resets.forEach(btn => {
        btn.addEventListener('click', (evt) => {
            els.successBanners.forEach(spn => spn.style.display = 'none');
            els.submits.forEach(subm => {
                subm.style.display = 'inline-block';
                subm.disabled = false;
            });
            var validated = document.querySelectorAll('.was-validated');
            validated.forEach(wv => wv.classList.remove('was-validated'));
            els.recaptchas.forEach(rc => grecaptcha.reset(rc));
        })
    })

    // Attach event listeners to each phone input field
    els.phoneNumbers.forEach((phone) => {
        phone.addEventListener('input', formatPhoneNumber);
    });

    $('#redirect-dialog').on('shown.bs.modal', function () {
        currentDelay = redirectDelay / 1000 // Should be 5
        $('#redirect-countdown').html(currentDelay)

        qpTimeout = setTimeout(function () {
            RedirectToQPSurvey()
        }, redirectDelay)
        qpRedirect = setInterval(function () {
            UpdateRedirectCountdown()
        }, 1000)
    })

    // Special dropdown options
    $("#opt-apply").click(function () {
        //console.log("apply clicked");
        $("#form2-apply").prop("checked", true);
    });

    $("#opt-check-status").click(function () {
        //console.log("check status clicked");
        $("#form4-contact-purpose").val("Check on Status of Application");
    });

    $("#opt-report").click(function () {
        //console.log("report clicked");
        $("#form4-contact-purpose").val("Report an Issue");
    });

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    ; (function () {
        'use strict'
        window.addEventListener(
            'load',
            function () {
                // Fetch all the forms we want to apply custom Bootstrap validation styles to
                var forms = document.getElementsByClassName('needs-validation')

                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function (form) {
                    form.addEventListener(
                        'submit',
                        function (event) {
                            event.preventDefault()

                            form.classList.add('was-validated')

                            SanitizeAllInput();
                            if (form.checkValidity() !== false) {
                                //console.log("checkvalidity was true")
                                // Which form is it? service-member-form, industry-employer-form, commander-form
                                if ($(form).attr('id') == 'service-member-form') {
                                    var email = $('#form1-email').val()
                                    var emailVerify = $('#form1-email-verify').val()

                                    if (email !== emailVerify) {
                                        $('#form1-email-verify').removeClass('isValid')
                                        $('#form1-email-verify').addClass('isInvalid')
                                    } else {
                                        SanitizeAllInput();
                                        $.ajax({
                                            statusCode: {
                                                400: ProveHuman,
                                                500: ServerError
                                            },
                                            url: 'scripts/contact-service-member.php',
                                            type: 'POST',
                                            data: $(form).serialize(),
                                            success: function (msg) {
                                                //alert("form submitted successfully!");
                                                if ($('#form1-branch').val() == 'Army') {
                                                    $('#form1-msg').append(armyMsg)
                                                }

                                                $('#form1-msg').css('display', 'block')
                                                $('#service-member-form button[type=submit]').css('display', 'none')

                                                // Military Member Form Submission Google Analytics Event
                                                //_gaq.push(['_trackEvent', 'Form', 'click', 'Military Members Form Submission', , true])
                                                gtag('event', 'Military Members Contact Form Submission', {
                                                    event_category: 'Form',
                                                    form_name: 'Military Members Contact Form',
                                                    page_url: window.location.href
                                                });
                                            },
                                        })
                                    }
                                } else if ($(form).attr('id') == 'industry-employer-form') {
                                    var email = $('#form2-email').val()
                                    var emailVerify = $('#form2-email-verify').val()

                                    if (email !== emailVerify) {
                                        $('#form2-email-verify').removeClass('isValid').addClass('isInvalid')
                                    } else {
                                        SanitizeAllInput();
                                        //alert("trying to send industry form");
                                        $.ajax({
                                            statusCode: {
                                                400: ProveHuman,
                                                500: ServerError
                                            },
                                            url: 'scripts/contact-industry-employer.php',
                                            type: 'POST',
                                            //data: $(form).serialize(),
                                            data: { encodedData: btoa($(form).serialize()) },
                                            success: function (msg) {
                                                //alert("form submitted successfully!");
                                                $('#form2-msg').css('display', 'block')
                                                $('#industry-employer-form button[type=submit]').css('display', 'none')

                                                // Industry Employer Form Submission Google Analytics Event
                                                //_gaq.push(['_trackEvent', 'Form', 'click', 'Industry Employer Form Submission', , true])
                                                gtag('event', 'Industry Employer Contact Form Submission', {
                                                    event_category: 'Form',
                                                    form_name: 'Industry Employer Contact Form',
                                                    page_url: window.location.href
                                                });
                                            },
                                        })
                                    }
                                } else if ($(form).attr('id') == 'commander-form') {
                                    var email = $('#form3-email').val()
                                    var emailVerify = $('#form3-email-verify').val()

                                    if (email !== emailVerify) {
                                        $('#form3-email-verify').removeClass('isValid').addClass('isInvalid')
                                    } else {
                                        SanitizeAllInput();
                                        $.ajax({
                                            statusCode: {
                                                400: ProveHuman,
                                                500: ServerError
                                            },
                                            url: 'scripts/contact-commander.php',
                                            type: 'POST',
                                            data: $(form).serialize(),
                                            success: function (msg) {
                                                //alert("form submitted successfully!");
                                                if ($('#form3-branch').val() == 'Army') {
                                                    $('#form3-msg').append(armyMsg)
                                                }

                                                $('#form3-msg').css('display', 'block')
                                                $('#commander-form button[type=submit]').css('display', 'none')

                                                // Commands Form Submission Google Analytics Event
                                                //_gaq.push(['_trackEvent', 'Form', 'click', 'Commands Form Submission', , true])
                                                gtag('event', 'Commands Contact Form Submission', {
                                                    event_category: 'Form',
                                                    form_name: 'Commands Contact Form',
                                                    page_url: window.location.href
                                                });
                                            },
                                        })
                                    }
                                } else if ($(form).attr('id') == 'general-form') {
                                    //console.log("checking general form");
                                    var email = $('#form4-email').val()
                                    var emailVerify = $('#form4-email-verify').val()

                                    if (email !== emailVerify) {
                                        //console.log("form not valid because of email");
                                        $('#form4-email-verify').removeClass('isValid').addClass('isInvalid')
                                    } else {
                                        var contactType = $('#form4-contact-type').val()
                                        var contactPurpose = $('#form4-contact-purpose').val()
                                        SanitizeAllInput();
                                        $.ajax({
                                            statusCode: {
                                                400: ProveHuman,
                                                500: ServerError
                                            },
                                            url: 'scripts/contact-general.php',
                                            type: 'POST',
                                            data: $(form).serialize(),
                                            success: function (msg) {
                                                //alert("form submitted successfully!");
                                                $('#form4-msg').css('display', 'block')
                                                $('#general-form button[type=submit]').css('display', 'none')

                                                // Commands Form Submission Google Analytics Event
                                                //_gaq.push(['_trackEvent', 'Form', 'click', 'General Form Submission', , true])
                                                gtag('event', 'General Form Submission', {
                                                    event_category: 'Form',
                                                    form_name: 'General Contact Form',
                                                    page_url: window.location.href
                                                });
                                            },
                                        })
                                        //}
                                    }
                                }
                            }
                        },
                        false
                    )
                })
            },
            false
        )
    })()
})

function ProveHuman() {
    alert("Please prove you are human");
}

function ServerError() {
    alert("An error occured!");
}

function SanitizeAllInput() {
    // Get all input and textarea elements on the page
    let inputElements = document.querySelectorAll('input, textarea');

    // Iterate over each element and sanitize its value
    inputElements.forEach((element) => {
        if (element.value) {
            // Sanitize the input using DOMPurify
            element.value = DOMPurify.sanitize(element.value);
        }
    });
}
$(document).ajaxStop(function () { })

$(window).resize(function () { })

$(window).scroll(function () { })

function CloseAllForms() {
    $("#service-member-container").removeClass("show");
    $("#industry-container").removeClass("show");
    $("#commander-container").removeClass("show");
    $("#general-container").removeClass("show");
}

function recaptchaCallback1() {
    $('#contact-form-submit-1').removeAttr('disabled')
}

function recaptchaCallback2() {
    $('#contact-form-submit-2').removeAttr('disabled')
}

function recaptchaCallback3() {
    $('#contact-form-submit-3').removeAttr('disabled')
}

function recaptchaCallback4() {
    $('#contact-form-submit-4').removeAttr('disabled')
}

function recaptchaCallback5() {
    $('#contact-form-submit-5').removeAttr('disabled')
}

// Show a Form
function ShowForm(num) {
    $('#contact-form-container').css('display', 'block')

    switch (num) {
        case 1: // Service Member
            $('#interested-service-member').css('display', 'block')
            break
        case 2: // Industry Employer
            $('#interested-industry-employer').css('display', 'block')
            break
        case 3: // Commander
            $('#interested-commander').css('display', 'block')
            break
    }
}

function formatPhoneNumber(event) {
    const inputField = event.target;
    const phoneNumber = inputField.value.replace(/\D/g, '');

    if (phoneNumber.length <= 3) {
        // Format as xxx
        inputField.value = phoneNumber;
    } else if (phoneNumber.length <= 6) {
        // Format as xxx-xxx
        inputField.value = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
        // Format as xxx-xxx-xxxx
        inputField.value = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
}
