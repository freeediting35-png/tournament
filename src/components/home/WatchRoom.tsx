/**
 * WatchRoom — Additive feature (new)
 * Embeds a Twitch/YouTube live stream + community chat section.
 * Feature flag: always visible (can be wrapped in a flag env variable later).
 * Does NOT touch any existing features or data flows.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv2, MessageCircle, Users, ExternalLink, Radio, Youtube, ChevronDown } from 'lucide-react';

// Mock live chat messages (static for UI demo; real integration would use a WebSocket)
const MOCK_CHAT = [
    { id: 1, user: 'ArjunSK', message: 'Let\'s gooo! 🔥 Best tournament site ever!', color: '#FF4500', time: '2m' },
    { id: 2, user: 'PriyaGamer', message: 'That last match was insane 🏆', color: '#FFD700', time: '1m' },
    { id: 3, user: 'RahulFF', message: 'GGs everyone, see you in the finals!', color: '#00E5FF', time: '1m' },
    { id: 4, user: 'VikramPro', message: 'Squad wins again 💪💪', color: '#00C853', time: '45s' },
    { id: 5, user: 'SunilKing', message: 'Join squad mode, more fun!', color: '#FF8C00', time: '30s' },
    { id: 6, user: 'DevFF99', message: 'When is the next solo tournament? 👀', color: '#A0A0B0', time: '15s' },
    { id: 7, user: 'ManishGamer', message: '₹50,000 prize pool looking huge!!! 🤑', color: '#FF4500', time: '10s' },
    { id: 8, user: 'SohamFire', message: 'Admin please update room ID earlier next time', color: '#A0A0B0', time: '5s' },
];

type StreamPlatform = 'youtube' | 'twitch';

const STREAM_OPTIONS: { platform: StreamPlatform; label: string; icon: React.ElementType; color: string; channelHint: string }[] = [
    { platform: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', channelHint: 'BlazeFire Arena' },
    { platform: 'twitch', label: 'Twitch', icon: Radio, color: '#9146FF', channelHint: 'blazefire_arena' },
];

const WatchRoom: React.FC = () => {
    const [activePlatform, setActivePlatform] = useState<StreamPlatform>('youtube');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
    const [viewerCount] = useState(Math.floor(Math.random() * 3000 + 800));

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const newMsg = {
            id: Date.now(),
            user: 'You',
            message: chatInput.trim(),
            color: '#FF4500',
            time: 'now',
        };
        setChatMessages(prev => [...prev.slice(-20), newMsg]);
        setChatInput('');
    };

    // YouTube live embed (replace with actual channel ID for production)
    const youtubeEmbedUrl = 'https://www.youtube.com/embed/live_stream?channel=UCxxxxxx&autoplay=1&mute=1&modestbranding=1';
    // Twitch embed
    const twitchEmbedUrl = `https://player.twitch.tv/?channel=blazefire_arena&parent=${window.location.hostname}&muted=true`;

    const embedUrl = activePlatform === 'youtube' ? youtubeEmbedUrl : twitchEmbedUrl;

    return (
        <section className="py-16 overflow-hidden">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-primary font-mono text-xs tracking-widest uppercase">Watch Room</p>
                            <div className="flex items-center gap-1.5 bg-danger/15 border border-danger/30 rounded-full px-2.5 py-0.5">
                                <span className="live-dot" style={{ width: 6, height: 6 }} />
                                <span className="text-danger text-[11px] font-bold font-mono">LIVE STREAM</span>
                            </div>
                        </div>
                        <h2 className="section-title text-white">
                            Live <span className="gradient-text">Watch Room</span>
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">Watch live tournament streams and chat with the community in real time.</p>
                    </div>

                    {/* Viewer count */}
                    <div className="flex items-center gap-2 glass-surface border border-white/10 rounded-xl px-4 py-2 self-start xl:self-auto">
                        <Users size={16} className="text-primary" />
                        <span className="text-white font-display font-bold">{viewerCount.toLocaleString('en-IN')}</span>
                        <span className="text-text-secondary text-xs">watching now</span>
                    </div>
                </motion.div>

                {/* Platform selector */}
                <div className="flex items-center gap-3 mb-6">
                    {STREAM_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        const active = activePlatform === opt.platform;
                        return (
                            <motion.button
                                key={opt.platform}
                                onClick={() => setActivePlatform(opt.platform)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-display font-bold text-sm transition-all ${
                                    active
                                        ? 'border-transparent text-white'
                                        : 'border-white/15 text-text-secondary hover:border-white/30'
                                }`}
                                style={active ? { background: opt.color, boxShadow: `0 0 20px ${opt.color}60` } : {}}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                <Icon size={16} />
                                {opt.label}
                                {active && <span className="text-xs opacity-80 font-mono">({opt.channelHint})</span>}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Main layout: Stream + Chat */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Stream embed */}
                    <motion.div
                        className="xl:col-span-2"
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="glass-ultra rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            {/* Stream placeholder (shown when channel not configured) */}
                            <div
                                className="relative w-full flex items-center justify-center bg-bg-dark"
                                style={{ aspectRatio: '16/9' }}
                            >
                                {/* Decorative placeholder — in production, replace with: */}
                                {/* <iframe src={embedUrl} allowFullScreen className="absolute inset-0 w-full h-full border-0" /> */}
                                <div className="absolute inset-0 scanlines"
                                    style={{ background: 'linear-gradient(135deg, rgba(255,69,0,0.05), rgba(0,0,0,0.9), rgba(255,215,0,0.03))' }}
                                />
                                <div className="relative z-10 text-center p-8">
                                    <motion.div
                                        className="text-7xl mb-4"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        📺
                                    </motion.div>
                                    <p className="font-display font-bold text-white text-2xl mb-2">
                                        {activePlatform === 'youtube' ? 'YouTube' : 'Twitch'} Live Stream
                                    </p>
                                    <p className="text-text-secondary text-sm mb-6 max-w-sm">
                                        Configure your {activePlatform === 'youtube' ? 'YouTube Channel ID' : 'Twitch channel name'} in Admin settings to enable live streaming.
                                    </p>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="live-dot" />
                                        <span className="text-danger font-bold font-mono text-sm">TOURNAMENT STREAM</span>
                                    </div>
                                    <a
                                        href={activePlatform === 'youtube' ? 'https://youtube.com/@BlazeFire_Arena' : 'https://twitch.tv/blazefire_arena'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-6 btn-primary text-sm px-5 py-2.5"
                                    >
                                        <ExternalLink size={14} />
                                        Watch on {activePlatform === 'youtube' ? 'YouTube' : 'Twitch'}
                                    </a>
                                </div>
                            </div>

                            {/* Stream info bar */}
                            <div className="flex items-center justify-between p-4 border-t border-white/8">
                                <div>
                                    <p className="text-white font-display font-bold text-sm">BlazeFire Arena — Finals Day</p>
                                    <p className="text-text-secondary text-xs">Squad Tournament • Season 12</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tv2 size={14} className="text-primary" />
                                    <span className="text-primary text-xs font-mono font-bold">HD STREAM</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Chat */}
                    <motion.div
                        className="xl:col-span-1 glass-ultra border border-white/10 rounded-2xl flex flex-col overflow-hidden"
                        style={{ maxHeight: 500 }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Chat header */}
                        <div className="flex items-center gap-2 p-4 border-b border-white/8">
                            <MessageCircle size={16} className="text-primary" />
                            <span className="font-display font-bold text-white text-sm">Live Chat</span>
                            <div className="flex gap-1 ml-2">
                                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-secondary" />
                                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-secondary" />
                                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-secondary" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollable">
                            {chatMessages.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    className="text-xs"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <span className="font-bold" style={{ color: msg.color }}>{msg.user}: </span>
                                    <span className="text-text-secondary">{msg.message}</span>
                                    <span className="text-white/20 text-[10px] ml-1">{msg.time}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Chat input */}
                        <form onSubmit={handleSendChat} className="p-3 border-t border-white/8 flex gap-2">
                            <input
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                placeholder="Say something..."
                                className="input-field flex-1 text-xs py-2 px-3"
                                maxLength={120}
                            />
                            <motion.button
                                type="submit"
                                className="btn-primary px-3 py-2 text-xs"
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                SEND
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Section divider */}
                <div className="section-divider mt-12" />
            </div>
        </section>
    );
};

export default WatchRoom;
