import db from '../../../../database/models';

export default function handler(req, res) {

  switch(req.method){
      case 'GET':
          return getBanks(req, res);
      default:
          res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
  }
}

const getBanks = async (req, res) => {
  const {id, roomId, enabled} = req.query;

  try{
      //los datos vienen del req.body
      let banks;
      //guardar cliente
      if(id){
          banks = await db.Bank.findAll({
              where: {
                  id: id
              },
              attributes: ['name'],
              include: [
                  {
                      model: db.Question,
                      as: 'BankQuestion',
                      attributes: ['textQuestion'],
                      include: [
                        {
                            model: db.Option,
                            as: 'QuestionOption',
                            attributes: ['correctA']
                        },
                          {
                              model: db.Answer,
                              as: 'QuestionAnswer',
                              attributes: ['selection', 'userId'],
                              include: [
                                {
                                    model: db.User,
                                    as: 'AnswerUser',
                                    attributes: ['name']
                                }
                            ]
                          }
                      ]
                  }
              ]
          });
      }else if(roomId){
          banks = await db.Bank.findAll({
              where: {
                  roomId: roomId
              },
              attributes: ['name'],
              include: [
                  {
                      model: db.Question,
                      as: 'BankQuestion',
                      attributes: ['textQuestion'],
                      include: [
                        {
                            model: db.Option,
                            as: 'QuestionOption',
                            attributes: ['correctA']
                        },
                          {
                              model: db.Answer,
                              as: 'QuestionAnswer',
                              attributes: ['selection', 'userId'],
                              include: [
                                {
                                    model: db.User,
                                    as: 'AnswerUser',
                                    attributes: ['name']
                                }
                            ]
                          }
                      ]
                  }
              ]
          });
      }else if(enabled !== undefined) {
          banks = await db.Bank.findAll({
              where: {
                  enabled: enabled === 'true'
              }
          })
      }else {
        banks = await db.Bank.findAll({
          attributes: ['name'],
          include: [
              {
                  model: db.Question,
                  as: 'BankQuestion',
                  attributes: ['textQuestion'],
                  include: [
                    {
                        model: db.Option,
                        as: 'QuestionOption',
                        attributes: ['correctA']
                    },
                      {
                          model: db.Answer,
                          as: 'QuestionAnswer',
                          attributes: ['selection', 'userId'],
                          include: [
                              {
                                  model: db.User,
                                  as: 'AnswerUser',
                                  attributes: ['name']
                              }
                          ]
                      }
                  ]
              }
          ]
        });    
      }

      return res.json(banks)
  
  }catch(error){
      console.log(error);
      let errors = []

      if(error.errors){
          //extrae la info
          errors = error.errors.map((item) => ({
              error: item.message, 
              field: item.path,
          }));
      }

      return res.status(400).json({
          message: `Ocurrió un error al procesar la petición: ${error.message}`,
          errors,
      })
  }
}