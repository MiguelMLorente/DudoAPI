//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import { ServerData } from "../../src/ServerData"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { Game } from "../../src/gameData/Game"

import { ErrorMessage } from "../../src/utils/Enums/ErrorMessage";
import { GameStatus } from "../../src/utils/Enums/GameStatus";
import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";

import { handleRequest } from '../Mocks/MockRequestHandlers/ReducedRequestHandler';

import * as mockServerData from "../Mocks/ServerDataMock";

import * as mockCreateGameAction from "../Mocks/ MockActions/CreateGameActionMock"
import * as mockJoinGameAction from "../Mocks/ MockActions/JoinGameActionMock"
import * as mockSetIsUserReadyAction from "../Mocks/ MockActions/SetIsUserReadyActionMock"

_chai.should();

@suite class SetIsUserReadyFunctionalTests {
    
    private realServerData: ServerData = mockServerData.realServerData();
    private createGameAction = mockCreateGameAction.correctAction;
    private joinGameAction1 = mockJoinGameAction.correctAction2;
    private joinGameAction2 = mockJoinGameAction.correctAction3;

    private correctAction1 = mockSetIsUserReadyAction.correctAction1;
    private correctAction2 = mockSetIsUserReadyAction.correctAction2;
    private correctAction3 = mockSetIsUserReadyAction.correctAction3;
    private correctAction4 = mockSetIsUserReadyAction.correctAction4;

    private faultyActionMissingUserId = mockSetIsUserReadyAction.faultyAction1;
    private faultyActionMissingGameId = mockSetIsUserReadyAction.faultyAction2;
    private faultyActionNotRegistered = mockSetIsUserReadyAction.faultyAction3;
    private faultyActionMissingReady = mockSetIsUserReadyAction.faultyAction4;

    private response: Response | Array<Response>;
    private gameId: string;
    private game: Game;

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
        this.correctAction1.actionData.gameId = this.gameId;
        this.correctAction2.actionData.gameId = this.gameId;
        this.correctAction3.actionData.gameId = this.gameId;
        this.correctAction4.actionData.gameId = this.gameId;
        // Add it also to the faulty ready player actions
        this.faultyActionMissingUserId.actionData.gameId = this.gameId;
        this.faultyActionNotRegistered.actionData.gameId = this.gameId;
        this.faultyActionMissingReady.actionData.gameId = this.gameId;
    }

    private checkGameStarted() {
        _chai.expect(this.game.status).to.be.eq(GameStatus.CURRENT);
        _chai.expect(this.game.numberOfPlayers).to.be.eq(3);
        _chai.expect(this.game.activeRound).to.be.ok;
        _chai.expect(this.game.users[0].isAlive).to.be.ok;
        _chai.expect(this.game.users[0].numberOfDice).to.be.eq(5);
        _chai.expect(this.game.users[0].diceValues.length).to.not.be.eq(0);
        // Check that only one player is active (it's their turn)
        let activePlayerCount: number = 0;
        this.game.users[0].isActive ? activePlayerCount++ : null;
        this.game.users[1].isActive ? activePlayerCount++ : null;
        this.game.users[2].isActive ? activePlayerCount++ : null;
        _chai.expect(activePlayerCount).to.be.eq(1);
    }

    @test 'Ready player 1'() {
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction1, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.game.status).to.be.eq(GameStatus.NOT_STARTED);
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.LOBBY_UPDATE);
        _chai.expect(this.response.data.length).to.be.eq(3);
    }

    @test 'Ready all players leads to starting game'() {
        handleRequest(this.correctAction1, this.realServerData);
        handleRequest(this.correctAction2, this.realServerData);
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction3, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        _chai.expect(this.response.data.length).to.be.eq(3);

        this.checkGameStarted();
    }



    @test 'Unready player 1'() {
        handleRequest(this.correctAction1, this.realServerData)
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction4, this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.LOBBY_UPDATE);
        _chai.expect(this.response.data.length).to.be.eq(3);
        handleRequest(this.correctAction2, this.realServerData);
        handleRequest(this.correctAction3, this.realServerData);
        _chai.expect(this.game.status).to.be.eq(GameStatus.NOT_STARTED);
    }



    @test 'Faulty ready player action, missing user Id'() {
        _chai.expect( () => {
            handleRequest(this.faultyActionMissingUserId, this.realServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);
    }

    @test 'Faulty ready player action, missing game Id'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionMissingGameId, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.GAME_NOT_FOUND);
    }

    @test 'Faulty ready player action, user not registered in this game'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionNotRegistered, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.USER_NOT_REGISTERED);
    }

    @test 'Faulty ready player action, missing ready statement'() {
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionMissingReady, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.READY);
    }

    @test 'Send duplicated ready action gives error'() {
        handleRequest(this.correctAction1, this.realServerData);
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction1, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.READY);
    }

    @test 'Send ready request to an already started game'() {
        handleRequest(this.correctAction1, this.realServerData);
        handleRequest(this.correctAction2, this.realServerData);
        handleRequest(this.correctAction3, this.realServerData);
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction1, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.GAME_STARTED);
    }
}