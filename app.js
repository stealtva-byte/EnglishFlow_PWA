const STORAGE_KEY = "englishflow.progress.v1";
const VOICE_SETTINGS_KEY = "englishflow.voice.v1";
const APP_SETTINGS_KEY = "englishflow.settings.v1";
const PROFILES_KEY = "englishflow.profiles.v1";
const ACTIVE_PROFILE_KEY = "englishflow.activeProfile.v1";
const CELEBRATED_STAGES_KEY = "englishflow.celebratedStages.v1";
const DAY_MS = 24 * 60 * 60 * 1000;
const NOVICE_HINT_WORD_LIMIT = 200;
const VISUAL_HINTS = {
  apple: "🍎",
  bag: "🎒",
  beach: "🏖️",
  block: "🧱",
  bread: "🍞",
  bus: "🚌",
  car: "🚗",
  cheese: "🧀",
  chest: "🧰",
  city: "🏙️",
  coffee: "☕",
  diamond: "💎",
  engine: "⚙️",
  eye: "👁️",
  farm: "🌾",
  fuel: "⛽",
  hand: "✋",
  head: "🙂",
  hello: "👋",
  hotel: "🏨",
  house: "🏠",
  leg: "🦵",
  map: "🗺️",
  milk: "🥛",
  passport: "🛂",
  pickaxe: "⛏️",
  road: "🛣️",
  seat: "💺",
  stone: "🪨",
  sword: "⚔️",
  taxi: "🚕",
  tea: "🍵",
  ticket: "🎫",
  torch: "🔦",
  train: "🚆",
  water: "💧",
  wheel: "🛞",
  wood: "🪵",
};
const ABSTRACT_PICTURE_WORDS = new Set([
  "bad",
  "brake",
  "craft",
  "airport",
  "driver",
  "friend",
  "garage",
  "gate",
  "good",
  "help",
  "mine",
  "no",
  "please",
  "sorry",
  "speed",
  "thanks",
  "traffic",
  "welcome",
  "yes",
]);
const BAD_VISUAL_SYMBOLS = new Set(["▦", "⬒", "▥", "✦", "⌂", "▤", "▣", "◇", "▾", "✚", "○", "═", "≡", "◉", "▱", "↗", "!", "▭", "→", "□", "▰", "≈", "?", "✓", "×"]);
const MALE_VOICE_HINTS = [
  "alex",
  "daniel",
  "fred",
  "tom",
  "thomas",
  "arthur",
  "george",
  "oliver",
  "david",
  "mark",
  "james",
  "matthew",
  "male",
  "man",
];
const FEMALE_VOICE_HINTS = [
  "samantha",
  "victoria",
  "karen",
  "moira",
  "susan",
  "tessa",
  "zira",
  "female",
  "woman",
  "serena",
  "ava",
];

const initialProfile = loadActiveProfile();

const state = {
  profile: initialProfile,
  words: [],
  dialogues: [],
  quizzes: [],
  sentences: [],
  pairs: [],
  blanks: [],
  currentIndex: 0,
  translationVisible: false,
  currentQuiz: null,
  quizTopic: "Все",
  quizAnswered: false,
  quizStats: { correct: 0, wrong: 0, streak: 0 },
  currentSentence: null,
  sentenceBank: [],
  sentenceAnswer: [],
  sentenceSolved: false,
  currentPairs: [],
  pairWordsOrder: [],
  pairsMessage: "",
  pairsFeedbackStatus: "neutral",
  selectedPairImage: null,
  selectedPairWord: null,
  matchedPairs: new Set(),
  currentBlank: null,
  blankAnswered: false,
  currentPicture: null,
  pictureAnswered: false,
  currentWordBuild: null,
  wordBuildBank: [],
  wordBuildAnswer: [],
  wordBuildSolved: false,
  deferredInstallPrompt: null,
  progress: loadProgress(),
  voiceSettings: loadVoiceSettings(),
  appSettings: loadAppSettings(),
  voices: [],
};

