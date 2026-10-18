// =========================================================
// smallthinks - sounds shared by every game
// Sound.pop()      -> short "pop" sound
// Sound.whoosh()   -> soft "whoosh" sound
// Sound.tada()     -> happy "ta-da!" tune
// Sound.chomp()    -> "nom nom nom"
// Sound.burp()     -> a silly burp
// Sound.say(text)  -> the browser reads the text out loud
// Sound.toggle()   -> turn all sound on or off
// =========================================================

const Sound = {
  on: true,
  audio: null,

  // Remember the on/off choice between visits and games
  load: function () {
    try {
      Sound.on = localStorage.getItem("smallthinks-sound") !== "off";
    } catch (error) {
      Sound.on = true; // storage blocked: just keep sound on
    }
  },

  toggle: function () {
    Sound.on = !Sound.on;
    try {
      localStorage.setItem("smallthinks-sound", Sound.on ? "on" : "off");
    } catch (error) {
      // storage blocked: the choice still works until the page closes
    }
    if (!Sound.on && window.speechSynthesis) {
      speechSynthesis.cancel(); // stop talking right away
    }
    return Sound.on;
  },

  // Make a tiny "pop" with the Web Audio API (no sound files needed)
  pop: function () {
    if (!Sound.on || !window.AudioContext) return;
    if (!Sound.audio) Sound.audio = new AudioContext();

    const now = Sound.audio.currentTime;
    const tone = Sound.audio.createOscillator();
    const volume = Sound.audio.createGain();

    // The pitch slides up quickly, then the volume fades out
    tone.frequency.setValueAtTime(400 + Math.random() * 200, now);
    tone.frequency.exponentialRampToValueAtTime(900, now + 0.08);
    volume.gain.setValueAtTime(0.25, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    tone.connect(volume);
    volume.connect(Sound.audio.destination);
    tone.start(now);
    tone.stop(now + 0.15);
  },

  // A soft "whoosh": noise that gets quieter and darker (no sound files needed)
  whoosh: function () {
    if (!Sound.on || !window.AudioContext) return;
    if (!Sound.audio) Sound.audio = new AudioContext();

    const now = Sound.audio.currentTime;
    const length = Sound.audio.sampleRate * 0.4; // 0.4 seconds
    const noise = Sound.audio.createBuffer(1, length, Sound.audio.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < length; i++) {
      samples[i] = Math.random() * 2 - 1;
    }

    const source = Sound.audio.createBufferSource();
    const filter = Sound.audio.createBiquadFilter();
    const volume = Sound.audio.createGain();

    source.buffer = noise;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
    volume.gain.setValueAtTime(0.2, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    source.connect(filter);
    filter.connect(volume);
    volume.connect(Sound.audio.destination);
    source.start(now);
  },

  // A short burst of noise, used by chomp()
  noise: function (start, seconds, fromHz, toHz, loudness) {
    const length = Math.floor(Sound.audio.sampleRate * seconds);
    const buffer = Sound.audio.createBuffer(1, length, Sound.audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      samples[i] = Math.random() * 2 - 1;
    }

    const source = Sound.audio.createBufferSource();
    const filter = Sound.audio.createBiquadFilter();
    const volume = Sound.audio.createGain();

    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(fromHz, start);
    filter.frequency.exponentialRampToValueAtTime(toHz, start + seconds);
    volume.gain.setValueAtTime(loudness, start);
    volume.gain.exponentialRampToValueAtTime(0.001, start + seconds);

    source.connect(filter);
    filter.connect(volume);
    volume.connect(Sound.audio.destination);
    source.start(start);
  },

  // "Nom nom nom": three quick crunchy bites
  chomp: function () {
    if (!Sound.on || !window.AudioContext) return;
    if (!Sound.audio) Sound.audio = new AudioContext();

    const now = Sound.audio.currentTime;
    for (let bite = 0; bite < 3; bite++) {
      Sound.noise(now + bite * 0.18, 0.12, 1500, 300, 0.35);
    }
  },

  // A silly low "burp"
  burp: function () {
    if (!Sound.on || !window.AudioContext) return;
    if (!Sound.audio) Sound.audio = new AudioContext();

    const now = Sound.audio.currentTime;
    const tone = Sound.audio.createOscillator();
    const wobble = Sound.audio.createOscillator();
    const wobbleSize = Sound.audio.createGain();
    const volume = Sound.audio.createGain();

    // A low buzzy note that wobbles up and down quickly, then drops
    tone.type = "sawtooth";
    tone.frequency.setValueAtTime(110, now);
    tone.frequency.exponentialRampToValueAtTime(60, now + 0.5);
    wobble.frequency.setValueAtTime(18, now);
    wobbleSize.gain.setValueAtTime(15, now);
    volume.gain.setValueAtTime(0.001, now);
    volume.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
    volume.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    wobble.connect(wobbleSize);
    wobbleSize.connect(tone.frequency);
    tone.connect(volume);
    volume.connect(Sound.audio.destination);
    tone.start(now);
    wobble.start(now);
    tone.stop(now + 0.5);
    wobble.stop(now + 0.5);
  },

  // A happy "ta-da!": four notes going up
  tada: function () {
    if (!Sound.on || !window.AudioContext) return;
    if (!Sound.audio) Sound.audio = new AudioContext();

    const notes = [523, 659, 784, 1047]; // C, E, G, high C
    notes.forEach(function (frequency, i) {
      const start = Sound.audio.currentTime + i * 0.13;
      const tone = Sound.audio.createOscillator();
      const volume = Sound.audio.createGain();

      tone.type = "triangle";
      tone.frequency.setValueAtTime(frequency, start);
      volume.gain.setValueAtTime(0.2, start);
      volume.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      tone.connect(volume);
      volume.connect(Sound.audio.destination);
      tone.start(start);
      tone.stop(start + 0.4);
    });
  },

  say: function (text) {
    if (!Sound.on || !window.speechSynthesis) return;
    speechSynthesis.cancel(); // don't queue up old numbers
    const words = new SpeechSynthesisUtterance(String(text));
    words.rate = 0.9;
    words.pitch = 1.2;
    speechSynthesis.speak(words);
  },
};

Sound.load();
