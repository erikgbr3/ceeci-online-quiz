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
    const { textQuestion, category, options } = req.body;

    // Inicia una transacción
    const transaction = await db.sequelize.transaction();

    try {
      // Primero, inserta en la tabla referenciada (Banks)
      const createdBank = await db.Bank.create({
        // Asegúrate de incluir los datos necesarios para crear un banco
        name: 'Nombre del Banco',  // Reemplaza con el nombre real del banco
        roomId: 1,
      }, { transaction });

      // Luego, inserta en la tabla referenciante (Questions)
      const createdQuestion = await db.Question.create({
        textQuestion,
        categoryId: category,
        bankId: createdBank.id, // Utiliza el id del banco recién creado
        // Otros campos que puedas necesitar
      }, { transaction });

      // Confirma la transacción
      await transaction.commit();

      // Puedes ajustar el manejo de la respuesta según tus necesidades
      res.status(201).json({
        message: 'Pregunta agregada exitosamente',
        question: createdQuestion,
      });
    } catch (error) {
      // Si hay un error, revierte la transacción
      await transaction.rollback();
      throw error; // Lanza el error para manejarlo más adelante
    }
  } catch (error) {
    console.error(error);
    // Puedes manejar los errores de manera adecuada y devolver un mensaje específico
    res.status(500).json({
      message: 'Error al agregar la pregunta',
      error: error.message,
    });
  }
};

module.exports = { addQuestion };


//PUT Function
const updateQuestion = async (req, res) => {
  
}

//DELETE Function
const deleteQuestion = async (req, res) => {
  
}