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

    private correctAction1 = mockJoinGameAction.correctAction2;
    private correctAction2 = mockJoinGameAction.correctAction3;
    
    private faultyActionMissingId = mockJoinGameAction.faultyAction1;
    private faultyActionMissingUserName = mockJoinGameAction.faultyAction2;
    private faultyActionMissingGameName = mockJoinGameAction.faultyAction3;
    private faultyActionIncorrectPassword = mockJoinGameAction.faultyAction4;
    private faultyActionAlreadyRegistered = mockJoinGameAction.correctAction1;

    private gameId: string;
    private game: Game;

    before() {
        // Create the game by User 1
        handleRequest(this.createGameAction, this.realServerData);
        let gameIds: Array<string> = Object.keys(this.realServerData.games)
        _chai.expect(gameIds.length).to.be.eq(1);
        this.gameId = gameIds[0];
        this.game = this.realServerData.games[this.gameId];
        this.readyPlayer1Action.actionData.gameId = this.gameId;
    }

    @test 'Join game by some other users'() {
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
            handleRequest(this.faultyActionMissingId, this.realServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionMissingUserName, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.USER_NAME);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.faultyActionMissingGameName, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.GAME_NAME);
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
        _chai.expect( () => {
            handleRequest(this.readyPlayer1Action, this.realServerData);
            let response: Response = handleRequest(this.correctAction1, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.GAME_STARTED);
        }).to.not.throw();
    }
}