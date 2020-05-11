<style lang="scss">
  .ar {
    width: 420px;
    font-family: 'Roboto', sans-serif;
    border-radius: 16px;
    background-color: #FAFAFA;
    box-shadow: 0 4px 18px 0 rgba(0,0,0,0.17);
    position: relative;
    box-sizing: content-box;

    &-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-records {
      height: 138px;
      padding-top: 1px;
      overflow-y: auto;
      margin-bottom: 20px;

      &__record {
        width: 320px;
        height: 45px;
        padding: 0 10px;
        margin: 0 auto;
        line-height: 45px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E8E8E8;
        position: relative;

        &--selected {
          border: 1px solid #E8E8E8;
          border-radius: 24px;
          background-color: #FFFFFF;
          margin-top: -1px;
          padding: 0 34px;
        }
      }
    }

    &-recorder {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      &__duration {
        color: #AEAEAE;
        font-size: 32px;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 16px;
      }

      &__play {
        position: absolute;
        top: 10px;
        left: -82px;
      }



      &__stop {
        position: absolute;
        top: 10px;
        right: -82px;
      }

      &__time-limit {
        position: absolute;
        color: #AEAEAE;
        margin-top: 20px;
        margin-bottom: 16px;
        font-size: 12px;
        top: 128px;
      }

      &__records-limit {
        position: absolute;
        color: #AEAEAE;
        /*margin-top: 20px;*/
        /*margin-bottom: 16px;*/
        font-size: 13px;
        top: 58px;
      }
    }

    &-spinner {
      display: flex;
      height: 30px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 144px;
      z-index: 10;

      &__dot {
        display: block;
        margin: 0 8px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background: #05CBCD;
        animation-name: blink;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-fill-mode: both;

        &:nth-child(2) { animation-delay: .2s; }

        &:nth-child(3) { animation-delay: .4s; }

        @keyframes blink {
          0%    { opacity: .2; }
          20%   { opacity: 1;  }
          100%  { opacity: .2; }
        }
      }
    }

    &__text {
      color: rgba(84,84,84,0.5);
      font-size: 16px;
    }

    &__blur {
      filter: blur(2px);
      opacity: 0.7;
    }

    &__overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 10;
    }

    &__upload-status {
      text-align: center;
      font-size: 10px;
      padding: 2px;
      letter-spacing: 1px;
      position: absolute;
      bottom: 0;

      &--success {
        color: green;
      }

      &--fail {
        color: red;
      }
    }

    &__rm {
      cursor: pointer;
      position: absolute;
      width: 6px;
      height: 6px;
      padding: 6px;
      line-height: 6px;
      margin: auto;
      left: 10px;
      bottom: 0;
      top: 0;
      color: rgb(244, 120, 90);
    }

    &__downloader,
    &__uploader {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    &__downloader {
      right: 115px;
    }

    &__uploader {
      right: 85px;
    }

    &ar-playermain {
      width: 400px;
      height: 120px;
      border: 0;
      border-radius: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: unset;
      font-family: 'Roboto', sans-serif;

      & > .ar-playermain-bar {
        border: 1px solid #E8E8E8;
        border-radius: 24px;
        margin: 0 0 0 5px;

        & > .ar-playermain__progress {
          width: 125px;
        }
      }

      &-bar {
        display: flex;
        align-items: center;
        height: 38px;
        padding: 0 12px;
        margin: 0 5px;
      }

      &-actions {
        width: 55%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      &__progress {
        width: 160px;
        margin: 0 8px;
      }

      &__time {
        color: rgba(84,84,84,0.5);
        font-size: 16px;
        width: 41px;
      }

      &__play {
        width: 45px;
        height: 45px;
        background-color: #FFFFFF;
        box-shadow: 0 2px 11px 11px rgba(0,0,0,0.07);

        &--active {
          fill: white !important;
          background-color: #05CBCD !important;

          &:hover {
            fill: #505050 !important;
          }
        }
      }
    }


  }

  @import '../scss/icons';
</style>

<template>

  <div class="ar">


    <div class="ar-playermain-bar">
      <div class="ar-playermain__time">{{playedTime}}</div>
      <line-control
        class="ar-playermain__progress"
        ref-id="progress"
        :percentage="progress"
        @change-linehead="_onUpdateProgress"/>
      <div class="ar-playermain__time">{{duration}}</div>
      <volume-control @change-volume="_onChangeVolume"/>
    </div>

    <audio :id="playerUniqId" :src="audioSource"></audio>
    <div class="ar__overlay" v-if="isUploading"></div>
    <div class="ar-spinner" v-if="isUploading">
      <div class="ar-spinner__dot"></div>
      <div class="ar-spinner__dot"></div>
      <div class="ar-spinner__dot"></div>
    </div>
<!--    <player-main :record="selected"/>-->
    <div class="ar-content" :class="{'ar__blur': isUploading}">

      <div class="ar-recorder">

        <icon-button
          id="play"
          class="ar-icon ar-icon__sm ar-recorder__play"
          :name="playBtnIcon"
          :class="{
            'ar-icon ar-icon__sm ar-recorder__play': isPlaying}"
          @click.native="playback"
        />
        <icon-button
          class="ar-icon ar-icon__lg"
          :name="iconButtonType"
          :class="{
            'ar-icon--rec': isRecording,
            'ar-icon--pulse': isRecording && volume > 0.02
          }"
          @click.native="toggleRecorder"/>
        <icon-button
          class="ar-icon ar-icon__sm ar-recorder__stop"
          name="stop"
          @click.native="stopRecorder"/>
      </div>

      <div class="ar-recorder__records-limit" v-if="attempts">Attempts: {{attemptsLeft}}/{{attempts}}</div>
      <div class="ar-recorder__duration">{{recordedTime}}</div>
      <div class="ar-recorder__time-limit" v-if="time">Record duration is limited: {{time}}m</div>

      <div class="ar-records">
        <div
          class="ar-records__record"
          :class="{'ar-records__record--selected': record.id === selected.id}"
          :key="record.id"
          v-for="(record, idx) in recordList"
          @click="choiceRecord(record)">
            <div
              class="ar__rm"
              v-if="record.id === selected.id"
              @click="removeRecord(idx)">&times;</div>
            <div class="ar__text">Voice Record {{idx + 1}}</div>
            <div class="ar__text">{{record.duration}}</div>

            <downloader
              v-if="record.id === selected.id && showDownloadButton"
              class="ar__downloader"
              :record="record"
              :filename="filename"/>

            <uploader
              v-if="record.id === selected.id && showUploadButton"
              class="ar__uploader"
              :record="record"
              :filename="filename"
              :headers="headers"
              :upload-url="uploadUrl"/>
        </div>
      </div>

      <audio-player :record="selected"/>
    </div>
  </div>
