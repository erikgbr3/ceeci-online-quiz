import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'GET':
            return getAnswers(req, res);
            
        case 'POST':
            return addAnswers(req, res);
        case 'DELETE':
            return deleteAnswer(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read'});
    }
}

const getAnswers = async (req, res) => {

    const userId = req.query.userId;
    let whereCondition = {};

        if (userId) {
            whereCondition = {
                userId: userId,
            };
        }

    try{
        //los datos vienen del req.body
        console.log(req.body);

        const answer = await db.Answer.findAll({
            attributes: ['selection','userId', 'questionId', 'optionId'],
            where: whereCondition,
        });
        return res.json(answer)
    
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


// const getAnswers = async (req, res) => {

//     const userId = req.query.userId;
//     const questionId = req.query.questionId;

//     // Verifica si al menos uno de los parámetros está presente
//     if (!userId && !questionId) {
//         return res.status(400).json({
//         message: 'Se requiere al menos uno de los parámetros userId o questionId.',
//         });
//     }

//     try{
//         //los datos vienen del req.body
//         console.log(req.body);

//         const whereClause = {};

//         // Añade userId a la cláusula WHERE si está presente
//         if (userId) {
//         whereClause.userId = userId;
//         }

//         // Añade questionId a la cláusula WHERE si está presente
//         if (questionId) {
//         whereClause.questionId = questionId;
//         }

//         const answer = await db.Answer.findAll({
//             attributes: ['selection','userId', 'questionId', 'optionId'],
//             where: whereClause,
//         });
//         return res.json(answer)
    
//     }catch(error){
//         console.log(error);
//         let errors = []

//         if(error.errors){
//             //extrae la info
//             errors = error.errors.map((item) => ({
//                 error: item.message, 
//                 field: item.path,
//             }));
//         }

//         return res.status(400).json({
//             message: `Ocurrió un error al procesar la petición: ${error.message}`,
//             errors,
//         })
//     }
// }

const addAnswers = async (req, res) =>  {
    try {

        const answer = await db.Answer.create({...req.body});

        res.status(200).json({
            answer,
            message: 'Respuesta enviada'
        });

    } catch (error) {

        console.log(error);

        let errors = [];
        if (error.errors){
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
                }));
        }
      return res.status(400).json( {
        error: true,
        message: `Ocurrió un error al procesar la petición: ${error.message}`,
        errors,
        } 
      )
    }
}

const deleteAnswer = async (req,res) => {
    try{
      const {id} = req.query;

        await db.Answer.destroy({
            where: { id: id }
        })

        res.json({
            message: 'Eliminado'
        })

      }
         catch (error){
            res.status(400).json({ error: "error al momento de borrar el estado"})
    }
}