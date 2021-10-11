import {suite, test} from "@testdeck/mocha";
//import {mock, instance} from "ts-mockito";
import * as _chai from "chai";

_chai.should();

@suite class firstTest {
    private numberOne = 1;
    

    @test 'numberOne should be equal to 1'() {
        _chai.expect(this.numberOne).to.be.eq(1);
    }
}