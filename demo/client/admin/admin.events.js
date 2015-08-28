Session.setDefault('iniciado', false)

function resetarPontuacao () {
  var pontos = Pontos.find().fetch();
  pontos.forEach(function(element){
    Pontos.remove({_id: element._id});
  });
  Session.set('pontuacoes', null)
}

Template.admin.events({
  'click #resetar': function () {
    resetarPontuacao();
    Meteor.call('iniciarOuParar', false);
  },
  'click #iniciar': function () {
    resetarPontuacao();

    if (!Iniciado.findOne({})){
      Iniciado.insert({jogoIniciou: true});
    } else {
      Meteor.call('iniciarOuParar', true);
    }

    Meteor.setTimeout(function () {
      Meteor.call('iniciarOuParar', false);
      var total = Pontos.find().fetch().length;

      var usuarios = _.uniq(Pontos.find({}, {
          sort: {userId: 1}, fields: {userId: true}
      }).fetch().map(function(x) {
          return x.userId;
      }), true);

      pontuacoes = [];

      usuarios.forEach(function (element) {
        pontuacoes.push({userName: Pontos.findOne({userId: element}).userName, pontos: Pontos.find({userId: element}).fetch().length});
      });

      var rankingUsuarios = pontuacoes.sort(function (a, b) {
        return b.pontos - a.pontos;
      })

      Session.set('pontuacoes', rankingUsuarios)

    }, 4000)
  }
});