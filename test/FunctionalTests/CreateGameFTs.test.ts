//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import * as mockServerData from "../Mocks/ServerDataMock";
import { ServerData } from "../../src/ServerData"
import { handleRequest } from '../Mocks/MockRequestHandlers/ReducedRequestHandler';
import * as mockCreateGameAction from "../Mocks/ MockActions/CreateGameActionMock"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../src/utils/Enums/ErrorMessage";
import { GameStatus } from "../../src/utils/Enums/GameStatus";
import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";

_chai.should();

@suite class CreateGameFunctionalTests {
    
    private response: Response | Array<Response>;
    private emptyServerData: ServerData = mockServerData.emptyServerData();
    private realServerData: ServerData = mockServerData.realServerData();

    private correctAction = mockCreateGameAction.correctAction;
    
    private faultyActionMissingId = mockCreateGameAction.faultyAction1;
    private faultyActionMissingUserName = mockCreateGameAction.faultyAction2;

    private checkGameCreatedCorrectly() {
        let gameIds = Object.keys(this.realServerData.games);
        _chai.expect(gameIds.length).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].numberOfPlayers).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].status).to.be.eq(GameStatus.NOT_STARTED);
        _chai.expect(this.realServerData.games[gameIds[0]].gamePassword).to.be.eq("Password-1");
        _chai.expect(this.realServerData.games[gameIds[0]].currentBid).to.be.eq(undefined);
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].Id).to.be.eq("486cae9d-dc1c-4e22-9a76-d0a120442f7d");
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].joinedGame).to.be.eq(gameIds[0]);
        _chai.expect(this.realServerData.games[gameIds[0]].users[0].isAdmin).to.be.ok;
    }

    @test 'Create a game by some user, but they are not registered'() {
        // Fail to get responsw
        _chai.expect( () => {
            handleRequest(this.correctAction, this.emptyServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);

        // Server unchanged checks
        _chai.expect(Object.keys(this.emptyServerData.users).length).to.be.eq(0);
        _chai.expect(Object.keys(this.emptyServerData.games).length).to.be.eq(0);
    }

    @test 'Create a game by some user normally'() {
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.JOIN_GAME);
        _chai.expect(this.response.data.length).to.be.eq(1);

        // Server side checks, check that there is one player inside one game with the appropriate props
        this.checkGameCreatedCorrectly();
    }

    @test 'Create a game twice by the same user should fail the second time'() {
        // Create a game initially
        handleRequest(this.correctAction, this.realServerData);
        _chai.expect( () => {
            this.response = handleRequest(this.correctAction, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.USER_REGISTERED);

        // Server side checks, same status as having a single request should be found
        this.checkGameCreatedCorrectly();
    }

    @test 'Faulty create game action, missing user Id' () {
        // Missing ID should throw an error since the user won't be found
        _chai.expect( () => {
            handleRequest(this.faultyActionMissingId, this.realServerData);
        }).to.throw(Error, ErrorMessage.USER_NOT_FOUND);
    }

    @test 'Faulty create game action, missing userName'() {
        // Missing user name will return an error message to the client
        _chai.expect( () => {
            this.response = handleRequest(this.faultyActionMissingUserName, this.realServerData);
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.USER_NAME);

        _chai.expect(Object.keys(this.realServerData.games).length).to.be.eq(0);
    }
}