const els = {
  viewTitle: document.getElementById("viewTitle"),
  wordText: document.getElementById("wordText"),
  wordTranscription: document.getElementById("wordTranscription"),
  wordEmoji: document.getElementById("wordEmoji"),
  cardTheme: document.getElementById("cardTheme"),
  translationBox: document.getElementById("translationBox"),
  translationText: document.getElementById("translationText"),
  revealButton: document.getElementById("revealButton"),
  knownButton: document.getElementById("knownButton"),
  unknownButton: document.getElementById("unknownButton"),
  speakButton: document.getElementById("speakButton"),
  xpValue: document.getElementById("xpValue"),
  streakValue: document.getElementById("streakValue"),
  levelValue: document.getElementById("levelValue"),
  dailyCount: document.getElementById("dailyCount"),
  todayReviewed: document.getElementById("todayReviewed"),
  knownWords: document.getElementById("knownWords"),
  weakWords: document.getElementById("weakWords"),
  themeList: document.getElementById("themeList"),
  totalReviewed: document.getElementById("totalReviewed"),
  activityBars: document.getElementById("activityBars"),
  weakList: document.getElementById("weakList"),
  dialogueScenarios: document.getElementById("dialogueScenarios"),
  voiceSelect: document.getElementById("voiceSelect"),
  voiceTestButton: document.getElementById("voiceTestButton"),
  voiceNote: document.getElementById("voiceNote"),
  hintNote: document.getElementById("hintNote"),
  quizWord: document.getElementById("quizWord"),
  quizTheme: document.getElementById("quizTheme"),
  quizEmoji: document.getElementById("quizEmoji"),
  quizOptions: document.getElementById("quizOptions"),
  quizFeedback: document.getElementById("quizFeedback"),
  quizTopicList: document.getElementById("quizTopicList"),
  quizCorrect: document.getElementById("quizCorrect"),
  quizWrong: document.getElementById("quizWrong"),
  quizStreak: document.getElementById("quizStreak"),
  nextQuizButton: document.getElementById("nextQuizButton"),
  speakQuizButton: document.getElementById("speakQuizButton"),
  sentenceTranslation: document.getElementById("sentenceTranslation"),
  sentenceBuild: document.getElementById("sentenceBuild"),
  sentenceBank: document.getElementById("sentenceBank"),
  sentenceFeedback: document.getElementById("sentenceFeedback"),
  checkSentenceButton: document.getElementById("checkSentenceButton"),
  nextSentenceButton: document.getElementById("nextSentenceButton"),
  pairImages: document.getElementById("pairImages"),
  pairWords: document.getElementById("pairWords"),
  pairsFeedback: document.getElementById("pairsFeedback"),
  nextPairsButton: document.getElementById("nextPairsButton"),
  blankTheme: document.getElementById("blankTheme"),
  blankTemplate: document.getElementById("blankTemplate"),
  blankTranslation: document.getElementById("blankTranslation"),
  blankOptions: document.getElementById("blankOptions"),
  blankFeedback: document.getElementById("blankFeedback"),
  nextBlankButton: document.getElementById("nextBlankButton"),
  pictureTheme: document.getElementById("pictureTheme"),
  picturePrompt: document.getElementById("picturePrompt"),
  pictureOptions: document.getElementById("pictureOptions"),
  pictureFeedback: document.getElementById("pictureFeedback"),
  nextPictureButton: document.getElementById("nextPictureButton"),
  wordBuildTheme: document.getElementById("wordBuildTheme"),
  wordBuildPrompt: document.getElementById("wordBuildPrompt"),
  letterSlots: document.getElementById("letterSlots"),
  letterBank: document.getElementById("letterBank"),
  wordBuildFeedback: document.getElementById("wordBuildFeedback"),
  checkWordBuildButton: document.getElementById("checkWordBuildButton"),
  nextWordBuildButton: document.getElementById("nextWordBuildButton"),
  installCard: document.getElementById("installCard"),
  installText: document.getElementById("installText"),
  installButton: document.getElementById("installButton"),
  heroLevel: document.getElementById("heroLevel"),
  heroXp: document.getElementById("heroXp"),
  heroStreak: document.getElementById("heroStreak"),
  heroDaily: document.getElementById("heroDaily"),
  heroKnown: document.getElementById("heroKnown"),
  heroStageTitle: document.getElementById("heroStageTitle"),
  heroStageWords: document.getElementById("heroStageWords"),
  levelProgressBar: document.getElementById("levelProgressBar"),
  nextLevelText: document.getElementById("nextLevelText"),
  stageTitle: document.getElementById("stageTitle"),
  stageText: document.getElementById("stageText"),
  stageIcon: document.getElementById("stageIcon"),
  stageWordCount: document.getElementById("stageWordCount"),
  stagePercent: document.getElementById("stagePercent"),
  stageProgressBar: document.getElementById("stageProgressBar"),
  stageRemaining: document.getElementById("stageRemaining"),
  stageReward: document.getElementById("stageReward"),
  stageCelebration: document.getElementById("stageCelebration"),
  celebrationTitle: document.getElementById("celebrationTitle"),
  celebrationText: document.getElementById("celebrationText"),
  celebrationButton: document.getElementById("celebrationButton"),
  splashScreen: document.getElementById("splashScreen"),
  continueLearningButton: document.getElementById("continueLearningButton"),
  avatarButton: document.getElementById("avatarButton"),
  profilePopover: document.getElementById("profilePopover"),
  profileModal: document.getElementById("profileModal"),
  profileModalClose: document.getElementById("profileModalClose"),
  profileModalTitle: document.getElementById("profileModalTitle"),
  profileAvatarButton: document.getElementById("profileAvatarButton"),
  avatarFileInput: document.getElementById("avatarFileInput"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileSelect: document.getElementById("profileSelect"),
  createProfileButton: document.getElementById("createProfileButton"),
  profileStageValue: document.getElementById("profileStageValue"),
  profileLevelValue: document.getElementById("profileLevelValue"),
  profileXpValue: document.getElementById("profileXpValue"),
  modalVoiceSelect: document.getElementById("modalVoiceSelect"),
  modalVoiceTestButton: document.getElementById("modalVoiceTestButton"),
  modalVoiceNote: document.getElementById("modalVoiceNote"),
  statsKnownWords: document.getElementById("statsKnownWords"),
  statsBestStreak: document.getElementById("statsBestStreak"),
  statsTotalReviews: document.getElementById("statsTotalReviews"),
  statsGamesPlayed: document.getElementById("statsGamesPlayed"),
  statsFavoriteTheme: document.getElementById("statsFavoriteTheme"),
  exportBackupButton: document.getElementById("exportBackupButton"),
  importBackupButton: document.getElementById("importBackupButton"),
  backupFileInput: document.getElementById("backupFileInput"),
  resetProgressButton: document.getElementById("resetProgressButton"),
};

const viewTitles = {
  home: "Главная",
  cards: "Карточки",
  games: "Игры",
  dialogues: "Диалоги",
  progress: "Прогресс",
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  document.body.classList.add("home-active");
  bindNavigation();
  bindCardActions();
  bindVoiceControls();
  bindHintControls();
  bindQuizControls();
  bindSentenceControls();
  bindPairsControls();
  bindBlankControls();
  bindPictureControls();
  bindWordBuildControls();
  bindInstallControls();
  bindCelebrationControls();
  bindHomeControls();
  bindProfileMenu();
  bindProfileModal();
  await loadData();
  applyTheme();
  setupVoices();
  chooseNextWord();
  chooseNextQuiz();
  chooseNextSentence();
  chooseNextPairs();
  chooseNextBlank();
  chooseNextPicture();
  chooseNextWordBuild();
  renderCard();
  renderStats();
  renderThemes();
  renderDialogues();
  renderQuizTopics();
  renderQuiz();
  renderSentence();
  renderPairs();
  renderBlank();
  renderPicture();
  renderWordBuild();
  renderHintControls();
  renderProfile();
  renderInstallCard();
  hideSplashScreen();
  registerServiceWorker();
}

async function loadData() {
  const [
    wordsResponse,
    dialoguesResponse,
    quizzesResponse,
    sentencesResponse,
    pairsResponse,
    blanksResponse,
  ] = await Promise.all([
    fetch("data/words.json"),
    fetch("data/dialogues.json"),
    fetch("data/quizzes.json"),
    fetch("data/sentences.json"),
    fetch("data/pairs.json"),
    fetch("data/blanks.json"),
  ]);
  state.words = await wordsResponse.json();
  state.dialogues = await dialoguesResponse.json();
  state.quizzes = await quizzesResponse.json();
  state.sentences = await sentencesResponse.json();
  state.pairs = await pairsResponse.json();
  state.blanks = await blanksResponse.json();
}

function bindNavigation() {
  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
}

function bindCardActions() {
  els.revealButton.addEventListener("click", () => {
    state.translationVisible = true;
    renderCard();
  });

  els.knownButton.addEventListener("click", () => reviewCurrentWord(true));
  els.unknownButton.addEventListener("click", () => reviewCurrentWord(false));
  els.speakButton.addEventListener("click", speakCurrentWord);
}

function bindVoiceControls() {
  document.querySelectorAll(".voice-mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.voiceSettings.mode = button.dataset.voiceMode;
      state.voiceSettings.voiceURI = "";
      saveVoiceSettings();
      syncBestVoiceForMode();
      renderVoiceControls();
    });
  });

  els.voiceSelect.addEventListener("change", () => {
    state.voiceSettings.voiceURI = els.voiceSelect.value;
    saveVoiceSettings();
    renderVoiceControls();
  });

  els.voiceTestButton.addEventListener("click", () => speakText("Hello. This is your EnglishFlow voice."));
}

function bindHintControls() {
  document.querySelectorAll(".hint-mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.appSettings.hintMode = button.dataset.hintMode;
      saveAppSettings();
      renderHintControls();
      renderCard();
    });
  });
}

function bindQuizControls() {
  els.nextQuizButton.addEventListener("click", () => {
    chooseNextQuiz();
    renderQuiz();
  });

  els.speakQuizButton.addEventListener("click", () => {
    if (state.currentQuiz) speakText(state.currentQuiz.word);
  });
}

function bindSentenceControls() {
  els.checkSentenceButton.addEventListener("click", checkSentenceAnswer);
  els.nextSentenceButton.addEventListener("click", () => {
    chooseNextSentence();
    renderSentence();
  });
}

function bindPairsControls() {
  els.nextPairsButton.addEventListener("click", () => {
    chooseNextPairs();
    renderPairs();
  });
}

function bindBlankControls() {
  els.nextBlankButton.addEventListener("click", () => {
    chooseNextBlank();
    renderBlank();
  });
}

function bindPictureControls() {
  els.nextPictureButton.addEventListener("click", () => {
    chooseNextPicture();
    renderPicture();
  });
}

function bindWordBuildControls() {
  els.checkWordBuildButton.addEventListener("click", checkWordBuildAnswer);
  els.nextWordBuildButton.addEventListener("click", () => {
    chooseNextWordBuild();
    renderWordBuild();
  });
}

function bindInstallControls() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    renderInstallCard();
  });

  window.addEventListener("appinstalled", () => {
    state.deferredInstallPrompt = null;
    renderInstallCard();
  });

  els.installButton.addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    renderInstallCard();
  });
}

function bindCelebrationControls() {
  els.celebrationButton.addEventListener("click", hideStageCelebration);
}

function bindHomeControls() {
  els.continueLearningButton.addEventListener("click", () => setView("cards"));
  document.querySelectorAll("[data-go-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.goView));
  });
}

