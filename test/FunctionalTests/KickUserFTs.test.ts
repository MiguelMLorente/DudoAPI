//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import { ServerData } from "../../src/ServerData"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { Game } from "../../src/gameData/Game"

import { ErrorMessage } from "../../src/utils/Enums/ErrorMessage";
import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";

import { handleRequest } from '../Mocks/MockRequestHandlers/ReducedRequestHandler';

import * as mockServerData from "../Mocks/ServerDataMock";

import * as mockCreateGameAction from "../Mocks/ MockActions/CreateGameActionMock"
import * as mockJoinGameAction from "../Mocks/ MockActions/JoinGameActionMock"
import * as mockSetIsUserReadyAction from "../Mocks/ MockActions/SetIsUserReadyActionMock"
import * as mockKickUserAction from "../Mocks/ MockActions/KickUserActionMock"

_chai.should();

@suite class KickUserFunctionalTests {

    private realServerData: ServerData = mockServerData.realServerData();
    private createGameAction = mockCreateGameAction.correctAction;
    private joinGameAction1 = mockJoinGameAction.correctAction2;
    private joinGameAction2 = mockJoinGameAction.correctAction3;
    private readyPlayer1Action = mockSetIsUserReadyAction.correctAction1;
    private readyPlayer2Action = mockSetIsUserReadyAction.correctAction2;
    private readyPlayer3Action = mockSetIsUserReadyAction.correctAction3;

    private kickPlayer2Action = mockKickUserAction.correctAction;
    private faultyActionNotAdmin = mockKickUserAction.faultyAction1;
    private faultyActionKickHimself = mockKickUserAction.faultyAction2;
    private faultyActionMissingUserId = mockKickUserAction.faultyAction3;
    private faultyActionMissingGameId = mockKickUserAction.faultyAction4;
    private faultyActionUnregistered = mockKickUserAction.faultyAction5;
    private faultyActionUserNotFound = mockKickUserAction.faultyAction6;

    private response: Response | Array<Response>;
    private gameId: string;
    private gameShortId: string;
    private game: Game;
    private startingPlayer: number;

    private playersId: Array<string> = ["486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "b378d887-b05a-402a-b758-afe9399587ef",
        "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9"];

    private playersName: Array<string> = ["UserName-1", "UserName-2", "UserName-2"];

    before() {
        // Start a game and get the game data from the response
        this.response = handleRequest(this.createGameAction, this.realServerData);
        this.gameShortId = this.response.data[0].sentData.gameShortId;
        this.gameId = this.response.data[0].sentData.gameId;
        this.game = this.realServerData.games[this.gameId];
        // Add the short Id to the join game actions and make the requests to join
        this.joinGameAction1.actionData.gameShortId = this.gameShortId;
        this.joinGameAction2.actionData.gameShortId = this.gameShortId;
        handleRequest(this.joinGameAction1, this.realServerData);
        handleRequest(this.joinGameAction2, this.realServerData);
        // Add the game Id to the ready player actions
        this.readyPlayer1Action.actionData.gameId = this.gameId;
        this.readyPlayer2Action.actionData.gameId = this.gameId;
        this.readyPlayer3Action.actionData.gameId = this.gameId;
        // Add the game Id to the kick player actions
        this.kickPlayer2Action.actionData.gameId = this.gameId;
        this.faultyActionNotAdmin.actionData.gameId = this.gameId;
        this.faultyActionKickHimself.actionData.gameId = this.gameId;
        this.faultyActionMissingUserId.actionData.gameId = this.gameId;
        this.faultyActionUnregistered.actionData.gameId = this.gameId;
        this.faultyActionUserNotFound.actionData.gameId = this.gameId;
    }

    @test 'Admin player can kick, continue in lobby'() {
        _chai.expect( () => {
            this.response = handleRequest(this.kickPlayer2Action, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response[0].channel).to.be.eq(ResponseChannel.KICKED_PLAYER);
        _chai.expect(this.response[1].channel).to.be.eq(ResponseChannel.LOBBY_UPDATE)
        _chai.expect(this.response[1].data.length).to.be.eq(2);
    }

    @test 'Admin player can kick, game starts after kick'() {
        handleRequest(this.readyPlayer1Action, this.realServerData);
        handleRequest(this.readyPlayer3Action, this.realServerData);
        _chai.expect( () => {
            this.response = handleRequest(this.kickPlayer2Action, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response[0].channel).to.be.eq(ResponseChannel.KICKED_PLAYER);
        _chai.expect(this.response[1].channel).to.be.eq(ResponseChannel.GAME_STATUS)
        _chai.expect(this.response[1].data.length).to.be.eq(2);
    }

    @test 'Not admin player cannot kick'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionNotAdmin, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.NOT_ADMIN);
    }


    @test 'Admin cannot kick himself'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionKickHimself, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.KICK_YOURSELF);
    }

    @test 'Faulty kick action, missing user Id'() {
        _chai.expect( () => {
            handleRequest(this.faultyActionMissingUserId, this.realServerData)
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);
    }

    @test 'Faulty kick action, missing game Id'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionMissingGameId, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.GAME_NOT_FOUND);
    }

    @test 'Faulty kick action, user not registered in this game'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionUnregistered, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.USER_NOT_REGISTERED);
    }

    @test 'Admin tries to kick a player outside the lobby'() {
        handleRequest(this.readyPlayer1Action, this.realServerData);
        handleRequest(this.readyPlayer2Action, this.realServerData);
        handleRequest(this.readyPlayer3Action, this.realServerData);
        _chai.expect( () => {
            this.response = handleRequest(this.kickPlayer2Action, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.GAME_STARTED);
    }

    @test 'Faulty action, kicked user does not exist in this game'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionUserNotFound, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.USER_NOT_FOUND);
    }

}