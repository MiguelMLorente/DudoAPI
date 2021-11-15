export enum ResponseChannel {
    JOIN_GAME = 'joined-game',
    END_ROUND = 'end-of-round',
    END_GAME = 'end-of-game',
    ERROR = 'error',
    INTERNAL_ERROR = 'internal-error',
    GAME_STATUS = 'game-status',
    MESSAGE = 'message',
    LOBBY_UPDATE = 'lobby-update',
    KICKED_PLAYER = 'kicked-player'
}