function bindProfileMenu() {
  els.avatarButton.addEventListener("click", () => {
    const isOpen = !els.profilePopover.hidden;
    els.profilePopover.hidden = isOpen;
    els.avatarButton.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (event) => {
    if (els.profilePopover.hidden) return;
    if (event.target.closest(".profile-menu")) return;
    els.profilePopover.hidden = true;
    els.avatarButton.setAttribute("aria-expanded", "false");
  });

  els.profilePopover.querySelectorAll("[data-profile-section]").forEach((button) => {
    button.addEventListener("click", () => openProfileModal(button.dataset.profileSection));
  });
}

function bindProfileModal() {
  els.profileModalClose.addEventListener("click", closeProfileModal);
  els.profileModal.addEventListener("click", (event) => {
    if (event.target === els.profileModal) closeProfileModal();
  });

  document.querySelectorAll("[data-profile-tab]").forEach((button) => {
    button.addEventListener("click", () => showProfileSection(button.dataset.profileTab));
  });

  els.profileNameInput.addEventListener("change", () => {
    state.profile.name = els.profileNameInput.value.trim() || "Мой профиль";
    saveCurrentProfile();
    renderProfile();
  });

  els.profileAvatarButton.addEventListener("click", () => els.avatarFileInput.click());
  els.avatarFileInput.addEventListener("change", handleAvatarUpload);
  els.profileSelect.addEventListener("change", () => switchProfile(els.profileSelect.value));
  els.createProfileButton.addEventListener("click", createProfile);
  els.modalVoiceSelect.addEventListener("change", () => {
    state.voiceSettings.voiceURI = els.modalVoiceSelect.value;
    saveVoiceSettings();
    renderVoiceControls();
  });
  els.modalVoiceTestButton.addEventListener("click", () => speakText("Hello. This is your EnglishFlow profile voice."));
  document.querySelectorAll(".theme-mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.appSettings.themeMode = button.dataset.themeMode;
      saveAppSettings();
      applyTheme();
      renderProfile();
    });
  });
  els.exportBackupButton.addEventListener("click", exportBackup);
  els.importBackupButton.addEventListener("click", () => els.backupFileInput.click());
  els.backupFileInput.addEventListener("change", importBackup);
  els.resetProgressButton.addEventListener("click", resetCurrentProfileProgress);
}

function setView(viewName) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.getElementById(`${viewName}View`).classList.add("active");
  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  document.body.classList.toggle("home-active", viewName === "home");
  els.profilePopover.hidden = true;
  els.avatarButton.setAttribute("aria-expanded", "false");
  els.viewTitle.textContent = viewTitles[viewName] || "EnglishFlow";
  renderStats();
}

function openProfileModal(section = "profile") {
  els.profilePopover.hidden = true;
  els.avatarButton.setAttribute("aria-expanded", "false");
  els.profileModal.hidden = false;
  showProfileSection(section);
  renderProfile();
}

function closeProfileModal() {
  els.profileModal.hidden = true;
}

function showProfileSection(section) {
  document.querySelectorAll("[data-profile-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.profileTab === section);
  });
  document.querySelectorAll("[data-profile-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.profilePanel === section);
  });
  const titles = {
    profile: "Профиль",
    voice: "Голос",
    theme: "Тема",
    stats: "Статистика",
    backup: "Резервная копия",
    reset: "Сброс прогресса",
  };
  els.profileModalTitle.textContent = titles[section] || "Профиль";
}

function renderProfile() {
  const avatar = state.profile.avatar || "🙂";
  const isImage = avatar.startsWith("data:image/");
  renderAvatarElement(els.avatarButton, avatar, isImage);
  renderAvatarElement(els.profileAvatarButton, avatar, isImage);
  els.profileNameInput.value = state.profile.name;

  const profiles = loadProfiles();
  els.profileSelect.innerHTML = profiles
    .map((profile) => `<option value="${profile.id}">${profile.name}</option>`)
    .join("");
  els.profileSelect.value = state.profile.id;

  const level = Math.max(1, Math.floor(state.progress.xp / 100) + 1);
  const known = getKnownWordCount();
  const stage = getVocabularyStage(known);
  els.profileStageValue.textContent = stage.shortTitle;
  els.profileLevelValue.textContent = level;
  els.profileXpValue.textContent = state.progress.xp;
  els.statsKnownWords.textContent = known;
  els.statsBestStreak.textContent = state.progress.bestStreak || 0;
  els.statsTotalReviews.textContent = state.progress.totalReviews || 0;
  els.statsGamesPlayed.textContent = state.progress.gamesPlayed || 0;
  els.statsFavoriteTheme.textContent = getFavoriteTheme();

  document.querySelectorAll(".theme-mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeMode === state.appSettings.themeMode);
  });
}

function renderAvatarElement(element, avatar, isImage) {
  element.textContent = "";
  if (isImage) {
    const image = document.createElement("img");
    image.src = avatar;
    image.alt = "";
    element.appendChild(image);
  } else {
    element.textContent = avatar;
  }
}

function handleAvatarUpload() {
  const file = els.avatarFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.profile.avatar = String(reader.result);
    saveCurrentProfile();
    renderProfile();
  });
  reader.readAsDataURL(file);
}

function createProfile() {
  const name = window.prompt("Имя нового профиля", "Новый ученик");
  if (!name) return;
  const profiles = loadProfiles();
  const profile = createProfileRecord(name.trim() || "Новый ученик");
  profiles.push(profile);
  saveProfiles(profiles);
  switchProfile(profile.id);
}

function switchProfile(profileId, force = false) {
  if (profileId === state.profile.id && !force) return;
  saveCurrentProfile();
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  const profile = loadProfiles().find((item) => item.id === profileId);
  if (!profile) return;
  state.profile = profile;
  state.progress = normalizeProgress(profile.progress);
  state.voiceSettings = normalizeVoiceSettings(profile.voiceSettings);
  state.appSettings = normalizeAppSettings(profile.appSettings);
  saveProgress();
  saveVoiceSettings();
  saveAppSettings();
  applyTheme();
  chooseNextWord();
  renderCard();
  renderStats();
  renderVoiceControls();
  renderHintControls();
  renderProfile();
}

function resetCurrentProfileProgress() {
  if (!window.confirm("Сбросить прогресс только текущего профиля?")) return;
  state.progress = normalizeProgress({});
  saveProgress();
  saveCurrentProfile();
  renderCard();
  renderStats();
  renderProfile();
}

function exportBackup() {
  saveCurrentProfile();
  const backup = {
    app: "EnglishFlow",
    version: 1,
    exportedAt: new Date().toISOString(),
    activeProfileId: state.profile.id,
    profiles: loadProfiles(),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "EnglishFlow_Backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importBackup() {
  const file = els.backupFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const backup = JSON.parse(String(reader.result));
      if (!Array.isArray(backup.profiles)) throw new Error("Invalid backup");
      saveProfiles(backup.profiles.map(normalizeProfile));
      const nextId = backup.activeProfileId || backup.profiles[0]?.id;
      localStorage.setItem(ACTIVE_PROFILE_KEY, nextId);
      switchProfile(nextId, true);
      renderProfile();
    } catch {
      window.alert("Не удалось импортировать файл резервной копии.");
    } finally {
      els.backupFileInput.value = "";
    }
  });
  reader.readAsText(file);
}

function chooseNextWord() {
  if (!state.words.length) return;

  const weighted = state.words
    .map((word, index) => {
      const item = state.progress.words[word.id] || {};
      const mistakes = item.mistakes || 0;
      const correct = item.correct || 0;
      const seenPenalty = Math.min(item.reviews || 0, 5);
      return {
        index,
        weight: 2 + mistakes * 4 - Math.min(correct, 3) + Math.max(0, 3 - seenPenalty),
      };
    })
    .sort((a, b) => b.weight - a.weight);

  const top = weighted.slice(0, Math.min(12, weighted.length));
  state.currentIndex = top[Math.floor(Math.random() * top.length)].index;
  state.translationVisible = false;
}

