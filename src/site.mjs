// Everything the site says lives here. Edit this file, then run `node build.mjs`.
//
// status: 'free'     out now and free
//         'paid'     out now, for sale (set price)
//         'soon'     finished, waiting on a store listing
//         'workshop' in development, not released yet
// links.repo:  only set it for PUBLIC repos. A private repo link is a 404 for visitors.
// links.store: the Elgato Marketplace (or other store) page, once it is listed.

export const site = {
  name: "Bade's Mod Shop",
  handle: 'Badeifer',
  url: 'https://badeifer.github.io',
  pageTitle: "Bade's Mod Shop | Xeneon Edge widgets, Stream Deck keys, Claude skills and Obsidian tools",
  headline: 'Your session limits, gaming replays and personal tasks, live on your desk',
  intro: 'Touchscreen widgets for the Corsair Xeneon Edge, Stream Deck keys, skills and mods for Claude, and pixel-art tools for Obsidian, each with a step-by-step setup guide.',
  caption: 'Swipe the screen, or use the arrows, to see every page.',
  // Help: where to go for answers. Shown in place of an About section.
  help: [
    { title: 'Report a bug', text: 'Say which project, what you tried and what happened. Screenshots help.', link: 'Open an issue', url: 'https://github.com/Badeifer/badeifer.github.io/issues/new' },
    { title: 'Get updates', text: 'Follow on GitHub to hear when a project is released or updated.', link: 'Follow Badeifer', url: 'https://github.com/Badeifer' }
  ],
  github: 'https://github.com/Badeifer',
  // Tips in crypto. Paste a public receiving address (a wallet used only for tips); leave it empty to hide the box.
  tips: [
    // Checked 2026-10-25: each address decoded from its wallet QR code and checksum-verified.
    { coin: 'SOL', name: 'Solana', address: '73jwsxMDvQMAiGdVpiRuCj6FgmSVHoqQy9bTMmNkMJGH' },
    { coin: 'ETH', name: 'Ethereum', address: '0xCfECCb807ac283D4A949e27a0D687f657d00CfA0' },
    { coin: 'BTC', name: 'Bitcoin', address: 'bc1q6cyvqz4kpgv4zqeelgq55xnsmjgg6utf0f3aat' }
  ],
  // The Maker page on Elgato Marketplace, once the organization is set up in Maker Console.
  marketplace: { url: '', live: false }
};

export const shelves = [
  {
    id: 'edge',
    nav: 'Widgets',
    name: 'Xeneon Edge widgets',
    blurb: 'HTML widgets for iCUE on the Corsair Xeneon Edge, the 14.5 inch touch strip. Sized for every slot, from a small tile to the full width.',
    platform: 'iCUE'
  },
  {
    id: 'streamdeck',
    nav: 'Stream Deck keys',
    name: 'Stream Deck keys',
    blurb: 'Icon packs and ready-made boards for the Elgato Stream Deck. Every icon is drawn here, and every sound is our own.',
    platform: 'Stream Deck',
    empty: 'The first icon packs and boards are in development. Follow on GitHub to hear when they are released.'
  },
  {
    id: 'skills',
    nav: 'Skills',
    name: 'Claude skills',
    blurb: 'Skills teach Claude a job it then does the same careful way every time. Add one to Claude Code or the Claude app and it is used when it fits.',
    platform: 'Claude'
  },
  {
    id: 'plugins',
    nav: 'Plugins',
    name: 'Claude Code plugins',
    blurb: 'Skills, agents and hooks bundled into one install for Claude Code.',
    platform: 'Claude Code'
  },
  {
    id: 'claude',
    nav: 'Claude mods',
    name: 'Claude Code mods',
    blurb: 'Mods that put usage limits, repos and handoffs right inside the Claude Code app.',
    platform: 'Claude Code'
  },
  {
    id: 'obsidian',
    nav: 'Obsidian',
    name: 'Obsidian',
    blurb: 'The Keep family: a pixel-art theme, a dashboard and a pet. Each one works on its own.',
    platform: 'Obsidian'
  }
];

const edgeNeeds = ['Corsair Xeneon Edge', 'iCUE 5.52 or later', 'Windows'];
const edgeSetup = [
  'Open iCUE and select the Xeneon Edge.',
  'Open the widgets section and press the plus button.',
  'Pick the .icuewidget file you downloaded, or install it straight from Elgato Marketplace inside iCUE once it is listed there.',
  'Drag the widget into a slot. Hold it to open its settings: colours, transparency and what it shows.'
];

