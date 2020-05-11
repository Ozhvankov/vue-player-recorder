
let audio = new Crunker();
audio
  .fetchAudio("/demo/44.mp3", "/demo/88.mp3")
  .then(buffers => audio.mergeAudio(buffers))
  .then(merged => audio.export(merged, "audio/mp3"))
  .then(output => audio.download(output.blob))
  .catch(error => {
    throw new Error(error);
  });
