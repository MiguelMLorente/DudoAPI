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

@suite class JoinGameFunctionalTests {
    
    private realServerData: ServerData = mockServerData.realServerData();
    private createGameAction = mockCreateGameAction.correctAction;
    private readyPlayer1Action = mockSetIsUserReadyAction.correctAction1;
    private readyPlayer2Action = mockSetIsUserReadyAction.correctAction2;

    private correctAction1 = mockJoinGameAction.correctAction2;
    private correctAction2 = mockJoinGameAction.correctAction3;
    
    private faultyActionMissingUserId = mockJoinGameAction.faultyAction1;
    private faultyActionMissingUserName = mockJoinGameAction.faultyAction2;
    private faultyActionMissingGameShortId = mockJoinGameAction.faultyAction3;
    private faultyActionIncorrectPassword = mockJoinGameAction.faultyAction4;
    private faultyActionAlreadyRegistered = mockJoinGameAction.correctAction1;

    private gameId: string;
    private gameShortId: string;
    private game: Game;

    before() {
        // Create the game by User 1 and get the shortId
        let response = handleRequest(this.createGameAction, this.realServerData);
        this.gameShortId = response.data[0].sentData.gameShortId;
        this.gameId = response.data[0].sentData.gameId;
        this.game = this.realServerData.games[this.gameId];
        // Set the game short Id for all mocked join game actions
        this.correctAction1.actionData.gameShortId = this.gameShortId;
        this.correctAction2.actionData.gameShortId = this.gameShortId;
        // Also do it for all the faulty actions excepting missing short ID
        this.faultyActionMissingUserId.actionData.gameShortId = this.gameShortId;
        this.faultyActionMissingUserName.actionData.gameShortId = this.gameShortId;
        this.faultyActionIncorrectPassword.actionData.gameShortId = this.gameShortId;
        this.faultyActionAlreadyRegistered.actionData.gameShortId = this.gameShortId;
        // Include the long game Id for the ready player actions
        this.readyPlayer1Action.actionData.gameId = this.gameId;
        this.readyPlayer2Action.actionData.gameId = this.gameId;
    }

    @test 'Join game by some users'() {
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction1, this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.JOIN_GAME);
            _chai.expect(response.data[0].sentData.gameId).to.be.eq(this.gameId);
            _chai.expect(response.data[0].sentData.playerList.length).to.be.eq(2);
        }).to.not.throw();
        _chai.expect(this.game.numberOfPlayers).to.be.eq(2);

        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction2, this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.JOIN_GAME);
            _chai.expect(response.data[0].sentData.gameId).to.be.eq(this.gameId);
            _chai.expect(response.data[0].sentData.playerList.length).to.be.eq(3);
        }).to.not.throw();
        _chai.expect(this.game.numberOfPlayers).to.be.eq(3);
        _chai.expect(this.game.users[0].Id).to.be.eq("486cae9d-dc1c-4e22-9a76-d0a120442f7d");
        _chai.expect(this.game.users[1].Id).to.be.eq("b378d887-b05a-402a-b758-afe9399587ef");
        _chai.expect(this.game.users[2].Id).to.be.eq("44daca2c-4ea7-48c8-9563-b0f12ce6c6f9");
        _chai.expect(this.game.users[0].joinedGame).to.be.eq(this.gameId);
        _chai.expect(this.game.users[1].joinedGame).to.be.eq(this.gameId);
        _chai.expect(this.game.users[2].joinedGame).to.be.eq(this.gameId);
        _chai.expect(this.game.status).to.be.eq(GameStatus.NOT_STARTED);
    }



    @test 'Join game with missing data'() {
        _chai.expect( () => {
            handleRequest(this.faultyActionMissingUserId, this.realServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionMissingUserName, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.USER_NAME);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionMissingGameShortId, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.GAME_SHORT_ID);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionIncorrectPassword, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.PASSWORD);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionAlreadyRegistered, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.USER_REGISTERED);
        }).to.not.throw();
    }



    @test 'Try to join an already started game leads to failure'() {
        handleRequest(this.correctAction1, this.realServerData);
        handleRequest(this.readyPlayer1Action, this.realServerData);
        handleRequest(this.readyPlayer2Action, this.realServerData);
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction2, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.GAME_STARTED);
        }).to.not.throw();
    }
}