export const projects = [
  {
    slug: 'claude-usage',
    shelf: 'edge',
    name: 'Claude usage',
    kind: 'iCUE widget',
    tagline: 'Your Claude Code limits, open chats and talk buttons, live on the Edge.',
    status: 'workshop',
    media: [
      { src: 'claude-1688.webp', alt: 'The Claude usage widget at large size: context, 5 hour and week limits beside a list of open chats, with a small pixel pet above the talk buttons.', w: 1688, h: 696 },
      { src: 'claude-840.webp', alt: 'The same widget at medium size, limits only.', w: 840, h: 696 }
    ],
    features: [
      'Context, 5 hour and weekly limits with reset times, plus a tick that shows where an even week would be by now.',
      'Open chats with their state: working, or finished and not looked at yet. Tap one to open it.',
      'Talk to Claude by voice with one tap.',
      'Up to six pixel pets that walk the widget, hide behind buttons and play together. One pet per chat if you like.',
      'Fits every slot. The small slot shows just the limits.'
    ],
    needs: [...edgeNeeds, 'The Session HQ mod for Claude Code, which writes the numbers'],
    setup: edgeSetup
  },
  {
    slug: 'nvidia-deck',
    shelf: 'edge',
    name: 'NVIDIA Deck',
    kind: 'iCUE widget',
    tagline: 'Ten touch keys for the NVIDIA app, with live FPS, CPU, GPU and memory beside them.',
    status: 'workshop',
    media: [
      { src: 'nvdeck-1688.webp', alt: 'The NVIDIA Deck widget: ten keys such as Save replay, Record, Screenshot and Perf overlay, next to bars for CPU, GPU, RAM, VRAM and storage.', w: 1688, h: 696 },
      { src: 'nvdeck-840.webp', alt: 'The NVIDIA Deck at medium size, keys only.', w: 840, h: 696 }
    ],
    features: [
      'Save replay, record, screenshot, instant replay, performance overlay, vibrance, highlights, clip library and overlay.',
      'Keys light up when a feature is on.',
      'Live FPS of the game in front, big and in the accent colour, red under 30.',
      'Large sizes add CPU, GPU and temperature, RAM, VRAM, storage and how much space your clips take.',
      'Shows the game that is running.'
    ],
    needs: [...edgeNeeds, 'NVIDIA app', 'A small helper that runs on your PC (included)'],
    setup: edgeSetup
  },
  {
    slug: 'needs-you',
    shelf: 'edge',
    name: 'Needs You',
    kind: 'iCUE widget',
    tagline: 'A count of what is waiting on you, from approvals to mail, one tap from the details.',
    status: 'workshop',
    media: [
      { src: 'needsyou-840.webp', alt: 'The Needs You widget: a large 3, with three items below it such as an approval and a mail.', w: 840, h: 696 }
    ],
    features: [
      'One big number, readable from across the room.',
      'Each item shows what it is and who it is from.',
      'Tap to open the details in Obsidian.',
      'Read only. It never changes anything.'
    ],
    needs: [...edgeNeeds, 'Agent Home for Obsidian'],
    setup: edgeSetup
  },
  {
    slug: 'prompt-cache',
    shelf: 'edge',
    name: 'Prompt Cache',
    kind: 'iCUE widget',
    tagline: 'A countdown for Claude\'s prompt cache, and how much money it saved you today and this week.',
    status: 'workshop',
    media: [
      { src: 'cache-1688.webp', alt: 'The Prompt Cache widget: a ring counting down from 41:56 marked warm, money saved this chat, today and this week, and a 7 day bar chart.', w: 1688, h: 696 },
      { src: 'cache-840.webp', alt: 'Prompt Cache at medium size: the ring and the savings.', w: 840, h: 696 }
    ],
    features: [
      'A ring that counts down until the cache goes cold, so you know when to reply.',
      'Warm, cooling and almost cold states you can read at a glance.',
      'What the cache saved this chat, today and this week, with the hit rate.',
      'A 7 day chart of savings. Turn it off in the widget settings for a calmer look.'
    ],
    needs: [...edgeNeeds, 'Claude Code', 'The Session HQ mod, which writes the readings'],
    setup: edgeSetup
  },
  {
    slug: 'pets',
    shelf: 'edge',
    name: 'Pets',
    kind: 'iCUE widget',
    tagline: 'A pixel playground where a small pet stands in for each of your open Claude chats.',
    status: 'workshop',
    media: [
      { src: 'pets-1688.webp', alt: 'The Pets widget: three pixel pets with chat names on crates and shelves under a night sky with a moon.', w: 1688, h: 696 }
    ],
    features: [
      'One named pet per open chat, up to six.',
      'Pets work while a chat is working, cheer when it finishes, hide and play when idle.',
      'The sky follows the time of day, or pick day or night.',
      'Crates, shelves and a lamp post to climb on.'
    ],
    needs: [...edgeNeeds, 'Claude Code', 'The Session HQ mod'],
    setup: edgeSetup
  },
  {
    slug: 'universal-repo-sync',
    shelf: 'edge',
    name: 'Universal Repo Sync',
    kind: 'iCUE widget',
    tagline: 'Every repo, every machine, always in step. One tap pulls what is new and pushes what is yours.',
    intro: 'Start on your desktop, pick up on your laptop, never hit a merge mess. Universal Repo Sync watches every Git repo on this PC, shows which ones are ahead of or behind GitHub, and brings each one level with a single tap. GitHub is the meeting point, so every device that syncs sees the same code.',
    status: 'workshop',
    media: [
      { src: 'repos-1688.webp', alt: 'Universal Repo Sync: counts of repos with changes, commits to push and to pull, beside a list of repos, each with a Sync key showing arrows for commits to push and pull.', w: 1688, h: 696 },
      { src: 'repos-840.webp', alt: 'Universal Repo Sync at medium size.', w: 840, h: 696 }
    ],
    features: [
      'One Sync key per repo. The arrows show the job: up for commits to push, down for commits to pull.',
      'Safe by design: pulls fast-forward only, never force-pushes, never makes a commit for you. If a repo needs a real merge, it tells you instead of guessing.',
      'At a glance: how many repos have uncommitted files, commits waiting to go up, and commits waiting to come down.',
      'Each repo shows its last commit and how long ago, busiest first.',
      'Tap a repo to open it in VS Code or GitHub Desktop.'
    ],
    needs: [...edgeNeeds, 'Git', 'The Session HQ mod'],
    setup: edgeSetup
  },
  {
    slug: 'print-monitor',
    shelf: 'edge',
    name: 'Print Monitor',
    kind: 'iCUE widget',
    tagline: 'Your Bambu Lab printer on the Edge: live camera, progress, time left, temperatures and AMS filament.',
    status: 'workshop',
    media: [
      { src: 'printmon-1688.webp', alt: 'Print Monitor during a real print on a Bambu Lab P1S: the live camera over the build plate, a ring at 90 percent with layer 40 of 72, 1 minute left, nozzle 220 and bed 55 degrees at target, and four AMS colours with the active one ringed.', w: 1688, h: 696 },
      { src: 'printmon-840.webp', alt: 'Print Monitor at medium size: the progress ring, time left, temperatures and AMS row.', w: 840, h: 696 }
    ],
    features: [
      'The printer camera, live. Tap it to fill the widget.',
      'Progress ring with the layer count, and the time left with the clock time it finishes.',
      'Nozzle and bed temperatures against their targets; amber while heating.',
      'Every AMS slot with its colour, type and how much is left; the loaded one ringed.',
      'Speed mode, part fan and chamber light at a glance.',
      'Read-only and local: it talks to the printer on your network, never through the cloud, and never sends it a command.'
    ],
    needs: [...edgeNeeds, 'A Bambu Lab printer (P1, X1 or A1 series) on the same network', 'The printer\'s IP address, serial number and LAN access code'],
    setup: [
      'On the printer\'s screen, open Settings, WLAN and note its IP address and LAN access code.',
      'Find the printer\'s serial number in Bambu Studio under Device, or on the label on the back of the printer.',
      'Open %LOCALAPPDATA%\\ModShop\\printer.json on your PC (it appears after the widget first runs) and fill in those three values. They never leave your PC.',
      ...edgeSetup.slice(1)
    ]
  },
  {
    slug: 'phosphor',
    shelf: 'edge',
    name: 'Phosphor',
    kind: 'iCUE widget',
    tagline: 'Your PC stats on a green-screen terminal, kept company by Blip, a pixel critter that reacts to the load.',
    status: 'workshop',
    media: [
      { src: 'phosphor-1688.webp', alt: 'Phosphor at large size: a green monochrome terminal with scanlines. Blip, a small pixel critter with two antennae, smiles beside 144 FPS; the next columns show CPU and GPU load with segmented bars and history traces, then RAM, VRAM and disk.', w: 1688, h: 696 },
      { src: 'phosphor-840.webp', alt: 'Phosphor at medium size: Blip beside CPU load at 18 percent, with Status, System and Memory tabs along the bottom.', w: 840, h: 696 }
    ],
    features: [
      'A green CRT look: scanlines, a soft glow, a rolling scan bar and curved-glass edges. One switch turns the effects off.',
      'Three touch tabs: Status, System and Memory. Large and Extra Large slots show all three at once.',
      'FPS of the game in front, CPU and GPU load with temperatures, RAM, VRAM and disk space, with three minutes of history for CPU and GPU.',
      'Blip naps when the PC idles, hums along under light load, runs when it is busy, focuses when you game and sweats when things run hot.',
      'Any colour you like: set the phosphor to amber, white or ice blue in the widget settings.'
    ],
    needs: [...edgeNeeds, 'A small helper that runs on your PC (included)'],
    setup: edgeSetup
  },
  {
    slug: 'vela',
    shelf: 'edge',
    name: 'Vela',
    kind: 'iCUE widget',
    tagline: 'A voice assistant for your desk: an original hologram on a projector pad. Tap the Edge, ask out loud, and she answers with subtitles in a natural voice.',
    status: 'workshop',
    media: [
      { src: 'vela-1688.webp', alt: 'Vela at large size: a tall adult woman with dark shoulder-length hair in an armoured bodysuit, drawn as a cool blue hologram standing on a glowing projector pad in a dark room with a faint grid floor. Beside her a subtitle reads: Want me to keep an eye on it while you play? Under it, a cue: Tap to stop.', w: 1688, h: 696 },
      { src: 'vela-840.webp', alt: 'Vela at medium size: the anime hologram on the left and the subtitle beside her.', w: 840, h: 696 }
    ],
    features: [
      'Tap and talk. She stops listening when you stop talking, or tap again to send. Claude Code answers and she speaks it a sentence at a time, so the first words come about four seconds after you finish.',
      'An original character in a 1990s anime style, projected as blue light with scanlines and film grain. She blinks, her lips move with her voice, and the pad and beam under her pulse with the microphone and her voice.',
      'She reacts: she leans in while you talk, lines of data rise through her while she thinks, and she hops when you touch her.',
      'Subtitles, not a chat log: whole sentences, never cut off, with a cue that tells you what a tap does right now.',
      'Hears you locally: Whisper on your graphics card, far more accurate than the Windows recognizer.',
      'Speaks locally or from the cloud: a built-in open voice, Azure or ElevenLabs stock voices, or a voice you record yourself.',
      'Record a voice: the person reads a consent line and a short script, about two minutes, and Vela can speak in their voice. It stays on your PC, and you can delete it any time.'
    ],
    needs: [...edgeNeeds, 'Claude Code', 'A microphone', 'An NVIDIA RTX graphics card with about 6 GB of free video memory', 'The voice helper app (included)'],
    setup: [
      'Run the included installer once. It sets up the voice helper and downloads the speech models (about 10 GB).',
      ...edgeSetup,
      'Tap the widget and ask something. The first answer after a break takes a few seconds longer while the voice loads.',
      'To change her voice or record a new one, open Voices in the voice window.'
    ]
  },
  {
    slug: 'agent-home-scene',
    shelf: 'edge',
    name: 'Agent Home scene',
    kind: 'iCUE widget',
    tagline: 'A live 3D headquarters where each of your agents works in its own room.',
    status: 'workshop',
    media: [
      { src: 'agenthome-1688.webp', alt: 'A 3D building seen from above at night, with rooms named Mission Control, Planning and Strategy, Research, Development and Break room, each with small figures at work. Chips read 2 need you, Night and Agent Home.', w: 1688, h: 696 },
      { src: 'agenthome-chief-840.webp', alt: 'A close-up of Mission Control: a glowing globe ringed by desks, wall screens of charts, and the Chief at work, with a Talk to the Chief button below.', w: 840, h: 696 }
    ],
    features: [
      'The same scene as the Agent Home desktop wallpaper, edge to edge.',
      'Mission Control is where the Chief works. Tap Talk to the Chief on the Claude usage widget and ask, by voice, what your agents are up to.',
      'Day and night, and a choice of scenes.',
      'A chip that says how many things need you.'
    ],
    needs: [...edgeNeeds, 'Agent Home for Obsidian'],
    setup: edgeSetup
  },
  {
    slug: 'replay-keys',
    shelf: 'streamdeck',
    name: 'Replay Keys',
    kind: 'Icon pack and board',
    tagline: '15 pixel-art keys for game capture, and a board that saves replays, records and screenshots with the NVIDIA app.',
    status: 'workshop',
    media: [
      { src: 'sd-replay-keys.webp', alt: 'Fifteen pixel-art keys in green and cream on dark tiles: save replay, instant replay, record, stop, screenshot, stats, FPS gauge, highlights, clip library, overlay, filters, mic on, mic off, webcam and go live.', w: 1600, h: 900 }
    ],
    features: [
      'Fifteen keys drawn pixel by pixel: save replay, instant replay, record, stop, screenshot, stats, FPS, highlights, clip library, overlay, filters, mic on and off, webcam and go live.',
      'The Replay Board: seven keys already set to the NVIDIA app\'s shortcuts. Import it and press.',
      'Search tags in Stream Deck, so "clip" or "rec" finds the right key.',
      'Crisp at every key size, from Stream Deck Mini to XL.'
    ],
    needs: ['Elgato Stream Deck app 7 or later', 'Any Stream Deck; the board is laid out for 15 keys', 'NVIDIA app, for the board\'s shortcuts'],
    setup: [
      'Double-click the .streamDeckIconPack file. Stream Deck installs the pack.',
      'For the ready board, double-click the .streamDeckProfile file and pick your Stream Deck.',
      'To use a single icon, click a key\'s image in Stream Deck, choose the pack, and pick the icon.'
    ],
    setupNote: 'In development. Coming to Elgato Marketplace.'
  },
  {
    slug: 'session-keys',
    shelf: 'streamdeck',
    name: 'Session Keys',
    kind: 'Icon pack and board',
    tagline: '20 pixel-art keys for working with an AI coding assistant, and a board that types your most-used replies for you.',
    status: 'workshop',
    media: [
      { src: 'sd-session-keys.webp', alt: 'Twenty pixel-art keys in terracotta and cream: talk, dictate, new chat, fix it, approve, reject, stop, thumbs up, thumbs down, note, decision signpost, handoff, commit, push, pull, sync, test flask, review, usage gauge and open app.', w: 1600, h: 900 }
    ],
    features: [
      'Twenty keys: talk, dictate, new chat, fix it, approve, reject, stop, good, wrong, note, decision, handoff, commit, push, pull, sync, run tests, review, usage and open app.',
      'The Session Board: fifteen keys that type a full instruction into the chat, such as "Run the tests and fix what fails", or press Escape to stop.',
      'Pairs with the Session Signals skill: the Good and Wrong keys file the lesson for you.',
      'Works with Claude Code and any chat that takes typed text.'
    ],
    needs: ['Elgato Stream Deck app 7 or later', 'Any Stream Deck; the board is laid out for 15 keys'],
    setup: [
      'Double-click the .streamDeckIconPack file. Stream Deck installs the pack.',
      'For the ready board, double-click the .streamDeckProfile file and pick your Stream Deck.',
      'Click into the chat box, then press a key.'
    ],
    setupNote: 'In development. Coming to Elgato Marketplace.'
  },
  {
    slug: 'game-night-keys',
    shelf: 'streamdeck',
    name: 'Game Night Keys',
    kind: 'Icon pack and board',
    tagline: '20 pixel-art keys for gaming and party chat, and a board for mute, deafen, volume, music and your game library.',
    status: 'workshop',
    media: [
      { src: 'sd-game-night-keys.webp', alt: 'Twenty pixel-art keys in violet and cream: controller, rocket, headset, deafen, mic on, mic off, push to talk, chat, clock, trophy, crosshair, light bulb, volume up, volume down, mute, music, hourglass, heart, shield and skull.', w: 1600, h: 900 }
    ],
    features: [
      'Twenty keys: controller, launch, headset, deafen, mic on and off, push to talk, chat, BRB, GG, crosshair, lights, volume, mute, music, timer, health, shield and skull.',
      'The Game Night Board: mute and deafen on Discord\'s default shortcuts, system volume and music, your Steam library and Big Picture, and BRB and GG typed into chat.',
      'Built-in Stream Deck actions only, so no extra plugin to install.'
    ],
    needs: ['Elgato Stream Deck app 7 or later', 'Any Stream Deck; the board is laid out for 15 keys', 'Discord and Steam, for those keys'],
    setup: [
      'Double-click the .streamDeckIconPack file. Stream Deck installs the pack.',
      'For the ready board, double-click the .streamDeckProfile file and pick your Stream Deck.'
    ],
    setupNote: 'In development. Coming to Elgato Marketplace.'
  },
  {
    slug: '8bit-soundboard',
    shelf: 'streamdeck',
    name: '8-Bit Soundboard',
    kind: 'Sound pack, icons and board',
    tagline: '17 retro sound effects made from scratch, with a matching pixel-art key for each and a board ready to play.',
    status: 'workshop',
    media: [
      { src: 'sd-8bit-soundboard.webp', alt: 'Seventeen pixel-art keys in teal and gold: coin, jump, potion, level up, lightning, explosion, hit, skull, checkered flag, bell, stopwatch, spring, drum, cymbal, trombone, air horn and clapping hands.', w: 1600, h: 900 }
    ],
    features: [
      'Coin, jump, power-up, level up, laser, explosion, hit, game over, victory, alarm, countdown, boing, drum roll, rimshot, sad trombone, air horn and applause.',
      'Every sound is synthesized here from square, triangle and noise waves, the way old game chips did it. No samples, so they are safe to play on stream.',
      'All sounds levelled to the same loudness, so no key is a surprise.',
      'The 8-Bit Soundboard board: fifteen of them on keys, sounds packed inside. Import and press.'
    ],
    needs: ['Elgato Stream Deck app 7 or later', 'Any Stream Deck; the board is laid out for 15 keys'],
    setup: [
      'Double-click the .streamDeckProfile file and pick your Stream Deck. The sounds come with it.',
      'For the icons on their own, double-click the .streamDeckIconPack file.'
    ],
    setupNote: 'In development. Coming to Elgato Marketplace.'
  },
  {
    slug: 'clip-mixer-keys',
    shelf: 'streamdeck',
    name: 'Clip Mixer Keys',
    kind: 'Icon pack',
    tagline: '15 pixel-art keys for video editing: fetch, cut on the beat, duck the music, voice lines, render and export.',
    status: 'workshop',
    media: [
      { src: 'sd-clip-mixer-keys.webp', alt: 'Fifteen pixel-art keys in pink and cream: download, film library, storyboard, waveform, scissors, timeline, live preview, volume dip, voice bubble, clean voice, fact check, open book, render, export and camera.', w: 1600, h: 900 }
    ],
    features: [
      'Fetch clip, library, plan edit, on the beat, cut, timeline, live edit, duck music, voice line, clean voice, check the facts, story video, render, export and frame grab.',
      'Works with any editor that takes a shortcut: set the key\'s action, then pick the icon.'
    ],
    needs: ['Elgato Stream Deck app 7 or later', 'Any Stream Deck'],
    setup: [
      'Double-click the .streamDeckIconPack file. Stream Deck installs the pack.',
      'Click a key\'s image in Stream Deck, choose Clip Mixer Keys, and pick the icon.'
    ],
    setupNote: 'In development. Coming to Elgato Marketplace.'
  },
  {
    slug: 'agent-keep',
    shelf: 'obsidian',
    name: 'Agent Keep',
    kind: 'Obsidian plugin', os: 'Windows, macOS, Linux, iOS, Android', category: 'ProductivityApplication',
    tagline: 'A pixel-art castle where your tasks, inbox and AI agents each get a room and show what they are doing.',
    status: 'soon',
    media: [
      { video: true, src: 'keep-hero.mp4', poster: 'keep-hero-poster.webp', alt: 'Agent Keep: a pixel-art castle by day, with characters in rooms for tasks, inbox and other agents.', w: 960, h: 565 },
      { video: true, src: 'live-status.mp4', poster: 'live-status-poster.webp', alt: 'A character changing state as its agent starts and finishes work.', w: 960, h: 358 },
      { src: 'all-scenes.webp', alt: 'All twelve scenes side by side.', w: 1960, h: 881 }
    ],
    features: [
      'Useful in two minutes with no AI and no code: built-in agents for your tasks, your inbox and today\'s writing.',
      'Anything that can write a small file can show up: a backup script, a scheduled job, Claude Code, a home server check.',
      'Each agent shows its state at a glance: thinking, working, waiting for you, resting, overdue or in trouble.',
      'Twelve scenes, a castle among them.',
      'Private by design: it never goes online, never runs a program and never changes your notes.'
    ],
    needs: ['Obsidian on desktop or mobile'],
    setup: [
      'In Obsidian, open Settings, Community plugins, and turn off Restricted mode if it is on.',
      'Press Browse and search for Agent Keep.',
      'Press Install, then Enable.',
      'Open the Keep from the castle icon in the left ribbon. Your tasks and inbox agents are already there.'
    ],
    setupNote: 'Agent Keep is on its way to the Obsidian community directory. These steps work once it is listed.'
  },
  {
    slug: 'pixel-keep',
    shelf: 'obsidian',
    name: 'Pixel Keep',
    kind: 'Obsidian theme', os: 'Windows, macOS, Linux, iOS, Android', category: 'DesignApplication',
    tagline: 'A pixel-art theme with a moonlit night and a golden afternoon. Your notes stay in your own font.',
    status: 'soon',
    media: [
      { video: true, src: 'pixel-keep-day-night.mp4', poster: 'pixel-keep-day-night-poster.webp', alt: 'Obsidian with the Pixel Keep theme, switching between the indigo night look and the sandstone day look.', w: 960, h: 600 },
      { src: 'pixel-keep-night.webp', alt: 'Pixel Keep at night.', w: 1440, h: 900 },
      { src: 'pixel-keep-day.png', alt: 'Pixel Keep by day.', w: 1440, h: 900 }
    ],
    features: [
      'Deep indigo and gold at night, sandstone and amber by day. Follows Obsidian\'s light and dark mode.',
      'Every text colour on the note page meets a 4.5 to 1 contrast, day and night.',
      'The pixel font is built in. Nothing loads from the internet.',
      'Plain CSS, so it works the same on Windows, macOS, Linux, iOS and Android.'
    ],
    needs: ['Obsidian on desktop or mobile'],
    setup: [
      'In Obsidian, open Settings, Appearance.',
      'Next to Themes, press Manage.',
      'Search for Pixel Keep and press Install and use.'
    ],
    setupNote: 'Pixel Keep is on its way to the Obsidian theme directory. These steps work once it is listed.'
  },
  {
    slug: 'task-pet',
    shelf: 'obsidian',
    name: 'Task Pet',
    kind: 'Obsidian plugin', os: 'Windows, macOS, Linux, iOS, Android', category: 'ProductivityApplication',
    tagline: 'A small pixel pet at the edge of your window who keeps your next five tasks one click away.',
    status: 'soon',
    media: [
      { src: 'taskpet-1600.webp', alt: 'Obsidian with a note called Week plan. In the corner a pixel steward in a green hood stands with a red badge reading 3; above him his Next tasks panel lists one task 2 days overdue, two due today, one just checked off and one due Thursday.', w: 1600, h: 900 },
      { src: 'taskpet-looks-1600.webp', alt: 'Eleven of the 93 looks: steward, knight, wizard, witch and king from the castle, an office worker, station crew, a starship captain, a panda, a bluebird and a giraffe.', w: 1600, h: 900 }
    ],
    features: [
      'Click him for your most urgent open tasks: overdue first, then due today. Check one off right there.',
      'Reads plain checkboxes, the Tasks plugin format and Dataview fields, with or without those plugins.',
      'A badge with how many tasks are due. He works when something is due and rests when you are done.',
      '93 looks: castle folk, office workers, space crew, starship officers and zoo animals.',
      'He walks, flies and wanders the window, and holds still when your mouse is near.',
      'Optional helper that breaks a task into steps or writes a first draft, with Claude or a model on your own PC.'
    ],
    needs: ['Obsidian 1.11.4 or later'],
    setup: [
      'In Obsidian, open Settings, Community plugins, and turn off Restricted mode if it is on.',
      'Press Browse and search for Task Pet.',
      'Press Install, then Enable. He appears at the bottom of your window.',
      'Click him to see your next tasks.'
    ],
    setupNote: 'Task Pet is on its way to the Obsidian community directory. These steps work once it is listed.'
  },
  {
    slug: 'session-handoffs',
    shelf: 'skills',
    name: 'Session Handoffs',
    kind: 'Claude skill',
    tagline: 'Saves where a project stands in three short files, then hands the next chat a prompt that picks up exactly there.',
    status: 'workshop',
    media: [],
    features: [
      'Say handoff, wrap up or save state: Claude rewrites HANDOFF.md with the goal, what is done, open problems, tasks and the next step.',
      'Decisions go into DECISIONS.md with their reasons, append only, so the why is never lost.',
      'A small INDEX.md says which file to read for what, so a new chat starts fast and cheap.',
      'Ends with a continuation prompt to paste into the next chat. Say continue and it reads the files back first.',
      'Keeps HANDOFF.md to 60 lines and checks that no passwords or personal data land in any file.'
    ],
    needs: ['Claude Code, or the Claude app with skills turned on'],
    setup: [],
    setupNote: 'In private testing. Install steps come with the release.'
  },
  {
    slug: 'session-signals',
    shelf: 'skills',
    name: 'Session Signals',
    kind: 'Claude skill',
    tagline: 'Say "good, document it" or "that was wrong", or press a Stream Deck key, and the lesson is filed in the right log.',
    status: 'workshop',
    media: [],
    features: [
      'Good and wrong answers go to LEARNINGS.md as a reusable pattern: what was done, why, and when to reuse it.',
      'Decisions go to DECISIONS.md and loose notes to an inbox, in one step, without stopping the work.',
      'Works from one short phrase, typed or sent by a Stream Deck key.',
      'Reads before it writes and skips duplicates. Asks one short question only when "that" could mean two things.',
      'Never writes passwords or personal data; it says what it skipped.'
    ],
    needs: ['Claude Code, or the Claude app with skills turned on', 'Optional: a Stream Deck key that types the phrase'],
    setup: [],
    setupNote: 'In private testing. Install steps come with the release.'
  },
  {
    slug: 'inbox-triage',
    shelf: 'skills',
    name: 'Inbox Triage',
    kind: 'Claude skill',
    tagline: 'Turns a pile of quick voice and button captures into filed decisions, to-dos, bugs and handoff notes.',
    status: 'workshop',
    media: [],
    features: [
      'Reads every waiting line in inbox.md and tags it: decision, to-do, bug, note or handoff.',
      'Shows a table of where each line goes. Clear ones are filed, unclear ones are asked about.',
      'Fixes obvious dictation slips and flags the uncertain ones instead of guessing.',
      'Archives what it filed rather than deleting it, so a wrong filing can be traced.',
      'Adds nothing the capture did not say.'
    ],
    needs: ['Claude Code, or the Claude app with skills turned on'],
    setup: [],
    setupNote: 'In private testing. Install steps come with the release.'
  },
  {
    slug: 'capability-check',
    shelf: 'skills',
    name: 'Capability Check',
    kind: 'Claude skill',
    tagline: 'Before Claude says "that is possible" or "that cannot be done", it checks the docs, the source and what others built.',
    status: 'workshop',
    media: [],
    features: [
      'States the exact question first, in one line.',
      'Reads the maker\'s own docs, listing, README, issues and changelog before any search snippet.',
      'Looks at the installed app\'s own files when it can, and at community projects that solved the same thing.',
      'Reports what was verified, what was inferred and what could not be checked, with a source for each claim.',
      'Only then proposes a build, the simplest one the evidence supports.'
    ],
    needs: ['Claude Code, or the Claude app with skills and web search turned on'],
    setup: [],
    setupNote: 'In private testing. Install steps come with the release.'
  },
  {
    slug: 'project-audit',
    shelf: 'skills',
    name: 'Project Audit',
    kind: 'Claude skill',
    tagline: 'A sanity check for a project\'s state files: stale tasks, contradictions, drift and leaked secrets, sorted by how much they matter.',
    status: 'workshop',
    media: [],
    features: [
      'Finds tasks still open that a decision says are done, decisions overruled later, and index rows that point at missing files.',
      'Scans for passwords, tokens and personal data, and reports where they are without quoting them.',
      'Checks skills for size limits and flags any changed since they were last tested.',
      'Reads hooks and settings without changing them, and flags any that send data off the PC.',
      'Fixes only low-risk items itself and asks about the rest.'
    ],
    needs: ['Claude Code, or the Claude app with skills turned on'],
    setup: [],
    setupNote: 'In private testing. Install steps come with the release.'
  },
  {
    slug: 'mod-studio',
    shelf: 'plugins',
    name: 'Mod Studio',
    kind: 'Claude Code plugin',
    tagline: 'Teaches Claude to build Claude Code mods that load the first time, render right everywhere and look hand-made.',
    status: 'workshop',
    media: [],
    features: [
      'The making-mods skill: how panes, the band above the prompt, status lines, toasts, slash commands and hooks fit together.',
      'A starter kit and a checklist, so a new mod loads on the first try.',
      'Rules for the terminal and the desktop app, so a mod looks right on both.',
      'Design rules that keep mods from looking like generic AI interface.'
    ],
    needs: ['Claude Code'],
    setup: [],
    setupNote: 'In private testing. Install steps come with the release.'
  },
  {
    slug: 'session-hq',
    shelf: 'claude',
    name: 'Session HQ',
    kind: 'Claude Code mod',
    tagline: 'Usage, repos, skills and automatic handoffs for Claude Code, in panes beside the chat.',
    status: 'workshop',
    media: [],
    features: [
      'Live 5 hour and weekly usage with a forecast of when you will hit the limit.',
      'Repos that need a commit, push or pull.',
      'Projects and Timeline panes.',
      'A Fresh chat button that hands the work to a new chat without losing the thread.',
      'A privacy shield for screen sharing.',
      'Feeds the Claude usage widget on the Xeneon Edge.'
    ],
    needs: ['Claude Code desktop app'],
    setup: [],
    setupNote: 'Session HQ is in private testing. Setup steps come with the public release.'
  }
];

