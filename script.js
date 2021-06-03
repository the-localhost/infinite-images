const imgContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API Auth& URL
const apiKey = 'h6Va4vMcBQ4fiI2BtR1ejLPY6SqNxJqcsUth11ZUfQ0';
const initialCount =5;
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// Helper function to set attributes of DOM elements
function setAttributes(element, attributes){
    for(const key in attributes){
        element.setAttribute(key, attributes[key]);
    }
}

// callback fn, triggered when img is loaded
function hasImageLoaded() {
    imagesLoaded++;
    if(imagesLoaded==totalImages){
        loader.hidden=true;
        ready=true;
        let finalCount=30;
        apiUrl=`https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${finalCount}`;
    }
}

// display photos on DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach(photo => {
        let desc = photo.alt_description;
        let url = photo.links.html;
        let src = photo.urls.regular;

        // anchor for our image
        const item = document.createElement('a');
        setAttributes(item, {
            href: url,
            target: '_blank',
        });
        
        // <img> for our image
        const img = document.createElement('img');
        setAttributes(img, {
            src: src,
            alt: desc,
            title: desc,
        });
        
        // when the image is loaded
        img.addEventListener('load', hasImageLoaded);

        // add img to item; add item to image-container
        item.appendChild(img);
        imgContainer.appendChild(item);
    });
}


// get photos from the API
async function getPhotosFromAPI() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        console.error("Got an error: ", error);
    }
}

// scroll event to check readiness for fetch request
window.addEventListener('scroll', () => {
    if(window.scrollY+window.innerHeight>=document.body.offsetHeight - 1000 && ready){
        ready=false;
        getPhotosFromAPI();
    }
});

// On initial load
getPhotosFromAPI();
