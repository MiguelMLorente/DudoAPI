//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import * as mockServerData from "../mocks/ServerDataMock";
import { ServerData } from "../../src/ServerData"
import { handleRequest } from '../mocks/ReducedRequestHandler';
import * as mockCreateGameAction from "../mocks/CreateGameActionMock"
import * as mockJoinGameAction from "../mocks/JoinGameActionMock"
import * as mockSetIsUserReadyAction from "../mocks/SetIsUserReadyActionMock"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../src/utils/Enums/ErrorMessage";
import { GameStatus } from "../../src/utils/Enums/GameStatus";
import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";
import { Game } from "../../src/gameData/Game"

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

    private faultyActionMissingId = mockSetIsUserReadyAction.faultyAction1;
    private faultyActionMissingGameId = mockSetIsUserReadyAction.faultyAction2;
    private faultyActionNotRegistered = mockSetIsUserReadyAction.faultyAction3;
    private faultyActionMissingReady = mockSetIsUserReadyAction.faultyAction4;

    private gameId: string;
    private game: Game;

    before() {
        // Create the game by User 1 and join with users 2 & 3
        handleRequest(this.createGameAction, this.realServerData);
        handleRequest(this.joinGameAction1, this.realServerData);
        handleRequest(this.joinGameAction2, this.realServerData);
        this.gameId = Object.keys(this.realServerData.games)[0];
        this.game = this.realServerData.games[this.gameId];
        // Set game ID for the start game actions
        this.correctAction1.actionData.gameId = this.gameId;
        this.correctAction2.actionData.gameId = this.gameId;
        this.correctAction3.actionData.gameId = this.gameId;
        this.correctAction4.actionData.gameId = this.gameId;

        this.faultyActionMissingId.actionData.gameId = this.gameId;
        this.faultyActionNotRegistered.actionData.gameId = this.gameId;
        this.faultyActionMissingReady.actionData.gameId = this.gameId;
        _chai.expect(this.game.users[0].diceValues.length).to.be.eq(0);
    }

    @test 'Ready player 1'() {
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction1, this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.LOBBY_UPDATE);
            _chai.expect(response.data.length).to.be.eq(3);
        }).to.not.throw();
        _chai.expect(this.game.status).to.be.eq(GameStatus.NOT_STARTED);
    }



    @test 'Ready all players leads to starting game'() {
        handleRequest(this.correctAction1, this.realServerData);
        handleRequest(this.correctAction2, this.realServerData);
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction3, this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
            _chai.expect(response.data.length).to.be.eq(3);
        }).to.not.throw();
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



    @test 'Unready player 1'() {
        handleRequest(this.correctAction1, this.realServerData)
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction4, this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.LOBBY_UPDATE);
            _chai.expect(response.data.length).to.be.eq(3);
        }).to.not.throw();
        handleRequest(this.correctAction2, this.realServerData);
        handleRequest(this.correctAction3, this.realServerData);
        _chai.expect(this.game.status).to.be.eq(GameStatus.NOT_STARTED);
    }



    @test 'Ready player with faulty data'() {
        _chai.expect( () => {
            handleRequest(this.faultyActionMissingId, this.realServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionMissingGameId, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.GAME_NOT_FOUND);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionNotRegistered, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.USER_NOT_REGISTERED);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionMissingReady, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.READY);
        }).to.not.throw();
    }



    @test 'Send duplicated ready action gives error'() {
        handleRequest(this.correctAction1, this.realServerData);
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction1, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.READY);
        }).to.not.throw();
    }



    @test 'Send ready request to an already started game'() {
        handleRequest(this.correctAction1, this.realServerData);
        handleRequest(this.correctAction2, this.realServerData);
        handleRequest(this.correctAction3, this.realServerData);
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction1, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.GAME_STARTED);
        }).to.not.throw();
    }
}