(function () {
    let sliderCreator = (node) => {
            let slider_outer = document.createElement('div'),
                slider = document.createElement('div'),
                sliderTrack = document.createElement('div'),
                controls = document.createElement('div'),
                prev = document.createElement('button'),
                next = document.createElement('button'),
                reviews;

            slider_outer.className = 'slider__outer';
            slider.className = 'slider';
            sliderTrack.className = 'slider__wrapper'
            sliderTrack.className.add = 'slider__wrapper';
            prev.classList.add('arrows', 'prev');
            next.classList.add('arrows', 'next');
            controls.className = 'controls';

            slider_outer.append(slider);
            slider.append(sliderTrack);
            controls.append(prev, next);
            slider_outer.append(controls);

            reviews = Array.from(node.querySelectorAll('.review')),
                target = reviews.map(item => {
                    return item.cloneNode(true)
                });
            node.innerHTML = '';

            target = target.map((item, i) => {
                let shell = document.createElement('div');
                shell.className = 'slider__item';
                if (!i) shell.classList.add('show');
                shell.append(item);
                return shell;
            });

            target.forEach(item => sliderTrack.append(item));
            node.append(slider_outer);
            let slideWidth = slider_outer.clientWidth,
                x0 = 0,
                y0 = 0,
                reg = /-?\d+/,
                transform = 0,

                translate = (el, trans) => {

                    return el.style.transform = `translateX(${trans}%)`
                },

                swipeStart = () => {
                    x0 = getEvent().clientX;
                    y0 = getEvent().clientY;
                    slider_outer.addEventListener('touchmove', swipeAction);
                    slider_outer.addEventListener('mousemove', swipeAction);
                },

                getEvent = () => {
                    return event.type.search('touch') !== -1 ? event.touches[0] : event;
                },

                transformSlide = (dir) => {
                    let slides = Array.from(slider_outer.querySelectorAll('.slider__item')),
                        slideShow = slides.findIndex(slide => slide.classList.contains('show')),
                        nextSlide = slideShow + dir,
                        transformSlide = parseInt((slides[slideShow].style.transform).match(reg));

                    if (nextSlide < 0) {
                        nextSlide = slides.length - 1;
                    } else if (nextSlide >= slides.length) {
                        nextSlide = 0
                    }
                    transform = parseInt((sliderTrack.style.transform).match(reg));
                    if (!transform) transform = 0;
                    if (!transformSlide) transformSlide = 0;
                    transform = Math.round(transform / 100) * 100;
                    transformSlide = Math.round(transformSlide / 100) * 100;
                    transform -= 100 * dir;

                    slides[slideShow].classList.remove('show');
                    slides[nextSlide].classList.add('show');

                    if (slideShow * dir < nextSlide * dir) {
                        translate(slides[nextSlide], transformSlide)
                    } else {
                        translate(slides[nextSlide], transformSlide + dir * slides.length * 100)
                    }
                },

                direction_slide = (flag) => {

                    let direction = (flag) ? 1 : -1;
                    transformSlide(direction)
                    slide();
                },

                slide = () => {
                    translate(sliderTrack, transform);
                    slider_outer.removeEventListener('touchmove', swipeAction);
                    slider_outer.removeEventListener('mousemove', swipeAction);
                },

                swipeAction = () => {
                    slider_outer.addEventListener('touchend', swipeEnd);
                    slider_outer.addEventListener('mouseup', swipeEnd);
                    transform = (sliderTrack.style.transform).match(reg);
                    if (!transform) transform = 0;
                    let x1 = (x0 - getEvent().clientX) / slideWidth * 100;
                    let y1 = (y0 - getEvent().clientY) / slideWidth * 100;
                    if (Math.abs(x1) > Math.abs(y1)) {
                        if (Math.abs(x1) >= 20) {
                            direction_slide(x1 > 0);
                        } else {
                            if (Math.abs(transform % 100 - x1) < 20)
                                translate(sliderTrack, transform - x1)

                        }
                    }
                },

                swipeEnd = () => {
                    slide();
                    slider_outer.removeEventListener('touchmove', swipeAction);
                    slider_outer.removeEventListener('mousemove', swipeAction);
                    slider_outer.removeEventListener('touchend', swipeEnd);
                    slider_outer.removeEventListener('mouseup', swipeEnd);
                };
            slider_outer.addEventListener('touchstart', swipeStart);
            slider_outer.addEventListener('mousedown', swipeStart);
            slider_outer.querySelector('.controls').addEventListener('click', (e) => direction_slide(e.target.closest('.next')));
        },

        scrollId = Array.from(document.querySelectorAll('.navigation a')).map((a) => {
            return a.getAttribute('href')
        }).splice(0, 5),

        accordion = (e) => {
            if (!(e.target.closest('.accordion_header'))) return;
            let Parent = e.target.closest('.acc_item');
            let Content = Parent.querySelector('.acc_content');
            if (Parent.classList.contains('open')) {
                Content.style.maxHeight = null;
                Parent.classList.remove('open');
            } else {
                Open = document.querySelector('.open')
                if (Open) {
                    Open.querySelector('.acc_content').style.maxHeight = null;
                    Open.classList.remove('open');
                }
                Parent.classList.toggle('open');
                Content.style.maxHeight = Content.scrollHeight + "px";
            }
        },

        scroller = (e) => {
            document.querySelector('.brogress_bar').classList.toggle('fixed', pageYOffset > 0)
            document.querySelector('.header').classList.toggle('fixed', pageYOffset > 0)
            let scrollList = scrollId.map(el => {
                return document.querySelector(el).offsetTop
            });
            scrollList.push(Math.max(document.body.scrollHeight, document.body.offsetHeight,
                document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight));
            let id = scrollList.findIndex(el => {
                return el >= pageYOffset + document.documentElement.clientHeight
            })
            document.querySelectorAll('.nav_link').forEach(el => el.classList.remove('active'));
            if (id) document.querySelectorAll('.nav_link')[id - 1].classList.add('active');
        },

        scrollTo = (e) => {
            e.preventDefault();
            if (!((e.target.closest('.nav_link')) || (e.target.closest('.header_logo')))) return;
            let height = document.querySelector(e.target.getAttribute('href')).offsetTop,
                delta = (height - pageYOffset) / 100;
            if (document.querySelector('.navigation.open')) {
                document.querySelector('.navigation.open').classList.remove('open');
                document.body.classList.remove('fixed');
            }
            start = setInterval(() => {
                window.scrollBy(0, delta)
            }, 10);
            setTimeout(() => {
                clearInterval(start);
            }, 1000);

        },

        burgerOpen = (e) => {
            let burger = document.querySelector('.nav_toggle');
            scrollWidth = window.innerWidth - document.documentElement.clientWidth
            if (e.target.closest('.nav_toggle') ||
                ((e.target.classList.contains('menu__link') && burger.classList.contains('open')))) {
                burger.style.right = scrollWidth ? `${30+scrollWidth}px` : '30px';
                document.body.classList.toggle('fixed');
                document.querySelector('.nav_toggle').classList.toggle('open');
                document.querySelector('.navigation').classList.toggle('open');
            }
        },

        scrollProcess = () => {
            let documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                    document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
                scrollPosition = pageYOffset + document.documentElement.clientHeight,
                sliderItems = document.querySelectorAll('.bar_item'),
                scroll_slider = Array.from(document.querySelectorAll('[data-scroller]')).map((el) => {
                    return el.offsetTop;
                });
            scroll_slider.push(documentHeight);
            let scroll_item = scroll_slider.findIndex(function (el) {
                    return el >= scrollPosition
                }),
                scrollPosition_location = scrollPosition - scroll_slider[scroll_item - 1],
                scrollHeight = scroll_slider[scroll_item] - scroll_slider[scroll_item - 1],
                Scroll_process = (scrollPosition_location / scrollHeight * 100).toFixed();

            sliderItems.forEach((el, i) => {
                el.style.borderImage = ''
                if (i < scroll_item) el.style.borderColor = '#f38181';
                if (i >= scroll_item) el.style.borderColor = '#fff';
            });
            document.querySelector('.bar_item.active').classList.remove('active');
            sliderItems[scroll_item - 1].classList.add('active');
            document.querySelector('.bar_item.active').style.borderImage = `linear-gradient(to right, #f38181 ${Scroll_process}%, #fff ${Scroll_process}%) 1 / 1 / 0 stretch`;
        },

        lazyLoad = () => {
            let windowHeight = document.documentElement.clientHeight,
                lazy_content = Array.from(document.querySelectorAll('[lazy]'));

            lazy_content = lazy_content.map(item => {
                return {
                    elem: item,
                    top: (function () {
                        return item.getBoundingClientRect().top
                    })(),
                    visible: false
                }
            });

            lazy_content.find(item => {
                if ((item.top - windowHeight < 100) && (item.visible == false)) {
                    if (item.elem.dataset.src) {
                        item.elem.src = item.elem.dataset.src;
                        item.elem.removeAttribute('data-src');
                        // item.elem.maxHeight=''
                    } else {
                        item.elem.classList.add('bg');
                    }
                    item.visible = true;
                }
            })
        };


    document.addEventListener('DOMContentLoaded', () => {
        let nodes = Array.from(document.querySelectorAll('[data-slider]'));
        nodes.forEach(node => sliderCreator(node))
    });

    document.querySelector('.nav_toggle').addEventListener('click', burgerOpen);
    document.querySelector('.header_inner').addEventListener('click', scrollTo);
    document.querySelector('.accordion').addEventListener('click', accordion);
    document.addEventListener('scroll', () => {
        scroller();
        scrollProcess();
        setTimeout(lazyLoad, 500);
    });

})();