function currentWord() {
  return state.words[state.currentIndex];
}

function renderCard() {
  const word = currentWord();
  if (!word) return;

  els.wordText.textContent = word.word;
  els.wordTranscription.textContent = word.transcription;
  if (shouldShowWordHint()) {
    const visual = visualFor(word);
    els.wordEmoji.textContent = visual;
    els.wordEmoji.classList.remove("hint-hidden");
    els.wordEmoji.classList.toggle("no-visual", !visual);
  } else {
    els.wordEmoji.textContent = "👁";
    els.wordEmoji.classList.add("hint-hidden");
    els.wordEmoji.classList.remove("no-visual");
  }
  els.cardTheme.textContent = word.theme;

  els.translationText.textContent = state.translationVisible
    ? word.translation
    : "Нажми «Показать перевод»";
  els.translationBox.querySelector("p").textContent = state.translationVisible
    ? "Перевод"
    : "Перевод скрыт";
  els.revealButton.textContent = state.translationVisible ? "Перевод открыт" : "Показать перевод";
}

function shouldShowWordHint() {
  if (state.appSettings.hintMode === "always") return true;
  if (state.appSettings.hintMode === "never") return false;
  return getKnownWordCount() < NOVICE_HINT_WORD_LIMIT;
}

function visualFor(item) {
  const word = item.word?.toLowerCase();
  if (word && VISUAL_HINTS[word]) return VISUAL_HINTS[word];
  if (item.emoji && !BAD_VISUAL_SYMBOLS.has(item.emoji)) return item.emoji;
  return "";
}

function hasConcreteVisual(item) {
  const word = item.word?.toLowerCase();
  return Boolean(word && VISUAL_HINTS[word] && !ABSTRACT_PICTURE_WORDS.has(word));
}

function pictureWordPool() {
  return state.quizzes.filter((item) => item.word && item.translation && hasConcreteVisual(item));
}

function setFeedback(element, message, status = "neutral") {
  element.textContent = message;
  element.classList.remove("success", "error", "neutral");
  element.classList.add(status);
}

function applyTheme() {
  const mode = state.appSettings.themeMode || "light";
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || (mode === "auto" && prefersDark);
  document.body.classList.toggle("dark-theme", isDark);
}

function renderHintControls() {
  document.querySelectorAll(".hint-mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.hintMode === state.appSettings.hintMode);
  });

  if (!els.hintNote) return;
  if (state.appSettings.hintMode === "always") {
    els.hintNote.textContent = "Картинки всегда видны рядом со словами.";
  } else if (state.appSettings.hintMode === "never") {
    els.hintNote.textContent = "Картинки скрыты, чтобы тренировать перевод без опоры.";
  } else {
    els.hintNote.textContent = `Картинки видны до ${NOVICE_HINT_WORD_LIMIT} знакомых слов, потом скрываются.`;
  }
}

function reviewCurrentWord(known) {
  const word = currentWord();
  if (!word) return;

  const today = getTodayKey();
  const wordProgress = state.progress.words[word.id] || {
    reviews: 0,
    correct: 0,
    mistakes: 0,
    lastReviewed: null,
  };

  wordProgress.reviews += 1;
  wordProgress.correct += known ? 1 : 0;
  wordProgress.mistakes += known ? 0 : 1;
  wordProgress.lastReviewed = today;

  state.progress.words[word.id] = wordProgress;
  state.progress.xp += known ? 5 : 3;
  state.progress.totalReviews += 1;
  state.progress.daily[today] = (state.progress.daily[today] || 0) + 1;
  updateStreak(today);
  saveProgress();

  chooseNextWord();
  renderCard();
  renderStats();
}

function speakCurrentWord() {
  const word = currentWord();
  if (!word) return;
  speakText(word.word);
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;

  const latestVoices = readEnglishVoices();
  if (latestVoices.length) state.voices = latestVoices;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const isMaleMode = state.voiceSettings.mode === "male";
  utterance.lang = "en-US";
  utterance.rate = isMaleMode ? 0.84 : 0.9;
  utterance.pitch = isMaleMode ? 0.86 : 1.08;

  const selectedVoice = resolveSelectedVoice();
  if (selectedVoice) utterance.voice = selectedVoice;

  window.speechSynthesis.speak(utterance);
}

function setupVoices() {
  if (!("speechSynthesis" in window)) {
    els.voiceSelect.innerHTML = `<option value="">SpeechSynthesis недоступен</option>`;
    els.voiceSelect.disabled = true;
    els.voiceTestButton.disabled = true;
    els.voiceNote.textContent = "Этот браузер не поддерживает браузерную озвучку.";
    return;
  }

  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
  [300, 1000, 2000].forEach((delay) => setTimeout(refreshVoices, delay));
}

function refreshVoices() {
  state.voices = readEnglishVoices();

  if (!state.voiceSettings.voiceURI) syncBestVoiceForMode();
  renderVoiceControls();
}

function readEnglishVoices() {
  if (!("speechSynthesis" in window)) return [];

  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en"))
    .sort((a, b) => {
      const aUS = a.lang.toLowerCase().startsWith("en-us") ? 0 : 1;
      const bUS = b.lang.toLowerCase().startsWith("en-us") ? 0 : 1;
      return aUS - bUS || a.name.localeCompare(b.name);
    });
}

function syncBestVoiceForMode() {
  const bestVoice = resolveBestVoiceForMode(state.voiceSettings.mode);
  state.voiceSettings.voiceURI = bestVoice ? bestVoice.voiceURI : "";
  saveVoiceSettings();
}

function renderVoiceControls() {
  document.querySelectorAll(".voice-mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.voiceMode === state.voiceSettings.mode);
  });

  els.voiceSelect.innerHTML = "";

  if (!state.voices.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Авто: голос браузера";
    els.voiceSelect.appendChild(option);
    els.voiceSelect.disabled = true;
    if (els.modalVoiceSelect) {
      els.modalVoiceSelect.innerHTML = `<option value="">Авто: голос браузера</option>`;
      els.modalVoiceSelect.disabled = true;
      els.modalVoiceNote.textContent = els.voiceNote.textContent;
    }
    els.voiceNote.textContent =
      "На Android список голосов часто скрыт. Мужской/женский режим всё равно меняет тон озвучки.";
    return;
  }

  els.voiceSelect.disabled = false;
  if (els.modalVoiceSelect) {
    els.modalVoiceSelect.innerHTML = "";
    els.modalVoiceSelect.disabled = false;
  }
  const visibleVoices = voicesForCurrentMode();
  visibleVoices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.voiceURI;
    option.textContent = `${voice.name} (${voice.lang})${voice.localService ? "" : " · online"}`;
    els.voiceSelect.appendChild(option);
    if (els.modalVoiceSelect) els.modalVoiceSelect.appendChild(option.cloneNode(true));
  });

  const selectedVoice = resolveSelectedVoice();
  els.voiceSelect.value = selectedVoice ? selectedVoice.voiceURI : "";
  if (els.modalVoiceSelect) els.modalVoiceSelect.value = selectedVoice ? selectedVoice.voiceURI : "";
  els.voiceNote.textContent = buildVoiceNote(selectedVoice);
  if (els.modalVoiceNote) els.modalVoiceNote.textContent = els.voiceNote.textContent;
}

