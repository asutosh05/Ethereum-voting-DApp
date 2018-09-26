pragma solidity ^0.4.2;

contract Election {
   //Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
   //Store canidates
   //Fetch candidate
    mapping(uint=>Candidate) public candidates;
      //Store candidate Count
    uint public candidateCount;
    function Election() public{
        addCandidate("Ram Singh");
        addCandidate("Hari Bhai");
    }
    function addCandidate(string _name) private {
        candidateCount++;
        candidates[candidateCount]=Candidate(candidateCount,_name,0);
    }
}