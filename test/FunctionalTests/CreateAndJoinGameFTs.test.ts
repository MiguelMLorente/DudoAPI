//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import * as mockServerData from "../mocks/ServerDataMock";
import { ServerData } from "../../src/ServerData"
import { handleRequest } from '../mocks/ReducedRequestHandler';
import * as mockCreateGameAction from "../mocks/CreateGameActionMock"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";

_chai.should();

@suite class CreateAndJoinGameFunctionalTests {
    
    private emptyServerData: ServerData = mockServerData.emptyServerData();
    private realServerData: ServerData = mockServerData.realServerData();
    private correctAction = mockCreateGameAction.correctAction;



    @test 'Create a game by some user, but they are not registered'() {
        // Fail to get response checks
        _chai.expect( () => {
            handleRequest(this.correctAction, this.emptyServerData)
        }).to.throw(Error, "User not found in database");

        // Server unchanged checks
        _chai.expect(Object.keys(this.emptyServerData.users).length).to.be.eq(0);
        _chai.expect(Object.keys(this.emptyServerData.games).length).to.be.eq(0);
    }



    @test 'Create a game by some user normally'() {
        // Response checks
        _chai.expect( () => {
            let response: Response= handleRequest(this.correctAction, this.realServerData);
            _chai.expect(response.channel).to.be.eq('joined-game');
            _chai.expect(response.data.length).to.be.eq(1);
        }).to.not.throw();

        // Server side checks
        let gameIds = Object.keys(this.realServerData.games)
        _chai.expect(gameIds.length).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].numberOfPlayers).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].status).to.be.eq("not started");
        _chai.expect(this.realServerData.games[gameIds[0]].gameName).to.be.eq("Game-1");
        _chai.expect(this.realServerData.games[gameIds[0]].gamePassword).to.be.eq("Password-1");
        _chai.expect(this.realServerData.games[gameIds[0]].currentBid).to.be.eq(undefined);
        _chai.expect(this.realServerData.games[gameIds[0]].playerList[0].Id).to.be.eq("486cae9d-dc1c-4e22-9a76-d0a120442f7d");
        _chai.expect(this.realServerData.games[gameIds[0]].playerList[0].joinedGame).to.be.eq(gameIds[0]);
    }

    

    @test 'Create a game twice by the same user should fail the second time'() {
        // Response checks
        handleRequest(this.correctAction, this.realServerData);
        _chai.expect( () => {
            let response: Response = handleRequest(this.correctAction, this.realServerData);
            _chai.expect(response.channel).to.be.eq('error');
            _chai.expect(response.data[0].sentData).to.be.eq("User already registered in a different game");
        }).to.not.throw();

        // Server side checks, same status as having a single request should be found
        let gameIds = Object.keys(this.realServerData.games)
        _chai.expect(gameIds.length).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].numberOfPlayers).to.be.eq(1);
        _chai.expect(this.realServerData.games[gameIds[0]].status).to.be.eq("not started");
        _chai.expect(this.realServerData.games[gameIds[0]].gameName).to.be.eq("Game-1");
        _chai.expect(this.realServerData.games[gameIds[0]].gamePassword).to.be.eq("Password-1");
        _chai.expect(this.realServerData.games[gameIds[0]].currentBid).to.be.eq(undefined);
        _chai.expect(this.realServerData.games[gameIds[0]].playerList[0].Id).to.be.eq("486cae9d-dc1c-4e22-9a76-d0a120442f7d");
        _chai.expect(this.realServerData.games[gameIds[0]].playerList[0].joinedGame).to.be.eq(gameIds[0]);
    }
}