// ========================
// CORE TYPESCRIPT TYPES
// ========================

export type TournamentMode = 'SOLO' | 'DUO' | 'SQUAD';
export type TournamentMap = 'Bermuda' | 'Kalahari' | 'Purgatory' | 'Alpine';
export type TournamentStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
export type TournamentType = 'TOURNAMENT' | 'EVENT';
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'FAMPAY' | 'GIFT_CARD' | 'REDEEM_CODE' | 'WALLET' | 'FREE';
export type RedeemCodeType = 'PERCENTAGE' | 'FIXED' | 'FREE_ENTRY';

export interface PrizeDistribution {
    rank: number;
    prize: string;
}

export interface Tournament {
    id: string;
    title: string;
    game: 'FREE_FIRE';
    mode: TournamentMode;
    map: TournamentMap;
    entryFee: number;
    prizePool: number;
    prizeDistribution: PrizeDistribution[];
    maxSlots: number;
    filledSlots: number;
    registeredPlayers: string[];
    startDateTime: string;
    registrationDeadline: string;
    status: TournamentStatus;
    rules: string[];
    roomIdReleaseTime: string;
    roomId?: string;
    roomPassword?: string;
    banner: string;
    isFeatured: boolean;
    createdBy: 'ADMIN';
    createdAt: string;
    updatedAt: string;
    type: TournamentType;
    eventDetails?: {
        description: string;
        specialRules: string[];
    };
}

export interface Registration {
    id: string;
    userId: string;
    userDisplayName: string;
    userEmail: string;
    freefireId: string;
    freefireName: string;
    tournamentId: string;
    tournamentTitle: string;
    teamName?: string;
    teammates?: string[];
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    paymentOrderId: string;
    registeredAt: string;
    slotNumber: number;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    freefireId: string | null;
    freefireName: string | null;
    joinedAt: string;
    tournaments: string[];
    totalSpent: number;
    redeemCodes: string[];
    giftCards: string[];
    wallet: number;
    isBanned?: boolean;
}

export interface GiftCard {
    code: string;
    value: number;
    isUsed: boolean;
    usedBy: string | null;
    usedAt: string | null;
    createdAt: string;
    expiresAt: string;
}

export interface RedeemCode {
    code: string;
    type: RedeemCodeType;
    value: number;
    maxUses: number;
    currentUses: number;
    validTournaments: string[] | 'ALL';
    expiresAt: string;
    isActive: boolean;
}

export interface PaymentTransaction {
    id: string;
    userId: string;
    userName: string;
    tournamentId: string;
    tournamentTitle: string;
    amount: number;
    method: PaymentMethod;
    orderId: string;
    status: PaymentStatus;
    createdAt: string;
}

export interface AdminStats {
    totalUsers: number;
    totalRevenue: number;
    monthRevenue: number;
    weekRevenue: number;
    activeTournaments: number;
    totalRegistrations: number;
}

export interface Notification {
    id: string;
    title: string;
    body: string;
    sentAt: string;
    sentTo: 'ALL' | string;
    tournamentId?: string;
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

export type RegistrationStep = 'WARNING' | 'TEAM_DETAILS' | 'PAYMENT' | 'CONFIRMING' | 'SUCCESS';
