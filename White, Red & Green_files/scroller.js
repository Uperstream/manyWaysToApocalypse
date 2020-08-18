import isMobile from './utils/is-mobile.js'
import MENU_HEIGHT from './utils/menu-height.js'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

window.jQuery && jQuery(function($) {
  if (isMobile) {
    return
  }

  const nextLinks = Array.from(document.getElementsByClassName('wrg-next-link'))

  if (!nextLinks.length) {
    return
  }

  const scroller = document.getElementsByClassName('wrg-scroller').item(0)

  if (!scroller) {
    return
  }

  const blocks = Array.from(scroller.children)
  const modules = Array.from(document.getElementsByClassName('wrg-module'))
  const $scrolling = $('html, body')

  blocks.forEach(_ => _.classList.add('wrg-scroller-block'))

  let currentIndex = -1
  let isScrolling = false

  document.body.classList.add('desktop')

  nextLinks.forEach((el, index) => {
    el.addEventListener('click', e => {
      e.preventDefault()
      scroll(-1, index)
    })
  })

  window.Lethargy && (function() {
    const lethargy = new Lethargy(); // Required semi-column!

    ['mousewheel', 'DOMMouseScroll', 'wheel', 'MozMousePixelScroll'].forEach(event =>
      window.addEventListener(event, e => {
        const direction = lethargy.check(e)

        if (direction !== false) {
          scroll(direction, Math.max(Math.min(currentIndex - direction, nextLinks.length - 1), -1))
        }
      })
    )
  })()

  requestAnimationFrame(centerVertically)

  blocks.length && blocks[0].classList.add('wrg-scroller-current')

  window.addEventListener('resize', centerVertically)
  window.addEventListener('keyup', e => {
    switch (e.keyCode) {
      case 38: // up arrow
        scroll(1, Math.max(Math.min(currentIndex - 1, nextLinks.length - 1), -1))
        break
      case 40: // down arrow
        scroll(-1, Math.max(Math.min(currentIndex + 1, nextLinks.length - 1), -1))
        break
      default:
        return
    }
  })

  function scroll(direction, from = false) {
    if (isScrolling) {
      return
    }

    if (from !== false) {
      currentIndex = from
    }

    isScrolling = true

    let didAnimation = false
    const isExternal = direction < 0 && nextLinks[currentIndex].classList.contains('external')

    blocks[direction < 0 ? currentIndex : (currentIndex + 2)].classList.remove('wrg-scroller-current')

    if (isExternal) {
      document.body.classList.add('navbar-hidden')
    } else {
      document.body.classList.remove('navbar-hidden')
    }

    blocks[currentIndex + 1].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    $scrolling.stop().animate({ scrollTop: window.innerHeight * (currentIndex + 1) }, 1000, function() {
      isScrolling = false

      if (!didAnimation) {
        didAnimation = true

        if (isExternal) {
          const targetUrl = nextLinks[currentIndex].getElementsByTagName('a').item(0)

          if (targetUrl) {
            window.location = targetUrl.href
          }
        } else {
          blocks[currentIndex + 1].classList.add('wrg-scroller-current')
        }
      }
    })
  }

  function centerVertically() {
    modules.forEach(el => {
      const h = el.getBoundingClientRect().height

      if (h < window.innerHeight) {
        el.style.top = (window.innerHeight - 2 * MENU_HEIGHT - h) / 2 + 'px'
      } else {
        el.style.top = 'auto'
      }
    })
  }
})
