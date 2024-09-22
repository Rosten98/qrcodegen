console.log("Loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form visibility on page load
    hideFormFields();

    // Add event listeners to radio buttons
    document.querySelectorAll('input[name="qr_type"]').forEach(radio => {
        radio.addEventListener('change', hideFormFields);
    });

    // Show QR placeholder
    let qr_placeholder = document.getElementById('qr-placeholder');
    let final_qr = document.getElementById('final-qr');
    qr_placeholder.style.display = 'block'
    final_qr.style.display = 'none'

});

function toggleQRimg(img_src, active) {
    let qr_placeholder = document.getElementById('qr-placeholder');
    let final_qr = document.getElementById('final-qr');
    let img_generated = document.getElementById('generated_qr_img');
    let btn_download = document.getElementById('download_qr_btn');

    if(active){
        img_generated.src = img_src;
        btn_download.href = img_src;
        
        qr_placeholder.style.display = 'none'
        final_qr.removeAttribute('style')
        final_qr.classList.add('d-flex');
        final_qr.classList.add('flex-column');
    } else {
        qr_placeholder.style.display = 'block';
        final_qr.classList.remove('d-flex');
        final_qr.classList.remove('flex-column');
        final_qr.style.display = 'none';
    }
}


function hideFormFields(){
    console.log("Function called")

     // Get selected radio button value
     let selectedOption = document.querySelector('input[name="qr_type"]:checked');

     // Hide all form groups initially
     document.querySelectorAll('.form-group').forEach(group => group.style.display = 'none');
 
     // Show the relevant form group based on selected option
     if (selectedOption) {
        let formId = selectedOption.value
        document.getElementById(formId).style.display = 'block';
     }
}

function toggleGeneratingBtn(enable) {
    moveBar();
    const btn_generate = document.getElementById('btn_generate_qr');
    const btn_generating = document.getElementById('btn_generating_qr');

    if(enable){
        btn_generate.style.display = 'none';
        btn_generating.style.display = 'block'
    } else {
        btn_generate.style.display = 'block';
        btn_generating.style.display = 'none'
    }
}

async function sendRequest(e) {
    e.preventDefault();
    
    toggleQRimg('', false)
    toggleGeneratingBtn(true);
    
    const form = e.target;
    const qr_form = new FormData(form);
    
    for (let [key, value] of qr_form.entries()) {
        console.log(key, value); // Prints each form field's name and value
    }

    let qr_type = qr_form.get('qr_type');
    let data = {}
    let url = '/api/generate-link-qr'

    if(qr_type == 'link') {
        let qr_url = qr_form.get('qr_url')
        data = { "qr_url": qr_url }
    } else if(qr_type == 'mail') {
        url = 'api/generate-email-qr'
        let qr_email = qr_form.get('email')
        let qr_subject = qr_form.get('subject')
        let qr_mail_body = qr_form.get('mail_body')
        data = { 
            "qr_email": qr_email,
            "qr_subject": qr_subject,
            "qr_mail_body": qr_mail_body,
        }
        // data = `mailto:${qr_email}?subject=${qr_subject}&body=${qr_mail_body}`
    } else if(qr_type == 'phonecall') {
        url = 'api/generate-call-qr'
        let qr_phone = qr_form.get('qr_phone')
        data = { "qr_phone": qr_phone }
    } else if(qr_type == 'whatsapp') {
        url = 'api/generate-whatsapp-qr'
        let qr_whatsapp = qr_form.get('qr_whatsapp')
        let qr_message = qr_form.get('qr_message')
        data = { 
            "qr_whatsapp": qr_whatsapp,
            "qr_message": qr_message 
        }
    }

    console.log("data:", data)
    console.log("url:", url)
    
    try {
        // Make the POST request
        const response = await fetch(url, {
            method: 'POST',  // Specify the request type
            headers: {
                'Content-Type': 'application/json',  // The type of data being sent
                'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token for security
            },
            body: JSON.stringify(data)  // The data being sent in the request
        });

        // Parse the JSON response
        const json = await response.json();

        // Log or display the response
        // console.log("Json:", json);

        let img_src = 'data:image/png;base64,'+json.qr_image_base64;

        toggleQRimg(img_src, true)
        toggleGeneratingBtn(false);
        
    } catch (error) {
        toggleGeneratingBtn(false);
        console.error('Error:', error);
    }
}

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    // console.log(cookieValue)
    return cookieValue;
}



function moveBar() {
    let bar = document.getElementById("moving-bar");
    let svg = document.getElementById("svg-qr");

    bar.style.display = 'block'
    
    let start = 0;
    let end = svg.getBoundingClientRect().height; // get the height of the svg
    let speed = 10; // change this to control the speed of the movement
    start += speed;

    console.log(start)
    console.log(end)
    
    // Reset to the top once it reaches the bottom
    if (start > end) {
        start = 0;
    }
    
    // Move the bar by changing its transform (smooth effect)
    bar.style.transform = `translateY(${start}px)`;
}