function resolveSelectedVoice() {
  if (!state.voices.length) return null;

  const visibleVoices = voicesForCurrentMode();
  const explicit = visibleVoices.find((voice) => voice.voiceURI === state.voiceSettings.voiceURI);
  if (explicit) return explicit;

  return resolveBestVoiceForMode(state.voiceSettings.mode);
}

function resolveBestVoiceForMode(mode) {
  if (!state.voices.length) return null;

  const pool = voicesForCurrentMode(mode);

  if (mode === "male") {
    return pool.find((voice) => voiceMatchesHints(voice, MALE_VOICE_HINTS)) || pool[0] || null;
  }

  if (mode === "female") {
    return pool.find((voice) => voiceMatchesHints(voice, FEMALE_VOICE_HINTS)) || pool[0] || null;
  }

  return pool[0] || null;
}

function voicesForCurrentMode(mode = state.voiceSettings.mode) {
  const usVoices = state.voices.filter((voice) => voice.lang.toLowerCase().startsWith("en-us"));
  const base = usVoices.length ? usVoices : state.voices;
  const hints = mode === "female" ? FEMALE_VOICE_HINTS : MALE_VOICE_HINTS;
  const matching = base.filter((voice) => voiceMatchesHints(voice, hints));
  return matching.length ? matching : base;
}

function voiceMatchesHints(voice, hints) {
  const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  return hints.some((hint) => label.includes(hint));
}

function buildVoiceNote(voice) {
  if (!voice) return "Используется голос браузера. Мужской/женский режим меняет тон озвучки.";

  const guessedType = voiceMatchesHints(voice, MALE_VOICE_HINTS)
    ? "похоже на мужской"
    : voiceMatchesHints(voice, FEMALE_VOICE_HINTS)
      ? "похоже на женский"
      : "тип голоса не определён браузером";

  return `${voice.name}: ${guessedType}. Если пол не определяется, режим дополнительно меняет тон.`;
}

function renderStats() {
  const today = getTodayKey();
  const wordValues = Object.values(state.progress.words);
  const known = getKnownWordCount();
  const weak = wordValues.filter((item) => item.mistakes > 0 && item.mistakes >= item.correct).length;
  const todayCount = state.progress.daily[today] || 0;
  const level = Math.max(1, Math.floor(state.progress.xp / 100) + 1);
  const xpIntoLevel = state.progress.xp % 100;
  const nextLevelXp = 100 - xpIntoLevel;

  els.xpValue.textContent = state.progress.xp;
  els.streakValue.textContent = state.progress.streak;
  els.levelValue.textContent = level;
  els.dailyCount.textContent = todayCount;
  els.todayReviewed.textContent = todayCount;
  els.knownWords.textContent = known;
  els.weakWords.textContent = weak;
  els.totalReviewed.textContent = state.progress.totalReviews;
  els.heroLevel.textContent = `Уровень ${level}`;
  els.heroXp.textContent = `${state.progress.xp} XP`;
  els.heroStreak.textContent = state.progress.streak;
  els.heroDaily.textContent = `${todayCount}/10`;
  els.heroKnown.textContent = known;
  els.levelProgressBar.style.width = `${xpIntoLevel}%`;
  els.nextLevelText.textContent = `До следующего уровня: ${nextLevelXp === 100 ? 100 : nextLevelXp} XP`;

  renderVocabularyStage(known);
  renderActivityBars();
  renderWeakList();
  renderProfile();
}

function getKnownWordCount() {
  return Object.values(state.progress.words).filter((item) => item.correct > item.mistakes).length;
}

function getVocabularyStage(known) {
  if (known >= 1000) return { shortTitle: "Этап 4", target: 1500 };
  if (known >= 600) return { shortTitle: "Этап 3", target: 1000 };
  if (known >= 300) return { shortTitle: "Этап 2", target: 600 };
  return { shortTitle: "Этап 1", target: 300 };
}

function getFavoriteTheme() {
  const counts = {};
  Object.entries(state.progress.words).forEach(([wordId, progress]) => {
    const word = state.words.find((item) => item.id === wordId);
    if (!word || !progress.reviews) return;
    counts[word.theme] = (counts[word.theme] || 0) + progress.reviews;
  });
  const [theme] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
  return theme || "—";
}

function renderVocabularyStage(known) {
  const stages = [
    {
      number: 1,
      target: 300,
      icon: "🏕️",
      title: "Этап 1 — Выживание",
      text: "Первые слова для простых бытовых ситуаций: дом, еда, семья, числа, цвета и короткие фразы.",
      reward: "Награда: уверенный старт и открытие более широких повседневных тем.",
    },
    {
      number: 2,
      target: 600,
      icon: "✈️",
      title: "Этап 2 — Туризм",
      text: "Словарь расширяется: путешествия, город, школа, транспорт, эмоции, вопросы и полезные действия.",
      reward: "Награда: больше игровых тем, фраз и заданий без постоянных визуальных подсказок.",
    },
    {
      number: 3,
      target: 1000,
      icon: "💬",
      title: "Этап 3 — Общение",
      text: "Крепкая beginner-база для чтения, поездок, разговорной практики и уверенного движения дальше.",
      reward: "Награда: цель EnglishFlow достигнута — 1000 слов активного словаря.",
    },
    {
      number: 4,
      target: 1500,
      icon: "🚀",
      title: "Этап 4 — Свободный английский",
      text: "Большой запас частых слов для уверенного чтения, поездок, бытовых диалогов и самостоятельной практики.",
      reward: "Награда: EnglishFlow Journey завершён — можно переходить к более живым диалогам и сложным темам.",
    },
  ];
  const currentStage = stages.find((stage) => known < stage.target) || stages[stages.length - 1];
  const previousTarget = stages[currentStage.number - 2]?.target || 0;
  const stageSpan = currentStage.target - previousTarget;
  const stageKnown = Math.max(0, known - previousTarget);
  const stagePercent = Math.min(100, Math.round((stageKnown / stageSpan) * 100));
  const remaining = Math.max(0, currentStage.target - known);

  els.stageIcon.textContent = currentStage.icon;
  els.stageTitle.textContent = currentStage.title;
  els.stageText.textContent = currentStage.text;
  els.heroStageTitle.textContent = currentStage.title;
  els.heroStageWords.textContent = `${known} / ${currentStage.target} слов`;
  els.stageWordCount.textContent = `${known} / ${currentStage.target} слов`;
  els.stagePercent.textContent = `${stagePercent}%`;
  els.stageProgressBar.style.width = `${stagePercent}%`;
  els.stageRemaining.textContent = remaining
    ? `Осталось ${remaining} слов до следующего этапа`
    : "Этап завершён";
  els.stageReward.textContent = currentStage.reward;
  document.querySelectorAll(".stage-step").forEach((step) => {
    const stageNumber = Number(step.dataset.stageStep);
    const stage = stages[stageNumber - 1];
    step.classList.toggle("active", stageNumber === currentStage.number);
    step.classList.toggle("done", known >= stage.target);
  });
  maybeCelebrateCompletedStage(known, stages);
}

function maybeCelebrateCompletedStage(known, stages) {
  const completed = stages.filter((stage) => known >= stage.target);
  if (!completed.length) return;

  const celebrated = loadCelebratedStages();
  const freshStage = completed.find((stage) => !celebrated.includes(stage.number));
  if (!freshStage) return;

  celebrated.push(freshStage.number);
  saveCelebratedStages(celebrated);
  showStageCelebration(freshStage);
}

function showStageCelebration(stage) {
  els.celebrationTitle.textContent = `${stage.title} пройден`;
  els.celebrationText.textContent = `${stage.reward} Следующий рубеж уже открыт.`;
  els.stageCelebration.hidden = false;
  window.setTimeout(() => els.stageCelebration.classList.add("show"), 20);
}

function hideStageCelebration() {
  els.stageCelebration.classList.remove("show");
  window.setTimeout(() => {
    els.stageCelebration.hidden = true;
  }, 220);
}

