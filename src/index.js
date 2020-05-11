import AudioPlayer from '@/components/player.vue'
// import PlayerMain from '@/components/playermain.vue'
import AudioRecorder from '@/components/recorder.vue'
const components = {
  AudioPlayer,
  //PlayerMain,
  AudioRecorder,

  install (Vue) {
    if (this.installed) {
      return
    }

    this.installed = true

    Vue.prototype.$eventBus = Vue.prototype.$eventBus || new Vue

    Vue.component('audio-player', AudioPlayer)
    //Vue.component('player-main', PlayerMain)
    Vue.component('audio-recorder', AudioRecorder)
  }
}

export default components

export { AudioPlayer, //PlayerMain,
  AudioRecorder }
