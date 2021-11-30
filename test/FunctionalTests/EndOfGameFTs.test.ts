//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import { ServerData } from "../../src/ServerData";
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { Game } from "../../src/gameData/Game";

import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";

import { handleRequest } from '../Mocks/MockRequestHandlers/ReducedRequestHandler';
import { handleExtendedRequest } from "../Mocks/MockRequestHandlers/ExtendedRequestHandler";

import * as mockServerData from "../Mocks/ServerDataMock";

import * as mockCreateGameAction from "../Mocks/ MockActions/CreateGameActionMock"
import * as mockJoinGameAction from "../Mocks/ MockActions/JoinGameActionMock"
import * as mockSetIsUserReadyAction from "../Mocks/ MockActions/SetIsUserReadyActionMock"
import * as mockBidAction from "../Mocks/ MockActions/BidActionMock"
import * as mockCallAction from "../Mocks/ MockActions/CallActionMock"
import * as mockSelectOptionAction from "../Mocks/ MockActions/SelectOptionActionMock"

_chai.should();

@suite class EndOfGameFunctionalTests {
    private serverData: ServerData = mockServerData.realServerData();

    private response: Response | Array<Response>;
    private gameId: string;
    private gameShortId: string;
    private game: Game;

    private usersId: Array<string> = ["486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "b378d887-b05a-402a-b758-afe9399587ef",
        "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9",
        "25654461-043c-4697-90bd-d775ed1a4e35"];

    private userNames: Array<string> = ["UserName-1", "UserName-2", "UserName-3", "UserName-4"];

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

    private getPlayerBidAction(n: number, diceQ: number, diceVal: number): any {
        let action = mockBidAction.emptyAction;
        action.requester.uuid = this.usersId[n];
        action.actionData.gameId = this.gameId;
        action.actionData.diceValue = diceVal;
        action.actionData.diceQuantity = diceQ;
        return action;
    }

    private getPlayerCallAction(n: number): any {
        let action = mockCallAction.emptyAction;
        action.requester.uuid = this.usersId[n];
        action.actionData.gameId = this.gameId;
        return action;
    }

    private playerSelectsOption(n: number, option: string): any {
        let action = mockSelectOptionAction.correctAction;
        action.requester.uuid = this.usersId[n];
        action.actionData.gameId = this.gameId;
        action.actionData.selectedOption = option;
        return handleRequest(action, this.serverData);
    }

    private playerLoses5Times(n: number): any {
        for (let i=0; i<4; i++){
            handleRequest(this.getPlayerBidAction(n,21,1), this.serverData);
            handleExtendedRequest(this.getPlayerCallAction(n+1), this.serverData);
        }
        this.playerSelectsOption(n,"blind");
        handleRequest(this.getPlayerBidAction(n,21,1), this.serverData);
        return handleExtendedRequest(this.getPlayerCallAction(n+1), this.serverData);
    }

    @test 'All players are eliminated'() {
        this.createAndStartGame();
        this.playerLoses5Times(0);
        this.playerLoses5Times(1);
        _chai.expect( () => {
            this.response = this.playerLoses5Times(2);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.END_GAME);
        _chai.expect(this.response.data[0].sentData.winner).to.be.eq(this.userNames[3]);
    }
}