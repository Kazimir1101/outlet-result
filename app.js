$(document).ready(function () {

    /* =====================================================
       PRODUCT MODAL
    ===================================================== */

    let currentImages = [];
    let currentIndex = 0;


    /* =====================================================
       SCROLL LOCK HELPERS
    ===================================================== */

    let scrollLockY = 0;

    function lockBodyScroll() {
        scrollLockY = window.scrollY || window.pageYOffset || 0;

        $('body')
            .addClass('modal-open')
            .css('top', -scrollLockY + 'px');
    }

    function unlockBodyScroll() {
        $('body')
            .removeClass('modal-open')
            .css('top', '');

        window.scrollTo(0, scrollLockY);
    }

    function lockFiltersScroll() {
        scrollLockY = window.scrollY || window.pageYOffset || 0;

        $('body')
            .addClass('filters-modal-open')
            .css('top', -scrollLockY + 'px');
    }

    function unlockFiltersScroll() {
        $('body')
            .removeClass('filters-modal-open')
            .css('top', '');

        window.scrollTo(0, scrollLockY);
    }


    /* =====================================================
       PREVENT TOUCH SCROLL ON OVERLAY
    ===================================================== */

    $(document).on('touchmove', function (e) {

        // Блокируем touchmove только если открыта модалка
        // и скролл не происходит внутри скроллируемого контента.

        const target = $(e.target);

        const insideProductContent =
            target.closest('.product-modal-content').length > 0;

        const insideFiltersBox =
            target.closest('.filters-modal-box').length > 0;

        if (
            $('.product-modal').hasClass('active') &&
            !insideProductContent
        ) {
            e.preventDefault();
            return;
        }

        if (
            $('.filters-modal').hasClass('active') &&
            !insideFiltersBox
        ) {
            e.preventDefault();
        }

    });


    /* =====================================================
       OPEN PRODUCT MODAL
    ===================================================== */

    $('.result-ad').on('click', function () {

        const card = $(this);


        /* -------------------------
           PRODUCT DATA
        ------------------------- */

        const title =
            card.data('title') ||
            card.find('h3').text().trim();

        const description =
            card.data('description') ||
            card.find('.ad-description').text().trim();

        const oldPrice =
            card.data('old-price') ||
            card.find('.old-price').text().trim();

        const newPrice =
            card.data('new-price') ||
            card.find('.new-price').text().trim();

        const city =
            card.data('city') ||
            card.find('.ad-info span:first').text().trim();

        const shop =
            card.data('shop') ||
            'Dükan';

        const address =
            card.data('address') ||
            'Ünvan qeyd edilməyib';

        const phone =
            card.data('phone') ||
            'Əlaqə nömrəsi yoxdur';

        const date =
            card.data('date') ||
            card.find('.ad-info span:last').text().trim();


        /* -------------------------
           IMAGES
        ------------------------- */

        const imageData = card.attr('data-images');

        currentImages = imageData
            ? imageData
                .split(',')
                .map(function (image) {
                    return image.trim();
                })
                .filter(Boolean)
            : [card.find('.ad-image img').attr('src')];


        currentIndex = 0;


        /* -------------------------
           SET PRODUCT INFO
        ------------------------- */

        $('.product-modal-title').text(title);

        $('.product-modal-description').text(description);

        $('.product-old-price').text(oldPrice);

        $('.product-new-price').text(newPrice);

        $('.product-address').text(shop);

        $('.product-full-address').text(address);

        $('.product-city').text(city);

        $('.product-phone-number').text(phone);

        $('.product-date-value').text(date);


        /* -------------------------
           BUILD SLIDER
        ------------------------- */

        buildSlider();


        /* -------------------------
           OPEN (clean, no fadeIn flicker)
        ------------------------- */

        // 1. Сначала показываем контейнер (display: flex),
        //    но БЕЗ класса active — контент ещё opacity:0.
        $('.product-modal').css('display', 'flex');

        // 2. Форсируем reflow, чтобы браузер применил display:flex
        //    до добавления класса active.
        void $('.product-modal')[0].offsetWidth;

        // 3. Добавляем active → проигрывается transition.
        $('.product-modal').addClass('active');

        // 4. Блокируем скролл body.
        lockBodyScroll();

    });


    /* =====================================================
       BUILD SLIDER
    ===================================================== */

    function buildSlider() {

        const slidesContainer =
            $('.product-slides');

        const dotsContainer =
            $('.product-slider-dots');


        slidesContainer.empty();

        dotsContainer.empty();


        currentImages.forEach(function (image, index) {

            const slide = $('<div>')
                .addClass('product-slide');

            const img = $('<img>')
                .attr('src', image)
                .attr('alt', 'Məhsul şəkli');

            slide.append(img);

            slidesContainer.append(slide);


            const dot = $('<span>')
                .addClass('product-slider-dot')
                .attr('data-index', index);

            dotsContainer.append(dot);

        });


        showSlide(0);


        /* dots */

        $('.product-slider-dot')
            .off('click')
            .on('click', function (event) {

                event.stopPropagation();

                const index =
                    parseInt($(this).attr('data-index'));

                showSlide(index);

            });


        updateCounter();

    }


    /* =====================================================
       SHOW SLIDE
    ===================================================== */

    function showSlide(index) {

        if (!currentImages.length) {
            return;
        }


        if (index < 0) {
            index = currentImages.length - 1;
        }


        if (index >= currentImages.length) {
            index = 0;
        }


        currentIndex = index;


        $('.product-slide')
            .removeClass('active')
            .eq(currentIndex)
            .addClass('active');


        $('.product-slider-dot')
            .removeClass('active')
            .eq(currentIndex)
            .addClass('active');


        updateCounter();

    }


    /* =====================================================
       COUNTER
    ===================================================== */

    function updateCounter() {

        $('.product-modal-counter').text(
            (currentIndex + 1) +
            ' / ' +
            currentImages.length
        );

    }


    /* =====================================================
       NEXT
    ===================================================== */

    $('.product-next').on('click', function (event) {

        event.stopPropagation();

        showSlide(currentIndex + 1);

    });


    /* =====================================================
       PREVIOUS
    ===================================================== */

    $('.product-prev').on('click', function (event) {

        event.stopPropagation();

        showSlide(currentIndex - 1);

    });


    /* =====================================================
       CLOSE PRODUCT MODAL
    ===================================================== */

    function closeProductModal() {

        $('.product-modal').removeClass('active');

        // Ждём завершения transition, затем скрываем.
        setTimeout(function () {

            if (!$('.product-modal').hasClass('active')) {
                $('.product-modal').css('display', 'none');
            }

        }, 340);

        unlockBodyScroll();

    }


    $('.product-modal-close').on('click', function () {

        closeProductModal();

    });


    $('.product-modal-overlay').on('click', function () {

        closeProductModal();

    });


    /* =====================================================
       ESC / ARROWS
    ===================================================== */

    $(document).on('keydown', function (event) {

        if (!$('.product-modal').hasClass('active')) {
            return;
        }


        if (event.key === 'Escape') {

            closeProductModal();

        }


        if (event.key === 'ArrowRight') {

            showSlide(currentIndex + 1);

        }


        if (event.key === 'ArrowLeft') {

            showSlide(currentIndex - 1);

        }

    });


    /* =====================================================
       TOUCH SWIPE
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    $('.product-slider').on('touchstart', function (event) {

        touchStartX =
            event.originalEvent.touches[0].clientX;

    });


    $('.product-slider').on('touchend', function (event) {

        touchEndX =
            event.originalEvent.changedTouches[0].clientX;


        const difference =
            touchStartX - touchEndX;


        if (Math.abs(difference) < 40) {
            return;
        }


        if (difference > 0) {

            showSlide(currentIndex + 1);

        } else {

            showSlide(currentIndex - 1);

        }

    });


    /* =====================================================
       FILTERS MODAL
    ===================================================== */

    /* OPEN FILTERS */

    $('.open-filters-btn').on('click', function () {

        $('.filters-modal').addClass('active');

        lockFiltersScroll();

    });


    /* CLOSE FILTERS */

    function closeFiltersModal() {

        $('.filters-modal').removeClass('active');

        unlockFiltersScroll();

    }


    /* CLOSE BUTTON */

    $('.close-filters-box').on('click', function () {

        closeFiltersModal();

    });


    /* CLICK OVERLAY */

    $('.filters-modal-overlay').on('click', function () {

        closeFiltersModal();

    });


    /* ESCAPE */

    $(document).on('keydown', function (e) {

        if (
            e.key === 'Escape' &&
            $('.filters-modal').hasClass('active')
        ) {

            closeFiltersModal();

        }

    });


    /* =====================================================
       SHOW FILTERED ADS
    ===================================================== */

    $('#show-filtered-ads').on('click', function () {

        const city =
            $('.custom-select[data-filter="city"]')
                .attr('data-value') || '';

        const minPrice =
            $('#filter-min-price').val();

        const maxPrice =
            $('#filter-max-price').val();

        const sort =
            $('.custom-select[data-filter="sort"]')
                .attr('data-value') || 'default';


        console.log('Şəhər:', city);
        console.log('Min qiymət:', minPrice);
        console.log('Max qiymət:', maxPrice);
        console.log('Sıralama:', sort);


        /*
         * Burada daha sonra backend-ə sorğu göndəriləcək.
         *
         * city
         * minPrice
         * maxPrice
         * sort
         *
         * məlumatlarını Spring Boot-a göndərə bilərsən.
         */


        closeFiltersModal();

    });


    /* =====================================================
       CUSTOM SELECT
    ===================================================== */

    $('.custom-select-button').on('click', function (e) {

        e.stopPropagation();

        const currentSelect = $(this).closest('.custom-select');

        $('.custom-select')
            .not(currentSelect)
            .removeClass('open');

        currentSelect.toggleClass('open');

    });


    /* SELECT OPTION */

    $('.custom-option').on('click', function (e) {

        e.stopPropagation();

        const option = $(this);

        const select = option.closest('.custom-select');

        const value = option.data('value');

        const text = option.text().trim();


        /* меняем текст */

        select
            .find('.custom-select-value')
            .text(text);


        /* меняем active */

        select
            .find('.custom-option')
            .removeClass('active');

        option.addClass('active');


        /* сохраняем значение */

        select.attr('data-value', value);


        /* закрываем */

        select.removeClass('open');

    });


    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    $(document).on('click', function () {

        $('.custom-select').removeClass('open');

    });

});
