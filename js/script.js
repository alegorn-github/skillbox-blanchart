'use strict';

const BLANCHART = {};

(()=>{

  const animateCSS = (element, animation, prefix = 'animate__') => {
    return new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = element;

      node.classList.add(`${prefix}animated`, animationName);

      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, {once: true});
  })};

  function closeBurgerMenu(event){
    const burgerMenu = document.querySelector('.header__burger-menu');
    const nav = document.querySelector('.header__navigation');
    const container = document.querySelector('.header__container');
    const enterLink = document.querySelector('.header__enter-link');
    const searchForm = document.querySelector('.header__search-form-container');

    nav.classList.remove('active');
    enterLink.classList.remove('active');
    container.appendChild(enterLink);
    container.appendChild(nav);
    container.insertBefore(enterLink,searchForm);
    container.insertBefore(nav,enterLink);

    burgerMenu.classList.remove('active');
  }

  function toggleSubmenu(event){
    const submenu = event.target.parentElement.querySelector('.menu__submenu');
    const exceptRules = [
      event.target.classList.contains('menu__submenu'),
      event.target.closest('.menu__submenu'),
      event.target.closest('.gallery__img-link'),
      event.target.closest('.gallery__modal-window'),
      event.target.closest('.header__burger-menu'),
      event.target.classList.contains('header__burger'),
    ];
    const exceptRule = exceptRules.find(item=>{return !!item});

    if (exceptRule){
      return;
    }
    else if (event.target.classList.contains('menu__item')){
      if (!event.target.classList.contains('active')){
        document.querySelectorAll('.menu__item').forEach((menuItem)=>{
          menuItem.classList.remove('active');
        });

        submenu.classList.add('animate__animated','animate__flipInX');
      }
      event.target.classList.toggle('active');
    }
    else {
      document.querySelectorAll('.active').forEach((activeItem)=>{
        if (activeItem.classList.contains('header__burger-menu')){
          closeBurgerMenu(event);
        }
        else {
          activeItem.classList.remove('active');
        }
        window.removeEventListener('scroll', noScroll);

      });
    }
  }

  function noScroll(event) {
    window.scrollTo(0, BLANCHART.modalY);
  }

  document.body.addEventListener('click',toggleSubmenu);
  document.querySelectorAll('.header__search-text:not(.header__search-text__mobile)').forEach((element)=>{
    element.addEventListener('focus', event => {event.target.parentElement.classList.add('header__search-form__focused');});
    element.addEventListener('blur', event => {event.target.parentElement.classList.remove('header__search-form__focused');});
  });

  document.querySelectorAll('.header__search-text__mobile').forEach(element=>{
    element.addEventListener('focus', event => {event.target.parentElement.querySelector('.header__search-button__mobile').classList.add('header__search-button__focused');});
    element.addEventListener('blur', event => {
      event.target.parentElement.querySelector('.header__search-button__mobile').classList.remove('header__search-button__focused');
    });
  })

  document.querySelector('.header__search-button__mobile').addEventListener('click',event=>{
    event.preventDefault();
    const topHeaderContainer = document.querySelector('.header__top-panel > .header__container');
    const searchForm = event.target.closest('form');
    const searchButton = event.target.closest('button');
    const searchInput = searchForm.querySelector('.header__search-text__mobile');
    const closeButton = searchForm.querySelector('.header__search-close');

    if (searchInput.classList.contains('opened')&&searchInput.value.length > 0){
      searchForm.submit();
    }
    else {
      const isBreakPoint768 = getComputedStyle(document.documentElement).getPropertyValue('--break-point').replace(/("|\s)/mig,'') === '768';
      const formOpened = searchForm.classList.contains('opened');
      const toggleOpenedClass = () => {
        topHeaderContainer.classList.toggle('opened');
        searchButton.classList.toggle('opened');
        searchForm.classList.toggle('opened');
        searchForm.classList.toggle('backdrop-blur');
        searchInput.classList.toggle('opened');
        closeButton.classList.toggle('opened');
      }

      toggleOpenedClass();
      if (isBreakPoint768&&!formOpened){
        animateCSS(document.querySelector('.header__search-form__mobile'), 'fadeInRight').then(()=>searchInput.focus());
      }

      searchInput.setAttribute('tabindex',formOpened?'0':'-1');
      searchButton.blur();

    }

  })

  document.querySelector('.header__search-close').addEventListener('click',event=>{
    event.preventDefault();
    document.querySelector('.header__search-text__mobile').value = '';
    document.querySelector('.header__search-button__mobile').click();
  })

  document.querySelectorAll('.close-button').forEach(elem => {
    elem.addEventListener('click',(event)=>{
      document.querySelectorAll('.active').forEach(elem => {elem.classList.remove('active')}) ;
      window.removeEventListener('scroll', noScroll);
    })
  })

  document.querySelectorAll('.gallery__img-link').forEach((element)=>{
    element.addEventListener('click',(event)=>{
      event.preventDefault();

      const modalWindow = document.querySelector('.gallery__modal-window');
      const modalOverlay = document.querySelector('.gallery__modal-overlay');

      if (document.documentElement.clientWidth <= 425){
        const galleryContainer = document.querySelector('.gallery__container');
        galleryContainer.appendChild(modalWindow);
        galleryContainer.appendChild(modalOverlay);
      }
      else {
        const gallerySlider = document.querySelector('.gallery__slider');
        gallerySlider.appendChild(modalWindow);
        gallerySlider.appendChild(modalOverlay);

      }

      if (modalWindow.classList.contains('active')){
        modalOverlay.classList.remove('active');
        // modalWindow.appendChild(modalOverlay);
        modalWindow.classList.remove('active');
      }
      else {
        const picture = event.target.querySelector('.gallery__picture').cloneNode(true);
        const imageDesc = event.target.querySelector('.gallery__img-desc').cloneNode(true);
        const modalPicture = modalWindow.querySelector('.gallery__modal-img');
        const modalDesc = modalWindow.querySelector('.gallery__modal-desc');
        const bodyHeight = document.body.clientHeight;

        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        modalPicture.innerHTML = '';
        modalDesc.innerHTML = '';
        modalPicture.appendChild(picture);
        modalDesc.appendChild(imageDesc);

        modalOverlay.style.height = bodyHeight + 'px';
        modalOverlay.classList.add('active');

        modalWindow.classList.add('animate__animated','animate__fadeIn');
        modalWindow.classList.add('active');

        const elementRect = modalWindow.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2)  + elementRect.height / 2;
        BLANCHART.modalY = middle;
        scroll.animateScroll(middle);

        document.addEventListener('scrollStop', event => {
          window.removeEventListener('scroll', noScroll);
          window.addEventListener('scroll', noScroll);
        }, {once: true});
      }
    });
  });

  document.querySelector('.header__burger').addEventListener('click',(event)=>{
    const burgerMenu = document.querySelector('.header__burger-menu');
    const nav = document.querySelector('.header__navigation');
    const enterLink = document.querySelector('.header__enter-link');
    nav.classList.add('active');
    enterLink.classList.add('active');
    burgerMenu.querySelector('.burger-menu__nav-container').appendChild(nav);
    burgerMenu.querySelector('.burger-menu__enter-container').appendChild(enterLink);

    document.querySelectorAll(".news-item__announcement").forEach(elem=>{
      $clamp(elem, {clamp: '2'});
    })

    burgerMenu.classList.add('animate__animated','animate__flipInX');
    burgerMenu.classList.add('active');
    document.querySelector('.burger-menu__close-button').focus();
  })

  document.querySelector('.burger-menu__close-button').addEventListener('click', closeBurgerMenu);

  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    easing: 'easeInOutCubic',
  });

  const customSelect = document.querySelector('.gallery__filter');
  const choices = new Choices(customSelect,{
    searchEnabled: false,
    placeholder: true,
    placeholderValue: "100",
    shouldSort: false,
    itemSelectText: "",
    position: 'bottom',
  });

  OverlayScrollbars(document.querySelectorAll('.header__submenu'),{
      className       : "os-theme-dark menu__submenu limited-handles",
      paddingAbsolute : true,
  });

  // burger-menu__news
  OverlayScrollbars(document.querySelector('.burger-menu__news-container'),{
    className       : "os-theme-dark limited-handles",
    paddingAbsolute : true,
  });

  const heroSlider = new Splide( '.hero__slider',{
    type: 'fade',
    arrows: false,
    pagination: false,
    autoplay: true,
    rewind: true,
  } ).mount();

  const gallerySwiper = new Swiper('.gallery__slider', {
    direction: 'horizontal',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el : '.swiper-pagination',
      type: 'fraction'
    },
    breakpoints: {
      1150:{
        spaceBetween: 50,
        slidesPerView: 3,
        slidesPerColumn: 2,
      },
      430: {
        spaceBetween: 34,
        slidesPerView: 2,
        slidesPerColumn: 2,
      },
      240: {
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerColumn: 1,
      }
    },
  });

  document.querySelectorAll('.handorgel').forEach(
    (elem)=>{
      const accordion = new handorgel(elem, {

        // whether multiple folds can be opened at once
        multiSelectable: false,
        // whether the folds are collapsible
        collapsible: true,

        // whether ARIA attributes are enabled
        ariaEnabled: true,
        // whether W3C keyboard shortcuts are enabled
        keyboardInteraction: true,
        // whether to loop header focus (sets focus back to first/last header when end/start reached)
        carouselFocus: false,

        // attribute for the header or content to open folds at initialization
        initialOpenAttribute: 'data-open',
        // whether to use transition at initial open
        initialOpenTransition: false,
        // delay used to show initial transition
        initialOpenTransitionDelay: 200,

        // header/content class if fold is open
        headerOpenClass: 'handorgel__header--open',
        contentOpenClass: 'handorgel__content--open',

        // header/content class if fold has been opened (transition finished)
        headerOpenedClass: 'handorgel__header--opened',
        contentOpenedClass: 'handorgel__content--opened',

        // header/content class if fold has been focused
        headerFocusClass: 'handorgel__header--focus',
        contentFocusClass: 'handorgel__content--focus',

        // header/content class if fold is disabled
        headerDisabledClass: 'handorgel__header--disabled',
        contentDisabledClass: 'handorgel__content--disabled',

      });

      elem.querySelectorAll('.catalogue__period-btn').forEach((button,index)=>{
        button.addEventListener('click',event=>{
          accordion.folds[index].toggle();
        })
      });

      accordion.on('fold:close', fold => {
        fold.header.querySelector('.catalogue__period-btn').classList.add('handorgel--close');
      });

      accordion.on('fold:closed', fold => {
        fold.header.querySelector('.catalogue__period-btn').classList.remove('handorgel--close');
      });

    }

  )

  document.querySelectorAll('.tabs__tab').forEach(element => {
    element.addEventListener('click',event => {
      event.preventDefault();
      const tab = event.target;
      const tabAnchor = tab.dataset.anchor;
      const tabsContainer = tab.closest('.tabs');
      let newTabContentSelector = `.tabs__content-container > .tabs__content[data-anchor=${tabAnchor}]`;
      let newTabContent = tabsContainer.querySelector(newTabContentSelector);
      const activeTabContent = tabsContainer.querySelector(':scope > .tabs__content-container > .tabs__content.tabs__content__active');

      if (!newTabContent){
        newTabContent = activeTabContent;
      }

      if (newTabContent.classList.contains('tabs__content__active')){
        animateCSS(newTabContent,'fadeIn');
      }
      else {
        animateCSS(activeTabContent,'fadeOut').then(
          ()=>{
            tabsContainer.querySelectorAll(':scope > .tabs__content-container > .tabs__content.tabs__content__active').forEach(
              (elem)=>{
                if (elem.classList.contains('tabs__content__activating')) {
                  elem.classList.remove('tabs__content__activating')
                }
                else{
                  elem.classList.remove('tabs__content__active');
                }
              }
            )
          }
        );

        newTabContent.classList.add('tabs__content__active','tabs__content__activating');
        animateCSS(newTabContent,'fadeIn');

      }

      const activeTab = tabsContainer.querySelector('.tabs__tab__active');

      if (activeTab){
        activeTab.classList.remove('tabs__tab__active');
      }

      tab.classList.add('tabs__tab__active');

    });
  });

  document.querySelectorAll('.catalogue__artist-link').forEach(elem=>{
    elem.addEventListener('click', event => {
      event.preventDefault();
      const isBreakPointMobile = getComputedStyle(document.documentElement).getPropertyValue('--break-point').replace(/("|\s)/mig,'') <= 768;

      if (isBreakPointMobile) {
        const anchor = event.target.dataset.anchor;
        const anchorTarget = `.catalogue__artist[data-anchor=${anchor}]`;
        const target = document.querySelector(anchorTarget);
        scroll.animateScroll(target);
      }

    })
  })

})()