// Permissions: what each iCUE widget asks iCUE for, what it does with it, and why. iCUE shows these when you install;
// this is the plain-English version. Keep in step with each widget's manifest.json.
const P = {
  helper: (why) => ({ name: 'Local helper app', detail: 'localhost:13509', what: 'Talks to a small helper app on this PC. It answers only widgets on this PC and never opens anything to the internet.', why }),
  swipe: 'Swipe between Edge pages even when your finger starts on this widget. iCUE alone only swipes from the gaps between widgets.',
  status: { name: 'Read one status file', detail: '<Home>/.session-hq-status.json', what: 'Reads the file Session HQ writes with your usage, chats and repo states.', why: 'It is where the numbers come from. Nothing else in your home folder is read.' },
  watch: { name: 'File watcher', detail: 'iCUE File System plugin', what: 'Gets told the moment that file changes.', why: 'Updates land instantly instead of on a timer, with less work for your PC.' },
  links: (why) => ({ name: 'Open links', detail: 'iCUE URL plugin', what: 'Opens a link or an app when you tap.', why }),
  startHelper: 'Starts the helper app if it is not running, so the widget fixes itself.'
};
export const widgetPermissions = {
  'claude-usage': [P.status, P.watch, P.helper(P.swipe), P.links('Opens a chat in the Claude app when you tap it, and starts voice chat from the Talk buttons.')],
  'nvidia-deck': [{ name: 'FPS plugin', detail: 'iCUE FPS plugin', what: 'Reads the frame rate and name of the app in front, measured by iCUE.', why: 'Shows your FPS live without running another overlay.' }, P.helper('Passes your taps to the NVIDIA app (save replay, record, overlay) and reads CPU, GPU and memory stats. iCUE widgets cannot reach the NVIDIA app directly, so the helper relays for them. ' + P.swipe), P.links(P.startHelper)],
  'needs-you': [{ name: 'Read one status file', detail: '<Home>/AppData/Local/AgentHub/wallpaper/state.js', what: 'Reads the list Agent Home writes of what is waiting on you.', why: 'It is the only source of the items. Nothing else is read.' }, P.watch, P.helper(P.swipe), P.links('Opens Obsidian when you tap an item.')],
  'prompt-cache': [P.status, P.watch, P.helper('Reads today\'s and this week\'s cache savings for the chart. ' + P.swipe), P.links(P.startHelper)],
  'pets': [P.status, P.watch, P.helper(P.swipe), P.links(P.startHelper)],
  'universal-repo-sync': [P.status, P.watch, P.helper('Runs the Sync for the repo you tapped: git pull (fast-forward only), then git push to that repo\'s own remote. Never a force push, never a commit, and only repos in your GitHub folder. ' + P.swipe), P.links('Opens a repo in VS Code or GitHub Desktop, and ' + P.startHelper.charAt(0).toLowerCase() + P.startHelper.slice(1))],
  'print-monitor': [P.helper('Holds the connection to your printer on your home network (status on port 8883, camera on port 6000) and hands the widget its status and newest camera frame. iCUE widgets cannot open those connections themselves. ' + P.swipe), P.links(P.startHelper)],
  'phosphor': [{ name: 'Sensors plugin', detail: 'iCUE Sensors plugin', what: 'Reads the CPU temperature sensor you pick in the widget settings.', why: 'Shows CPU temperature without another monitoring app.' }, { name: 'FPS plugin', detail: 'iCUE FPS plugin', what: 'Reads the frame rate and name of the app in front, measured by iCUE.', why: 'Shows your FPS live without running another overlay.' }, P.helper('Reads CPU, GPU and memory load, GPU temperature, VRAM and disk space, which iCUE widgets cannot read themselves. ' + P.swipe), P.links(P.startHelper)],
  'vela': [P.helper('Reads what the voice assistant is doing (listening, thinking, speaking), what she has said so far and how loud the voice is, to draw her on the widget. ' + P.swipe), P.links('Starts listening when you tap, sends or stops on the next tap, and ' + P.startHelper.charAt(0).toLowerCase() + P.startHelper.slice(1))],
  'agent-home-scene': [{ name: 'Read five scene files', detail: '<Home>/AppData/Local/AgentHub/wallpaper/', what: 'Reads the scene, state and choice files Agent Home writes for its desktop wallpaper.', why: 'The widget draws the same live scene. It reads only those five files.' }, P.watch, P.helper(P.swipe), P.links(P.startHelper)]
};