function loadCelebratedStages() {
  try {
    return JSON.parse(localStorage.getItem(CELEBRATED_STAGES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCelebratedStages(stages) {
  localStorage.setItem(CELEBRATED_STAGES_KEY, JSON.stringify(stages));
}

function renderThemes() {
  const counts = state.words.reduce((acc, word) => {
    acc[word.theme] = (acc[word.theme] || 0) + 1;
    return acc;
  }, {});

  els.themeList.innerHTML = Object.entries(counts)
    .map(([theme, count]) => `<div class="theme-pill"><span>${theme}</span><strong>${count}</strong></div>`)
    .join("");
}

function renderDialogues() {
  els.dialogueScenarios.innerHTML = state.dialogues
    .map((item) => `<div class="scenario-pill"><span>${item.title}</span><strong>${item.level}</strong></div>`)
    .join("");
}

function renderQuizTopics() {
  const topics = ["Все", ...new Set(state.quizzes.map((item) => item.theme))];
  els.quizTopicList.innerHTML = topics
    .map(
      (topic) =>
        `<button class="quiz-topic${topic === state.quizTopic ? " active" : ""}" data-quiz-topic="${topic}" type="button">${topic}</button>`,
    )
    .join("");

  els.quizTopicList.querySelectorAll(".quiz-topic").forEach((button) => {
    button.addEventListener("click", () => {
      state.quizTopic = button.dataset.quizTopic;
      chooseNextQuiz();
      renderQuizTopics();
      renderQuiz();
    });
  });
}

function chooseNextQuiz() {
  const pool = filteredQuizzes();
  if (!pool.length) return;
  state.currentQuiz = pool[Math.floor(Math.random() * pool.length)];
  state.quizAnswered = false;
}

function filteredQuizzes() {
  if (state.quizTopic === "Все") return state.quizzes;
  return state.quizzes.filter((item) => item.theme === state.quizTopic);
}

function renderQuiz() {
  if (!state.currentQuiz) return;
  const options = buildQuizOptions(state.currentQuiz);
  const quizVisual = visualFor(state.currentQuiz);
  els.quizWord.textContent = state.currentQuiz.word;
  els.quizTheme.textContent = state.currentQuiz.theme;
  els.quizEmoji.textContent = quizVisual;
  els.quizEmoji.classList.toggle("no-visual", !quizVisual);
  setFeedback(els.quizFeedback, "Выбери правильный перевод.");
  els.quizOptions.innerHTML = options
    .map((option) => `<button class="quiz-option" data-answer="${option}" type="button">${option}</button>`)
    .join("");

  els.quizOptions.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => handleQuizAnswer(button));
  });

  renderQuizStats();
}

function buildQuizOptions(quiz) {
  const distractors = state.quizzes
    .filter((item) => item.id !== quiz.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((item) => item.translation);

  return [quiz.translation, ...distractors].sort(() => Math.random() - 0.5);
}

function handleQuizAnswer(button) {
  if (state.quizAnswered || !state.currentQuiz) return;
  state.quizAnswered = true;

  const isCorrect = button.dataset.answer === state.currentQuiz.translation;
  button.classList.add(isCorrect ? "correct" : "wrong");

  els.quizOptions.querySelectorAll(".quiz-option").forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.dataset.answer === state.currentQuiz.translation) {
      optionButton.classList.add("correct");
    }
  });

  if (isCorrect) {
    state.quizStats.correct += 1;
    state.quizStats.streak += 1;
    state.progress.xp += 10;
    state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
    setFeedback(els.quizFeedback, `Верно: ${state.currentQuiz.word} — ${state.currentQuiz.translation}. +10 XP`, "success");
  } else {
    state.quizStats.wrong += 1;
    state.quizStats.streak = 0;
    state.progress.xp += 2;
    state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
    setFeedback(els.quizFeedback, `Почти. Правильно: ${state.currentQuiz.translation}. +2 XP за попытку`, "error");
  }

  state.progress.totalReviews += 1;
  state.progress.daily[getTodayKey()] = (state.progress.daily[getTodayKey()] || 0) + 1;
  updateStreak(getTodayKey());
  saveProgress();
  renderQuizStats();
  renderStats();
}

function renderQuizStats() {
  els.quizCorrect.textContent = state.quizStats.correct;
  els.quizWrong.textContent = state.quizStats.wrong;
  els.quizStreak.textContent = state.quizStats.streak;
}

function chooseNextSentence() {
  if (!state.sentences.length) return;
  state.currentSentence = state.sentences[Math.floor(Math.random() * state.sentences.length)];
  state.sentenceAnswer = [];
  state.sentenceBank = shuffle([...state.currentSentence.words]);
  state.sentenceSolved = false;
}

function renderSentence() {
  if (!state.currentSentence) return;

  const punctuation = state.currentSentence.type === "Вопрос" ? "?" : ".";
  els.sentenceTranslation.textContent = `${state.currentSentence.translation}${punctuation}`;
  setFeedback(els.sentenceFeedback, "Собери английскую фразу в правильном порядке.");
  els.sentenceBuild.innerHTML = state.sentenceAnswer.length
    ? state.sentenceAnswer
        .map((word, index) => `<button class="word-chip" data-answer-index="${index}" type="button">${word}</button>`)
        .join("")
    : `<span class="voice-note">Нажимай слова снизу.</span>`;
  els.sentenceBank.innerHTML = state.sentenceBank
    .map((word, index) => `<button class="word-chip" data-bank-index="${index}" type="button">${word}</button>`)
    .join("");

  els.sentenceBuild.querySelectorAll(".word-chip[data-answer-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.answerIndex);
      const [word] = state.sentenceAnswer.splice(index, 1);
      state.sentenceBank.push(word);
      renderSentence();
    });
  });

  els.sentenceBank.querySelectorAll(".word-chip[data-bank-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.bankIndex);
      const [word] = state.sentenceBank.splice(index, 1);
      state.sentenceAnswer.push(word);
      renderSentence();
    });
  });
}

function checkSentenceAnswer() {
  if (!state.currentSentence) return;
  if (state.sentenceSolved) {
    setFeedback(els.sentenceFeedback, "Это предложение уже засчитано. Нажми «Следующая».");
    return;
  }
  const answer = state.sentenceAnswer.join(" ");
  const correct = state.currentSentence.sentence;
  const isCorrect = answer === correct;

  if (isCorrect) {
    state.sentenceSolved = true;
    state.progress.xp += 12;
    state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
    state.progress.totalReviews += 1;
    state.progress.daily[getTodayKey()] = (state.progress.daily[getTodayKey()] || 0) + 1;
    updateStreak(getTodayKey());
    saveProgress();
    renderStats();
    setFeedback(els.sentenceFeedback, `Верно: ${correct}. +12 XP`, "success");
  } else {
    setFeedback(els.sentenceFeedback, `Пока нет. Правильно: ${correct}.`, "error");
  }
}

function chooseNextPairs() {
  state.currentPairs = shuffle([...state.pairs]).slice(0, 6);
  state.pairWordsOrder = shuffle([...state.currentPairs]);
  state.pairsMessage = "";
  state.pairsFeedbackStatus = "neutral";
  state.selectedPairImage = null;
  state.selectedPairWord = null;
  state.matchedPairs = new Set();
}

