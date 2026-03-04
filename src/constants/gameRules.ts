export const SKILL_GAME_WARNING = {
    title: '⚠️ IMPORTANT NOTICE — Please Read Before Registering',
    rules: [
        '🎮 BlazeFire Arena tournaments are SKILL-BASED competitions. Results depend entirely on your gaming ability.',
        '💰 Entry fees are non-refundable once the tournament has started.',
        '🚫 Use of hacks, cheats, emulators (unless permitted), or any third-party tools will result in permanent ban.',
        '📵 Account sharing is strictly prohibited. You must play from your own Free Fire account.',
        '⚡ Players found win-trading or match-fixing will be permanently disqualified.',
        '🔞 This platform involves real-money entry fees. Please ensure you are using your own money responsibly.',
        '📋 All disputes must be raised within 30 minutes of match end with valid screenshot proof.',
        '🎯 BlazeFire Arena decisions on rule violations are final and binding.',
        '🏆 Prize distribution happens within 48 hours after tournament completion via Fampay.',
        '📱 Stable internet connection is YOUR responsibility. Disconnection is not grounds for a rematch.',
    ],
    acknowledgmentText: 'I have read, understood, and agree to all the rules and conditions above.',
    buttonText: 'I AGREE — PROCEED TO REGISTRATION',
};

export const DEFAULT_TOURNAMENT_RULES = [
    'Players must join the room within 5 minutes of room ID being shared.',
    'Only the registered Free Fire account may participate.',
    'Screenshots of results must be submitted within 30 minutes of match end.',
    'Any form of teaming with opponents will result in immediate disqualification.',
    'The use of VPN or location spoofers is strictly prohibited.',
    'Players must have a minimum of Platinum rank to participate in ranked tournaments.',
    'BlazeFire Arena reserves the right to cancel any tournament due to technical issues.',
];

export const GAME_MAPS: { value: string; label: string }[] = [
    { value: 'Bermuda', label: '🏝️ Bermuda' },
    { value: 'Kalahari', label: '🏜️ Kalahari' },
    { value: 'Purgatory', label: '🌋 Purgatory' },
    { value: 'Alpine', label: '🏔️ Alpine' },
];

export const TOURNAMENT_MODES: { value: string; label: string }[] = [
    { value: 'SOLO', label: '1v1 Solo' },
    { value: 'DUO', label: '2v2 Duo' },
    { value: 'SQUAD', label: '4v4 Squad' },
];