// Toolbox: what you need to run these projects, plus recommended tools. No affiliate links.
export const toolboxIntro = 'What you need to run these projects, plus tools worth having. No sponsored or affiliate links.';
export const toolbox = [
  {
    id: 'hardware',
    name: 'Hardware',
    items: [
      { name: 'Corsair Xeneon Edge', note: 'The 14.5 inch touchscreen the iCUE widgets are made for.', url: 'https://www.corsair.com/us/en/p/monitors/cc-9011306-ww/xeneon-edge-14-5-lcd-touchscreen-cc-9011306-ww' },
      { name: 'Elgato Stream Deck', note: 'Runs the Stream Deck plugins. Any model with keys works.' },
      { name: 'NVIDIA GeForce RTX graphics card', note: 'Needed for the NVIDIA Deck widget and RTX Remix.' }
    ]
  },
  {
    id: 'apps',
    name: 'Required apps',
    items: [
      { name: 'iCUE', note: 'Installs and runs the Xeneon Edge widgets.', url: 'https://www.corsair.com/us/en/s/icue' },
      { name: 'Stream Deck app', note: 'Installs and runs the Stream Deck plugins.', url: 'https://www.elgato.com/us/en/s/downloads' },
      { name: 'Obsidian', note: 'The notes app Agent Keep, Pixel Keep and Task Pet run in.', url: 'https://obsidian.md' },
      { name: 'NVIDIA App', note: 'Instant replay, recording and the overlay that NVIDIA Deck controls.', url: 'https://www.nvidia.com/en-us/software/nvidia-app/' },
      { name: 'Claude Code', note: 'Needed for Session HQ and the Claude usage widget.', url: 'https://claude.com/claude-code' }
    ]
  },
  {
    id: 'claude-addons',
    name: 'Claude Code add-ons',
    items: [
      { name: 'Impeccable', note: 'Design reviews and polish passes for anything with a UI.', url: 'https://impeccable.style/' },
      { name: 'frontend-design', note: 'Picks a real design direction before Claude builds a UI.', url: 'https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design' },
      { name: 'Windows-MCP', note: 'Lets Claude open and drive Windows apps.', url: 'https://github.com/CursorTouch/Windows-MCP' },
      { name: 'NVIDIA App MCP', note: 'Lets Claude save replays, take screenshots and toggle the overlay.', url: 'https://www.nvidia.com/en-us/software/nvidia-app/' }
    ]
  },
  {
    id: 'utilities',
    name: 'Useful utilities',
    items: [
      { name: 'RTX Remix', note: 'Remaster classic games with path tracing and new textures.', url: 'https://www.nvidia.com/en-us/geforce/rtx-remix/' },
      { name: 'Ventoy', note: 'One USB stick that boots any number of ISOs.', url: 'https://www.ventoy.net/' },
      { name: 'cobalt', note: 'Clean video and audio downloads, no ads.', url: 'https://cobalt.tools/' },
      { name: 'Meshy', note: 'AI-generated 3D models to start a print from.', url: 'https://www.meshy.ai/' },
      { name: 'PowerShell 7', note: 'A modern shell for scripting Windows.', url: 'https://github.com/PowerShell/PowerShell' },
      { name: 'uv', note: 'Installs Python and its packages in seconds.', url: 'https://docs.astral.sh/uv/' },
      { name: 'Git', note: 'Version control for any project.', url: 'https://git-scm.com/' }
    ]
  }
];
export const statusLabel = {
  free: 'Free',
  paid: 'For sale',
  soon: 'Coming soon',
  workshop: 'In development'
};
