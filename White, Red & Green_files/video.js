import isMobile from '../utils/is-mobile.js'
import '../utils/responsive-class.js'

window.jQuery && jQuery(function($) {
  const videos = Array.from(document.getElementsByClassName('wrg-video'))

  if (!videos.length) {
    return
  }

  let shouldPushVimeo = false, didLoadVimeo = false,
      shouldPushYoutube = false, didLoadYoutube = false
  let currentVideo, currentVideoId
  let youtubePlayers = {}, vimeoPlayers = {}

  videos.forEach(video => {
    if (shouldPushVimeo && shouldPushYoutube) {
      return
    }

    if (!shouldPushVimeo && video.classList.contains('vimeo')) {
      shouldPushVimeo = true
    } else if (!shouldPushYoutube && video.classList.contains('youtube')) {
      shouldPushYoutube = true
    }
  })

  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    didLoadYoutube = true

    if (!shouldPushVimeo || didLoadVimeo) {
      onScriptsLoaded()
    }
  }

  window.onVimeoIframeAPIReady = function onVimeoIframeAPIReady() {
    didLoadVimeo = true

    if (!shouldPushYoutube || didLoadYoutube) {
      onScriptsLoaded()
    }
  }

  if (shouldPushVimeo) {
    pushScript('https://player.vimeo.com/api/player.js', onVimeoIframeAPIReady)
  }

  if (shouldPushYoutube) {
    pushScript('https://www.youtube.com/player_api')
  }

  function onScriptsLoaded() {
    const videoGalleries = Array.from(document.getElementsByClassName('wrg-video-gallery-carousel'))

    videos.forEach(video => {
      const videoId = video.dataset.videoId
      const autoplay = video.classList.contains('autoplay')

      if (video.classList.contains('vimeo') && window.Vimeo && !vimeoPlayers[videoId]) {
        vimeoPlayers[videoId] = new Vimeo.Player(video.getElementsByTagName('iframe').item(0))

        if (!isMobile && autoplay) {
          vimeoPlayers[videoId].on('loaded', () => {
            vimeoPlayers[videoId].setVolume(0)
            playVideo(null, video)
          })
        }
      } else if (video.classList.contains('youtube') && window.YT && !youtubePlayers[videoId]) {
        const videoEl = video.getElementsByClassName('youtube').item(0)
        const args = {
          videoId,
          playerVars: {
            color: 'white',
            modestbranding: 1,
            rel: 0,
            vq: 'hd720',
            loop: 1
          }
        }

        if (!isMobile && autoplay) {
          const onReady = function() {
            youtubePlayers[videoId].removeEventListener('onReady', onReady)
            youtubePlayers[videoId].mute()
            playVideo(null, video)
          }

          args.events = {
            onReady
          }
        }

        youtubePlayers[videoId] = new YT.Player(videoEl, args)
      }

      if (
        video.parentNode.classList.contains('slick-track') ||
        video.parentNode.classList.contains('wrg-gallery-carousel')
      ) {
        return
      }

      video.addEventListener('click', e => {
        playVideo(e)
      })
    })

    videoGalleries.forEach(videoGallery => {
      let currentSlide
      const $videoGallery = $(videoGallery)

      const onSlickInit = function(slick = $videoGallery.slick('getSlick')) {
        const getCurrentSlide = function getCurrentSlide() {
          return slick.$slides.get(slick.currentSlide)
        }

        $videoGallery
        .on('afterChange', function() {
          currentSlide && currentSlide.removeEventListener('click', playVideo)
          currentSlide = getCurrentSlide()
          currentSlide && currentSlide.addEventListener('click', playVideo)
        })
        .on('beforeChange', pauseCurrentVideo)

        currentSlide = getCurrentSlide()
        currentSlide && currentSlide.addEventListener('click', playVideo)
      }

      if ($videoGallery.slick) {
        try {
          $videoGallery.slick('getSlick')
          onSlickInit()
        } catch (e) {
          $videoGallery.one('init', function(e, slick) {
            onSlickInit(slick)
          })
        }
      }
    })
  }

  function pushScript(src, callback) {
    const script = document.createElement('script')
    document.body.appendChild(script)

    script.onload = function() {
      callback && callback()
    }

    script.src = src
  }

  function playVideo(e, video = false) {
    pauseCurrentVideo()

    video = video || e.currentTarget
    const videoId = video.dataset.videoId

    if (video.classList.contains('vimeo') && window.Vimeo) {
      vimeoPlayers[videoId].play()
    } else if (video.classList.contains('youtube') && window.YT) {
      youtubePlayers[videoId].playVideo()
    } else {
      return
    }

    currentVideo = video
    currentVideoId = videoId
    video.classList.add('active')
  }

  function pauseCurrentVideo() {
    if (!currentVideo) {
      return
    }

    currentVideo.classList.remove('active')

    if (isNaN(currentVideoId)) {
      return
    }

    if (currentVideo.classList.contains('vimeo') && vimeoPlayers[currentVideoId]) {
      vimeoPlayers[currentVideoId].pause && vimeoPlayers[currentVideoId].pause()
    } else if (currentVideo.classList.contains('youtube') && youtubePlayers[currentVideoId]) {
      youtubePlayers[currentVideoId].pauseVideo && youtubePlayers[currentVideoId].pauseVideo()
    } else {
      return
    }
  }
})
