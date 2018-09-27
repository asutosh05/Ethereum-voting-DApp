var Election= artifacts.require("./Election.sol")

contract("Election",function(accounts){
    var electionInstnace;

    it("initializes with two candidate",function(){
        return Election.deployed().then(function(instance){
            return instance.candidateCount();
        }).then(function(count){
            assert.equal(count,2);
        });
    });



    it("it initializes the candidate with correct valuses",function(){
        return Election.deployed().then(function(instance){
            electionInstnace=instance;
            return electionInstnace.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1,"Contains the correct id");
            assert.equal(candidate[1],"Ram Singh","Contain correct name");
            assert.equal(candidate[2],0,"Contain the correct votes count");
            return electionInstnace.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2,"Contains the correct id");
            assert.equal(candidate[1],"Hari Bhai","Contain correct name");
            assert.equal(candidate[2],0,"Contain the correct votes count");
        });
    });

    it("allows a voter to cast a vote",function(){
        return Election.deployed().then(function(instance){
            electionInstnace=instance;
            candidateid=1;
            return electionInstnace.vote(candidateid,{from:accounts[0]});
        }).then(function(receipts){
            return electionInstnace.voters(accounts[0]);
        }).then(function(voted){
            assert(voted,"the voter was makred as voted");
            return electionInstnace.candidates(candidateid);

        }).then(function(candidate){
            var voteCount=candidate[2];
            assert.equal(voteCount,1,"increments the candidate's vote count")
        });
    });

    it("throws an excption for invalid candidate",function(){
        return Election.deployed().then(function(instance){
            electionInstnace=instance;
            return electionInstnace.vote(99,{from:accounts[1]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,"error message must contain revert ");
            return electionInstnace.candidates(1);
        }).then(function(candidate1){
            var voteCount=candidate1[2];
            assert.equal(voteCount,1,"candidate 1 did not receive any vote");
            return electionInstnace.candidates(2);
        }).then(function(candidate2){
            var voteCount=candidate2[2];
            assert.equal(voteCount,0,"candidate 2 did not receive any votes");
        });
    });

    it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 2;
          electionInstance.vote(candidateId, { from: accounts[1] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
    });

});