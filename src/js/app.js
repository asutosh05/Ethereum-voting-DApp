App={
  web3Provider:null,
  contracts:{},
  account:'0x0',

  init:function(){
    return App.initWeb3();
  },
  //Initialize client side application to local block chain
  initWeb3: function(){
    if(typeof web3 !=='undefined'){
      //If a web3 instance is ready provided by Meta Masl--
      App.web3Provider=web3.currentProvider;
      web3=new Web3(web3.currentProvider);
    }else{
      App.web3Provider=new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
      web3=new web3(App.web3Provider);
    }
    return App.initContract();
  },
  initContract:function(){
    $.getJSON("Election.json",function(election){
      //Instantiate a new truffle contract from the artifactes
      App.contracts.Election=TruffleContract(election);
      //Coonnect provider to intrect with contract
      App.contracts.Election.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render:function(){
    var electionInstance;
    var loader=$("#loader");
    var content=$("#content");
    loader.show();
    content.hide();

    //Load Account data
    web3.eth.getCoinbase(function(err,account){
      if(err==null){
        App.account=account;
        $("#accountAddress").html("Your Account: "+account);

      }
    });

    App.contracts.Election.deployed().then(function(instance){
      electionInstance=instance;
      return electionInstance.candidateCount();
    }).then(function(candidateCount){
      var candidateResult=$("#candidatesResults");
      candidateResult.empty();

      var candidateSelect=$('#candidatesSelect');
      candidateSelect.empty();

      for (var i=1;i<=candidateCount;i++){
        electionInstance.candidates(i).then(function(candidate){
        var id=candidate[0];
        var name=candidate[1];
        var voteCount=candidate[2];

        //render candidate Result
        var candidateTemplate ="<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
        candidateResult.append(candidateTemplate);

        //render candidate 
        var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
        candidateSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted){
      //Dont not allow a user to vote
      if(hasVoted){
        $('form').hide();
      }
    
      loader.hide();
      content.show();
    }).catch(function(error){
      console.warn(error)
    });

  },
  castVote:function(){
    var candidateId=$('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance){
      return instance.vote(candidateId,{from : App.account});
    }).then(function(result){
      $('#content').hide();
      $('#loader').show();
    }).catch(function(err){
      console.log(err);
    })
  }

};

$(function(){
  $(window).load(function(){
    App.init();
  });
});























// App = {
//   web3Provider: null,
//   contracts: {},

//   init: function() {
//     // Load pets.
//     $.getJSON('../pets.json', function(data) {
//       var petsRow = $('#petsRow');
//       var petTemplate = $('#petTemplate');

//       for (i = 0; i < data.length; i ++) {
//         petTemplate.find('.panel-title').text(data[i].name);
//         petTemplate.find('img').attr('src', data[i].picture);
//         petTemplate.find('.pet-breed').text(data[i].breed);
//         petTemplate.find('.pet-age').text(data[i].age);
//         petTemplate.find('.pet-location').text(data[i].location);
//         petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

//         petsRow.append(petTemplate.html());
//       }
//     });

//     return App.initWeb3();
//   },

//   initWeb3: function() {
//     /*
//      * Replace me...
//      */

//     return App.initContract();
//   },

//   initContract: function() {
//     /*
//      * Replace me...
//      */

//     return App.bindEvents();
//   },

//   bindEvents: function() {
//     $(document).on('click', '.btn-adopt', App.handleAdopt);
//   },

//   markAdopted: function(adopters, account) {
//     /*
//      * Replace me...
//      */
//   },

//   handleAdopt: function(event) {
//     event.preventDefault();

//     var petId = parseInt($(event.target).data('id'));

//     /*
//      * Replace me...
//      */
//   }

// };

// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });
