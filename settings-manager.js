// Settings State Management Module
// Handles localStorage persistence for all user configuration settings

const SETTINGS_KEY = 'startpage_settings';

// Default settings
const DEFAULT_SETTINGS = {
    font: 'cinzel',
    fontWeight: 400,
    searchEngine: 'g',
    searchEngineIndex: 0
};

// Load all settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
        try {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
        } catch (error) {
            console.error('Error loading settings:', error);
            return DEFAULT_SETTINGS;
        }
    }
    return DEFAULT_SETTINGS;
}

// Save all settings to localStorage
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Update a specific setting
function updateSetting(key, value) {
    const settings = loadSettings();
    settings[key] = value;
    saveSettings(settings);
    return settings;
}

// Apply settings to the UI
function applySettings() {
    const settings = loadSettings();

    // Apply font selection
    const fontSelect = document.getElementById('selectFont');
    if (fontSelect) {
        fontSelect.value = settings.font;
        applyFont(settings.font);
    }

    // Apply font weight
    const weightSlider = document.getElementById('weight');
    if (weightSlider) {
        weightSlider.value = settings.fontWeight;
        applyFontWeight(settings.fontWeight);
    }

    // Apply search engine preference
    if (window.engineIndex !== undefined && window.selectEngine !== undefined) {
        window.engineIndex = settings.searchEngineIndex;
        window.selectEngine = settings.searchEngine;
        const engineLabel = document.getElementById('engineLabel');
        if (engineLabel) {
            engineLabel.textContent = settings.searchEngine + '/';
        }
    }
}

// Apply font to clock
function applyFont(font) {
    const clockdiv = document.querySelector('.clock');
    if (!clockdiv) return;

    switch (font) {
        case 'cinzel':
            clockdiv.style.fontFamily = '"Cinzel", serif';
            break;
        case 'sansserif':
            clockdiv.style.fontFamily = 'sans-serif';
            break;
        case 'bitcount':
            clockdiv.style.fontFamily = '"Bitcount Grid Single", system-ui';
            break;
        default:
            clockdiv.style.fontFamily = '"Cinzel", serif';
    }
}

// Apply font weight to clock
function applyFontWeight(weight) {
    const clockdiv = document.querySelector('.clock');
    if (clockdiv) {
        clockdiv.style.fontWeight = weight;
    }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', function () {
    // Load and apply saved settings
    applySettings();

    // Set up font selection listener
    const fontSelect = document.getElementById('selectFont');
    if (fontSelect) {
        fontSelect.addEventListener('change', function (e) {
            const font = e.target.value;
            updateSetting('font', font);
            applyFont(font);
        });
    }

    // Set up font weight listener
    const weightSlider = document.getElementById('weight');
    if (weightSlider) {
        weightSlider.addEventListener('input', function (e) {
            const weight = parseInt(e.target.value);
            updateSetting('fontWeight', weight);
            applyFontWeight(weight);
        });
    }
});

// Export functions for use in other modules
window.settingsManager = {
    loadSettings,
    saveSettings,
    updateSetting,
    applySettings
};