</template>

<script>

  import AudioPlayer from './player'
  import Downloader  from './downloader'
  import IconButton  from './icon-button'
  import Recorder    from '@/lib/recorder'
  // import mixer       from '@/lib/mixer' //mixer
  //import crunker       from '@/lib/crunker' //mixer
  import Uploader    from './uploader'
  import UploaderPropsMixin from '@/mixins/uploader-props'
  import { convertTimeMMSS }  from '@/lib/utils'
  import recorder from './recorder'
  import LineControl   from './line-control'
  import VolumeControl from './volume-control'


  export default {
    mixins: [UploaderPropsMixin],
    props: {
      attempts : { type: Number },
      time     : { type: Number },

      bitRate    : { type: Number, default: 128   },
      sampleRate : { type: Number, default: 44100 },

      showDownloadButton : { type: Boolean, default: true },
      showUploadButton   : { type: Boolean, default: true },

      micFailed        : { type: Function },
      beforeRecording  : { type: Function },
      pauseRecording   : { type: Function },
      afterRecording   : { type: Function },
      failedUpload     : { type: Function },
      beforeUpload     : { type: Function },
      successfulUpload : { type: Function },
      selectRecord     : { type: Function },

      src      : { type: String },
      record   : { type: Object },
      filename : { type: String }
    },
    data () {
      return {
        isUploading   : false,
        recorder      : this._initRecorder(),
        recordList    : [],
        selected      : {},
        uploadStatus  : null,
        isPlaying  : false,
        duration   : convertTimeMMSS(0),
        playedTime : convertTimeMMSS(0),
        progress   : 0,


      }
    },
    components: {
      AudioPlayer,
      Downloader,
      IconButton,
      Uploader,

      LineControl,
      VolumeControl
    },
    mounted () {
      this.$eventBus.$on('start-upload', () => {
        this.isUploading = true
        this.beforeUpload && this.beforeUpload('before upload')
      })

      this.$eventBus.$on('end-upload', (msg) => {
        this.isUploading = false

        if (msg.status === 'success') {
          this.successfulUpload && this.successfulUpload(msg.response)
        } else {
          this.failedUpload && this.failedUpload(msg.response)
        }
      })

      this.player = document.getElementById(this.playerUniqId)

      this.player.addEventListener('ended', () => {
        this.isPlaying = false
      })

      this.player.addEventListener('loadeddata', (ev) => {
        this._resetProgress()
        this.duration = convertTimeMMSS(this.player.duration)
      })

      this.player.addEventListener('timeupdate', this._onTimeUpdate)

      this.$eventBus.$on('remove-record', () => {
        this._resetProgress()
      })

    },
    beforeDestroy () {
      this.stopRecorder()
    },
    methods: {
      toggleRecorder () {
        if (this.attempts && this.recorder.records.length >= this.attempts) {
          return
        }

        if (!this.isRecording || (this.isRecording && this.isPause)) {
          this.recorder.start()
        } else {
          this.recorder.pause()
        }
      },
      stopRecorder () {
        if (!this.isRecording) {
          return
        }

        this.recorder.stop()
        this.recordList = this.recorder.recordList()

      },
      removeRecord (idx) {
        this.recordList.splice(idx, 1)
        this.$set(this.selected, 'url', null)
        this.$eventBus.$emit('remove-record')
      },
      choiceRecord (record) {
        if (this.selected === record) {
          return
        }
        this.selected = record
        this.selectRecord && this.selectRecord(record)
      },
      _initRecorder () {
        return new Recorder({
          beforeRecording : this.beforeRecording,
          afterRecording  : this.afterRecording,
          pauseRecording  : this.pauseRecording,
          micFailed       : this.micFailed,
          bitRate         : this.bitRate,
          sampleRate      : this.sampleRate,
          format          : this.format
        })
      },

      playback () {
        if (!this.audioSource) {
          return
        }

        if (this.isPlaying) {
          this.player.pause()
          this.recorder.pause()
        } else {

          this.recorder.start()
          setTimeout(() => { this.player.play() }, 0)
        }

        this.isPlaying = !this.isPlaying
      },
      _resetProgress () {
        if (this.isPlaying) {
          this.player.pause()
        }

        this.duration   = convertTimeMMSS(0)
        this.playedTime = convertTimeMMSS(0)
        this.progress   = 0
        this.isPlaying  = false
      },
      _onTimeUpdate () {
        this.playedTime = convertTimeMMSS(this.player.currentTime)
        this.progress = (this.player.currentTime / this.player.duration) * 100
      },
      _onUpdateProgress (pos) {
        if (pos) {
          this.player.currentTime = pos * this.player.duration
        }
      },
      _onChangeVolume (val) {
        if (val) {
          this.player.volume = val
        }
      },

    },
    computed: {
      attemptsLeft () {
        return this.attempts - this.recordList.length
      },
      iconButtonType () {
        return this.isRecording && this.isPause ? 'mic' : this.isRecording ? 'pause' : 'mic'
      },
      isPause () {
        return this.recorder.isPause
      },
      isRecording () {
        return this.recorder.isRecording
      },
      recordedTime () {
        if (this.time && this.recorder.duration >= this.time * 60) {
          this.stopRecorder()
        }
        return convertTimeMMSS(this.recorder.duration)
      },
      volume () {
        return parseFloat(this.recorder.volume)
      },
      audioSource () {
        const url = this.src || "/demo/01.mp3"//this.record.url
        if (url) {
          return url
        } else {
          this._resetProgress()
        }
      },
      playBtnIcon () {
        return this.isPlaying ? 'pause' : 'play'
      },
      playerUniqId () {
        return `main-audio-player${this._uid}`
      }
    }
  }
</script>

