let swiper = null;

function Photos_click() {
    document.getElementById('image-overlay').style.display = 'block';
    document.getElementById("mediaModal").classList.add("active");

    fetch(photos_path)
        .then(res => res.json())
        .then(data => {
            const wrapper = document.getElementById("carouselContent");
            wrapper.innerHTML = ""; // Clear previous slides

            data.forEach(item => {
                const slide = document.createElement("div");
                slide.className = "swiper-slide";

                if (item.type === "image") {
                slide.innerHTML = `<img src="${item.src}" alt="">`;
                } else if (item.type === "video") {
                slide.innerHTML = `
                    <video loop autoplay muted playsinline>
                    <source src="${item.src}" type="video/mp4">
                    Your browser does not support video.
                    </video>`;
                }

                wrapper.appendChild(slide);
            });

            if (swiper) {
                swiper.destroy(true, true);
            }

            swiper = new Swiper('.swiper', {
                loop: true,
                autoplay: {
                    delay: 3000,
                },
                slidesPerView: 1,
                centeredSlides: true,
                speed: 800,
            });
        })
        .catch(error => {
            document.getElementById('image-overlay').style.display = 'none';
            document.getElementById("mediaModal").classList.remove("active");
            alert("Wait until you receive the friendship");
        });
}

function closeModal() {
    document.getElementById('image-overlay').style.display = 'none';
    document.getElementById("mediaModal").classList.remove("active");
    if (swiper) {
        swiper.autoplay.stop();
        swiper.destroy(true, true); // clean up here too
        swiper = null;
    }
}
