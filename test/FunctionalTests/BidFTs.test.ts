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
import * as mockBidAction from "../Mocks/ MockActions/BidActionMock"

_chai.should();

@suite class BidFunctionalTests {

    private realServerData: ServerData = mockServerData.realServerData();
    private createGameAction = mockCreateGameAction.correctAction;
    private joinGameAction1 = mockJoinGameAction.correctAction2;
    private joinGameAction2 = mockJoinGameAction.correctAction3;
    private readyPlayer1Action = mockSetIsUserReadyAction.correctAction1;
    private readyPlayer2Action = mockSetIsUserReadyAction.correctAction2;
    private readyPlayer3Action = mockSetIsUserReadyAction.correctAction3;

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
        // Add the game Id to the ready player actions and handle them;
        this.readyPlayer1Action.actionData.gameId = this.gameId;
        this.readyPlayer2Action.actionData.gameId = this.gameId;
        this.readyPlayer3Action.actionData.gameId = this.gameId;
        handleRequest(this.readyPlayer1Action, this.realServerData);
        handleRequest(this.readyPlayer2Action, this.realServerData);
        handleRequest(this.readyPlayer3Action, this.realServerData);
        // Find the starting player
        this.getStartingPlayer();
    }

    private getCorrectAction(diceQ: number, diceVal: number): any {
        let action = mockBidAction.emptyAction;
        action.requester.uuid = this.playersId[this.startingPlayer];
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

    @test 'Normal bid round'() {
        _chai.expect( () => {
            this.response = handleRequest(this.getCorrectAction(2, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
        _chai.expect(this.response.data.length).to.be.eq(3);
        _chai.expect(this.response.data[0].sentData).to.not.be.deep.eq(this.response.data[1].sentData);
        let knownDice: number = this.response.data[0].sentData.playersInfo[0].diceNumber || 0 + 
            this.response.data[0].sentData.playersInfo[1].diceNumber || 0  + 
            this.response.data[0].sentData.playersInfo[2].diceNumber || 0 ;
        _chai.expect(knownDice).to.be.eq(5);

        _chai.expect( () => {
            this.response = handleRequest(this.getCorrectAction(3, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);

        _chai.expect( () => {
            this.response = handleRequest(this.getCorrectAction(2, 4), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);

        _chai.expect( () => {
            this.response = handleRequest(this.getCorrectAction(1, 5), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.GAME_STATUS);
    }

    @test 'Wrong player tries to bid'() {
        _chai.expect( () => {
            this.setNextPlayer();
            this.response = handleRequest(this.getCorrectAction(2, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.NOT_TURN);
    }

    @test 'Second player bid is incorrect, diminishing the number of dice without incrementing the value' () {
        handleRequest(this.getCorrectAction(2, 3), this.realServerData)
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(1, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.BID);
    }

    @test 'Second player bid is incorrect, diminishing the value of the dice' () {
        handleRequest(this.getCorrectAction(2, 3), this.realServerData)
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(5, 2), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.BID);
    }

    @test 'Second player bid is incorrect, repeating bid' () {
        handleRequest(this.getCorrectAction(2, 3), this.realServerData)
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(2, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.BID);
    }

    @test 'Incorrect format of the dice values, dice count must be int'() {
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(<float>1.2, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.DICE_NUM_INT);
    }

    @test 'Incorrect format of the dice values, dice value must be int'() {
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(1, <float>3.5), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.DICE_VAL_INT);
    }

    @test 'Incorrect format of the dice values, dice count must be > 0'() {
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(0, 3), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.DICE_NUM_1);
    }

    @test 'Incorrect format of the dice values, dice value must be between 1 and 6'() {
        _chai.expect( () => {
            this.response = handleRequest(this.getIncorrectAction(3, 7), this.realServerData)
        }).to.not.throw();
        _chai.expect(this.response.channel).to.be.eq(ResponseChannel.ERROR);
        _chai.expect(this.response.data.length).to.be.eq(1);
        _chai.expect(this.response.data[0].sentData).to.be.eq(ErrorMessage.DICE_VAL_1_6);
    }
}