import * as chaiModule from 'chai';
import chaiSpies from 'chai-spies';

// configure chai to use chai-spies
const chai = chaiModule.use(chaiSpies);

// export a single instance of chai that is imported in each test file
export {
    chai
}