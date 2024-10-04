const imageUpload = document.getElementById('image-upload');
const imageUrl = document.getElementById('image-url');
const imagePreview = document.getElementById('image-preview');
const uploadForm = document.getElementById('upload-form');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');

function displayImage(src) {
    imagePreview.src = src;
    imagePreview.style.display = 'block';
}

imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            displayImage(e.target.result);
        }
        reader.readAsDataURL(file);
        document.querySelector('.file-upload-label').textContent = file.name;
        imageUrl.value = ''; // Clear URL input when file is selected
    }
});

imageUrl.addEventListener('input', function(e) {
    if (this.value.trim() !== '') {
        displayImage(this.value);
        imageUpload.value = ''; // Clear file input when URL is entered
        document.querySelector('.file-upload-label').textContent = 'Choose Image File';
    }
});

// uploadForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     if (imageUpload.files.length > 0) {
//         formData.append('file', imageUpload.files[0]);
//     } else if (imageUrl.value.trim() !== '') {
//         formData.append('url', imageUrl.value.trim());
//     } else {
//         resultDiv.innerHTML = '<span class="error">Please select an image file or enter an image URL.</span>';
//         resultDiv.classList.add('show');
//         return;
//     }

//     resultDiv.textContent = '';
//     resultDiv.classList.remove('show');
//     loadingDiv.style.display = 'block';

//     try {
//         const response = await fetch('http://localhost:8000/predict/', {
//             method: 'POST',
//             body: formData
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         resultDiv.textContent = `Prediction: ${result.label}`;
//         resultDiv.classList.add('show');
//     } catch (error) {
//         console.error('Error:', error);
//         resultDiv.innerHTML = `<span class="error">An error occurred during prediction: ${error.message}</span>`;
//         resultDiv.classList.add('show');
//     } finally {
//         loadingDiv.style.display = 'none';
//     }
// });

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (imageUpload.files.length > 0) {
        formData.append('file', imageUpload.files[0]);
    } else if (imageUrl.value.trim() !== '') {
        formData.append('url', imageUrl.value.trim());
    } else {
        resultDiv.innerHTML = '<span class="error">Please select an image file or enter an image URL.</span>';
        resultDiv.classList.add('show');
        return;
    }

    resultDiv.textContent = '';
    resultDiv.classList.remove('show');
    loadingDiv.style.display = 'block';

    try {
        const response = await fetch('http://localhost:8000/predict/', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        resultDiv.textContent = `Prediction: ${result.label}`;
        resultDiv.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `<span class="error">An error occurred during prediction: ${error.message}</span>`;
        resultDiv.classList.add('show');
    } finally {
        loadingDiv.style.display = 'none';
    }
});
