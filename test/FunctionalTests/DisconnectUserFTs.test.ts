//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import { ServerData } from "../../src/ServerData";
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { Game } from "../../src/gameData/Game";

import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";

import { handleDisconnect } from "../Mocks/MockRequestHandlers/ReducedDisconnectHandler";
import { handleRequest } from '../Mocks/MockRequestHandlers/ReducedRequestHandler';

import * as mockServerData from "../Mocks/ServerDataMock";

import * as mockCreateGameAction from "../Mocks/ MockActions/CreateGameActionMock"
import * as mockJoinGameAction from "../Mocks/ MockActions/JoinGameActionMock"
import * as mockSetIsUserReadyAction from "../Mocks/ MockActions/SetIsUserReadyActionMock"

_chai.should();

@suite class DisconnectUserFunctionalTests {
    private serverData: ServerData = mockServerData.realServerData();

    private response: Response | Array<Response>;
    private gameId: string;
    private gameShortId: string;
    private game: Game;
    private startingPlayer: number;

    private usersId: Array<string> = ["486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "b378d887-b05a-402a-b758-afe9399587ef",
        "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9",
        "25654461-043c-4697-90bd-d775ed1a4e35"];

    private userNames: Array<string> = ["UserName-1", "UserName-2", "UserName-3", "UserName-4"];

    private disconnectUser(n: number): Response | Array<Response> {
        let socketsId: Array<string> = ["SocketId-1", "SocketId-2", "SocketId-3", "SocketId-4"];
        return handleDisconnect(socketsId[n], this.serverData);
    }

    private disconnectAllUsers(): Response | Array<Response> {
        this.disconnectUser(0);
        this.disconnectUser(1);
        this.disconnectUser(2);
        return this.disconnectUser(3);
    }

    private createGame(): void {
        let response = handleRequest(mockCreateGameAction.correctAction, this.serverData);
        this.gameId = response.data[0].sentData.gameId;
        this.gameShortId = response.data[0].sentData.gameShortId;
        this.game = this.serverData.games[this.gameId];
    }

    private joinPlayer(n: number): void {
        let joinGameAction = mockJoinGameAction.emptyAction;
        joinGameAction.requester.uuid = this.usersId[n];
        joinGameAction.requester.name = this.userNames[n];
        joinGameAction.actionData.gameShortId = this.gameShortId;
        handleRequest(joinGameAction, this.serverData);
    }

    private joinAllPlayers(): void {
        this.joinPlayer(1);
        this.joinPlayer(2);
        this.joinPlayer(3);
    }

    private readyPlayer(n: number): void {
        let readyPlayerAction = mockSetIsUserReadyAction.emptyAction;
        readyPlayerAction.requester.uuid = this.usersId[n];
        readyPlayerAction.actionData.gameId = this.gameId;
        handleRequest(readyPlayerAction, this.serverData);
    }

    private readyAllPlayers(): void {
        this.readyPlayer(0);
        this.readyPlayer(1);
        this.readyPlayer(2);
        this.readyPlayer(3);
    }

    private createAndStartGame(): void {
        this.createGame();
        this.joinAllPlayers();
        this.readyAllPlayers();
        this.game.currentPlayer = 0;
        this.game.users[0].isActive = true;
        this.game.users[1].isActive = false;
        this.game.users[2].isActive = false;
        this.game.users[3].isActive = false;
    }

    private checkUserRemoved(n: number): void {
        _chai.expect(this.serverData.users[this.usersId[n]]).to.be.eq(undefined);
    }

    private checkGameRemoved(): void {
        _chai.expect(this.serverData.games[this.gameId]).to.be.eq(undefined);
    }

    private checkGameNotRemoved(): void {
        _chai.expect(this.serverData.games[this.gameId]).to.not.be.eq(undefined);
    }

    @test 'User joins server and then disconnects'() {
        _chai.expect( () => {
            this.response = this.disconnectUser(0);
        }).to.not.throw();
        _chai.expect(this.response).to.be.eq(undefined);
        this.checkUserRemoved(0);
    }

    @test 'User starts a game and then disconnects'() {
        this.createGame();
        _chai.expect( () => {
            this.response = this.disconnectUser(0);
        }).to.not.throw();
        _chai.expect(this.response).to.be.eq(undefined);
        this.checkUserRemoved(0);
        this.checkGameRemoved();
    }

    @test 'One user joins and then leaves'() {
        this.createGame();
        this.readyPlayer(0);
        this.joinPlayer(1);
        _chai.expect( () => {
            this.response = this.disconnectUser(1);
        }).to.not.throw();
        this.checkUserRemoved(1);
        this.checkGameNotRemoved();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.LOBBY_UPDATE);
        _chai.expect(this.game.numberOfPlayers).to.be.eq(1);
    }

    @test 'Some player leaves the lobby and game starts'() {
        this.createGame();
        this.joinAllPlayers();
        this.readyPlayer(0);
        this.readyPlayer(1);
        this.readyPlayer(2);
        _chai.expect( () => {
            this.response = this.disconnectUser(3);
        }).to.not.throw();
        this.checkUserRemoved(3);
        this.checkGameNotRemoved();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        _chai.expect(this.game.numberOfPlayers).to.be.eq(3);
    }

    @test 'Admin leaves the lobby, the first joiner is promoted'() {
        this.createGame();
        this.joinAllPlayers();
        _chai.expect( () => {
            this.response = this.disconnectUser(0);
        }).to.not.throw();
        this.checkUserRemoved(0);
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.LOBBY_UPDATE);
        _chai.expect(this.serverData.users[this.usersId[1]].isAdmin).to.be.eq(true);
    }

    @test 'Some player leaves the game out of their turn'() {
        this.createAndStartGame();
        _chai.expect( () => {
            this.response = this.disconnectUser(1);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        _chai.expect(this.game.users[1].isAlive).to.be.eq(false);
        _chai.expect(this.game.users[1].diceValues.length).to.be.eq(0);
        _chai.expect(this.game.users[0].numberOfDice).to.be.eq(5);
        _chai.expect(this.game.users[2].numberOfDice).to.be.eq(5);
        _chai.expect(this.game.users[3].numberOfDice).to.be.eq(5);
    }

    @test 'Some player leaves the game in their turn'() {
        this.createAndStartGame()
        _chai.expect( () => {
            this.response = this.disconnectUser(0);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        _chai.expect(this.game.users[0].isAlive).to.be.eq(false);
        _chai.expect(this.game.currentPlayer).to.be.eq(1);
        _chai.expect(this.game.users[0].diceValues.length).to.be.eq(0);
        _chai.expect(this.game.users[1].numberOfDice).to.be.eq(5);
        _chai.expect(this.game.users[2].numberOfDice).to.be.eq(5);
        _chai.expect(this.game.users[3].numberOfDice).to.be.eq(5);
    }

    @test 'Three players leave the game and it ends'() {
        this.createAndStartGame();
        this.disconnectUser(1);
        this.disconnectUser(2);
        _chai.expect( () => {
            this.response = this.disconnectUser(3);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.END_GAME);
        _chai.expect(this.response.data[0].sentData.winner).to.be.eq(this.userNames[0]);
    }

    @test 'The game is ended and all players disconnect'() {
        this.createAndStartGame();
        _chai.expect( () => {
            this.response = this.disconnectAllUsers();
        }).to.not.throw();
        this.checkGameRemoved();
        _chai.expect(this.response).to.be.eq(undefined);
    }
}