function renderPairs() {
  if (!state.currentPairs.length) return;

  const images = state.currentPairs;
  const words = state.pairWordsOrder;

  els.pairImages.innerHTML = images
    .map(
      (item) =>
        `<button class="pair-card${pairClass(item.id, "image")}" data-pair-image="${item.id}" type="button"><strong>${visualFor(item)}</strong><span>${item.translation}</span></button>`,
    )
    .join("");
  els.pairWords.innerHTML = words
    .map(
      (item) =>
        `<button class="pair-word${pairClass(item.id, "word")}" data-pair-word="${item.id}" type="button">${item.word}</button>`,
    )
    .join("");

  els.pairImages.querySelectorAll(".pair-card").forEach((button) => {
    button.addEventListener("click", () => selectPairImage(button.dataset.pairImage));
  });
  els.pairWords.querySelectorAll(".pair-word").forEach((button) => {
    button.addEventListener("click", () => selectPairWord(button.dataset.pairWord));
  });

  const matchedCount = state.matchedPairs.size;
  const pairsMessage =
    state.pairsMessage ||
    (matchedCount === state.currentPairs.length
      ? `Набор готов. +${matchedCount * 4} XP`
      : `Найдено пар: ${matchedCount}/${state.currentPairs.length}`);
  const pairsStatus = state.pairsMessage
    ? state.pairsFeedbackStatus
    : matchedCount === state.currentPairs.length
      ? "success"
      : "neutral";
  setFeedback(els.pairsFeedback, pairsMessage, pairsStatus);
}

function chooseNextBlank() {
  if (!state.blanks.length) return;
  state.currentBlank = state.blanks[Math.floor(Math.random() * state.blanks.length)];
  state.blankAnswered = false;
}

function renderBlank() {
  if (!state.currentBlank) return;

  els.blankTheme.textContent = state.currentBlank.theme;
  els.blankTemplate.textContent = state.currentBlank.template;
  els.blankTranslation.textContent = state.currentBlank.translation;
  setFeedback(els.blankFeedback, "Выбери слово для пропуска.");
  els.blankOptions.innerHTML = shuffle([...state.currentBlank.options])
    .map((option) => `<button class="blank-option" data-blank-answer="${option}" type="button">${option}</button>`)
    .join("");

  els.blankOptions.querySelectorAll(".blank-option").forEach((button) => {
    button.addEventListener("click", () => handleBlankAnswer(button));
  });
}

function renderInstallCard() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    els.installText.textContent = "Приложение уже открыто как установленная PWA.";
    els.installButton.hidden = true;
    return;
  }

  if (state.deferredInstallPrompt) {
    els.installText.textContent = "Можно установить EnglishFlow как отдельное приложение.";
    els.installButton.hidden = false;
    return;
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    els.installText.textContent = "iPhone: нажми «Поделиться», затем «На экран Домой».";
  } else {
    els.installText.textContent = "Android/Chrome: открой меню браузера и выбери «Установить приложение» или «Добавить на главный экран».";
  }
  els.installButton.hidden = true;
}

function handleBlankAnswer(button) {
  if (state.blankAnswered || !state.currentBlank) return;
  state.blankAnswered = true;

  const isCorrect = button.dataset.blankAnswer === state.currentBlank.answer;
  button.classList.add(isCorrect ? "correct" : "wrong");

  els.blankOptions.querySelectorAll(".blank-option").forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.dataset.blankAnswer === state.currentBlank.answer) {
      optionButton.classList.add("correct");
    }
  });

  if (isCorrect) {
    state.progress.xp += 8;
    state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
    setFeedback(els.blankFeedback, `Верно: ${state.currentBlank.template.replace("___", state.currentBlank.answer)}. +8 XP`, "success");
  } else {
    state.progress.xp += 2;
    state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
    setFeedback(els.blankFeedback, `Почти. Правильно: ${state.currentBlank.answer}. +2 XP`, "error");
  }

  state.progress.totalReviews += 1;
  state.progress.daily[getTodayKey()] = (state.progress.daily[getTodayKey()] || 0) + 1;
  updateStreak(getTodayKey());
  saveProgress();
  renderStats();
}

function chooseNextPicture() {
  const pool = pictureWordPool();
  if (!pool.length) return;
  state.currentPicture = pool[Math.floor(Math.random() * pool.length)];
  state.pictureAnswered = false;
}

function renderPicture() {
  if (!state.currentPicture) return;

  const options = buildWordOptions(state.currentPicture);
  els.pictureTheme.textContent = state.currentPicture.theme;
  els.picturePrompt.textContent = visualFor(state.currentPicture);
  setFeedback(els.pictureFeedback, "Выбери английское слово.");
  els.pictureOptions.innerHTML = options
    .map((option) => `<button class="quiz-option" data-picture-answer="${option}" type="button">${option}</button>`)
    .join("");

  els.pictureOptions.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => handlePictureAnswer(button));
  });
}

function buildWordOptions(target) {
  const distractors = [...new Set(
    pictureWordPool()
      .filter((item) => item.id !== target.id && item.word !== target.word)
      .sort(() => Math.random() - 0.5)
      .map((item) => item.word),
  )].slice(0, 3);

  return [target.word, ...distractors].sort(() => Math.random() - 0.5);
}

function handlePictureAnswer(button) {
  if (state.pictureAnswered || !state.currentPicture) return;
  state.pictureAnswered = true;

  const isCorrect = button.dataset.pictureAnswer === state.currentPicture.word;
  button.classList.add(isCorrect ? "correct" : "wrong");

  els.pictureOptions.querySelectorAll(".quiz-option").forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.dataset.pictureAnswer === state.currentPicture.word) {
      optionButton.classList.add("correct");
    }
  });

  if (isCorrect) {
    addStudyProgress(9);
    setFeedback(els.pictureFeedback, `Верно: ${visualFor(state.currentPicture)} — ${state.currentPicture.word}. +9 XP`, "success");
  } else {
    addStudyProgress(2);
    setFeedback(els.pictureFeedback, `Почти. Правильно: ${state.currentPicture.word}. +2 XP`, "error");
  }
}

function chooseNextWordBuild() {
  const pool = pictureWordPool().filter((item) => /^[a-z]{3,8}$/.test(item.word));
  if (!pool.length) return;
  state.currentWordBuild = pool[Math.floor(Math.random() * pool.length)];
  state.wordBuildAnswer = [];
  state.wordBuildBank = shuffle(state.currentWordBuild.word.split(""));
  state.wordBuildSolved = false;
}

function renderWordBuild() {
  if (!state.currentWordBuild) return;

  const targetLength = state.currentWordBuild.word.length;
  els.wordBuildTheme.textContent = state.currentWordBuild.theme;
  els.wordBuildPrompt.textContent = visualFor(state.currentWordBuild);
  setFeedback(els.wordBuildFeedback, "Собери слово из букв.");
  els.letterSlots.innerHTML = Array.from({ length: targetLength }, (_, index) => {
    const letter = state.wordBuildAnswer[index] || "";
    return `<button class="letter-slot${letter ? " filled" : ""}" data-letter-slot="${index}" type="button">${letter}</button>`;
  }).join("");
  els.letterBank.innerHTML = state.wordBuildBank
    .map((letter, index) => `<button class="letter-chip" data-letter-index="${index}" type="button">${letter}</button>`)
    .join("");

  els.letterSlots.querySelectorAll(".letter-slot[data-letter-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.letterSlot);
      const [letter] = state.wordBuildAnswer.splice(index, 1);
      if (letter) state.wordBuildBank.push(letter);
      renderWordBuild();
    });
  });

  els.letterBank.querySelectorAll(".letter-chip[data-letter-index]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.wordBuildAnswer.length >= targetLength) return;
      const index = Number(button.dataset.letterIndex);
      const [letter] = state.wordBuildBank.splice(index, 1);
      state.wordBuildAnswer.push(letter);
      renderWordBuild();
    });
  });
}

