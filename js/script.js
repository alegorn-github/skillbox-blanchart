'use strict';

(()=>{

  function toggleSubmenu(event){
    const submenu = event.target.parentElement.querySelector('.menu__submenu');
    if (event.target.classList.contains('menu__item')){
      if (!event.target.classList.contains('active')){
        document.querySelectorAll('.menu__item').forEach((menuItem)=>{
          menuItem.classList.remove('active');
        });

        submenu.classList.add('animate__animated','animate__flipInX');
      }
      event.target.classList.toggle('active');
    }
    else if (event.target.classList.contains('menu__submenu')||event.target.closest('.menu__submenu')){
      return;
    }
    else {
      document.querySelectorAll('.menu__item').forEach((menuItem)=>{
        menuItem.classList.remove('active');
      });
    }
  }

  document.body.addEventListener('click',toggleSubmenu);
  const headerSearchText= document.querySelector('.header__search-text');
  headerSearchText.addEventListener('focus', event => {event.target.parentElement.classList.add('header__search-form__focused');});
  headerSearchText.addEventListener('blur', event => {event.target.parentElement.classList.remove('header__search-form__focused');});
  // document.querySelector('.header__search-form').addEventListener('keyup',(event)=>{

  // })

  OverlayScrollbars(document.querySelectorAll('.header__submenu'),{
      className       : "os-theme-dark menu__submenu",
      paddingAbsolute : true,
  });

  new Splide( '.splide',{
    type: 'loop',
    arrows: false,
    pagination: false,
    autoplay: true,
  } ).mount();

})()
