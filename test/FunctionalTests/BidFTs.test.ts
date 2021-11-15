//@ts-nocheck
import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";

import * as mockServerData from "../mocks/ServerDataMock";
import { ServerData } from "../../src/ServerData"
import { handleRequest } from '../mocks/ReducedRequestHandler';
import * as mockCreateGameAction from "../mocks/CreateGameActionMock"
import * as mockJoinGameAction from "../mocks/JoinGameActionMock"
import * as mockSetIsUserReadyAction from "../mocks/SetIsUserReadyActionMock"
import * as mockBidAction from "../mocks/BidActionMock"
import { Response } from "../../src/utils/Builders/ResponseBuilder/Responses/Response";
import { ErrorMessage } from "../../src/utils/Enums/ErrorMessage";
import { GameStatus } from "../../src/utils/Enums/GameStatus";
import { ResponseChannel } from "../../src/utils/Enums/ResponseChannels";
import { Game } from "../../src/gameData/Game"

_chai.should();

@suite class BidFunctionalTests {

    private realServerData: ServerData = mockServerData.realServerData();
    private createGameAction = mockCreateGameAction.correctAction;
    private joinGameAction1 = mockJoinGameAction.correctAction2;
    private joinGameAction2 = mockJoinGameAction.correctAction3;
    private readyPlayer1Action = mockSetIsUserReadyAction.correctAction1;
    private readyPlayer2Action = mockSetIsUserReadyAction.correctAction2;
    private readyPlayer3Action = mockSetIsUserReadyAction.correctAction3;

    private gameId: string;
    private game: Game;
    private startingPlayer: number;

    private playersId: Array<string> = ["486cae9d-dc1c-4e22-9a76-d0a120442f7d",
        "b378d887-b05a-402a-b758-afe9399587ef",
        "44daca2c-4ea7-48c8-9563-b0f12ce6c6f9"];

    private playersName: Array<string> = ["UserName-1", "UserName-2", "UserName-2"];

    before() {
        // Start a game with one admin and 2 other players
        handleRequest(this.createGameAction, this.realServerData);
        handleRequest(this.joinGameAction1, this.realServerData);
        handleRequest(this.joinGameAction2, this.realServerData);
        this.gameId = Object.keys(this.realServerData.games)[0];
        this.game = this.realServerData.games[this.gameId];
        this.readyPlayer1Action.actionData.gameId = this.gameId;
        this.readyPlayer2Action.actionData.gameId = this.gameId;
        this.readyPlayer3Action.actionData.gameId = this.gameId;
        handleRequest(this.readyPlayer1Action, this.realServerData);
        handleRequest(this.readyPlayer2Action, this.realServerData);
        handleRequest(this.readyPlayer3Action, this.realServerData);
        this.getStartingPlayer();
    }

    private getCorrectAction(diceQ: number, diceVal: number): any {
        let action = mockBidAction.emptyAction;
        action.requester.uuid = this.playersId[this.startingPlayer];
        action.requester.name = this.playersName[this.startingPlayer];
        action.actionData.userId = this.playersId[this.startingPlayer];
        action.actionData.gameId = this.gameId;
        action.actionData.diceValue = diceVal;
        action.actionData.diceQuantity = diceQ;
        this.setNextPlayer();
        return action;
    }

    private getIncorrectAction(diceQ: number, diceVal: number): any {
        let action = this.getCorrectAction(diceQ, diceVal);
        this.setPreviousPlayer();
        return action;
    }

    private getStartingPlayer() {
        this.startingPlayer = this.game.currentPlayer;
    }

    private setNextPlayer() {
        this.startingPlayer++;
        this.startingPlayer = this.startingPlayer % 3;
    }

    private setPreviousPlayer() {
        this.startingPlayer--;
        this.startingPlayer = (this.startingPlayer + 3) % 3;
    }

    @test 'Starting player can bid, then next player does'() {
        _chai.expect( () => {
            let response: Response = handleRequest(this.getCorrectAction(2, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
            _chai.expect(response.data.length).to.be.eq(3);
            _chai.expect(response.data[0].sentData).to.not.be.deep.eq(response.data[1].sentData);
            let knownDice: number = response.data[0].sentData.playersInfo[0].diceNumber || 0 + 
                response.data[0].sentData.playersInfo[1].diceNumber || 0  + 
                response.data[0].sentData.playersInfo[2].diceNumber || 0 ;
            _chai.expect(knownDice).to.be.eq(5);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.getCorrectAction(3, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.getCorrectAction(2, 4), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.getCorrectAction(1, 5), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        }).to.not.throw();
    }



    @test 'Wrong player tries to bid'() {
        _chai.expect( () => {
            this.setNextPlayer();
            let response: Response = handleRequest(this.getCorrectAction(2, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.NOT_TURN);
        }).to.not.throw();
    }



    @test 'Second player bid is incorrect' () {
        handleRequest(this.getCorrectAction(2, 3), this.realServerData)
        // Diminishing the number of dice without incrementing the value
        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(1, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.BID);
        }).to.not.throw();

        // Diminishing the value of the dice
        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(5, 2), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.BID);
        }).to.not.throw();

        // Same bid as before
        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(2, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.BID);
        }).to.not.throw();
    }

    @test 'Incorrect format of the dice values'() {
        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(<float>1.2, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.DICE_NUM_INT);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(1, <float>3.5), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.DICE_VAL_INT);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(0, 3), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.DICE_NUM_1);
        }).to.not.throw();

        _chai.expect( () => {
            let response: Response = handleRequest(this.getIncorrectAction(3, 7), this.realServerData)
            _chai.expect(response.channel).to.be.eq(ResponseChannel.ERROR);
            _chai.expect(response.data.length).to.be.eq(1);
            _chai.expect(response.data[0].sentData).to.be.eq(ErrorMessage.DICE_VAL_1_6);
        }).to.not.throw();
    }
}