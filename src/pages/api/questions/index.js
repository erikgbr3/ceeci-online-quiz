import db from '../../../../database/models'
const { Op, Sequelize } = require("sequelize");

export default function handler (req, res) {
  switch (req.method) {
    case 'GET':
      return getQuestion (req, res);
    case 'POST':
      return addQuestion (req, res);
    case 'PUT':
      return updateQuestion (req, res);
    case 'DELETE':
      return deleteQuestion (req, res);

    default:
      res.status(400).json({ error: true, message: 'Petición errónea' });
  }
}

//GET Function
const getQuestion = async (req, res) => {
  try {
    // const { Op, Sequelize } = require("sequelize");
    const questions = await db.Question.findAll({

      include: [
        {
          model: db.Bank,
          as: 'QuestionBank',
          attributes: ['id', 'name', 'roomId'],
          include: [
            { 
              model: db.Room,
              as: 'BankRoom',
              attributes: ['id', 'name', 'userId'],
            },
          ],
        },
        {
          model: db.Category,
          as: 'QuestionCategory',
          attributes: ['id', 'name'],
        },
        // {
        //   model: db.Option, // Asegúrate de incluir el modelo correcto
        //   as: 'QuestionOption',
        //   attributes: [
        //     'id', 
        //     'option1', 
        //     'option2',
        //     'option3',
        //     'correctA',
        //     'questionId'
        // ], // Incluye los atributos necesarios
        // },
        // {
        //   model: db.Answer, // Asegúrate de incluir el modelo correcto
        //   as: 'QuestionAnswer',
        //   attributes: [
        //     'id',
        //     'userId',
        //     'questionId',
        //     'optionId'
        //   ],
        //   where: {
        //     questionId: Sequelize.col('Question.id')
        //   }
        // },
      ],
      attributes: [
        'id',
        'textQuestion',
        'bankId',
        'categoryId'
      ]
    });
    
    return res.json(questions);
    
  } catch (error) {
    console.log(error);

    return res.status(400).json(
      {
        error: true,
        message: `Ocurrio un error al procesar la peticion ${error.message}`
      }
    )
  }
}

//POST Function
const addQuestion = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

//PUT Function
const updateQuestion = async (req, res) => {
  
}

//DELETE Function
const deleteQuestion = async (req, res) => {
  
}