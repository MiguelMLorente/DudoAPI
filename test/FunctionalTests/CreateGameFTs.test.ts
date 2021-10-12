//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import * as mockServerData from "../mocks/ServerDataMock";
import { ServerData } from "../../src/ServerData"
import { handleRequest } from '../mocks/ReducedRequestHandler';
import * as mockCreateGameAction from "../mocks/CreateGameActionMock"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../src/utils/ErrorMessage";
import { GameStatus } from "../../src/utils/GameStatus";
import { ResponseChannel } from "../../src/utils/ResponseChannels";

_chai.should();

@suite class CreateGameFunctionalTests {
    
    private emptyServerData: ServerData = mockServerData.emptyServerData();
    private realServerData: ServerData = mockServerData.realServerData();

    private correctAction = mockCreateGameAction.correctAction;
    
    private faultyActionMissingId = mockCreateGameAction.faultyAction1;
    private faultyActionMissingUserName = mockCreateGameAction.faultyAction2;
    private faultyActionMissingGameName = mockCreateGameAction.faultyAction3;


    @test 'Create a game by some user, but they are not registered'() {
        // Fail to get response checks
        _chai.expect( () => {
            handleRequest(this.correctAction, this.emptyServerData)
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);

        // Server unchanged checks
        _chai.expect(Object.keys(this.emptyServerData.users).length).to.be.eq(0);
        _chai.expect(Object.keys(this.emptyServerData.games).length).to.be.eq(0);
    }



    @test 'Create a game by some user normally'() {
        // Response checks
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.JOIN_GAME);
            _chai.expect(response.data.length).to.be.eq(1);
        }).to.not.throw();

        // Server side checks
        let gameIds = Object.keys(this.realServerData.games)
        _chai.expect(gameIds.length).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].numberOfPlayers).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].status).to.be.eq(GameStatus.NOT_STARTED);
        _chai.expect(this.realServerData.games[gameIds[0]].gameName).to.be.eq("Game-1");
        _chai.expect(this.realServerData.games[gameIds[0]].gamePassword).to.be.eq("Password-1");
        _chai.expect(this.realServerData.games[gameIds[0]].currentBid).to.be.eq(undefined);
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].Id).to.be.eq("486cae9d-dc1c-4e22-9a76-d0a120442f7d");
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].joinedGame).to.be.eq(gameIds[0]);
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].isAdmin).to.be.ok;
    }

    

    @test 'Create a game twice by the same user should fail the second time'() {
        // Response checks
        handleRequest(this.correctAction, this.realServerData);
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction, this.realServerData);
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.USER_REGISTERED);
        }).to.not.throw();

        // Server side checks, same status as having a single request should be found
        let gameIds = Object.keys(this.realServerData.games)
        _chai.expect(gameIds.length).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].numberOfPlayers).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].status).to.be.eq(GameStatus.NOT_STARTED);
        _chai.expect(this.realServerData.games[gameIds[0]].gameName).to.be.eq("Game-1");
        _chai.expect(this.realServerData.games[gameIds[0]].gamePassword).to.be.eq("Password-1");
        _chai.expect(this.realServerData.games[gameIds[0]].currentBid).to.be.eq(undefined);
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].Id).to.be.eq("486cae9d-dc1c-4e22-9a76-d0a120442f7d");
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].joinedGame).to.be.eq(gameIds[0]);
    }



    @test 'Create a game with missing data: ID, user name & game name' () {
        // Missing ID should throw an error since the user won't be found
        _chai.expect( () => {
            handleRequest(this.faultyActionMissingId, this.realServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);
        // Missing user name or game name won't throw any error, but an error message
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

        _chai.expect(Object.keys(this.realServerData.games).length).to.be.eq(0);
    }
}