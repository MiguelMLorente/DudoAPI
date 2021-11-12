export class LobbyInfo {
    playerName: String;
    isReady: boolean;

    constructor(name: String, ready: boolean) {
        this.playerName = name;
        this.isReady = ready;
    }
}