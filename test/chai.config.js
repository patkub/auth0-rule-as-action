import * as chaiModule from "chai";
import chaiSpies from "chai-spies";
import chaiExclude from "chai-exclude";

// configure chai to use chai-spies
const chai = chaiModule.use(chaiSpies);
chai.use(chaiExclude);

// export a single instance of chai that is imported in each test file
export { chai };
