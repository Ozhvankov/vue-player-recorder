var AudioMixer = require('audio-mixer');

// Creates a new audio mixer with the specified options
let mixer = new AudioMixer.Mixer({
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  clearInterval: 250
});

// Creates an input that is attached to the mixer
let input = mixer.input({
  channels: 1,
  volume: 75
});

// Creates a standalone input
let standaloneInput = new AudioMixer.Input({
  channels: 1,
  bitDepth: 16,
  sampleRate: 48000,
  volume: 75
});

// Adds the standalone input to the mixer
mixer.addInput(standaloneInput);

// Pipes a readable stream into an input
deviceInputStream.pipe(input);
deviceInputStream2.pipe(standaloneInput);

// Pipes the mixer output to an writable stream
mixer.pipe(deviceOutputStream);