function checkWordBuildAnswer() {
  if (!state.currentWordBuild) return;
  if (state.wordBuildSolved) {
    setFeedback(els.wordBuildFeedback, "Это слово уже засчитано. Нажми «Следующее».");
    return;
  }

  const answer = state.wordBuildAnswer.join("");
  const correct = state.currentWordBuild.word;

  if (answer === correct) {
    state.wordBuildSolved = true;
    addStudyProgress(11);
    setFeedback(els.wordBuildFeedback, `Верно: ${correct}. +11 XP`, "success");
  } else if (answer.length < correct.length) {
    setFeedback(els.wordBuildFeedback, "Добавь все буквы, потом проверь.");
  } else {
    setFeedback(els.wordBuildFeedback, `Пока нет. Правильно: ${correct}.`, "error");
  }
}

function addStudyProgress(xp) {
  state.progress.xp += xp;
  state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
  state.progress.totalReviews += 1;
  state.progress.daily[getTodayKey()] = (state.progress.daily[getTodayKey()] || 0) + 1;
  updateStreak(getTodayKey());
  saveProgress();
  renderStats();
}

function pairClass(id, type) {
  if (state.matchedPairs.has(id)) return " matched";
  if (type === "image" && state.selectedPairImage === id) return " selected";
  if (type === "word" && state.selectedPairWord === id) return " selected";
  return "";
}

function selectPairImage(id) {
  if (state.matchedPairs.has(id)) return;
  state.selectedPairImage = id;
  checkPairSelection();
  renderPairs();
}

function selectPairWord(id) {
  if (state.matchedPairs.has(id)) return;
  state.selectedPairWord = id;
  checkPairSelection();
  renderPairs();
}

function checkPairSelection() {
  if (!state.selectedPairImage || !state.selectedPairWord) return;

  if (state.selectedPairImage === state.selectedPairWord) {
    state.matchedPairs.add(state.selectedPairImage);
    const pair = state.currentPairs.find((item) => item.id === state.selectedPairImage);
    state.pairsMessage = pair ? `Верно: ${visualFor(pair)} — ${pair.word}. +4 XP` : "Верно. +4 XP";
    state.pairsFeedbackStatus = "success";
    state.progress.xp += 4;
    state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
    state.progress.totalReviews += 1;
    state.progress.daily[getTodayKey()] = (state.progress.daily[getTodayKey()] || 0) + 1;
    updateStreak(getTodayKey());
    saveProgress();
    renderStats();
  } else {
    state.pairsMessage = "Не пара. Попробуй ещё раз.";
    state.pairsFeedbackStatus = "error";
  }

  state.selectedPairImage = null;
  state.selectedPairWord = null;
}

function shuffle(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function renderActivityBars() {
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(Date.now() - (6 - offset) * DAY_MS);
    const key = toDateKey(date);
    return { key, label: date.toLocaleDateString("ru-RU", { weekday: "short" }) };
  });

  const max = Math.max(10, ...days.map((day) => state.progress.daily[day.key] || 0));
  els.activityBars.innerHTML = days
    .map((day) => {
      const count = state.progress.daily[day.key] || 0;
      const height = Math.max(10, Math.round((count / max) * 120));
      return `<div class="activity-bar"><span style="height:${height}px"></span><strong>${count}</strong><small>${day.label}</small></div>`;
    })
    .join("");
}

function renderWeakList() {
  const weakWords = state.words
    .map((word) => ({ word, progress: state.progress.words[word.id] }))
    .filter((item) => item.progress && item.progress.mistakes > 0)
    .sort((a, b) => b.progress.mistakes - a.progress.mistakes)
    .slice(0, 8);

  if (!weakWords.length) {
    els.weakList.innerHTML = `<div class="weak-pill"><span>Пока нет слабых слов</span><strong>0</strong></div>`;
    return;
  }

  els.weakList.innerHTML = weakWords
    .map(
      (item) =>
        `<div class="weak-pill"><span>${item.word.word} — ${item.word.translation}</span><strong>${item.progress.mistakes}</strong></div>`,
    )
    .join("");
}

function updateStreak(today) {
  const last = state.progress.lastStudyDate;
  if (last === today) return;

  const yesterday = toDateKey(new Date(Date.now() - DAY_MS));
  state.progress.streak = last === yesterday ? state.progress.streak + 1 : 1;
  state.progress.bestStreak = Math.max(state.progress.bestStreak, state.progress.streak);
  state.progress.lastStudyDate = today;
}

function loadProgress() {
  return normalizeProgress(initialProfile.progress);
}

function normalizeProgress(progress = {}) {
  const defaults = {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    totalReviews: 0,
    gamesPlayed: 0,
    lastStudyDate: null,
    daily: {},
    words: {},
  };

  return { ...defaults, ...(progress || {}) };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  saveCurrentProfile();
}

function loadVoiceSettings() {
  return normalizeVoiceSettings(initialProfile.voiceSettings);
}

function normalizeVoiceSettings(settings = {}) {
  const defaults = {
    mode: "male",
    voiceURI: "",
  };

  const saved = { ...defaults, ...(settings || {}) };
  if (!["male", "female"].includes(saved.mode)) saved.mode = "male";
  return saved;
}

function loadAppSettings() {
  return normalizeAppSettings(initialProfile.appSettings);
}

function normalizeAppSettings(settings = {}) {
  const defaults = {
    hintMode: "novice",
    themeMode: "light",
  };

  const saved = { ...defaults, ...(settings || {}) };
  if (!["always", "novice", "never"].includes(saved.hintMode)) saved.hintMode = "novice";
  if (!["light", "dark", "auto"].includes(saved.themeMode)) saved.themeMode = "light";
  return saved;
}

function saveAppSettings() {
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(state.appSettings));
  saveCurrentProfile();
}

function saveVoiceSettings() {
  localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(state.voiceSettings));
  saveCurrentProfile();
}

function loadActiveProfile() {
  const profiles = ensureProfiles();
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY) || profiles[0].id;
  const profile = profiles.find((item) => item.id === activeId) || profiles[0];
  localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
  return normalizeProfile(profile);
}

function ensureProfiles() {
  const profiles = loadProfiles();
  if (profiles.length) return profiles;

  const profile = createProfileRecord("Мой профиль", {
    progress: readLegacyJson(STORAGE_KEY, {}),
    voiceSettings: readLegacyJson(VOICE_SETTINGS_KEY, {}),
    appSettings: readLegacyJson(APP_SETTINGS_KEY, {}),
  });
  saveProfiles([profile]);
  localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
  return [profile];
}

function loadProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
    return Array.isArray(profiles) ? profiles.map(normalizeProfile) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles.map(normalizeProfile)));
}

function createProfileRecord(name, data = {}) {
  return normalizeProfile({
    id: `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    avatar: "🙂",
    ...data,
  });
}

function normalizeProfile(profile) {
  return {
    id: profile.id || `profile-${Date.now()}`,
    name: profile.name || "Мой профиль",
    avatar: profile.avatar || "🙂",
    progress: normalizeProgress(profile.progress),
    voiceSettings: normalizeVoiceSettings(profile.voiceSettings),
    appSettings: normalizeAppSettings(profile.appSettings),
  };
}

function saveCurrentProfile() {
  if (!state?.profile) return;
  const profiles = loadProfiles();
  const current = normalizeProfile({
    ...state.profile,
    progress: state.progress,
    voiceSettings: state.voiceSettings,
    appSettings: state.appSettings,
  });
  const index = profiles.findIndex((profile) => profile.id === current.id);
  if (index >= 0) profiles[index] = current;
  else profiles.push(current);
  state.profile = current;
  saveProfiles(profiles);
}

function readLegacyJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function getTodayKey() {
  return toDateKey(new Date());
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch((error) => {
    console.warn("Service worker registration failed", error);
  });
}

function hideSplashScreen() {
  if (!els.splashScreen) return;
  els.splashScreen.classList.add("hide");
  window.setTimeout(() => {
    els.splashScreen.hidden = true;
  }, 520);
}
